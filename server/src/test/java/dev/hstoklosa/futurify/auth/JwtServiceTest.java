package dev.hstoklosa.futurify.auth;

import dev.hstoklosa.futurify.user.entity.User;
import dev.hstoklosa.futurify.auth.service.JwtService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;


class JwtServiceTest {

//    private JwtConfig jwtConfig;

    private JwtService underTest;

    private User user;

    @BeforeEach
    void setUp() {

//        underTest = new JwtService(jwtConfig);
//
//        user = User.builder()
//            .firstName("FirstName")
//            .lastName("LastName")
//            .email("test@test.com")
//            .password("testpassword")
//            .role(UserRole.USER)
//            .enabled(true)
//            .build();
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void shouldGenerateValidToken() {
//        String token = underTest.generateToken(user);
//        assertThat(token).isNotEmpty().isNotNull();
//        assertThat(underTest.isTokenValid(token, user)).isTrue();
    }

    @Test
    void shouldExtractUsernameFromToken() {

    }

    @Test
    void shouldExtractExpirationFromToken() {

    }


}