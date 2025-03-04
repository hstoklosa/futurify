package dev.hstoklosa.futurify.board.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDescriptionInsightsRequest {
    @NotBlank(message = "Job title is required")
    private String jobTitle;
    
    @NotBlank(message = "Company name is required")
    private String companyName;
    
    @NotBlank(message = "Job description is required")
    private String jobDescription;
} 