package dev.hstoklosa.futurify.board.repository;

import dev.hstoklosa.futurify.board.entity.Action;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActionRepository extends JpaRepository<Action, Integer> {
    @Query("SELECT a FROM Action a LEFT JOIN FETCH a.job WHERE a.job.id = :jobId")
    List<Action> findByJobId(@Param("jobId") Integer jobId);

    @Query("SELECT a FROM Action a LEFT JOIN FETCH a.job WHERE a.id = :actionId")
    Action findByIdWithJob(@Param("actionId") Integer actionId);
} 