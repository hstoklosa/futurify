package dev.hstoklosa.futurify.board.dto;

import dev.hstoklosa.futurify.board.entity.JobType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobResponse {

    Integer id;

    String title;

    String companyName;

    String location;

    JobType type;

    String postUrl;

    String description;

    String salary;

    Integer position;

    Integer stageId;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

}
