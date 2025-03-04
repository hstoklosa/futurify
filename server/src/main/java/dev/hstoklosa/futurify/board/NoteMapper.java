package dev.hstoklosa.futurify.board;

import dev.hstoklosa.futurify.board.dto.CreateNoteRequest;
import dev.hstoklosa.futurify.board.dto.NoteResponse;
import dev.hstoklosa.futurify.board.entity.Job;
import dev.hstoklosa.futurify.board.entity.Note;
import dev.hstoklosa.futurify.common.util.SecurityUtil;
import dev.hstoklosa.futurify.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class NoteMapper {

    public Note toEntity(CreateNoteRequest request, Job job, User user) {
        return Note.builder()
                .content(SecurityUtil.sanitiseHtml(request.getContent()))
                .job(job)
                .user(user)
                .build();
    }

    public NoteResponse toResponse(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getContent(),
                note.getJob().getId(),
                note.getUser().getId(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
} 