package dev.hstoklosa.futurify.auth.controller;

import dev.hstoklosa.futurify.auth.service.AuthenticationService;
import dev.hstoklosa.futurify.common.api.ResponseFactory;
import dev.hstoklosa.futurify.auth.dto.UserResponse;
import dev.hstoklosa.futurify.auth.dto.LoginRequest;
import dev.hstoklosa.futurify.auth.dto.RegisterRequest;
import dev.hstoklosa.futurify.common.api.ApiResponse;
import dev.hstoklosa.futurify.common.util.CookieUtil;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseFactory.success(service.getCurrentUser()));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
        @RequestBody @Valid RegisterRequest request
    ) throws MessagingException {
        UserResponse response = service.register(request);
        ResponseCookie accessTokenCookie = CookieUtil.generateAccessTokenCookie(response.accessToken());
        ResponseCookie refreshTokenCookie = CookieUtil.generateRefreshTokenCookie(response.refreshToken());

        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(ResponseFactory.success(response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(
        @RequestBody LoginRequest request
    ) {
        UserResponse response = service.login(request);
        ResponseCookie accessTokenCookie = CookieUtil.generateAccessTokenCookie(response.accessToken());
        ResponseCookie refreshTokenCookie = CookieUtil.generateRefreshTokenCookie(response.refreshToken());

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(ResponseFactory.success(response));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<UserResponse>> refreshToken(
        HttpServletRequest request
    ) {
        UserResponse response = service.refreshToken(request);
        ResponseCookie accessTokenCookie = CookieUtil.generateAccessTokenCookie(response.accessToken());
        ResponseCookie refreshTokenCookie = CookieUtil.generateRefreshTokenCookie(response.refreshToken());

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(ResponseFactory.success(response));
    }

    @GetMapping("/activate-account")
    public ResponseEntity<ApiResponse<String>> activateAccount(
        @RequestParam String token
    ) throws MessagingException {
        service.activateAccount(token);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseFactory.success());
    }
}
