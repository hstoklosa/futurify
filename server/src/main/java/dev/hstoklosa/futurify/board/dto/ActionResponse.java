package dev.hstoklosa.futurify.board.dto;

import dev.hstoklosa.futurify.board.entity.ActionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActionResponse {
    private Integer id;
    private String title;
    private ActionType type;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String color;
    private String notes;
    private boolean completed;
    private Integer jobId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 