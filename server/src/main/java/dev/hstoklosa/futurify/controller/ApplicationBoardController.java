package dev.hstoklosa.futurify.controller;

import dev.hstoklosa.futurify.dto.BoardDto;
import dev.hstoklosa.futurify.dto.request.CreateBoardRequestDto;
import dev.hstoklosa.futurify.dto.response.GenericApiResponse;
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
    public ResponseEntity<GenericApiResponse<?>> getBoards(
            @RequestParam(name = "archived", defaultValue = "false") boolean archived,
            @RequestParam(name = "sort", defaultValue = "DESC") Sort.Direction sortDirection
    ) {
        List<BoardDto> response = applicationBoardService.getBoards(archived, sortDirection);
        return ResponseEntity.ok().body(GenericApiResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<GenericApiResponse<Integer>> createBoard(
            @RequestBody @Valid CreateBoardRequestDto request
    ) {
        Integer boardId = applicationBoardService.createBoard(request);
        return ResponseEntity.ok().body(GenericApiResponse.success(boardId));
    }

}
