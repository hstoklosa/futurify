package dev.hstoklosa.futurify.board.repository;

import dev.hstoklosa.futurify.board.entity.JobTimelineEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobTimelineEventRepository extends JpaRepository<JobTimelineEvent, Integer> {
    
    /**
     * Find all timeline events for a specific job
     * 
     * @param jobId The ID of the job
     * @return List of timeline events ordered by creation date (newest first)
     */
    List<JobTimelineEvent> findAllByJobIdOrderByCreatedAtDesc(Integer jobId);
} 