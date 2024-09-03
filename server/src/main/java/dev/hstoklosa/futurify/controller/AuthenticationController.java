package dev.hstoklosa.futurify.controller;

import dev.hstoklosa.futurify.dto.AuthenticationResponseDto;
import dev.hstoklosa.futurify.dto.UserDto;
import dev.hstoklosa.futurify.dto.request.LoginRequest;
import dev.hstoklosa.futurify.dto.request.RegisterRequest;
import dev.hstoklosa.futurify.dto.response.GenericApiResponse;
import dev.hstoklosa.futurify.service.AuthenticationService;
import dev.hstoklosa.futurify.util.CookieUtil;
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
    public ResponseEntity<GenericApiResponse<UserDto>> me() {
        return ResponseEntity.ok().body(GenericApiResponse.success(service.getCurrentUser()));
    }

    @PostMapping("/register")
    public ResponseEntity<GenericApiResponse<UserDto>> register(
        @RequestBody @Valid RegisterRequest request
    ) throws MessagingException {
        AuthenticationResponseDto response = service.register(request);
        ResponseCookie accessTokenCookie = CookieUtil.generateAccessTokenCookie(response.getAccessToken());
        ResponseCookie refreshTokenCookie = CookieUtil.generateRefreshTokenCookie(response.getRefreshToken());

        return ResponseEntity.status(HttpStatus.CREATED)
            .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
            .body(GenericApiResponse.success(response.getUserDto()));
    }

    @PostMapping("/login")
    public ResponseEntity<GenericApiResponse<UserDto>> login(
        @RequestBody LoginRequest request
    ) {
        AuthenticationResponseDto response = service.login(request);
        ResponseCookie accessTokenCookie = CookieUtil.generateAccessTokenCookie(response.getAccessToken());
        ResponseCookie refreshTokenCookie = CookieUtil.generateRefreshTokenCookie(response.getRefreshToken());

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
            .body(GenericApiResponse.success(response.getUserDto()));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<GenericApiResponse<UserDto>> refreshToken(
        HttpServletRequest request
    ) {
        AuthenticationResponseDto response = service.refreshToken(request);
        ResponseCookie accessTokenCookie = CookieUtil.generateAccessTokenCookie(response.getAccessToken());
        ResponseCookie refreshTokenCookie = CookieUtil.generateRefreshTokenCookie(response.getRefreshToken());

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
            .body(GenericApiResponse.success());
    }

    @GetMapping("/activate-account")
    public ResponseEntity<GenericApiResponse<String>> activateAccount(
        @RequestParam String token
    ) throws MessagingException {
        service.activateAccount(token);
        return ResponseEntity.ok().body(GenericApiResponse.success());
    }
}
