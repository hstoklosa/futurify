package dev.hstoklosa.futurify.board.dto;

import dev.hstoklosa.futurify.board.entity.JobEventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobTimelineEventResponse {
    private Integer id;
    private Integer jobId;
    private JobEventType eventType;
    private String description;
    private String details;
    private LocalDateTime timestamp;
} 