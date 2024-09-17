package dev.hstoklosa.futurify.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoardDto {

    Integer id;

    String name;

    boolean archived;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

}
