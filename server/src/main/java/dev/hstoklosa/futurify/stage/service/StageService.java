package dev.hstoklosa.futurify.stage.service;

import dev.hstoklosa.futurify.board.entity.Board;
import dev.hstoklosa.futurify.stage.entity.Stage;
import dev.hstoklosa.futurify.stage.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class StageService {
    private static final List<String> DEFAULT_STAGE_NAMES = List.of(
            "Wishlist", "Applied", "Interview", "Offer", "Rejected"
    );

    private final StageRepository stageRepository;

    public List<Stage> createDefaultStages(Board board) {
        List<Stage> stages = IntStream.range(0, DEFAULT_STAGE_NAMES.size())
                .mapToObj(idx -> new Stage(DEFAULT_STAGE_NAMES.get(idx), idx, board))
                .collect(Collectors.toList());

        return stageRepository.saveAll(stages);
    }

}
