package dev.hstoklosa.futurify.mapper;

import dev.hstoklosa.futurify.model.entity.User;
import dev.hstoklosa.futurify.dto.UserDto;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class UserDtoMapper implements Function<User, UserDto> {

    @Override
    public UserDto apply(User user) {
        return new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name(),
                user.isEnabled()
        );
    }
}
