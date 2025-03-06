package dev.hstoklosa.futurify.board.service;

import dev.hstoklosa.futurify.board.NoteMapper;
import dev.hstoklosa.futurify.board.dto.CreateNoteRequest;
import dev.hstoklosa.futurify.board.dto.NoteResponse;
import dev.hstoklosa.futurify.board.dto.UpdateNoteRequest;
import dev.hstoklosa.futurify.board.entity.Job;
import dev.hstoklosa.futurify.board.entity.Note;
import dev.hstoklosa.futurify.board.repository.JobRepository;
import dev.hstoklosa.futurify.board.repository.NoteRepository;
import dev.hstoklosa.futurify.common.exception.OperationNotPermittedException;
import dev.hstoklosa.futurify.common.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.common.util.SecurityUtil;
import dev.hstoklosa.futurify.user.entity.User;
import dev.hstoklosa.futurify.user.entity.UserRole;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final JobRepository jobRepository;
    private final dev.hstoklosa.futurify.board.NoteMapper noteMapper;
    private final JobTimelineService timelineService;

    public NoteServiceImpl(
            NoteRepository noteRepository, 
            JobRepository jobRepository, 
            dev.hstoklosa.futurify.board.NoteMapper noteMapper,
            JobTimelineService timelineService) {
        this.noteRepository = noteRepository;
        this.jobRepository = jobRepository;
        this.noteMapper = noteMapper;
        this.timelineService = timelineService;
    }

    @Override
    @Transactional
    public NoteResponse createNote(CreateNoteRequest request) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + request.getJobId()));

        // User is assumed to be authenticated and available from security context
        User currentUser = SecurityUtil.getCurrentUser();

        Note note = noteMapper.toEntity(request, job, currentUser);
        note = noteRepository.save(note);

        // Track note creation in timeline
        timelineService.recordNoteCreation(job, note.getContent());

        return noteMapper.toResponse(note);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoteResponse> getNotesByJobId(Integer jobId) {
        // No change needed
        // Check if job exists
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job not found with ID: " + jobId);
        }

        return noteRepository.findAllByJobId(jobId).stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NoteResponse updateNote(Integer noteId, UpdateNoteRequest request) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + noteId));

        Job job = note.getJob();

        // Ensure user has permission to update the note
        // (User should be the creator of the note or have admin rights)
        User currentUser = SecurityUtil.getCurrentUser();
        if (!note.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != UserRole.ADMIN) {
            throw new OperationNotPermittedException("You don't have permission to update this note");
        }

        // Save old content for timeline tracking
        String oldContent = note.getContent();
        
        // Update note content
        note.setContent(request.getContent());
        note = noteRepository.save(note);

        // Track note update in timeline
        timelineService.recordNoteUpdate(job, oldContent, note.getContent());

        return noteMapper.toResponse(note);
    }

    @Override
    @Transactional
    public void deleteNote(Integer noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + noteId));

        Job job = note.getJob();
        
        // Ensure user has permission to delete the note
        User currentUser = SecurityUtil.getCurrentUser();
        if (!note.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != UserRole.ADMIN) {
            throw new OperationNotPermittedException("You don't have permission to delete this note");
        }

        // Save content for timeline tracking before deletion
        String noteContent = note.getContent();
        
        noteRepository.delete(note);
        
        // Track note deletion in timeline
        timelineService.recordNoteDeletion(job, noteContent);
    }

    @Override
    @Transactional
    public void deleteAllNotesByJobId(Integer jobId) {
        // Check if job exists and get job entity for timeline tracking
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));
        
        // Get all notes before deletion for timeline tracking
        List<Note> notes = noteRepository.findAllByJobId(jobId);
        
        // Delete all notes
        noteRepository.deleteAllByJobId(jobId);
        
        // Track each note deletion in timeline
        for (Note note : notes) {
            timelineService.recordNoteDeletion(job, note.getContent());
        }
    }
} 