package dev.hstoklosa.futurify.board;

import dev.hstoklosa.futurify.board.dto.BoardResponse;
import dev.hstoklosa.futurify.board.dto.BoardsResponse;
import dev.hstoklosa.futurify.board.dto.CreateBoardRequest;
import dev.hstoklosa.futurify.board.dto.UpdateBoardRequest;
import dev.hstoklosa.futurify.board.entity.Board;
import dev.hstoklosa.futurify.stage.dto.StageResponse;
import dev.hstoklosa.futurify.user.entity.User;
import org.mapstruct.*;

import java.util.List;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class BoardMapper {

    public abstract BoardResponse boardToBoardResponse(Board board);

    public abstract BoardsResponse boardToBoardsResponse(Board board, List<StageResponse> stages);

    @Mapping(target = "user", source = "user")
    @Mapping(target = "name", source = "boardDto.name")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    public abstract Board createBoardRequestToBoard(CreateBoardRequest boardDto, User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract void updateBoard(@MappingTarget Board board, UpdateBoardRequest boardDto);

}