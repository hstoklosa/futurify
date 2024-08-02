package dev.hstoklosa.futurify.dto;

import java.util.List;

public record UserDto (
        Integer id,
        String firstName,
        String lastName,
        String email,
        List<String> roles
) {}
