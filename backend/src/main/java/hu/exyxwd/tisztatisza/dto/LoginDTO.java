package hu.exyxwd.tisztatisza.dto;

import lombok.*;
import jakarta.validation.constraints.NotEmpty;

@Setter
@Getter
@AllArgsConstructor
public class LoginDTO {
    @NotEmpty(message = "Username should not be empty")
    private String username;

    @NotEmpty(message = "Password should not be empty")
    private String password;
}