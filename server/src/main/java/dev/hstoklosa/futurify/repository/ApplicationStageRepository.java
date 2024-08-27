package dev.hstoklosa.futurify.repository;

import dev.hstoklosa.futurify.model.entity.ApplicationStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ApplicationStageRepository extends JpaRepository<ApplicationStage, UUID> {
}
