package dev.hstoklosa.futurify.user.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateDailyGoalRequest {
    @NotNull(message = "Daily application goal cannot be null")
    @Min(value = 0, message = "Daily application goal must be a non-negative number")
    private Integer dailyApplicationGoal;
} 