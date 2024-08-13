package dev.hstoklosa.futurify.dto;

public record UserDto (
        Integer id,
        String firstName,
        String lastName,
        String email,
        String role,
        boolean enabled
) {}
