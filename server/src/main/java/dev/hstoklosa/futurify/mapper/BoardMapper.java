package dev.hstoklosa.futurify.mapper;

import dev.hstoklosa.futurify.dto.BoardDto;
import dev.hstoklosa.futurify.dto.UpdateBoardDto;
import dev.hstoklosa.futurify.model.entity.ApplicationBoard;
import org.mapstruct.*;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public abstract class BoardMapper {

//    @Mapping(target = "username", source = "user.email")
    public abstract BoardDto boardToBoardDto(ApplicationBoard board);

    public abstract ApplicationBoard boardDtoToBoard(BoardDto boardDto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    public abstract void updateBoard(@MappingTarget ApplicationBoard board, UpdateBoardDto boardDto);

}