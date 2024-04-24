package hu.exyxwd.tisztatisza.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO
{
    @NotEmpty(message = "Username should not be empty")
    private String username;
}
