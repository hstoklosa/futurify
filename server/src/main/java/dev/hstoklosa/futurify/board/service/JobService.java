package dev.hstoklosa.futurify.board.service;


import dev.hstoklosa.futurify.board.JobMapper;
import dev.hstoklosa.futurify.board.dto.CreateJobRequest;
import dev.hstoklosa.futurify.board.dto.JobResponse;
import dev.hstoklosa.futurify.board.entity.Board;
import dev.hstoklosa.futurify.board.entity.Job;
import dev.hstoklosa.futurify.board.repository.BoardRepository;
import dev.hstoklosa.futurify.board.repository.JobRepository;
import dev.hstoklosa.futurify.common.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.common.util.SecurityUtil;
import dev.hstoklosa.futurify.stage.entity.Stage;
import dev.hstoklosa.futurify.stage.repository.StageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final BoardRepository boardRepository;
    private final StageRepository stageRepository;
    private final JobMapper jobMapper;

    public JobResponse getJobById(Integer jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("The requested job application doesn't exist."));

        return jobMapper.jobToJobResponse(job);
    }

    @Transactional
    public List<JobResponse> getJobs(Integer boardId) {
        return jobRepository.findAllByBoardId(boardId).stream()
                .map(jobMapper::jobToJobResponse)
                .collect(Collectors.toList());
    }

    @Transactional // multiple UPDATEs in shiftPosition
    public JobResponse createJob(Integer boardId, CreateJobRequest request) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("The board has not been provided for this job."));

        Stage stage = stageRepository.findById(request.getStageId())
                .orElseThrow(() -> new ResourceNotFoundException("The stage has not been provided for this job."));

        String jobDescription = request.getDescription();
        if (StringUtils.hasText(jobDescription)) {
            request.setDescription(SecurityUtil.sanitiseHtml(jobDescription));
        }

        Integer stageId = stage.getId();
        Integer endPos = jobRepository.findMaxPositionByStageId(stageId);
        jobRepository.shiftPositionsUp(stageId, 0, endPos);

        Job job = jobRepository.save(jobMapper.createJobRequestToJob(request, board, stage));
        return jobMapper.jobToJobResponse(job);
    }

}
