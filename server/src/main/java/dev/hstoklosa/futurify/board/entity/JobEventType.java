package dev.hstoklosa.futurify.board.entity;

public enum JobEventType {
    CREATED,
    UPDATED,
    DELETED,
    STAGE_CHANGED,
    // This event type is kept for backwards compatibility but is no longer used
    POSITION_CHANGED,
    // Note-related events
    NOTE_CREATED,
    NOTE_UPDATED,
    NOTE_DELETED
} 