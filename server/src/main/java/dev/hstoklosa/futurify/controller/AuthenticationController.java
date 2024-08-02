package dev.hstoklosa.futurify.controller;

import dev.hstoklosa.futurify.config.JwtService;
import dev.hstoklosa.futurify.dto.AuthenticationResultDto;
import dev.hstoklosa.futurify.dto.UserDto;
import dev.hstoklosa.futurify.payload.request.LoginRequest;
import dev.hstoklosa.futurify.payload.request.RegisterRequest;
import dev.hstoklosa.futurify.payload.response.GenericApiResponse;
import dev.hstoklosa.futurify.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
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

    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<GenericApiResponse<UserDto>> register(
        @RequestBody RegisterRequest request
    ) {
        AuthenticationResultDto result = service.register(request);
        ResponseCookie accessTokenCookie = jwtService.generateAccessTokenCookie(result.getAccessToken());
        ResponseCookie refreshTokenCookie = jwtService.generateRefreshTokenCookie(result.getAccessToken());

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
        ResponseCookie accessTokenCookie = jwtService.generateAccessTokenCookie(result.getAccessToken());
        ResponseCookie refreshTokenCookie = jwtService.generateRefreshTokenCookie(result.getRefreshToken());

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
        ResponseCookie accessTokenCookie = jwtService.generateAccessTokenCookie(result.getAccessToken());
        ResponseCookie refreshTokenCookie = jwtService.generateRefreshTokenCookie(result.getRefreshToken());

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
            .body(GenericApiResponse.success("Token has been successfully refreshed."));
    }
}
