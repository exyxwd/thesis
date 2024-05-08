package hu.exyxwd.tisztatisza.service;

import org.mockito.*;
import org.junit.jupiter.api.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import hu.exyxwd.tisztatisza.model.User;
import hu.exyxwd.tisztatisza.repository.UserRepository;

public class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private CustomUserDetailsService customUserDetailsService;

    @BeforeEach
    public void init() {
        MockitoAnnotations.openMocks(this);
        customUserDetailsService = new CustomUserDetailsService(userRepository);
    }

    @Test
    @DisplayName("Test loading user by username when user exists")
    public void testLoadUserByUsername() {
        User user = new User();
        user.setUsername("testUser");
        user.setPassword("testPassword");

        when(userRepository.findByUsername("testUser")).thenReturn(user);
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("testUser");

        assertEquals(user.getUsername(), userDetails.getUsername(),
                "Username is not the expected value when loading user by username");
        assertEquals("encodedPassword", passwordEncoder.encode(userDetails.getPassword()),
                "Password is not the expected value when loading user by username");
    }

    @Test
    @DisplayName("Test loading user by username when user does not exist")
    public void testLoadUserByUsernameNotFound() {
        when(userRepository.findByUsername("testUser")).thenReturn(null);

        assertThrows(UsernameNotFoundException.class, () -> {
            customUserDetailsService.loadUserByUsername("testUser");
        });
    }
}