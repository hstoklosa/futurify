package dev.hstoklosa.futurify.stage;

import dev.hstoklosa.futurify.stage.dto.StageResponse;
import dev.hstoklosa.futurify.stage.entity.Stage;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class StageMapper {

    public abstract StageResponse stageToStageResponse(Stage stage);

}
