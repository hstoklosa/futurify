package dev.hstoklosa.futurify.board.repository;

import dev.hstoklosa.futurify.board.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Integer> {

    List<Job> findAllByBoardId(Integer boardId);
    
    @Query("SELECT j FROM Job j WHERE j.stage.id = :stageId ORDER BY j.position ASC")
    List<Job> findAllByStageIdOrderByPositionAsc(@Param("stageId") Integer stageId);

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
    
    @Modifying
    @Query(value = """
        UPDATE Job j
        SET j.position = j.position - 1\s
        WHERE j.stage.id = :stageId\s
            AND (j.position >= :start AND j.position <= :end)\s
    """)
    void shiftPositionsDown(
            @Param("stageId") Integer stageId,
            @Param("start") Integer startPos,
            @Param("end") Integer endPos
    );

    @Query("SELECT MAX(j.position) FROM Job j WHERE j.stage.id = :stageId")
    Integer findMaxPositionByStageId(@Param("stageId") Integer stageId);
    
    @Query("SELECT COUNT(j) FROM Job j WHERE j.stage.id = :stageId")
    Integer countByStageId(@Param("stageId") Integer stageId);
    
    @Modifying
    @Query("UPDATE Job j SET j.stage.id = :newStageId, j.position = :newPosition WHERE j.id = :jobId")
    void updateJobStageAndPosition(
            @Param("jobId") Integer jobId,
            @Param("newStageId") Integer newStageId,
            @Param("newPosition") Integer newPosition
    );
}
