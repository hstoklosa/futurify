package dev.hstoklosa.futurify.stage.service;

import dev.hstoklosa.futurify.board.entity.ApplicationBoard;
import dev.hstoklosa.futurify.stage.entity.ApplicationStage;
import dev.hstoklosa.futurify.stage.repository.ApplicationStageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ApplicationStageService {
    private final ApplicationStageRepository stageRepository;

    public List<ApplicationStage> createDefaultStages(ApplicationBoard board) {
        List<ApplicationStage> stages = Stream.of("Wishlist", "Applied", "Interview", "Offer", "Rejected")
                .map(name -> ApplicationStage.builder()
                        .name(name)
                        .board(board)
                        .build())
                .collect(Collectors.toList());

        stageRepository.saveAll(stages);
        return stages;
    }

}
