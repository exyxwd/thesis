package hu.exyxwd.tisztatisza.service;

import org.springframework.stereotype.Service;

@Service
public class ValidationService {

    public String validateUsername(String username) {
        if (username.length() < 4) {
            return "Username is too short";
        }
        if (!username.matches("[a-zA-Z0-9 ÁáÉéÍíÓóÖöŐőÚúÜüŰű]+") || username.isEmpty()) {
            return "Username must be alphanumeric, can contain spaces, and cannot be all spaces";
        }
        if (username.length() > 255) {
            return "Username is too long";
        }
        return null;
    }

    public String validatePassword(String password) {
        if (password.length() < 4) {
            return "Password is too short";
        }
        if (password.length() > 255) {
            return "Password is too long";
        }
        return null;
    }
}
