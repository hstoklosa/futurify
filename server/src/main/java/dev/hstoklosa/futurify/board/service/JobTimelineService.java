package dev.hstoklosa.futurify.board.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hstoklosa.futurify.board.JobTimelineEventMapper;
import dev.hstoklosa.futurify.board.dto.JobTimelineEventResponse;
import dev.hstoklosa.futurify.board.entity.Job;
import dev.hstoklosa.futurify.board.entity.JobEventType;
import dev.hstoklosa.futurify.board.entity.JobTimelineEvent;
import dev.hstoklosa.futurify.board.repository.JobRepository;
import dev.hstoklosa.futurify.board.repository.JobTimelineEventRepository;
import dev.hstoklosa.futurify.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobTimelineService {

    private final JobTimelineEventRepository timelineRepository;
    private final JobRepository jobRepository;
    private final JobTimelineEventMapper timelineMapper;
    private final ObjectMapper objectMapper;

    /**
     * Creates a timeline event for a job
     *
     * @param jobId The ID of the job
     * @param eventType The type of event
     * @param description A human-readable description of the event
     * @param details Optional details about the event (can be null)
     */
    @Transactional
    public void createTimelineEvent(Integer jobId, JobEventType eventType, String description, Object details) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        String detailsJson = null;
        if (details != null) {
            try {
                detailsJson = objectMapper.writeValueAsString(details);
            } catch (JsonProcessingException e) {
                log.error("Failed to serialize event details", e);
                detailsJson = "Error serializing details: " + e.getMessage();
            }
        }

        JobTimelineEvent event = JobTimelineEvent.builder()
                .job(job)
                .eventType(eventType)
                .description(description)
                .details(detailsJson)
                .build();

        timelineRepository.save(event);
    }

    /**
     * Records a job creation event
     */
    @Transactional
    public void recordJobCreation(Job job) {
        createTimelineEvent(
                job.getId(),
                JobEventType.CREATED,
                "Job application created",
                Map.of(
                        "title", job.getTitle(),
                        "company", job.getCompanyName(),
                        "stage", job.getStage().getName()
                )
        );
    }

    /**
     * Records a job update event with changes
     */
    @Transactional
    public void recordJobUpdate(Job job, Map<String, String> changes) {
        createTimelineEvent(
                job.getId(),
                JobEventType.UPDATED,
                "Job application details updated",
                changes
        );
    }

    /**
     * Records a stage change event
     */
    @Transactional
    public void recordStageChange(Job job, String oldStageName, String newStageName) {
        createTimelineEvent(
                job.getId(),
                JobEventType.STAGE_CHANGED,
                "Job stage changed from '" + oldStageName + "' to '" + newStageName + "'",
                Map.of(
                        "previousStage", oldStageName,
                        "newStage", newStageName
                )
        );
    }

    /**
     * Records a position change event
     * This method is no longer used as we don't track position changes within columns
     */
    /*
    @Transactional
    public void recordPositionChange(Job job, int oldPosition, int newPosition) {
        createTimelineEvent(
                job.getId(),
                JobEventType.POSITION_CHANGED,
                "Job position changed from " + oldPosition + " to " + newPosition,
                Map.of(
                        "previousPosition", oldPosition,
                        "newPosition", newPosition
                )
        );
    }
    */

    /**
     * Records a note creation event
     */
    @Transactional
    public void recordNoteCreation(Job job, String noteContent) {
        // Create a preview of the note content (truncate if too long)
        String preview = createNotePreview(noteContent);
        
        createTimelineEvent(
                job.getId(),
                JobEventType.NOTE_CREATED,
                "Note added to job application",
                Map.of(
                        "preview", preview
                )
        );
    }

    /**
     * Records a note update event
     */
    @Transactional
    public void recordNoteUpdate(Job job, String oldContent, String newContent) {
        // Create previews of the old and new content
        String oldPreview = createNotePreview(oldContent);
        String newPreview = createNotePreview(newContent);
        
        createTimelineEvent(
                job.getId(),
                JobEventType.NOTE_UPDATED,
                "Note updated",
                Map.of(
                        "previousContent", oldPreview,
                        "newContent", newPreview,
                        "preview", newPreview // For simpler display in the UI
                )
        );
    }

    /**
     * Records a note deletion event
     */
    @Transactional
    public void recordNoteDeletion(Job job, String noteContent) {
        // Create a preview of the deleted note content
        String preview = createNotePreview(noteContent);
        
        createTimelineEvent(
                job.getId(),
                JobEventType.NOTE_DELETED,
                "Note deleted from job application",
                Map.of(
                        "preview", preview
                )
        );
    }
    
    /**
     * Creates a preview of note content by truncating if necessary
     */
    private String createNotePreview(String content) {
        if (content == null) {
            return "";
        }
        
        // Limit preview to 50 characters
        int maxLength = 50;
        if (content.length() <= maxLength) {
            return content;
        }
        
        return content.substring(0, maxLength) + "...";
    }

    /**
     * Gets all timeline events for a job
     *
     * @param jobId The ID of the job
     * @return List of timeline events ordered by timestamp (newest first)
     */
    @Transactional(readOnly = true)
    public List<JobTimelineEventResponse> getJobTimelineEvents(Integer jobId) {
        // Check if job exists
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job not found with ID: " + jobId);
        }

        return timelineRepository.findAllByJobIdOrderByCreatedAtDesc(jobId).stream()
                .map(timelineMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Deletes all timeline events for a job
     *
     * @param jobId The ID of the job
     */
    @Transactional
    public void deleteAllTimelineEventsByJobId(Integer jobId) {
        // Check if job exists
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job not found with ID: " + jobId);
        }
        
        List<JobTimelineEvent> events = timelineRepository.findAllByJobIdOrderByCreatedAtDesc(jobId);
        if (!events.isEmpty()) {
            timelineRepository.deleteAll(events);
        }
    }
} 