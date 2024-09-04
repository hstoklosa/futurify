package dev.hstoklosa.futurify.service;

import dev.hstoklosa.futurify.model.entity.ApplicationBoard;
import dev.hstoklosa.futurify.model.entity.ApplicationStage;
import dev.hstoklosa.futurify.repository.ApplicationStageRepository;
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
