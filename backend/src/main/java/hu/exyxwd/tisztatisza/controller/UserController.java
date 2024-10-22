package hu.exyxwd.tisztatisza.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;
import java.security.Principal;
import lombok.AllArgsConstructor;
import java.util.stream.Collectors;
import jakarta.servlet.http.HttpServletResponse;

import hu.exyxwd.tisztatisza.dto.*;
import hu.exyxwd.tisztatisza.model.User;
import hu.exyxwd.tisztatisza.security.JwtUtil;
import hu.exyxwd.tisztatisza.service.ValidationService;
import hu.exyxwd.tisztatisza.repository.UserRepository;

/**
 * Controller for handling user related requests.
 */
@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class UserController {

    private PasswordEncoder passwordEncoder;

    AuthenticationManager authenticationManager;

    UserRepository userRepository;

    ValidationService validationService;

    private JwtUtil jwtUtil;

    /**
     * Login the user with the given credentials.
     *
     * @param loginReq Contains the username and password.
     * @param response To set the cookie.
     * @return Indicates the result of the operation.
     */
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

    /**
     * Get the information of the authenticated user.
     *
     * @param principal Contains the authenticated user.
     * @return Contains the username of the authenticated user.
     */
    @GetMapping("/userInfo")
    public ResponseEntity<?> userInfo(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authenticated user found");
        }

        String username = principal.getName();
        UserInfoDTO userInfoDto = new UserInfoDTO(username);

        return ResponseEntity.ok(userInfoDto);
    }

    /**
     * Logout the authenticated user.
     *
     * @param response To clear the JWT token.
     * @return Indicates the result of the operation.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Clear the JWT token by setting the cookie to an empty string and setting its
        // Max-Age attribute to 0
        response.setHeader(HttpHeaders.SET_COOKIE, "token=; Path=/api; HttpOnly; Max-Age=0; SameSite=Strict");
        return ResponseEntity.ok().build();
    }

    /**
     * Register a new user with the given credentials.
     *
     * @param registerRequest Contains the username and password.
     * @return Indicates the result of the operation.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User registerRequest) {
        String username = registerRequest.getUsername();
        String password = registerRequest.getPassword();

        // Validate the username
        String usernameValidation = validationService.validateUsername(username);
        if (usernameValidation != null) {
            return ResponseEntity.status(usernameValidation == "Username is too short" ? HttpStatus.BAD_REQUEST
                    : HttpStatus.UNPROCESSABLE_ENTITY).body(usernameValidation);
        }

        // Validate the password
        String passwordValidation = validationService.validatePassword(password);
        if (passwordValidation != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(passwordValidation);
        }

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already taken");
        }

        // Save the new user in the database
        User newUser = new User(username, passwordEncoder.encode(password));
        userRepository.save(newUser);

        return ResponseEntity.ok().build();
    }

    /**
     * Get the usernames of all users.
     *
     * @return Contains the usernames of all users.
     */
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

    /**
     * Change the username of the user with the given username.
     * @param username The username of the user whose username to change.
     * @param request Contains the new username.
     * @return Indicates the result of the operation.
     */
    @PutMapping("/users/{username}/username")
    public ResponseEntity<?> changeUsername(@PathVariable String username, @RequestBody Map<String, String> request) {

        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Validate the new username
        String newUsername = request.get("newUsername").trim();
        String usernameValidation = validationService.validateUsername(newUsername);
        if (usernameValidation != null) {
            return ResponseEntity.status(usernameValidation == "Username is too short" ? HttpStatus.BAD_REQUEST
                    : HttpStatus.UNPROCESSABLE_ENTITY).body(usernameValidation);
        }

        if (userRepository.existsByUsername(newUsername)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already taken");
        }

        user.setUsername(newUsername);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    /**
     * Change the password of the user with the given username.
     *
     * @param username The username of the user whose password to change.
     * @param request Contains the new password.
     * @return Indicates the result of the operation.
     */
    @PutMapping("/users/{username}/password")
    public ResponseEntity<?> changePassword(@PathVariable String username, @RequestBody Map<String, String> request) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Validate the new password
        String newPassword = request.get("newPassword");
        String passwordValidation = validationService.validatePassword(newPassword);
        if (passwordValidation != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(passwordValidation);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    /**
     * Delete the user with the given username.
     *
     * @param username The username of the user to delete.
     * @return Indicates the result of the operation.
     */
    @DeleteMapping("/users/{username}/delete")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        if (username.equals(currentUsername)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Users cannot delete themselves");
        }

        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        userRepository.delete(user);

        return ResponseEntity.ok().build();
    }
}