package hu.exyxwd.tisztatisza.controller;

import org.junit.jupiter.api.*;
import org.springframework.http.*;
import org.springframework.security.core.context.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.mockito.Mockito;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;
import java.security.Principal;

import hu.exyxwd.tisztatisza.dto.*;
import hu.exyxwd.tisztatisza.model.User;
import hu.exyxwd.tisztatisza.dto.UserInfoDTO;
import hu.exyxwd.tisztatisza.security.JwtUtil;
import hu.exyxwd.tisztatisza.repository.UserRepository;

public class UserControllerTest {
    private JwtUtil jwtUtil;
    private UserController userController;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;

    @BeforeEach
    public void init() {
        authenticationManager = Mockito.mock(AuthenticationManager.class);
        jwtUtil = Mockito.mock(JwtUtil.class);
        userRepository = Mockito.mock(UserRepository.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        userController = new UserController(passwordEncoder, authenticationManager, userRepository, jwtUtil);
    }

    @Test
    @DisplayName("Test successful login")
    public void testLoginSuccess() throws Exception {
        LoginDTO loginReq = new LoginDTO("username", "password");
        MockHttpServletResponse response = new MockHttpServletResponse();
        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(auth.getName()).thenReturn("username");
        when(jwtUtil.createToken(any(User.class))).thenReturn("token");

        ResponseEntity<?> result = userController.login(loginReq, response);

        assertEquals(HttpStatus.OK, result.getStatusCode(), "Login status code should be OK after successful login");
        assertEquals("token=token; Path=/api; HttpOnly; SameSite=Strict", response.getHeader("Set-Cookie"),
                "Token cookie should be set after successful login");
    }

    @Test
    @DisplayName("Test unsuccessful login because of bad credentials")
    public void testLoginFailure() throws Exception {
        LoginDTO loginReq = new LoginDTO("username", "password");
        MockHttpServletResponse response = new MockHttpServletResponse();
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        ResponseEntity<?> result = userController.login(loginReq, response);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode(),
                "Login status code should be UNAUTHORIZED after unsuccessful login because of bad credentials");
        assertEquals("Invalid username or password", result.getBody(),
                "Response body should be 'Invalid username or password' after unsuccessful login because of bad credentials");
    }

    @Test
    @DisplayName("Test successful user info retrieval")
    public void testUserInfoSuccess() {
        Principal principal = mock(Principal.class);
        when(principal.getName()).thenReturn("username");

        ResponseEntity<?> result = userController.userInfo(principal);

        assertEquals(HttpStatus.OK, result.getStatusCode(),
                "User info status code should be OK after successful user info retrieval");
        Optional<?> body = Optional.ofNullable(result.getBody());
        assertTrue(body.isPresent() && body.get() instanceof UserInfoDTO);
        body.filter(UserInfoDTO.class::isInstance)
                .map(UserInfoDTO.class::cast)
                .ifPresent(b -> assertEquals("username", b.getUsername(),
                        "Incorrect username after successful user info retrieval"));
    }

