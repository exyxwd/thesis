package hu.exyxwd.tisztatisza.service;

import org.mockito.*;
import org.junit.jupiter.api.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import hu.exyxwd.tisztatisza.model.User;
import hu.exyxwd.tisztatisza.repository.UserRepository;

public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Test initialization of UserService when the UserRepository is empty")
    public void testInit() {
        when(userRepository.count()).thenReturn(0L);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        userService.init();

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Test generation of random password with specific length")
    public void testGenerateRandomPassword() {
        String password = userService.generateRandomPassword(10);
        assertNotNull(password);
        assertEquals(10, password.length());
    }
}