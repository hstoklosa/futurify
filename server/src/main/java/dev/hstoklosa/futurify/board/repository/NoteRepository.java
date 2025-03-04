package dev.hstoklosa.futurify.board.repository;

import dev.hstoklosa.futurify.board.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Integer> {
    List<Note> findAllByJobId(Integer jobId);
    List<Note> findAllByUserId(Integer userId);
    void deleteAllByJobId(Integer jobId);
} 