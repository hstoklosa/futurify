package dev.hstoklosa.futurify.dto;

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

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

}
