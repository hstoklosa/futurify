package dev.hstoklosa.futurify.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import static com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_NULL)
public record UserResponse(
        Integer id,
        String firstName,
        String lastName,
        String email,
        String role,
        boolean enabled,
        @JsonIgnore String accessToken,
        @JsonIgnore String refreshToken
) { }
