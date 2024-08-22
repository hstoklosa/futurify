package dev.hstoklosa.futurify.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GenericApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private ApiErrorResponse error;

    public static <T> GenericApiResponse<T> success(T data, String message) {
        return GenericApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> GenericApiResponse<T> error(ApiErrorResponse error) {
        return GenericApiResponse.<T>builder()
                .success(false)
                .error(error)
                .build();
    }
}
