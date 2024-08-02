package dev.hstoklosa.futurify.service;

import dev.hstoklosa.futurify.domain.TokenType;
import dev.hstoklosa.futurify.domain.UserRole;
import dev.hstoklosa.futurify.domain.entities.Token;
import dev.hstoklosa.futurify.domain.entities.User;
import dev.hstoklosa.futurify.dto.AuthenticationResultDto;
import dev.hstoklosa.futurify.dto.UserDto;
import dev.hstoklosa.futurify.exception.DuplicateResourceException;
import dev.hstoklosa.futurify.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.mapper.UserDtoMapper;
import dev.hstoklosa.futurify.payload.request.LoginRequest;
import dev.hstoklosa.futurify.payload.request.RegisterRequest;
import dev.hstoklosa.futurify.repositories.TokenRepository;
import dev.hstoklosa.futurify.repositories.UserRepository;
import dev.hstoklosa.futurify.config.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;

    private final TokenRepository tokenRepository;

    private final UserDtoMapper userDtoMapper;

    private final JwtService jwtService;

    private final AuthenticationManager authManager;

    private final PasswordEncoder passwordEncoder;


    public AuthenticationResultDto register(RegisterRequest request) {
         if (userRepository.existsByEmail(request.getEmail())) {
             throw new DuplicateResourceException(
                "The email address is already taken."
             );
         }

        var user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(UserRole.USER)
            .build();

        var savedUser = userRepository.save(user);

        UserDto userDto = userDtoMapper.apply(savedUser);
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        saveUserToken(savedUser, accessToken);

        return AuthenticationResultDto.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .userDto(userDto)
            .build();
    }

    public AuthenticationResultDto login(LoginRequest request) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        var user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException(
                "User with email [%s] wasn't found.".formatted(request.getEmail())
            ));

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        UserDto userDto = userDtoMapper.apply(user);

        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);

        return AuthenticationResultDto.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .userDto(userDto)
            .build();
    }

    public AuthenticationResultDto refreshToken(HttpServletRequest request) {
        final String refreshToken;
        final String userEmail;

        refreshToken = jwtService.getRefreshTokenFromCookie(request);
        if (refreshToken == null)
            return null;

        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "User with email %s wasn't found.".formatted(userEmail)
                ));

            if (jwtService.isTokenValid(refreshToken, user)) {
                String accessToken = jwtService.generateToken(user);
                String newRefreshToken = jwtService.generateRefreshToken(user);
                UserDto userDto = userDtoMapper.apply(user);

                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);

                return AuthenticationResultDto.builder()
                    .accessToken(accessToken)
                    .refreshToken(newRefreshToken)
                    .userDto(userDto)
                    .build();
            }
        }

        return null;
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
