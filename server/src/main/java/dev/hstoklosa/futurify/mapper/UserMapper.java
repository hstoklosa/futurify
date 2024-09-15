package dev.hstoklosa.futurify.mapper;

import dev.hstoklosa.futurify.dto.TokenDto;
import dev.hstoklosa.futurify.dto.response.UserResponse;
import dev.hstoklosa.futurify.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

    @Mapping(target = "accessToken", source = "tokens.accessToken")
    @Mapping(target = "refreshToken", source = "tokens.refreshToken")
    public abstract UserResponse userToAuthUserResponse(User user, TokenDto tokens);

    public abstract UserResponse userToUserResponse(User user);

}
