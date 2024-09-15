package dev.hstoklosa.futurify.util;

import dev.hstoklosa.futurify.config.JwtConfig;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {
    private static JwtConfig jwtConfig;

    @Autowired
    public CookieUtil(JwtConfig jwtConfig) {
        CookieUtil.jwtConfig = jwtConfig;
    }

    public static ResponseCookie generateAccessTokenCookie(String accessToken) {
        return generateCookie("accessToken", accessToken, "/api/v1", jwtConfig.getAccessExpiration());
    }

    public static ResponseCookie generateRefreshTokenCookie(String refreshToken) {
        return generateCookie("refreshToken", refreshToken, "/api/v1/auth/refresh-token", jwtConfig.getRefreshExpiration());
    }

    private static ResponseCookie generateCookie(String name, String value, String path, long maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(false) // true in production
                .path(path)
                .maxAge(maxAge)
                .build();
    }

    public static ResponseCookie getCleanAccessTokenCookie() {
        return ResponseCookie.from("accessToken", null).httpOnly(true).path("/api/v1").maxAge(0).build();
    }

    public static ResponseCookie getCleanRefreshTokenCookie() {
        return ResponseCookie.from("refreshToken", null).httpOnly(true).path("/api/v1/auth/refresh-token").maxAge(0).build();
    }

    public static String getAccessTokenFromCookie(HttpServletRequest request) {
        return getCookie(request, "accessToken");
    }

    public static String getRefreshTokenFromCookie(HttpServletRequest request) {
        return getCookie(request, "refreshToken");
    }

    public static String getCookie(final HttpServletRequest request, final String tokenName) {
        final Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;

        for (Cookie cookie : cookies) {
            if (tokenName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}
