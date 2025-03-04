package dev.hstoklosa.futurify.board.service;

import dev.hstoklosa.futurify.board.dto.CreateNoteRequest;
import dev.hstoklosa.futurify.board.dto.NoteResponse;
import dev.hstoklosa.futurify.board.dto.UpdateNoteRequest;

import java.util.List;

public interface NoteService {
    NoteResponse createNote(CreateNoteRequest request);
    List<NoteResponse> getNotesByJobId(Integer jobId);
    NoteResponse updateNote(Integer noteId, UpdateNoteRequest request);
    void deleteNote(Integer noteId);
    void deleteAllNotesByJobId(Integer jobId);
} 