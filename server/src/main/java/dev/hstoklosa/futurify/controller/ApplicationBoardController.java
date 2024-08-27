package dev.hstoklosa.futurify.controller;

import dev.hstoklosa.futurify.dto.request.CreateBoardRequest;
import dev.hstoklosa.futurify.dto.response.GenericApiResponse;
import dev.hstoklosa.futurify.service.ApplicationBoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/board")
@RequiredArgsConstructor
public class ApplicationBoardController {
    private final ApplicationBoardService applicationBoardService;

    @PostMapping
    public ResponseEntity<GenericApiResponse<Integer>> createBoard(
            @RequestBody @Valid CreateBoardRequest request
    ) {
        return ResponseEntity.ok()
                .body(GenericApiResponse.success(
                        "Board has been successfully created.",
                        applicationBoardService.createBoard(request))
                );
    }

}
