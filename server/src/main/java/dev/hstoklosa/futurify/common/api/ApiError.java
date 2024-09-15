package dev.hstoklosa.futurify.common.api;

import org.springframework.validation.BindingResult;

import java.util.List;
import java.util.stream.Collectors;

public record ApiError(String message, List<ValidationError> errors) {
    public static List<ValidationError> extractValidationErrors(final BindingResult bindingResult) {
        return bindingResult.getFieldErrors().stream()
                .map(error -> new ValidationError(error.getField(), error.getDefaultMessage()))
                .collect(Collectors.toList());
    }

    public record ValidationError(String field, String message) { }
}