package dev.hstoklosa.futurify.mapper;

import dev.hstoklosa.futurify.dto.request.CreateBoardRequest;
import dev.hstoklosa.futurify.dto.response.BoardDto;
import dev.hstoklosa.futurify.dto.request.UpdateBoardRequest;
import dev.hstoklosa.futurify.model.entity.ApplicationBoard;
import dev.hstoklosa.futurify.model.entity.User;
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