package dev.hstoklosa.futurify.repository;

import dev.hstoklosa.futurify.AbstractTestcontainers;
import dev.hstoklosa.futurify.user.entity.UserRole;
import dev.hstoklosa.futurify.user.entity.User;
import dev.hstoklosa.futurify.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest extends AbstractTestcontainers {

    @Autowired
    private UserRepository underTest;

    @BeforeEach
    void setUp() {
        underTest.deleteAll();
    }

    @Test
    void shouldReturnUserWhenFoundByEmail() {
        User user = User.builder()
            .id(1)
            .firstName("Hubert")
            .lastName("Stoklosa")
            .email("hubert.stoklosa23@gmail.com")
            .password("password")
            .role(UserRole.USER)
            .enabled(true)
            .build();
        underTest.save(user);

        Optional<User> result = underTest.findByEmail("hubert.stoklosa23@gmail.com");

        assertThat(result)
            .isPresent()
            .hasValueSatisfying(savedUser -> {
                assertThat(savedUser.getId()).isEqualTo(1);
                assertThat(savedUser.getFirstName()).isEqualTo("Hubert");
                assertThat(savedUser.getLastName()).isEqualTo("Stoklosa");
                assertThat(savedUser.getEmail()).isEqualTo("hubert.stoklosa23@gmail.com");
                assertThat(savedUser.getPassword()).isEqualTo("password");
                assertThat(savedUser.getRole()).isEqualTo(UserRole.USER);
                assertThat(savedUser.isEnabled()).isTrue();
            });
    }

    @Test
    void shouldNotReturnUserWhenNotFoundByEmail() {
        User user = User.builder()
                .id(1)
                .firstName("Hubert")
                .lastName("Stoklosa")
                .email("hubert.stoklosa23@gmail.com")
                .password("1234")
                .role(UserRole.USER)
                .enabled(true)
                .build();
        underTest.save(user);

        Optional<User> result = underTest.findByEmail("non@existent.com");
        assertThat(result).isNotPresent();
    }
}