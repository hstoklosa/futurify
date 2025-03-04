package dev.hstoklosa.futurify.board.service;

import dev.hstoklosa.futurify.board.NoteMapper;
import dev.hstoklosa.futurify.board.dto.CreateNoteRequest;
import dev.hstoklosa.futurify.board.dto.NoteResponse;
import dev.hstoklosa.futurify.board.dto.UpdateNoteRequest;
import dev.hstoklosa.futurify.board.entity.Job;
import dev.hstoklosa.futurify.board.entity.Note;
import dev.hstoklosa.futurify.board.repository.JobRepository;
import dev.hstoklosa.futurify.board.repository.NoteRepository;
import dev.hstoklosa.futurify.common.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.common.util.SecurityUtil;
import dev.hstoklosa.futurify.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final JobRepository jobRepository;
    private final dev.hstoklosa.futurify.board.NoteMapper noteMapper;

    public NoteServiceImpl(NoteRepository noteRepository, JobRepository jobRepository, dev.hstoklosa.futurify.board.NoteMapper noteMapper) {
        this.noteRepository = noteRepository;
        this.jobRepository = jobRepository;
        this.noteMapper = noteMapper;
    }

    @Override
    @Transactional
    public NoteResponse createNote(CreateNoteRequest request) {
        User currentUser = SecurityUtil.getCurrentUser();
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        Note note = noteMapper.toEntity(request, job, currentUser);
        Note savedNote = noteRepository.save(note);

        return noteMapper.toResponse(savedNote);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoteResponse> getNotesByJobId(Integer jobId) {
        return noteRepository.findAllByJobId(jobId).stream()
                .map(noteMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public NoteResponse updateNote(Integer noteId, UpdateNoteRequest request) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        User currentUser = SecurityUtil.getCurrentUser();
        if (!note.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You can only update your own notes");
        }

        note.setContent(request.getContent());
        Note updatedNote = noteRepository.save(note);

        return noteMapper.toResponse(updatedNote);
    }

    @Override
    @Transactional
    public void deleteNote(Integer noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        User currentUser = SecurityUtil.getCurrentUser();
        if (!note.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You can only delete your own notes");
        }

        noteRepository.delete(note);
    }

    @Override
    @Transactional
    public void deleteAllNotesByJobId(Integer jobId) {
        noteRepository.deleteAllByJobId(jobId);
    }
} 