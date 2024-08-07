package dev.hstoklosa.futurify.controller;

import dev.hstoklosa.futurify.config.JwtService;
import dev.hstoklosa.futurify.dto.AuthenticationResultDto;
import dev.hstoklosa.futurify.dto.UserDto;
import dev.hstoklosa.futurify.dto.request.LoginRequest;
import dev.hstoklosa.futurify.dto.request.RegisterRequest;
import dev.hstoklosa.futurify.dto.response.GenericApiResponse;
import dev.hstoklosa.futurify.service.AuthenticationService;
import dev.hstoklosa.futurify.util.CookieUtil;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final JwtService jwtService;
    private final CookieUtil cookieUtil;

    @PostMapping("/register")
    public ResponseEntity<GenericApiResponse<UserDto>> register(
        @RequestBody RegisterRequest request
    ) throws MessagingException {
        AuthenticationResultDto result = service.register(request);
        ResponseCookie accessTokenCookie = cookieUtil.generateAccessTokenCookie(result.getAccessToken());
        ResponseCookie refreshTokenCookie = cookieUtil.generateRefreshTokenCookie(result.getAccessToken());

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
            .body(GenericApiResponse.success(result.getUserDto()));
    }

    @PostMapping("/login")
    public ResponseEntity<GenericApiResponse<UserDto>> login(
        @RequestBody LoginRequest request
    ) {
        AuthenticationResultDto result = service.login(request);
        ResponseCookie accessTokenCookie = cookieUtil.generateAccessTokenCookie(result.getAccessToken());
        ResponseCookie refreshTokenCookie = cookieUtil.generateRefreshTokenCookie(result.getRefreshToken());

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
            .body(GenericApiResponse.success(result.getUserDto()));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<GenericApiResponse<String>> refreshToken(
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        AuthenticationResultDto result = service.refreshToken(request);
        ResponseCookie accessTokenCookie = cookieUtil.generateAccessTokenCookie(result.getAccessToken());
        ResponseCookie refreshTokenCookie = cookieUtil.generateRefreshTokenCookie(result.getRefreshToken());

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
            .body(GenericApiResponse.success("Token has been successfully refreshed."));
    }

    @GetMapping("/activate-account")
    public ResponseEntity<GenericApiResponse<String>> activateAccount(
        @RequestParam String token
    ) throws MessagingException {
        service.activateAccount(token);
        return ResponseEntity.ok()
            .body(GenericApiResponse.success("The account has been successfully verified."));
    }
}
