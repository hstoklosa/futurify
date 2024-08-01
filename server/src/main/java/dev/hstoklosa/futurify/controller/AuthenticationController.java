package dev.hstoklosa.futurify.controller;

import dev.hstoklosa.futurify.dto.AuthenticationResult;
import dev.hstoklosa.futurify.payload.request.LoginRequest;
import dev.hstoklosa.futurify.payload.request.RegisterRequest;
import dev.hstoklosa.futurify.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<?> register(
        @RequestBody RegisterRequest request
    ) {
        AuthenticationResult result = service.register(request);
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, result.getAccessTokenCookie().toString())
            .header(HttpHeaders.SET_COOKIE, result.getRefreshTokenCookie().toString())
            .body(result.getUserDTO());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {
        AuthenticationResult result = service.login(request);
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, result.getAccessTokenCookie().toString())
            .header(HttpHeaders.SET_COOKIE, result.getRefreshTokenCookie().toString())
            .body(result.getUserDTO());
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        AuthenticationResult result = service.refreshToken(request);
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, result.getAccessTokenCookie().toString())
            .header(HttpHeaders.SET_COOKIE, result.getRefreshTokenCookie().toString())
            .body(result.getUserDTO());
    }
}
