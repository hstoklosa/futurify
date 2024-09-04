package dev.hstoklosa.futurify.service;

import dev.hstoklosa.futurify.dto.BoardDto;
import dev.hstoklosa.futurify.dto.request.CreateBoardRequestDto;
import dev.hstoklosa.futurify.mapper.BoardMapper;
import dev.hstoklosa.futurify.model.entity.ApplicationBoard;
import dev.hstoklosa.futurify.model.entity.User;
import dev.hstoklosa.futurify.repository.ApplicationBoardRepository;
import dev.hstoklosa.futurify.util.SecurityUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationBoardService {
    private final ApplicationBoardRepository boardRepository;
    private final ApplicationStageService applicationStageService;
    private final BoardMapper boardMapper;

    @Transactional
    public Integer createBoard(CreateBoardRequestDto request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ApplicationBoard board = ApplicationBoard.builder()
                .name(request.getName())
                .user(user)
                .build();

        boardRepository.save(board);
        applicationStageService.createDefaultStages(board);
        return board.getId();
    }

    @Transactional()
    public List<BoardDto> getBoards(boolean archived, Sort.Direction sortDirection) {
        User user = SecurityUtil.getCurrentUser();
        Sort sortBy = Sort.by(sortDirection, "createdAt");

         return boardRepository.findByUserAndArchived(user, archived, sortBy)
                 .stream()
                 .map(boardMapper::boardToBoardDto)
                 .collect(Collectors.toList());
    }

}
