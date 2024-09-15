package dev.hstoklosa.futurify.common.api;

import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;

public class ResponseFactory {

    public static <T> ApiResponse<T> success() {
        return new ApiResponse<>(HttpStatus.OK.value(), null, null);
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(HttpStatus.OK.value(), data, null);
    }

    public static ApiResponse<Void> error(int status, String message) {
        return new ApiResponse<>(status, null, new ApiError(message, null));
    }

    public static ApiResponse<Void> error(int status, String message, BindingResult bindingResult) {
        return new ApiResponse<>(status, null, new ApiError(message, ApiError.extractValidationErrors(bindingResult)));
    }
}
