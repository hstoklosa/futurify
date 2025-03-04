package dev.hstoklosa.futurify.board.controller;

import dev.hstoklosa.futurify.board.dto.CreateNoteRequest;
import dev.hstoklosa.futurify.board.dto.NoteResponse;
import dev.hstoklosa.futurify.board.dto.UpdateNoteRequest;
import dev.hstoklosa.futurify.board.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<NoteResponse> createNote(@Valid @RequestBody CreateNoteRequest request) {
        return new ResponseEntity<>(noteService.createNote(request), HttpStatus.CREATED);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<NoteResponse>> getNotesByJobId(@PathVariable Integer jobId) {
        return ResponseEntity.ok(noteService.getNotesByJobId(jobId));
    }

    @PatchMapping("/{noteId}")
    public ResponseEntity<NoteResponse> updateNote(
            @PathVariable Integer noteId,
            @Valid @RequestBody UpdateNoteRequest request) {
        return ResponseEntity.ok(noteService.updateNote(noteId, request));
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(@PathVariable Integer noteId) {
        noteService.deleteNote(noteId);
        return ResponseEntity.noContent().build();
    }
} 