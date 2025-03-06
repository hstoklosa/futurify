package dev.hstoklosa.futurify.board;

import dev.hstoklosa.futurify.board.dto.ActionResponse;
import dev.hstoklosa.futurify.board.dto.CreateActionRequest;
import dev.hstoklosa.futurify.board.entity.Action;
import dev.hstoklosa.futurify.board.entity.ActionType;
import dev.hstoklosa.futurify.board.entity.Job;

import java.util.HashMap;
import java.util.Map;

public class ActionMapper {
    // Map to store default colors for each action type
    private static final Map<ActionType, String> DEFAULT_COLORS = new HashMap<>();

    static {
        // Initialize default colors for each action type
        DEFAULT_COLORS.put(ActionType.PREPARE_COVER_LETTER, "#4285F4");  // Blue
        DEFAULT_COLORS.put(ActionType.PREPARE_RESUME, "#34A853");        // Green
        DEFAULT_COLORS.put(ActionType.REACH_OUT, "#FBBC05");             // Yellow
        DEFAULT_COLORS.put(ActionType.GET_REFERENCE, "#EA4335");         // Red
        DEFAULT_COLORS.put(ActionType.APPLY, "#8E24AA");                 // Purple
        DEFAULT_COLORS.put(ActionType.FOLLOW_UP, "#00ACC1");             // Cyan
        DEFAULT_COLORS.put(ActionType.PREPARE_FOR_INTERVIEW, "#FB8C00"); // Orange
        DEFAULT_COLORS.put(ActionType.PHONE_SCREEN, "#43A047");          // Green
        DEFAULT_COLORS.put(ActionType.PHONE_INTERVIEW, "#1E88E5");       // Blue
        DEFAULT_COLORS.put(ActionType.ON_SITE_INTERVIEW, "#3949AB");     // Indigo
        DEFAULT_COLORS.put(ActionType.OFFER_RECEIVED, "#00897B");        // Teal
        DEFAULT_COLORS.put(ActionType.ACCEPT_OFFER, "#7CB342");          // Light Green
        DEFAULT_COLORS.put(ActionType.DECLINE_OFFER, "#C0CA33");         // Lime
        DEFAULT_COLORS.put(ActionType.REJECTED, "#E53935");              // Red
        DEFAULT_COLORS.put(ActionType.EMAIL, "#039BE5");                 // Light Blue
        DEFAULT_COLORS.put(ActionType.MEETING, "#8D6E63");               // Brown
        DEFAULT_COLORS.put(ActionType.PHONE_CALL, "#5E35B1");            // Deep Purple
        DEFAULT_COLORS.put(ActionType.SEND_AVAILABILITY, "#00BCD4");     // Cyan
        DEFAULT_COLORS.put(ActionType.ASSIGNMENT, "#FFA000");            // Amber
        DEFAULT_COLORS.put(ActionType.NETWORKING_EVENT, "#F4511E");      // Deep Orange
        DEFAULT_COLORS.put(ActionType.OTHER, "#757575");                 // Grey
        DEFAULT_COLORS.put(ActionType.WITHDRAWAL, "#546E7A");            // Blue Grey
    }

    public static String getDefaultColorForType(ActionType type) {
        return DEFAULT_COLORS.getOrDefault(type, "#757575"); // Default to grey if type not found
    }

    public static Action toEntity(CreateActionRequest request, Job job) {
        String color = request.getColor();
        if (color == null || color.isEmpty()) {
            color = getDefaultColorForType(request.getType());
        }

        return Action.builder()
                .title(request.getTitle())
                .type(request.getType())
                .startDateTime(request.getStartDateTime())
                .endDateTime(request.getEndDateTime())
                .color(color)
                .notes(request.getNotes())
                .completed(request.isCompleted())
                .job(job)
                .build();
    }

    public static ActionResponse toResponse(Action action) {
        return new ActionResponse(
                action.getId(),
                action.getTitle(),
                action.getType(),
                action.getStartDateTime(),
                action.getEndDateTime(),
                action.getColor(),
                action.getNotes(),
                action.isCompleted(),
                action.getJob().getId(),
                action.getCreatedAt(),
                action.getUpdatedAt()
        );
    }
} 