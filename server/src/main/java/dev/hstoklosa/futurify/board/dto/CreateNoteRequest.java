package dev.hstoklosa.futurify.board.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateNoteRequest {
    
    @NotBlank(message = "Content cannot be empty")
    private String content;

    @NotNull(message = "Job ID cannot be null")
    private Integer jobId;
} 