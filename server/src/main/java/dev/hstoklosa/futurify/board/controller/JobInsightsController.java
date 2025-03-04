package dev.hstoklosa.futurify.board.controller;

import dev.hstoklosa.futurify.board.dto.ai.JobDescriptionInsightsRequest;
import dev.hstoklosa.futurify.board.dto.ai.JobInsightsResponse;
import dev.hstoklosa.futurify.board.entity.Job;
import dev.hstoklosa.futurify.board.repository.JobRepository;
import dev.hstoklosa.futurify.board.service.DeepSeekService;
import dev.hstoklosa.futurify.common.api.ApiResponse;
import dev.hstoklosa.futurify.common.api.ResponseFactory;
import dev.hstoklosa.futurify.common.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.common.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobInsightsController {

    private final DeepSeekService deepSeekService;
    private final JobRepository jobRepository;

    /**
     * Get AI-generated insights for a job description
     * @param jobId ID of the job to analyze
     * @return JobInsights containing responsibilities, qualifications, and keywords
     */
    @GetMapping("/{jobId}/insights")
    public ResponseEntity<ApiResponse<JobInsightsResponse>> getJobInsights(@PathVariable Integer jobId) {
        // Fetch the job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("The requested job application doesn't exist."));
        
        // Verify the user has access to this job
        if (!job.getBoard().getUser().getId().equals(SecurityUtil.getCurrentUser().getId())) {
            throw new ResourceNotFoundException("The requested job application doesn't exist.");
        }
        
        // Extract insights
        JobInsightsResponse insights = deepSeekService.extractJobInsights(
                job.getTitle(),
                job.getCompanyName(),
                job.getDescription()
        );
        
        return ResponseEntity.ok().body(ResponseFactory.success(insights));
    }
    
    /**
     * Analyze a job description and extract insights
     * @param request Contains job title, company name, and description text to analyze
     * @return JobInsights containing responsibilities, qualifications, and keywords
     */
    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<JobInsightsResponse>> analyzeJobDescription(
            @Valid @RequestBody JobDescriptionInsightsRequest request
    ) {
        // Extract insights from the provided description
        JobInsightsResponse insights = deepSeekService.extractJobInsights(
                request.getJobTitle(),
                request.getCompanyName(),
                request.getJobDescription()
        );
        
        return ResponseEntity.ok().body(ResponseFactory.success(insights));
    }
} 