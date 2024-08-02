package dev.hstoklosa.futurify.exception;

import dev.hstoklosa.futurify.payload.response.ApiErrorResponse;
import dev.hstoklosa.futurify.payload.response.GenericApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<GenericApiResponse<?>> handleException(
        ResourceNotFoundException e,
        HttpServletRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(GenericApiResponse.error(
                        ApiErrorResponse.builder()
                                .path(request.getRequestURI())
                                .message(e.getMessage())
                                .timestamp(LocalDateTime.now())
                                .build()
                        )
                );
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<GenericApiResponse<?>> handleException(
            DuplicateResourceException e,
            HttpServletRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(GenericApiResponse.error(
                        ApiErrorResponse.builder()
                                .path(request.getRequestURI())
                                .message(e.getMessage())
                                .timestamp(LocalDateTime.now())
                                .build()
                        )
                );
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<GenericApiResponse<?>> handleException(
        InsufficientAuthenticationException e,
        HttpServletRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(GenericApiResponse.error(
                        ApiErrorResponse.builder()
                                .path(request.getRequestURI())
                                .message("Authentication is required to access this resource")
                                .timestamp(LocalDateTime.now())
                                .build()
                        )
                );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<GenericApiResponse<?>> handleException(
        BadCredentialsException e,
        HttpServletRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(GenericApiResponse.error(
                        ApiErrorResponse.builder()
                            .path(request.getRequestURI())
                            .message("The provided email/password is incorrect.")
                            .timestamp(LocalDateTime.now())
                            .build()
                        )
                );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<GenericApiResponse<?>> handleException(
        Exception e,
        HttpServletRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(GenericApiResponse.error(
                        ApiErrorResponse.builder()
                            .path(request.getRequestURI())
                            .message("Internal error, please try again later or contact the admin.")
                            .timestamp(LocalDateTime.now())
                            .build()
                        )
                );
    }
}