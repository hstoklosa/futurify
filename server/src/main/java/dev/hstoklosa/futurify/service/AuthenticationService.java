package dev.hstoklosa.futurify.service;

import dev.hstoklosa.futurify.domain.EmailTemplateName;
import dev.hstoklosa.futurify.domain.TokenType;
import dev.hstoklosa.futurify.domain.UserRole;
import dev.hstoklosa.futurify.domain.entities.ActivationToken;
import dev.hstoklosa.futurify.domain.entities.AccessToken;
import dev.hstoklosa.futurify.domain.entities.User;
import dev.hstoklosa.futurify.dto.AuthenticationResultDto;
import dev.hstoklosa.futurify.dto.UserDto;
import dev.hstoklosa.futurify.exception.DuplicateResourceException;
import dev.hstoklosa.futurify.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.mapper.UserDtoMapper;
import dev.hstoklosa.futurify.payload.request.LoginRequest;
import dev.hstoklosa.futurify.payload.request.RegisterRequest;
import dev.hstoklosa.futurify.repositories.ActivationTokenRepository;
import dev.hstoklosa.futurify.repositories.AccessTokenRepository;
import dev.hstoklosa.futurify.repositories.UserRepository;
import dev.hstoklosa.futurify.config.JwtService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final AccessTokenRepository accessTokenRepository;
    private final ActivationTokenRepository activationTokenRepository;

    private final JwtService jwtService;
    private final EmailService emailService;

    private final UserDtoMapper userDtoMapper;

    private final AuthenticationManager authManager;

    private final PasswordEncoder passwordEncoder;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    public AuthenticationResultDto register(RegisterRequest request) throws MessagingException {
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
            .enabled(false)
            .role(UserRole.USER)
            .build();

        var savedUser = userRepository.save(user);

        UserDto userDto = userDtoMapper.apply(savedUser);
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        saveUserToken(savedUser, accessToken);
        sendVerificationEmail(user);

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

    @Transactional
    public void activateAccount(String token) throws MessagingException {
        ActivationToken savedToken = activationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid activation code."));

        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendVerificationEmail(savedToken.getUser());
            throw new RuntimeException("Activation code has expired. A new token has been sent to your email address.");
        }

        var user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("The user wasn't found."));

        user.setEnabled(true);
        userRepository.save(user);

        savedToken.setValidatedAt(LocalDateTime.now());
        activationTokenRepository.save(savedToken);
    }

    private void sendVerificationEmail(User user) throws MessagingException {
        String verificationToken = generateAndSaveActivationToken(user);

        emailService.sendEmail(
                user.getEmail(),
                user.getFullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                verificationToken,
                "Account Activation"
        );
    }

    private String generateAndSaveActivationToken(User user) {
        String generatedToken = generateActivationToken(6);
        var token = ActivationToken.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();

        activationTokenRepository.save(token);
        return generatedToken;
    }

    private String generateActivationToken(int length) {
        String chars = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom random = new SecureRandom(); // generated value is cryptographically secure

        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(chars.length());
            codeBuilder.append(chars.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }

    public void saveUserToken(User user, String accessToken) {
        var token = AccessToken.builder()
            .user(user)
            .token(accessToken)
            .type(TokenType.BEARER)
            .expired(false)
            .revoked(false)
            .build();

        accessTokenRepository.save(token);
    }

    public void revokeAllUserTokens(User user) {
        var validTokens = accessTokenRepository.findAllValidTokenByUser(user.getId());

        if (validTokens.isEmpty())
            return;

        validTokens.forEach(token -> {
            token.setRevoked(true);
            token.setExpired(true);
        });

        accessTokenRepository.saveAll(validTokens);
    }
}
