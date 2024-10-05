package dev.hstoklosa.futurify.board.repository;

import dev.hstoklosa.futurify.board.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Integer> {

    List<Job> findAllByBoardId(Integer boardId);

    @Modifying
    @Query(value = """
        UPDATE Job j
        SET j.position = j.position + 1\s
        WHERE j.stage.id = :stageId\s
            AND (j.position >= :start AND j.position <= :end)\s
    """)
    void shiftPositionsUp(
            @Param("stageId") Integer stageId,
            @Param("start") Integer startPos,
            @Param("end") Integer endPos
    );


    @Query("SELECT MAX(j.position) FROM Job j WHERE j.stage.id = :stageId")
    Integer findMaxPositionByStageId(@Param("stageId") Integer stageId);

}
