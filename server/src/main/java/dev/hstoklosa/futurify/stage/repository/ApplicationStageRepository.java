package dev.hstoklosa.futurify.stage.repository;

import dev.hstoklosa.futurify.stage.entity.ApplicationStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ApplicationStageRepository extends JpaRepository<ApplicationStage, UUID> {
}
