package dev.hstoklosa.futurify.service;

import dev.hstoklosa.futurify.dto.request.CreateBoardRequest;
import dev.hstoklosa.futurify.model.entity.ApplicationBoard;
import dev.hstoklosa.futurify.model.entity.ApplicationStage;
import dev.hstoklosa.futurify.model.entity.User;
import dev.hstoklosa.futurify.repository.ApplicationBoardRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationBoardService {
    private static final List<String> DEFAULT_BOARD_STAGES = List.of("Wishlist", "Applied", "Interview", "Offer", "Rejected");

    private final ApplicationBoardRepository boardRepository;
    private final ApplicationStageService applicationStageService;

    @Transactional
    public Integer createBoard(CreateBoardRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        ApplicationBoard board = ApplicationBoard.builder()
                .name(request.getName())
                .user(user)
                .build();
        boardRepository.save(board);

        List<ApplicationStage> stages = DEFAULT_BOARD_STAGES.stream()
                .map(name -> ApplicationStage.builder()
                        .name(name)
                        .board(board)
                        .build())
                .collect(Collectors.toList());
        applicationStageService.saveAll(stages);

        return board.getId();
    }

}
