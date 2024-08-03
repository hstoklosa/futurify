package dev.hstoklosa.futurify.repositories;

import dev.hstoklosa.futurify.domain.entities.AccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AccessTokenRepository extends JpaRepository<AccessToken, Integer> {

    @Query(value = """
        SELECT t FROM AccessToken t INNER JOIN User u\s
        ON t.user.id = u.id\s
        WHERE u.id = :id AND (t.expired = FALSE OR t.revoked = FALSE)\s
    """)
    List<AccessToken> findAllValidTokenByUser(Integer id);

    Optional<AccessToken> findByToken(String id);

}
