package dev.hstoklosa.futurify.board.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoteResponse {
    
    private Integer id;
    
    private String content;
    
    private Integer jobId;
    
    private Integer userId;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
} 