package dev.hstoklosa.futurify.board.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeepSeekRequest {
    private String model;
    private List<DeepSeekMessage> messages;
    private Double temperature;
    @Builder.Default
    private Integer max_tokens = 2048;
} 