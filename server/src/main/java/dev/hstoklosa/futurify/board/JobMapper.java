package dev.hstoklosa.futurify.board;

import dev.hstoklosa.futurify.board.dto.CreateJobRequest;
import dev.hstoklosa.futurify.board.dto.JobResponse;
import dev.hstoklosa.futurify.board.dto.UpdateJobRequest;
import dev.hstoklosa.futurify.board.entity.Board;
import dev.hstoklosa.futurify.board.entity.Job;
import dev.hstoklosa.futurify.stage.entity.Stage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public abstract class JobMapper {

    @Mapping(target = "board", source = "board")
    @Mapping(target = "stage", source = "stage")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt",  ignore = true)
    public abstract Job createJobRequestToJob(CreateJobRequest requestDto, Board board, Stage stage);

    @Mapping(target = "stageId", expression = "java(job.getStage().getId())")
    public abstract JobResponse jobToJobResponse(Job job);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "board", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "stage", source = "stage")
    public abstract void updateJobFromRequest(UpdateJobRequest request, Stage stage, @MappingTarget Job job);

}
