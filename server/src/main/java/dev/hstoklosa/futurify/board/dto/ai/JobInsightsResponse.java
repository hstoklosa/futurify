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
public class JobInsightsResponse {
    private List<String> responsibilities;
    private List<String> qualifications;
    private List<String> keywords;
} 