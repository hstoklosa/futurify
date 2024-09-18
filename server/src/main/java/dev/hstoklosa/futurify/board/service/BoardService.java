package dev.hstoklosa.futurify.board.service;

import dev.hstoklosa.futurify.board.entity.Board;
import dev.hstoklosa.futurify.board.repository.BoardRepository;
import dev.hstoklosa.futurify.board.BoardMapper;
import dev.hstoklosa.futurify.common.exception.OperationNotPermittedException;
import dev.hstoklosa.futurify.common.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.common.util.SecurityUtil;
import dev.hstoklosa.futurify.board.dto.CreateBoardRequest;
import dev.hstoklosa.futurify.board.dto.UpdateBoardRequest;
import dev.hstoklosa.futurify.board.dto.BoardDto;
import dev.hstoklosa.futurify.stage.service.StageService;
import dev.hstoklosa.futurify.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final StageService stageService;
    private final BoardMapper boardMapper;

    @Transactional
    public Integer createBoard(CreateBoardRequest request) {
        User user = SecurityUtil.getCurrentUser();
        Board board = boardRepository.save(boardMapper.createBoardRequestToBoard(request, user));
        stageService.createDefaultStages(board);
        return board.getId();
    }

    @Transactional()
    public List<BoardDto> getAllBoards(boolean archived, Sort.Direction sortDirection) {
        User user = SecurityUtil.getCurrentUser();
        Sort sortBy = Sort.by(sortDirection, "createdAt");

        return boardRepository.findByUserAndArchived(user, archived, sortBy)
                .stream()
                .map(boardMapper::boardToBoardDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BoardDto updateBoard(Integer boardId, UpdateBoardRequest updateBoardRequest) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("The specified board couldn't be found."));
        User currentUser = SecurityUtil.getCurrentUser();

        if (!Objects.equals(currentUser.getId(), board.getUser().getId())) {
            throw new OperationNotPermittedException("You aren't permitted to update this board.");
        }

        boardMapper.updateBoard(board, updateBoardRequest);
        boardRepository.save(board);
        return boardMapper.boardToBoardDto(board);
    }

}