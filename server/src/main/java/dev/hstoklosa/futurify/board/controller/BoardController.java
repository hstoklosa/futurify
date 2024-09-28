package dev.hstoklosa.futurify.board.controller;

import dev.hstoklosa.futurify.board.service.BoardService;
import dev.hstoklosa.futurify.common.api.ApiResponse;
import dev.hstoklosa.futurify.common.api.ResponseFactory;
import dev.hstoklosa.futurify.board.dto.CreateBoardRequest;
import dev.hstoklosa.futurify.board.dto.UpdateBoardRequest;
import dev.hstoklosa.futurify.board.dto.BoardResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boards")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    @PostMapping
    public ResponseEntity<ApiResponse<Integer>> createBoard(
            @RequestBody @Valid CreateBoardRequest request
    ) {
        Integer boardId = boardService.createBoard(request);
        return ResponseEntity.ok().body(ResponseFactory.success(boardId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BoardResponse>> getBoard(@PathVariable Integer id) {
        BoardResponse response = boardService.getBoard(id);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BoardResponse>>> getBoards(
            @RequestParam(name = "archived", defaultValue = "false") boolean archived,
            @RequestParam(name = "sort", defaultValue = "DESC") Sort.Direction sortDirection
    ) {
        List<BoardResponse> response = boardService.getAllBoards(archived, sortDirection);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<BoardResponse>> updateBoard(
            @PathVariable Integer id,
            @RequestBody @Valid UpdateBoardRequest updateBoardRequest
    ) {
        BoardResponse response = boardService.updateBoard(id, updateBoardRequest);
        return ResponseEntity.ok().body(ResponseFactory.success(response));
    }

}