    @Test
    @DisplayName("Test unsuccessful user info retrieval because of no authenticated user")
    public void testUserInfoFailure() {
        ResponseEntity<?> result = userController.userInfo(null);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode(),
                "User info status code should be UNAUTHORIZED after unsuccessful user info retrieval because of no authenticated user");
        assertEquals("No authenticated user found", result.getBody(),
                "Response body should be 'No authenticated user found' after unsuccessful user info retrieval because of no authenticated user");
    }

    @Test
    @DisplayName("Test successful logout")
    public void testLogout() {
        MockHttpServletResponse response = new MockHttpServletResponse();

        ResponseEntity<?> result = userController.logout(response);

        assertEquals(HttpStatus.OK, result.getStatusCode(), "Logout status code should be OK after successful logout");
        assertEquals("token=; Path=/api; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict",
                response.getHeader("Set-Cookie"), "Token cookie should be cleared after successful logout");
    }

    @Test
    @DisplayName("Test successful registration")
    public void testRegisterNewUser() {
        User registerRequest = new User("newuser", "password");
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(registerRequest);

        ResponseEntity<?> result = userController.register(registerRequest);

        assertEquals(HttpStatus.OK, result.getStatusCode(),
                "Registration status code should be OK after successful registration");
    }

    @Test
    @DisplayName("Test unsuccessful registration beacuse of already taken username")
    public void testRegisterExistingUser() {
        User registerRequest = new User("existinguser", "password");
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        ResponseEntity<?> result = userController.register(registerRequest);

        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode(),
                "Registration status code should be BAD_REQUEST after unsuccessful registration because of already taken username");
        assertEquals("Username is already taken", result.getBody(),
                "Response body should be 'Username is already taken' after unsuccessful registration because of already taken username");
    }

    @Test
    @DisplayName("Test successful usernames retrieval")
    public void testGetUsers() {
        User user = new User("username", "password");
        when(userRepository.findAll()).thenReturn(Collections.singletonList(user));

        ResponseEntity<List<Map<String, String>>> result = userController.getUsers();

        assertEquals(HttpStatus.OK, result.getStatusCode(),
                "Get users status code should be OK after successful usernames retrieval");
        List<Map<String, String>> body = result.getBody();
        assertNotNull(body);
        if (body != null) {
            assertFalse(body.isEmpty());
            assertEquals("username", body.get(0).get("username"),
                    "Incorrect username after successful usernames retrieval");
        }
    }

    @Test
    @DisplayName("Test successful username change")
    public void testChangeUsernameSuccess() {
        User user = new User("oldUsername", "password");
        when(userRepository.findByUsername("oldUsername")).thenReturn(user);
        when(userRepository.existsByUsername("newUsername")).thenReturn(false);

        ResponseEntity<?> result = userController.changeUsername("oldUsername",
                Collections.singletonMap("newUsername", "newUsername"));

        assertEquals(HttpStatus.OK, result.getStatusCode(),
                "Username change status code should be OK after successful username change");
        assertEquals("newUsername", user.getUsername(),
                "Incorrect username after successful username change");
    }

    @Test
    @DisplayName("Test unsuccessful username change because of non existing user")
    public void testChangeUsernameUserNotFound() {
        when(userRepository.findByUsername("oldUsername")).thenReturn(null);

        ResponseEntity<?> result = userController.changeUsername("oldUsername",
                Collections.singletonMap("newUsername", "newUsername"));

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode(),
                "Username change status code should be NOT_FOUND after unsuccessful username change because of non existing user");
        assertEquals("User not found", result.getBody(),
                "Username change response body should be 'User not found' after unsuccessful username change because of non existing user");
    }

    @Test
    @DisplayName("Test unsuccessful username change because of already existing user with the new name")
    public void testChangeUsernameUsernameTaken() {
        User user = new User("oldUsername", "password");
        when(userRepository.findByUsername("oldUsername")).thenReturn(user);
        when(userRepository.existsByUsername("newUsername")).thenReturn(true);

        ResponseEntity<?> result = userController.changeUsername("oldUsername",
                Collections.singletonMap("newUsername", "newUsername"));

        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode(),
                "Username change status code should be BAD_REQUEST after unsuccessful username change because of already existing user with the new name");
        assertEquals("Username is already taken", result.getBody(),
                "Username change response body should be 'Username is already taken' after unsuccessful username change because of already existing user with the new name");
    }

    @Test
    @DisplayName("Test successful password change")
    public void testChangePasswordSuccess() {
        User user = new User("username", "oldPassword");
        when(userRepository.findByUsername("username")).thenReturn(user);
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedPassword");

        ResponseEntity<?> result = userController.changePassword("username",
                Collections.singletonMap("newPassword", "newPassword"));

        assertEquals(HttpStatus.OK, result.getStatusCode(),
                "Password change status code should be OK after successful password change");
        assertEquals("newEncodedPassword", user.getPassword(),
                "Incorrect password after successful password change");
    }

    @Test
    @DisplayName("Test unsuccessful password change because of non existing user")
    public void testChangePasswordUserNotFound() {
        when(userRepository.findByUsername("username")).thenReturn(null);

        ResponseEntity<?> result = userController.changePassword("username",
                Collections.singletonMap("newPassword", "newPassword"));

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode(),
                "Password change status code should be NOT_FOUND after unsuccessful password change because of non existing user");
        assertEquals("User not found", result.getBody(),
                "Password change response body should be 'User not found' after unsuccessful password change because of non existing user");
    }

    @Test
    @DisplayName("Test successful user deletion")
    public void testDeleteUserSuccess() {
        User user = new User("username", "password");
        when(userRepository.findByUsername("username")).thenReturn(user);

        Authentication auth = Mockito.mock(Authentication.class);
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn("admin");
        SecurityContextHolder.setContext(securityContext);

        ResponseEntity<?> result = userController.deleteUser("username");

        assertEquals(HttpStatus.OK, result.getStatusCode(),
                "User deletion status code should be OK after successful user deletion");
        verify(userRepository, times(1)).delete(user);
    }

    @Test
    @DisplayName("Test unsuccessful user deletion beacuse of not existing user")
    public void testDeleteUserNotFound() {
        when(userRepository.findByUsername("username")).thenReturn(null);

        Authentication auth = Mockito.mock(Authentication.class);
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn("admin");
        SecurityContextHolder.setContext(securityContext);

        ResponseEntity<?> result = userController.deleteUser("username");

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode(),
                "User deletion status code should be NOT_FOUND after unsuccessful user deletion because of not existing user");
        assertEquals("User not found", result.getBody(),
                "User deletion response body should be 'User not found' after unsuccessful user deletion because of not existing user");
    }
}
