package dev.hstoklosa.futurify.auth.service;

import dev.hstoklosa.futurify.common.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {
    @Override
    public void logout(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.addHeader(HttpHeaders.SET_COOKIE, CookieUtil.getCleanAccessTokenCookie().toString());
        response.addHeader(HttpHeaders.SET_COOKIE, CookieUtil.getCleanRefreshTokenCookie().toString());
        SecurityContextHolder.clearContext();
    }
}
