package dev.hstoklosa.futurify.board.dto;

import dev.hstoklosa.futurify.board.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateJobRequest {
    
    @NotNull(message = "Stage ID is required")
    private Integer stageId;
    
    @NotBlank(message = "Job title is required")
    private String title;
    
    @NotBlank(message = "Company name is required")
    private String companyName;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Job type is required")
    private JobType type;
    
    private String description;
    
    private String postUrl;
    
    private String salary;
} 