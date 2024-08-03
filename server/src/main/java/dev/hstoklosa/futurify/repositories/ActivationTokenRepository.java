package dev.hstoklosa.futurify.repositories;

import dev.hstoklosa.futurify.domain.entities.ActivationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActivationTokenRepository extends JpaRepository<ActivationToken, Integer> {

    Optional<ActivationToken> findByToken(String token);
}
