package dev.hstoklosa.futurify.exception;

import dev.hstoklosa.futurify.dto.response.ApiErrorResponse;
import dev.hstoklosa.futurify.dto.response.GenericApiResponse;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String INTERNAL_ERROR_MESSAGE = "Internal error, please try again later or contact the admin.";
    private static final String UNAUTHORIZED_MESSAGE = "You aren't authorized to access this resource.";
    private static final String BAD_CREDENTIALS_MESSAGE = "The provided email/password is incorrect.";
    private static final String ACCOUNT_DISABLED_MESSAGE = "ACCOUNT_DISABLED";
    private static final String VALIDATION_ERROR_MESSAGE = "Validation error.";

    @ExceptionHandler({ ResourceNotFoundException.class, UsernameNotFoundException.class })
    public ResponseEntity<GenericApiResponse<ApiErrorResponse>> handleException(
        ResourceNotFoundException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(request, HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<GenericApiResponse<ApiErrorResponse>> handleDisabledException(
        DisabledException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(request, HttpStatus.FORBIDDEN, ACCOUNT_DISABLED_MESSAGE);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<GenericApiResponse<ApiErrorResponse>> handleException(
        DuplicateResourceException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(request, HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<GenericApiResponse<ApiErrorResponse>> handleException(
        InsufficientAuthenticationException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(request, HttpStatus.UNAUTHORIZED, UNAUTHORIZED_MESSAGE);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<GenericApiResponse<ApiErrorResponse>> handleException(
        BadCredentialsException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(request, HttpStatus.UNAUTHORIZED, BAD_CREDENTIALS_MESSAGE);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<GenericApiResponse<ApiErrorResponse>> handleException(
        MethodArgumentNotValidException ex,
        HttpServletRequest request
    ) {
        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
            .path(request.getRequestURI())
            .message(VALIDATION_ERROR_MESSAGE)
            .build();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errorResponse.addValidationError(error.getField(), error.getDefaultMessage());
        });

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(GenericApiResponse.error(errorResponse));
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<GenericApiResponse<ApiErrorResponse>> handleException(
            InvalidTokenException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(request, HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(MessagingException.class)
    public ResponseEntity<GenericApiResponse<ApiErrorResponse>> handleException(
        MessagingException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(request, HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<GenericApiResponse<ApiErrorResponse>> handleException(
        Exception ex,
        HttpServletRequest request
    ) {
        ex.printStackTrace();
        return buildErrorResponse(request, HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_ERROR_MESSAGE);
    }

    private ResponseEntity<GenericApiResponse<ApiErrorResponse>> buildErrorResponse(
        HttpServletRequest request,
        HttpStatus status,
        String message
    ) {
        return ResponseEntity
            .status(status)
            .body(GenericApiResponse.error(
                ApiErrorResponse.builder()
                    .path(request.getRequestURI())
                    .message(message)
                    .build()
            ));
    }
}
