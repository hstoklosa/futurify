package dev.hstoklosa.futurify.board.entity;

public enum JobEventType {
    CREATED,
    UPDATED,
    DELETED,
    STAGE_CHANGED,
    POSITION_CHANGED, // kept for backwards compatibility but is no longer used
    NOTE_CREATED,
    NOTE_UPDATED,
    NOTE_DELETED
} 