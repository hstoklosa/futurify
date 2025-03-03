package dev.hstoklosa.futurify.board.dto;

import dev.hstoklosa.futurify.board.entity.JobType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobsResponse {

    Integer id;

    String title;

    String companyName;

    String postUrl;

    private JobType type;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

}
