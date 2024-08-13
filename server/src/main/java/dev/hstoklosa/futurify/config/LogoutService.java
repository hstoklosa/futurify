package dev.hstoklosa.futurify.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hstoklosa.futurify.dto.response.GenericApiResponse;
import dev.hstoklosa.futurify.repository.AccessTokenRepository;
import dev.hstoklosa.futurify.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final AccessTokenRepository accessTokenRepository;
    private final CookieUtil cookieUtil;
    private final ObjectMapper objectMapper;

    @Override
    public void logout(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) {
        final String accessToken = cookieUtil.getAccessTokenFromCookie(request);

        if (accessToken == null)
            return;

        var storedToken = accessTokenRepository.findByToken(accessToken)
            .orElse(null);

        if (storedToken == null)
            return;

        storedToken.setExpired(true);
        storedToken.setRevoked(true);
        accessTokenRepository.save(storedToken);

        ResponseCookie accessTokenCookie = cookieUtil.getCleanAccessTokenCookie();
        ResponseCookie refreshTokenCookie = cookieUtil.getCleanRefreshTokenCookie();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        SecurityContextHolder.clearContext();

        try {
            GenericApiResponse<String> apiResponse = GenericApiResponse.success(null, "Logged out successfully");
            objectMapper.writeValue(response.getWriter(), apiResponse);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
