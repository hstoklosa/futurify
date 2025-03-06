package dev.hstoklosa.futurify.board.controller;

import dev.hstoklosa.futurify.board.dto.ActionResponse;
import dev.hstoklosa.futurify.board.dto.CreateActionRequest;
import dev.hstoklosa.futurify.board.dto.UpdateActionRequest;
import dev.hstoklosa.futurify.board.service.ActionService;
import dev.hstoklosa.futurify.common.api.ApiResponse;
import dev.hstoklosa.futurify.common.api.ResponseFactory;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/actions")
@RequiredArgsConstructor
public class ActionController {
    private final ActionService actionService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ActionResponse>> getAction(
            @PathVariable Integer id
    ) {
        ActionResponse response = actionService.getActionById(id);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<ActionResponse>>> getActionsByJob(
            @PathVariable Integer jobId
    ) {
        List<ActionResponse> response = actionService.getActionsByJobId(jobId);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }

    @PostMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<ActionResponse>> createAction(
            @PathVariable Integer jobId,
            @Valid @RequestBody CreateActionRequest request
    ) {
        ActionResponse response = actionService.createAction(jobId, request);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }

    @PutMapping("/{actionId}")
    public ResponseEntity<ApiResponse<ActionResponse>> updateAction(
            @PathVariable Integer actionId,
            @Valid @RequestBody UpdateActionRequest request
    ) {
        ActionResponse response = actionService.updateAction(actionId, request);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }

    @DeleteMapping("/{actionId}")
    public ResponseEntity<ApiResponse<Void>> deleteAction(
            @PathVariable Integer actionId
    ) {
        actionService.deleteAction(actionId);
        return ResponseEntity.ok().body(ResponseFactory.success(null));
    }
} 