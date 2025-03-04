package dev.hstoklosa.futurify.board;

import dev.hstoklosa.futurify.board.dto.JobTimelineEventResponse;
import dev.hstoklosa.futurify.board.entity.JobTimelineEvent;
import org.springframework.stereotype.Component;

@Component
public class JobTimelineEventMapper {

    /**
     * Maps a JobTimelineEvent entity to a JobTimelineEventResponse DTO
     *
     * @param event The JobTimelineEvent entity to be mapped
     * @return JobTimelineEventResponse DTO
     */
    public JobTimelineEventResponse mapToResponse(JobTimelineEvent event) {
        if (event == null) {
            return null;
        }

        return JobTimelineEventResponse.builder()
                .id(event.getId())
                .jobId(event.getJob().getId())
                .eventType(event.getEventType())
                .description(event.getDescription())
                .details(event.getDetails())
                .timestamp(event.getCreatedAt())
                .build();
    }
} 