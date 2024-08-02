package dev.hstoklosa.futurify.exception;

import dev.hstoklosa.futurify.payload.response.ApiErrorResponse;
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
    public ResponseEntity<ApiErrorResponse> handleException(
        ResourceNotFoundException e,
        HttpServletRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiErrorResponse.builder()
                    .path(request.getRequestURI())
                    .message(e.getMessage())
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .timestamp(LocalDateTime.now())
                    .build()
                );
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiErrorResponse> handleException(
            DuplicateResourceException e,
            HttpServletRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiErrorResponse.builder()
                        .path(request.getRequestURI())
                        .message(e.getMessage())
                        .statusCode(HttpStatus.CONFLICT.value())
                        .timestamp(LocalDateTime.now())
                        .build()
                );
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleException(
        InsufficientAuthenticationException e,
        HttpServletRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiErrorResponse.builder()
                        .path(request.getRequestURI())
                        .message("Authentication is required to access this resource")
                        .statusCode(HttpStatus.FORBIDDEN.value())
                        .timestamp(LocalDateTime.now())
                        .build()
                );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleException(
        BadCredentialsException e,
        HttpServletRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiErrorResponse.builder()
                        .path(request.getRequestURI())
                        .message("The provided email/password is incorrect.")
                        .statusCode(HttpStatus.UNAUTHORIZED.value())
                        .timestamp(LocalDateTime.now())
                        .build()
                );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleException(
        Exception e,
        HttpServletRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                        .path(request.getRequestURI())
                        .message("Internal error, please try again later or contact the admin.")
                        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .timestamp(LocalDateTime.now())
                        .build()
                );
    }
}
