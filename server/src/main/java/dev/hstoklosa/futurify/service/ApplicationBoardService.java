package dev.hstoklosa.futurify.service;

import dev.hstoklosa.futurify.common.exception.OperationNotPermittedException;
import dev.hstoklosa.futurify.common.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.common.util.SecurityUtil;
import dev.hstoklosa.futurify.dto.request.CreateBoardRequest;
import dev.hstoklosa.futurify.dto.request.UpdateBoardRequest;
import dev.hstoklosa.futurify.dto.response.BoardDto;
import dev.hstoklosa.futurify.mapper.BoardMapper;
import dev.hstoklosa.futurify.model.entity.ApplicationBoard;
import dev.hstoklosa.futurify.model.entity.User;
import dev.hstoklosa.futurify.repository.ApplicationBoardRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationBoardService {
    private final ApplicationBoardRepository boardRepository;
    private final ApplicationStageService applicationStageService;
    private final BoardMapper boardMapper;

    @Transactional
    public Integer createBoard(CreateBoardRequest request) {
        User user = SecurityUtil.getCurrentUser();
        ApplicationBoard board = boardRepository.save(boardMapper.createBoardRequestToBoard(request, user));
        applicationStageService.createDefaultStages(board);
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
        ApplicationBoard board = boardRepository.findById(boardId)
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