package dev.hstoklosa.futurify.service;

import dev.hstoklosa.futurify.config.JwtService;
import dev.hstoklosa.futurify.domain.UserRole;
import dev.hstoklosa.futurify.domain.entities.User;
import dev.hstoklosa.futurify.dto.AuthenticationResponse;
import dev.hstoklosa.futurify.dto.LoginRequest;
import dev.hstoklosa.futurify.dto.RegisterRequest;
import dev.hstoklosa.futurify.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(UserRole.USER)
            .build();

        repository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
            .token(jwtToken)
            .build();
    }

    public AuthenticationResponse login(LoginRequest request) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        var user = repository.findByEmail(request.getEmail())
            .orElseThrow(); // TODO: throw correct exception, handle it etc
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
            .token(jwtToken)
            .build();
    }
}
