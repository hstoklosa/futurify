package dev.hstoklosa.futurify.stage.service;

import dev.hstoklosa.futurify.board.entity.Board;
import dev.hstoklosa.futurify.stage.entity.Stage;
import dev.hstoklosa.futurify.stage.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class StageService {
    private final StageRepository stageRepository;

    public List<Stage> createDefaultStages(Board board) {
        List<Stage> stages = Stream.of("Wishlist", "Applied", "Interview", "Offer", "Rejected")
                .map(name -> Stage.builder()
                        .name(name)
                        .board(board)
                        .build())
                .collect(Collectors.toList());

        stageRepository.saveAll(stages);
        return stages;
    }

}
