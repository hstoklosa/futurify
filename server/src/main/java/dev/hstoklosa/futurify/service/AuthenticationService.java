package dev.hstoklosa.futurify.service;

import dev.hstoklosa.futurify.dto.AuthenticationResponseDto;
import dev.hstoklosa.futurify.dto.TokenDto;
import dev.hstoklosa.futurify.exception.InvalidTokenException;
import dev.hstoklosa.futurify.model.enums.EmailTemplate;
import dev.hstoklosa.futurify.model.enums.UserRole;
import dev.hstoklosa.futurify.model.entity.ActivationToken;
import dev.hstoklosa.futurify.model.entity.User;
import dev.hstoklosa.futurify.dto.UserDto;
import dev.hstoklosa.futurify.exception.DuplicateResourceException;
import dev.hstoklosa.futurify.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.mapper.UserDtoMapper;
import dev.hstoklosa.futurify.dto.request.LoginRequest;
import dev.hstoklosa.futurify.dto.request.RegisterRequest;
import dev.hstoklosa.futurify.repository.ActivationTokenRepository;
import dev.hstoklosa.futurify.repository.UserRepository;
import dev.hstoklosa.futurify.util.SecurityUtil;
import dev.hstoklosa.futurify.util.CookieUtil;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final JwtService jwtService;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final ActivationTokenRepository activationTokenRepository;
    private final UserDtoMapper userDtoMapper;
    private final AuthenticationManager authManager;
    private final PasswordEncoder passwordEncoder;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    public UserDto getCurrentUser() {
        if (SecurityUtil.isAuthenticated()) {
            throw new InsufficientAuthenticationException("You need to authenticated before accessing user data.");
        }

        return userDtoMapper.apply(SecurityUtil.getCurrentUser());
    }

    public AuthenticationResponseDto register(RegisterRequest request) throws MessagingException {
         if (userRepository.existsByEmail(request.getEmail())) {
             throw new DuplicateResourceException(
                "The email address is already taken."
             );
         }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .role(UserRole.USER)
                .build();

        User savedUser = userRepository.save(user);
        UserDto userDto = userDtoMapper.apply(savedUser);
        TokenDto tokens = jwtService.issueTokens(user);

        sendVerificationEmail(user);

        return AuthenticationResponseDto.builder()
                .accessToken(tokens.getAccessToken())
                .refreshToken(tokens.getRefreshToken())
                .userDto(userDto)
                .build();
    }

    public AuthenticationResponseDto login(LoginRequest request) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException(
                "User with the email [%s] wasn't found.".formatted(request.getEmail())
            ));

        TokenDto tokens = jwtService.issueTokens(user);
        UserDto userDto = userDtoMapper.apply(user);

        return AuthenticationResponseDto.builder()
                .accessToken(tokens.getAccessToken())
                .refreshToken(tokens.getRefreshToken())
                .userDto(userDto)
                .build();
    }

    @Transactional
    public AuthenticationResponseDto refreshToken(HttpServletRequest request) {
        final String refreshToken = CookieUtil.getRefreshTokenFromCookie(request);
        if (refreshToken == null) {
            throw new InvalidTokenException("Refresh token is missing.");
        }

        final String userEmail = jwtService.extractUsername(refreshToken) ;
        if (userEmail == null) {
            throw new InvalidTokenException("Unable to extract user email from refresh token");
        }

        var user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User with email %s wasn't found.".formatted(userEmail)
            ));


        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new InvalidTokenException("Refresh token is invalid or expired");
        }

        UserDto userDto = userDtoMapper.apply(user);
        TokenDto tokens = jwtService.issueTokens(user);

        return AuthenticationResponseDto.builder()
                .accessToken(tokens.getAccessToken())
                .refreshToken(tokens.getRefreshToken())
                .userDto(userDto)
                .build();
    }

    @Transactional(dontRollbackOn = InvalidTokenException.class)
    public void activateAccount(String token) throws MessagingException {
        ActivationToken savedToken = activationTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("The provided activation code is invalid."));

        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendVerificationEmail(savedToken.getUser());
            throw new InvalidTokenException("Activation code has expired. A new token has been sent to your email address.");
        }

        User user = userRepository.findById(savedToken.getUser().getId())
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
                EmailTemplate.ACTIVATE_ACCOUNT,
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
        SecureRandom random = new SecureRandom();

        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(chars.length());
            codeBuilder.append(chars.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }

}
