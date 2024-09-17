package dev.hstoklosa.futurify.common.exception;

import dev.hstoklosa.futurify.common.api.ApiResponse;
import dev.hstoklosa.futurify.common.api.ResponseFactory;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestExceptionController {

    @ExceptionHandler()
    public ResponseEntity<ApiResponse<Void>> handleInvalidOperationException(OperationNotPermittedException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidTokenException(InvalidTokenException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler({ ResourceNotFoundException.class, UsernameNotFoundException.class })
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateResourceException(DuplicateResourceException ex) {
        return buildErrorResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiResponse<Void>> handleDisabledException() {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "The action requires email verification to proceed.");
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthenticatedException() {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "The action requires authentication to proceed.");
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException() {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "The provided email/password is incorrect.");
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnsupportedMethodException() {
        return buildErrorResponse(HttpStatus.METHOD_NOT_ALLOWED, "The request method is not allowed.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidArgumentException(MethodArgumentNotValidException ex) {
        return buildValidationErrorResponse(HttpStatus.BAD_REQUEST,  "An error occurred while validating the provided data.", ex.getBindingResult());
    }

    @ExceptionHandler(MessagingException.class)
    public ResponseEntity<ApiResponse<Void>> handleEmailMessageException() {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while sending the email, please try again later.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException() {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal error, please try again later or contact the admin.");
    }

    private ResponseEntity<ApiResponse<Void>> buildErrorResponse(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(ResponseFactory.error(status.value(), message));
    }

    private ResponseEntity<ApiResponse<Void>> buildValidationErrorResponse(HttpStatus status, String message, BindingResult bindingResult) {
        return ResponseEntity.status(status).body(ResponseFactory.error(status.value(), message, bindingResult));
    }

}
