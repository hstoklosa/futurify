package dev.hstoklosa.futurify.repository;

import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;


@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class AccessTokenRepositoryTest {

//    @Autowired
//    private AccessTokenRepository underTest;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    private User user;
//
//    @BeforeEach
//    void setUp() {
//        user = User.builder()
//            .firstName("FirstName")
//            .lastName("LastName")
//            .email("test@test.com")
//            .password("testpassword")
//            .role(UserRole.USER)
//            .enabled(true)
//            .build();
//
//        userRepository.save(user);
//    }
//
//    @AfterEach
//    void tearDown() {
//        userRepository.deleteAll();
//        underTest.deleteAll();
//    }
//
//    @Test
//    void shouldReturnAllValidTokens() {
//        // Given
//        var validToken1 = AccessToken.builder()
//            .user(user)
//            .token("token1")
//            .type(TokenType.BEARER)
//            .expired(false)
//            .revoked(false)
//            .build();
//
//        var validToken2 = AccessToken.builder()
//            .user(user)
//            .token("token2")
//            .type(TokenType.BEARER)
//            .expired(false)
//            .revoked(false)
//            .build();
//
//        var invalidToken = AccessToken.builder()
//            .user(user)
//            .token("token3")
//            .type(TokenType.BEARER)
//            .expired(true)
//            .revoked(true)
//            .build();
//
//        underTest.saveAll(List.of(validToken1, validToken2, invalidToken));
//
//        // When
//        List<AccessToken> validTokens = underTest.findAllValidTokenByUser(user.getId());
//
//        validTokens.forEach(token -> {
//            System.out.println("XD: " + token.getToken());
//        });
//
//        // Then
//        assertThat(validTokens).hasSize(2)
//            .extracting(token -> token.getToken())
//            .containsExactlyInAnyOrder("token1", "token2");
//    }
//
//    @Test
//    void shouldReturnEmptyListWhenNoValidTokens() {
//        // Given
//        var invalidToken = AccessToken.builder()
//            .user(user)
//            .token("token1")
//            .type(TokenType.BEARER)
//            .expired(true)
//            .revoked(true)
//            .build();
//
//        underTest.save(invalidToken);
//
//        // When
//        List<AccessToken> validTokens = underTest.findAllValidTokenByUser(user.getId());
//
//        // Then
//        assertThat(validTokens).isEmpty();
//    }
//
//    @Test
//    void shouldReturnEmptyListWhenUserDoesNotExist() {
//        // When
//        List<AccessToken> validTokens = underTest.findAllValidTokenByUser(999);
//
//        // Then
//        assertThat(validTokens).isEmpty();
//    }
}