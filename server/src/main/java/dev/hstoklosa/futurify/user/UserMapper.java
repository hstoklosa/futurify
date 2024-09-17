package dev.hstoklosa.futurify.user;

import dev.hstoklosa.futurify.auth.dto.TokenDto;
import dev.hstoklosa.futurify.auth.dto.UserResponse;
import dev.hstoklosa.futurify.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

    @Mapping(target = "accessToken", source = "tokens.accessToken")
    @Mapping(target = "refreshToken", source = "tokens.refreshToken")
    public abstract UserResponse userToAuthUserResponse(User user, TokenDto tokens);

    public abstract UserResponse userToUserResponse(User user);

}
