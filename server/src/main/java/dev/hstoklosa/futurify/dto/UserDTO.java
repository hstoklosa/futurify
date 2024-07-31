package dev.hstoklosa.futurify.dto;

import java.util.List;

public record UserDTO (
        Integer id,
        String firstName,
        String lastName,
        String email,
        List<String> roles
) {}
