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
    private T data;
    private ApiErrorResponse error;

    public static <T> GenericApiResponse<T> success(T data) {
        return GenericApiResponse.<T>builder()
                .data(data)
                .build();
    }

    public static <T> GenericApiResponse<T> success() {
        return GenericApiResponse.<T>builder()
                .data(null)
                .build();
    }

    public static <T> GenericApiResponse<T> error(ApiErrorResponse error) {
        return GenericApiResponse.<T>builder()
                .error(error)
                .build();
    }
}
