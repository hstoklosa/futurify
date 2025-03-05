package dev.hstoklosa.futurify.board.controller;

import dev.hstoklosa.futurify.board.dto.CreateJobRequest;
import dev.hstoklosa.futurify.board.dto.JobResponse;
import dev.hstoklosa.futurify.board.dto.UpdateJobPositionRequest;
import dev.hstoklosa.futurify.board.dto.UpdateJobRequest;
import dev.hstoklosa.futurify.board.service.JobService;
import dev.hstoklosa.futurify.common.api.ApiResponse;
import dev.hstoklosa.futurify.common.api.ResponseFactory;
import dev.hstoklosa.futurify.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {
    private final JobService jobService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJob(
            @PathVariable Integer id
    ) {
        JobResponse response = jobService.getJobById(id);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }
    
    @GetMapping("/board/{boardId}")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getJobsByBoard(
            @PathVariable Integer boardId
    ) {
        List<JobResponse> response = jobService.getJobs(boardId);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }
    
    @GetMapping("/stage/{stageId}")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getJobsByStage(
            @PathVariable Integer stageId
    ) {
        List<JobResponse> response = jobService.getJobsByStage(stageId);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }
    
    @PostMapping("/board/{boardId}")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @PathVariable Integer boardId,
            @Valid @RequestBody CreateJobRequest request
    ) {
        JobResponse response = jobService.createJob(boardId, request);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }
    
    @PatchMapping("/{jobId}/position")
    public ResponseEntity<ApiResponse<JobResponse>> updateJobPosition(
            @PathVariable Integer jobId,
            @Valid @RequestBody UpdateJobPositionRequest request
    ) {
        JobResponse response = jobService.updateJobPosition(jobId, request);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }
    
    @PutMapping("/{jobId}")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable Integer jobId,
            @Valid @RequestBody UpdateJobRequest request
    ) {
        JobResponse response = jobService.updateJob(jobId, request);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }

    @GetMapping("/today/count")
    public ResponseEntity<ApiResponse<Integer>> getTodayApplicationsCount(
            @AuthenticationPrincipal User user) {
        Integer count = jobService.getTodayApplicationsCount(user.getId());
        return ResponseEntity.ok(new ApiResponse<>(200, count, null));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Integer jobId) {
        jobService.deleteJob(jobId);
        return ResponseEntity.ok().body(ResponseFactory.success(null));
    }
}
