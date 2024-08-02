package dev.hstoklosa.futurify.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class GenericApiResponse<T> {

    private boolean success;

    private T data;

    private ApiErrorResponse error;

    public static <T> GenericApiResponse<T> success(T data) {
        return GenericApiResponse.<T>builder()
                .success(true)
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
