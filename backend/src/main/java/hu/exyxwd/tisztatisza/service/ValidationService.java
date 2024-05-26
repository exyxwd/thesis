package hu.exyxwd.tisztatisza.service;

import org.springframework.stereotype.Service;

/** This service is for validating user input. */
@Service
public class ValidationService {

    /**
     * Validates the given username.
     *
     * @param username The username to validate.
     * @return Null if the username is valid, or a message describing why it is not.
     */
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

    /**
     * Validates the given password.
     *
     * @param password The password to validate.
     * @return Null if the password is valid, or a message describing why it is not.
     */
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
