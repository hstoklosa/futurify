package dev.hstoklosa.futurify.service;

import dev.hstoklosa.futurify.common.exception.DuplicateResourceException;
import dev.hstoklosa.futurify.common.exception.InvalidTokenException;
import dev.hstoklosa.futurify.dto.response.UserResponse;
import dev.hstoklosa.futurify.mapper.UserMapper;
import dev.hstoklosa.futurify.model.enums.EmailTemplate;
import dev.hstoklosa.futurify.model.enums.UserRole;
import dev.hstoklosa.futurify.model.entity.ActivationToken;
import dev.hstoklosa.futurify.model.entity.User;
import dev.hstoklosa.futurify.common.exception.ResourceNotFoundException;
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
    private final UserMapper userMapper;
    private final AuthenticationManager authManager;
    private final PasswordEncoder passwordEncoder;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    public UserResponse getCurrentUser() {
        if (!SecurityUtil.isAuthenticated()) {
            throw new InsufficientAuthenticationException("You need to authenticated before accessing user data.");
        }

        return userMapper.userToUserResponse(SecurityUtil.getCurrentUser());
    }

    public UserResponse register(RegisterRequest request) throws MessagingException {
         if (userRepository.existsByEmail(request.getEmail())) {
             throw new DuplicateResourceException("The provided email is already in use.");
         }

        User user = userRepository.save(
                User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .role(UserRole.USER)
                .build()
        );
        sendVerificationEmail(user);

        return userMapper.userToAuthUserResponse(user, jwtService.issueTokens(user));
    }

    public UserResponse login(LoginRequest request) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User with the email [%s] wasn't found.".formatted(request.getEmail())));

        return userMapper.userToAuthUserResponse(user, jwtService.issueTokens(user));
    }

    @Transactional
    public UserResponse refreshToken(HttpServletRequest request) {
        final String refreshToken = CookieUtil.getRefreshTokenFromCookie(request);
        if (refreshToken == null) {
            throw new InvalidTokenException("The provided JWT token is invalid.");
        }

        final String userEmail = jwtService.extractUsername(refreshToken) ;
        if (userEmail == null) {
            throw new InvalidTokenException("The provided JWT token is invalid.");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User with email %s wasn't found.".formatted(userEmail)));

        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new InvalidTokenException("The provided JWT token is invalid.");
        }

        return userMapper.userToAuthUserResponse(user, jwtService.issueTokens(user));
    }

    @Transactional(dontRollbackOn = InvalidTokenException.class)
    public void activateAccount(String token) throws MessagingException {
        ActivationToken savedToken = activationTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("The provided activation code is invalid."));

        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendVerificationEmail(savedToken.getUser());
            throw new InvalidTokenException("The provided activation code has expired. A new token has been sent to your email address.");
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
