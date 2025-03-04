package dev.hstoklosa.futurify.board.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeepSeekChoice {
    private DeepSeekMessage message;
    private String finish_reason;
    private Integer index;
} 