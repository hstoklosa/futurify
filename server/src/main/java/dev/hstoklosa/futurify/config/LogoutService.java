package dev.hstoklosa.futurify.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hstoklosa.futurify.repositories.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final TokenRepository tokenRepository;

    private final JwtService jwtService;

    private final ObjectMapper objectMapper;


    @Override
    public void logout(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) {
        final String accessToken = jwtService.getAccessTokenFromCookie(request);

        if (accessToken == null)
            return;

        var storedToken = tokenRepository.findByToken(accessToken)
            .orElse(null);

        if (storedToken == null)
            return;

        storedToken.setExpired(true);
        storedToken.setRevoked(true);

        tokenRepository.save(storedToken);

        ResponseCookie accessTokenCookie = jwtService.getCleanAccessTokenCookie();
        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());

        ResponseCookie refreshTokenCookie = jwtService.getCleanRefreshTokenCookie();
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        SecurityContextHolder.clearContext();

        try {
            objectMapper.writeValue(response.getWriter(), "Successfully logged out.");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
