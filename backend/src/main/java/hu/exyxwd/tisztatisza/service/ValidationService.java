package hu.exyxwd.tisztatisza.service;

import org.springframework.stereotype.Service;
import hu.exyxwd.tisztatisza.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class ValidationService {

    @Autowired
    UserRepository userRepository;

    public String validateUsername(String username) {
        if (!username.matches("[a-zA-Z0-9 ÁáÉéÍíÓóÖöŐőÚúÜüŰű]+") || username.isEmpty()) {
            return "Username must be alphanumeric, can contain spaces, and cannot be all spaces";
        }
        if (username.length() > 255) {
            return "Username is too long";
        }
        if (username.length() < 4) {
            return "Username is too short";
        }
        if (userRepository.existsByUsername(username)) {
            return "Username is already taken";
        }
        return null;
    }

    public String validatePassword(String password) {
        if (password.length() > 255) {
            return "Password is too long";
        }
        if (password.length() < 4) {
            return "Password is too short";
        }
        return null;
    }
}
