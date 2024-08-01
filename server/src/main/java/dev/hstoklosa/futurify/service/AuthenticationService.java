package dev.hstoklosa.futurify.service;

import dev.hstoklosa.futurify.domain.TokenType;
import dev.hstoklosa.futurify.domain.UserRole;
import dev.hstoklosa.futurify.domain.entities.Token;
import dev.hstoklosa.futurify.domain.entities.User;
import dev.hstoklosa.futurify.dto.AuthenticationResult;
import dev.hstoklosa.futurify.dto.UserDTO;
import dev.hstoklosa.futurify.mapper.UserDTOMapper;
import dev.hstoklosa.futurify.payload.request.LoginRequest;
import dev.hstoklosa.futurify.payload.request.RegisterRequest;
import dev.hstoklosa.futurify.repositories.TokenRepository;
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

    private final UserRepository userRepository;

    private final TokenRepository tokenRepository;

    private final UserDTOMapper userDTOMapper;

    private final JwtService jwtService;

    private final AuthenticationManager authManager;

    private final PasswordEncoder passwordEncoder;


    public AuthenticationResult register(RegisterRequest request) {
        // if (repository.existsByEmail(request.getEmail())) {}

        var user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(UserRole.USER)
            .build();

        var savedUser = userRepository.save(user);

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        saveUserToken(savedUser, accessToken);

        ResponseCookie accessTokenCookie = jwtService.generateAccessTokenCookie(accessToken);
        ResponseCookie refreshTokenCookie = jwtService.generateRefreshTokenCookie(refreshToken);
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

        var user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(); // TODO: throw correct exception, handle it etc

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);

        ResponseCookie accessTokenCookie = jwtService.generateAccessTokenCookie(accessToken);
        ResponseCookie refreshTokenCookie = jwtService.generateRefreshTokenCookie(refreshToken);
        UserDTO userDTO = userDTOMapper.apply(user);

        return AuthenticationResult.builder()
            .accessTokenCookie(accessTokenCookie)
            .refreshTokenCookie(refreshTokenCookie)
            .userDTO(userDTO)
            .build();
    }

    public void saveUserToken(User user, String accessToken) {
        var token = Token.builder()
            .user(user)
            .token(accessToken)
            .type(TokenType.BEARER)
            .expired(false)
            .revoked(false)
            .build();

        tokenRepository.save(token);
    }

    public void revokeAllUserTokens(User user) {
        var validTokens = tokenRepository.findAllValidTokenByUser(user.getId());

        if (validTokens.isEmpty())
            return;

        validTokens.forEach(token -> {
            token.setRevoked(true);
            token.setExpired(true);
        });

        tokenRepository.saveAll(validTokens);
    }

}
