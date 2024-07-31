package dev.hstoklosa.futurify.controller;

import dev.hstoklosa.futurify.dto.AuthenticationResponse;
import dev.hstoklosa.futurify.dto.LoginRequest;
import dev.hstoklosa.futurify.dto.RegisterRequest;
import dev.hstoklosa.futurify.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<AuthenticationResponse> register(
        @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(service.login(request));
    }

}
