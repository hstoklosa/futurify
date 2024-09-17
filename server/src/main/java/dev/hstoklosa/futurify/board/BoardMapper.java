package dev.hstoklosa.futurify.board;

import dev.hstoklosa.futurify.board.dto.CreateBoardRequest;
import dev.hstoklosa.futurify.board.dto.BoardDto;
import dev.hstoklosa.futurify.board.dto.UpdateBoardRequest;
import dev.hstoklosa.futurify.board.entity.ApplicationBoard;
import dev.hstoklosa.futurify.user.entity.User;
import org.mapstruct.*;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class BoardMapper {

    public abstract BoardDto boardToBoardDto(ApplicationBoard board);

    @Mapping(target = "user", source = "user")
    @Mapping(target = "name", source = "boardDto.name")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    public abstract ApplicationBoard createBoardRequestToBoard(CreateBoardRequest boardDto, User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract void updateBoard(@MappingTarget ApplicationBoard board, UpdateBoardRequest boardDto);

}