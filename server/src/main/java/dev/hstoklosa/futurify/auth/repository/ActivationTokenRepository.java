package dev.hstoklosa.futurify.auth.repository;

import dev.hstoklosa.futurify.auth.entity.ActivationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActivationTokenRepository extends JpaRepository<ActivationToken, Integer> {

    Optional<ActivationToken> findByToken(String token);

}
