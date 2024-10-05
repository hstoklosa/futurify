package dev.hstoklosa.futurify.board.dto;

import dev.hstoklosa.futurify.board.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateJobRequest {

    @NotBlank(message = "Job title is required.")
    private String title;

    @NotBlank(message = "Company name is required.")
    private String companyName;

    @NotBlank(message = "Job location is required.")
    private String location;

    @NotNull(message = "Job type is required.")
    private JobType type;

    private String description;

    @NotNull(message = "Job must be attached to a stage.")
    private Integer stageId;

}
