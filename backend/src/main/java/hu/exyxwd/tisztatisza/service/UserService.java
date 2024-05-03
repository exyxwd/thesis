package hu.exyxwd.tisztatisza.service;

import hu.exyxwd.tisztatisza.model.User;
import org.springframework.stereotype.Service;
import hu.exyxwd.tisztatisza.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Base64;
import java.security.SecureRandom;
import javax.annotation.PostConstruct;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private String generateRandomPassword(int length) {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[length];
        random.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

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