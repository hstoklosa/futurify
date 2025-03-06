package dev.hstoklosa.futurify.board.dto;

import dev.hstoklosa.futurify.board.entity.ActionType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateActionRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Action type is required")
    private ActionType type;

    @NotNull(message = "Start date and time is required")
    private LocalDateTime startDateTime;

    @NotNull(message = "End date and time is required")
    private LocalDateTime endDateTime;

    private String color;

    private String notes;

    private boolean completed = false;

    @AssertTrue(message = "Start date must be before end date")
    private boolean isStartDateBeforeEndDate() {
        if (startDateTime == null || endDateTime == null) {
            return true;
        }
        return startDateTime.isBefore(endDateTime);
    }
} 