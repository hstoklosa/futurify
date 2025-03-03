package dev.hstoklosa.futurify.board.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateJobPositionRequest {

    @NotNull(message = "Stage ID is required.")
    private Integer stageId;

    @NotNull(message = "Position is required.")
    @Min(value = 0, message = "Position must be a non-negative integer.")
    private Integer position;
} 