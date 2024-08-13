package dev.hstoklosa.futurify.mapper;

import dev.hstoklosa.futurify.model.entity.User;
import dev.hstoklosa.futurify.dto.UserDto;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.function.Function;
import java.util.stream.Collectors;

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
