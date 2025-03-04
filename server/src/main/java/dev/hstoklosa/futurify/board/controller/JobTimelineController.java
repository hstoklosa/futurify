package dev.hstoklosa.futurify.board.controller;

import dev.hstoklosa.futurify.board.dto.JobTimelineEventResponse;
import dev.hstoklosa.futurify.board.service.JobTimelineService;
import dev.hstoklosa.futurify.common.api.ApiResponse;
import dev.hstoklosa.futurify.common.api.ResponseFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/jobs/{jobId}/timeline")
public class JobTimelineController {

    private final JobTimelineService timelineService;

    /**
     * Get timeline events for a specific job
     * 
     * @param jobId The ID of the job
     * @return List of timeline events
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<JobTimelineEventResponse>>> getJobTimeline(
            @PathVariable Integer jobId
    ) {
        List<JobTimelineEventResponse> timelineEvents = timelineService.getJobTimelineEvents(jobId);
        return ResponseEntity.ok().body(ResponseFactory.success(timelineEvents));
    }
} 