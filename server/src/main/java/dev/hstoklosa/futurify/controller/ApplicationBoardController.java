package dev.hstoklosa.futurify.controller;

import dev.hstoklosa.futurify.common.api.ApiResponse;
import dev.hstoklosa.futurify.common.api.ResponseFactory;
import dev.hstoklosa.futurify.dto.request.CreateBoardRequest;
import dev.hstoklosa.futurify.dto.request.UpdateBoardRequest;
import dev.hstoklosa.futurify.dto.response.BoardDto;
import dev.hstoklosa.futurify.service.ApplicationBoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boards")
@RequiredArgsConstructor
public class ApplicationBoardController {
    private final ApplicationBoardService applicationBoardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BoardDto>>> getBoards(
            @RequestParam(name = "archived", defaultValue = "false") boolean archived,
            @RequestParam(name = "sort", defaultValue = "DESC") Sort.Direction sortDirection
    ) {
        List<BoardDto> response = applicationBoardService.getAllBoards(archived, sortDirection);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Integer>> createBoard(
            @RequestBody @Valid CreateBoardRequest request
    ) {
        Integer boardId = applicationBoardService.createBoard(request);
        return ResponseEntity.ok().body(ResponseFactory.success(boardId));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<BoardDto>> updateBoard(
            @PathVariable("id") Integer id,
            @RequestBody @Valid UpdateBoardRequest updateBoardRequest
    ) {
        BoardDto response = applicationBoardService.updateBoard(id, updateBoardRequest);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }

}