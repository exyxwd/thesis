package hu.exyxwd.tisztatisza.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;
import java.security.Principal;
import java.util.stream.Collectors;
import jakarta.servlet.http.HttpServletResponse;

import hu.exyxwd.tisztatisza.dto.*;
import hu.exyxwd.tisztatisza.model.User;
import hu.exyxwd.tisztatisza.security.JwtUtil;
import hu.exyxwd.tisztatisza.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    private JwtUtil jwtUtil;

    public UserController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Autowired
    public UserController(PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
            UserRepository userRepository, JwtUtil jwtUtil) {
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @ResponseBody
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginReq, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginReq.getUsername(), loginReq.getPassword()));
            String username = authentication.getName();
            User user = new User(username, "");
            String token = jwtUtil.createToken(user);

            response.setHeader(HttpHeaders.SET_COOKIE, "token=" + token + "; Path=/api; HttpOnly; SameSite=Strict");

            return ResponseEntity.ok().build();

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/userInfo")
    public ResponseEntity<?> userInfo(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authenticated user found");
        }

        String username = principal.getName();
        UserInfoDTO userInfoDto = new UserInfoDTO(username);

        return ResponseEntity.ok(userInfoDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Clear the JWT token by setting the cookie to an empty string and setting its
        // Max-Age attribute to 0
        response.setHeader(HttpHeaders.SET_COOKIE, "token=; Path=/api; HttpOnly; Max-Age=0; SameSite=Strict");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User registerRequest) {
        // Check if the username or password is too long
        if (registerRequest.getUsername().length() > 255 || registerRequest.getPassword().length() > 255) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username or password is too long");
        }

        // Check if the username is already taken
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken");
        }

        // Save the new user in the database
        User newUser = new User(registerRequest.getUsername(), passwordEncoder.encode(registerRequest.getPassword()));
        userRepository.save(newUser);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, String>>> getUsers() {
        List<User> users = userRepository.findAll();

        List<Map<String, String>> usernames = users.stream()
                .map(user -> {
                    Map<String, String> usernameMap = new HashMap<>();
                    usernameMap.put("username", user.getUsername());
                    return usernameMap;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(usernames);
    }

    @PutMapping("/users/{username}/username")
    public ResponseEntity<?> changeUsername(@PathVariable String username, @RequestBody Map<String, String> request) {
        
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        
        String newUsername = request.get("newUsername");
        // Check if the new username is too long
        if (newUsername.length() > 255) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New username is too long");
        }

        if (userRepository.existsByUsername(newUsername)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken");
        }

        user.setUsername(newUsername);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{username}/password")
    public ResponseEntity<?> changePassword(@PathVariable String username, @RequestBody Map<String, String> request) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        
        String newPassword = request.get("newPassword");
        // Check if the new password is too long
        if (newPassword.length() > 255) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password is too long");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{username}/delete")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        if (username.equals(currentUsername)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Users cannot delete themselves");
        }

        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        userRepository.delete(user);

        return ResponseEntity.ok().build();
    }
}