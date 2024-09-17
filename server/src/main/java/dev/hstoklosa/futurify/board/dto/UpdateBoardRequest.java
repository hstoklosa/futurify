package dev.hstoklosa.futurify.board.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateBoardRequest {

    String name;

    Boolean archived;

}
