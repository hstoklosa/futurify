package dev.hstoklosa.futurify.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateBoardRequestDto {

    @NotBlank(message = "Board name is required.")
    private String name;

}
