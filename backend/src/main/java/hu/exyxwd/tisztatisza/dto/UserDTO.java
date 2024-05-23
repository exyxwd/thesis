package hu.exyxwd.tisztatisza.dto;

import lombok.*;
import jakarta.validation.constraints.*;
// TODO: Not used, remove it
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO
{
    private Long id;
    
    @NotEmpty(message = "Name should not be empty")
    private String name;

    @NotEmpty(message = "Password should not be empty")
    private String password;
}
