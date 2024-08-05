package dev.hstoklosa.futurify.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    @Value("${application.security.jwt.cookie.expiration}")
    private long cookieExpiry;

    public ResponseCookie generateAccessTokenCookie(String accessToken) {
        return generateCookie("accessToken", accessToken, "/api/v1");
    }

    public ResponseCookie generateRefreshTokenCookie(String refreshToken) {
        return generateCookie("refreshToken", refreshToken, "/api/v1/auth/refresh-token");
    }

    private ResponseCookie generateCookie(String name, String value, String path) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(false) // true in production
                .path(path)
                .maxAge(cookieExpiry)
                .build();
    }

    public ResponseCookie getCleanAccessTokenCookie() {
        return ResponseCookie.from("accessToken", null).httpOnly(true).path("/api/v1").maxAge(0).build();
    }

    public ResponseCookie getCleanRefreshTokenCookie() {
        return ResponseCookie.from("refreshToken", null).httpOnly(true).path("/api/v1/auth/refresh-token").maxAge(0).build();
    }

    public String getAccessTokenFromCookie(HttpServletRequest request) {
        return getTokenFromCookie(request, "accessToken");
    }

    public String getRefreshTokenFromCookie(HttpServletRequest request) {
        return getTokenFromCookie(request, "refreshToken");
    }

    public String getTokenFromCookie(HttpServletRequest request, String tokenName) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (tokenName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }
}
