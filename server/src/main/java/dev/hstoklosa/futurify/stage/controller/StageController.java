package dev.hstoklosa.futurify.stage.controller;

import dev.hstoklosa.futurify.common.api.ApiResponse;
import dev.hstoklosa.futurify.common.api.ResponseFactory;
import dev.hstoklosa.futurify.stage.dto.StageResponse;
import dev.hstoklosa.futurify.stage.service.StageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boards/{id}")
@RequiredArgsConstructor
public class StageController {
    private final StageService stageService;

    @GetMapping ("/stages")
    public ResponseEntity<ApiResponse<?>> getStagesByBoardId(@PathVariable Integer id) {
        return ResponseEntity.ok()
                .body(ResponseFactory.success(stageService.getStagesByBoard(id)));
    }

}
