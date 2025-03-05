package dev.hstoklosa.futurify.config;

import dev.hstoklosa.futurify.user.entity.User;
import dev.hstoklosa.futurify.user.entity.UserRole;
import dev.hstoklosa.futurify.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class SuperuserConfig {
    
    @Value("${application.superuser.name:#{null}}")
    private String superuserName;
    
    @Value("${application.superuser.surname:#{null}}")
    private String superuserSurname;
    
    @Value("${application.superuser.email:#{null}}")
    private String superuserEmail;
    
    @Value("${application.superuser.password:#{null}}")
    private String superuserPassword;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE) // Ensure this runs before DataLoader
    public CommandLineRunner initializeSuperuser() {
        return args -> {
            // Validate environment variables
            if (superuserEmail == null || superuserPassword == null || 
                superuserName == null || superuserSurname == null) {
                String errorMsg = "Missing required superuser environment variables. Please check your .env file for: " +
                    "SUPERUSER_NAME, SUPERUSER_SURNAME, SUPERUSER_EMAIL, SUPERUSER_PASSWORD";
                log.error(errorMsg);
                throw new IllegalStateException(errorMsg);
            }

            try {
                if (userRepository.findByEmail(superuserEmail).isEmpty()) {
                    User superuser = User.builder()
                        .firstName(superuserName)
                        .lastName(superuserSurname)
                        .email(superuserEmail)
                        .password(passwordEncoder.encode(superuserPassword))
                        .role(UserRole.ADMIN)
                        .enabled(true)
                        .build();

                    userRepository.save(superuser);
                    log.info("Superuser account created successfully with email: {}", superuserEmail);
                } else {
                    log.info("Superuser already exists with email: {} - skipping creation", superuserEmail);
                }
            } catch (Exception e) {
                String errorMsg = "Failed to create/verify superuser: " + e.getMessage();
                log.error(errorMsg, e);
                throw new IllegalStateException(errorMsg, e);
            }
        };
    }
} 