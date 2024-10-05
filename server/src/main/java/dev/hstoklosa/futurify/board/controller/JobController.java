package dev.hstoklosa.futurify.board.controller;

import dev.hstoklosa.futurify.board.dto.CreateJobRequest;
import dev.hstoklosa.futurify.board.dto.JobResponse;
import dev.hstoklosa.futurify.board.service.JobService;
import dev.hstoklosa.futurify.common.api.ApiResponse;
import dev.hstoklosa.futurify.common.api.ResponseFactory;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boards/{id}")
public class JobController {

    private final JobService jobService;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getJobs(
            @PathVariable Integer id
    ) {
        List<JobResponse> response = jobService.getJobs(id);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }

    @PostMapping("/jobs")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @PathVariable Integer id,
            @RequestBody @Valid CreateJobRequest request
    ) {
        JobResponse response = jobService.createJob(id, request);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }
}
