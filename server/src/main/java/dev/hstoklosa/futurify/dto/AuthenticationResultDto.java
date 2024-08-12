package dev.hstoklosa.futurify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResultDto {
    private String accessToken;
    private String refreshToken;
    private UserDto userDto;
}
