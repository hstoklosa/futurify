package dev.hstoklosa.futurify.stage.repository;

import dev.hstoklosa.futurify.stage.entity.Stage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StageRepository extends JpaRepository<Stage, UUID> {}
