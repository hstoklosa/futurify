package dev.hstoklosa.futurify.service;

import dev.hstoklosa.futurify.domain.UserRole;
import dev.hstoklosa.futurify.domain.entities.User;
import dev.hstoklosa.futurify.dto.AuthenticationResult;
import dev.hstoklosa.futurify.dto.UserDTO;
import dev.hstoklosa.futurify.mapper.UserDTOMapper;
import dev.hstoklosa.futurify.payload.request.LoginRequest;
import dev.hstoklosa.futurify.payload.request.RegisterRequest;
import dev.hstoklosa.futurify.repositories.UserRepository;
import dev.hstoklosa.futurify.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
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

    private final UserDTOMapper userDTOMapper;

    public AuthenticationResult register(RegisterRequest request) {
        // if (repository.existsByEmail(request.getEmail())) {}

        var user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(UserRole.USER)
            .build();

        var savedUser = repository.save(user);

        ResponseCookie accessTokenCookie = jwtService.generateAccessTokenCookie(user);
        ResponseCookie refreshTokenCookie = jwtService.generateRefreshTokenCookie(user);
        UserDTO userDTO = userDTOMapper.apply(savedUser);

        return AuthenticationResult.builder()
            .accessTokenCookie(accessTokenCookie)
            .refreshTokenCookie(refreshTokenCookie)
            .userDTO(userDTO)
            .build();
    }

    public AuthenticationResult login(LoginRequest request) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        var user = repository.findByEmail(request.getEmail())
            .orElseThrow(); // TODO: throw correct exception, handle it etc

        ResponseCookie accessTokenCookie = jwtService.generateAccessTokenCookie(user);
        ResponseCookie refreshTokenCookie = jwtService.generateRefreshTokenCookie(user);
        UserDTO userDTO = userDTOMapper.apply(user);

        return AuthenticationResult.builder()
            .accessTokenCookie(accessTokenCookie)
            .refreshTokenCookie(refreshTokenCookie)
            .userDTO(userDTO)
            .build();
    }

}
