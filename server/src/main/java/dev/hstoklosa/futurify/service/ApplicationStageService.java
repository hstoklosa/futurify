package dev.hstoklosa.futurify.service;

import dev.hstoklosa.futurify.model.entity.ApplicationStage;
import dev.hstoklosa.futurify.repository.ApplicationStageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationStageService {
    private final ApplicationStageRepository applicationStageRepository;

    public List<ApplicationStage> saveAll(Iterable<ApplicationStage> columns) {
        return applicationStageRepository.saveAll(columns);
    }
}
