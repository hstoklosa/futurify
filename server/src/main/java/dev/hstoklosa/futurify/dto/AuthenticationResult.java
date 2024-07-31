package dev.hstoklosa.futurify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseCookie;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResult {

    private ResponseCookie accessTokenCookie;

    private ResponseCookie refreshTokenCookie;

    private UserDTO userDTO;

}
