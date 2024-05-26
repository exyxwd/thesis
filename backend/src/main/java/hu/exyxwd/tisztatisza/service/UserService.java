package hu.exyxwd.tisztatisza.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Base64;
import java.security.SecureRandom;
import javax.annotation.PostConstruct;

import hu.exyxwd.tisztatisza.model.User;
import hu.exyxwd.tisztatisza.repository.UserRepository;

/** Service class to set up the initial user. */
@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Generates a random password.
     *
     * @param charLength The length of the password.
     * @return The generated password.
     */
    public String generateRandomPassword(int charLength) {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[charLength];
        random.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes).substring(0, charLength);
    }

    /**
     * Initializes the user repository with the initial user if it is empty and
     * prints it to console.
     */
    @PostConstruct
    public void init() {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");

            String randomPassword = generateRandomPassword(10);
            admin.setPassword(passwordEncoder.encode(randomPassword));

            userRepository.save(admin);
            System.out.println("Generated password for admin (username: admin): " + randomPassword);
        }
    }
}