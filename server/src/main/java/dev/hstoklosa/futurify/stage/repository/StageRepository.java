package dev.hstoklosa.futurify.stage.repository;

import dev.hstoklosa.futurify.board.entity.Board;
import dev.hstoklosa.futurify.stage.entity.Stage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StageRepository extends JpaRepository<Stage, Integer> {

    List<Stage> findAllByBoard(Board board);

}
