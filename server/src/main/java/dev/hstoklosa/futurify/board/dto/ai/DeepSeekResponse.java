package dev.hstoklosa.futurify.board.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeepSeekResponse {
    private String id;
    private String model;
    private String object;
    private Long created;
    private List<DeepSeekChoice> choices;
    private Object usage;
    
    public String getContent() {
        if (choices != null && !choices.isEmpty() && choices.get(0).getMessage() != null) {
            return choices.get(0).getMessage().getContent();
        }
        return null;
    }
} 