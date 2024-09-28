package dev.hstoklosa.futurify.board.dto;

import dev.hstoklosa.futurify.stage.dto.StageResponse;
import dev.hstoklosa.futurify.stage.entity.Stage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoardsResponse {

    Integer id;

    String name;

    List<StageResponse> stages;

    boolean archived;

}