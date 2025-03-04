package dev.hstoklosa.futurify.board.service;


import dev.hstoklosa.futurify.board.JobMapper;
import dev.hstoklosa.futurify.board.dto.CreateJobRequest;
import dev.hstoklosa.futurify.board.dto.JobResponse;
import dev.hstoklosa.futurify.board.dto.UpdateJobPositionRequest;
import dev.hstoklosa.futurify.board.dto.UpdateJobRequest;
import dev.hstoklosa.futurify.board.entity.Board;
import dev.hstoklosa.futurify.board.entity.Job;
import dev.hstoklosa.futurify.board.repository.BoardRepository;
import dev.hstoklosa.futurify.board.repository.JobRepository;
import dev.hstoklosa.futurify.common.exception.OperationNotPermittedException;
import dev.hstoklosa.futurify.common.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.common.util.SecurityUtil;
import dev.hstoklosa.futurify.stage.entity.Stage;
import dev.hstoklosa.futurify.stage.repository.StageRepository;
import dev.hstoklosa.futurify.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;
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
    
    @Transactional
    public List<JobResponse> getJobsByStage(Integer stageId) {
        return jobRepository.findAllByStageIdOrderByPositionAsc(stageId).stream()
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
        Integer newPosition = endPos != null ? endPos + 1 : 0;
        
        Job job = jobMapper.createJobRequestToJob(request, board, stage);
        job.setPosition(newPosition);
        
        job = jobRepository.save(job);
        return jobMapper.jobToJobResponse(job);
    }
    
    @Transactional
    public JobResponse updateJobPosition(Integer jobId, UpdateJobPositionRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("The requested job application doesn't exist."));
        
        User currentUser = SecurityUtil.getCurrentUser();
        if (!currentUser.getId().equals(job.getBoard().getUser().getId())) {
            throw new OperationNotPermittedException("You aren't permitted to update this job.");
        }
        
        Stage targetStage = stageRepository.findById(request.getStageId())
                .orElseThrow(() -> new ResourceNotFoundException("The specified stage couldn't be found."));
        
        // Ensure the stage belongs to the same board as the job
        if (!targetStage.getBoard().getId().equals(job.getBoard().getId())) {
            throw new OperationNotPermittedException("Cannot move job to a stage from a different board.");
        }
        
        Integer targetPosition = request.getPosition();
        Integer currentStageId = job.getStage().getId();
        Integer targetStageId = targetStage.getId();
        Integer currentPosition = job.getPosition();
        
        // Handle position changes within the same stage
        if (Objects.equals(currentStageId, targetStageId)) {
            handlePositionChangeWithinStage(job, currentPosition, targetPosition);
        } else {
            // Handle moving job to a different stage
            handlePositionChangeBetweenStages(job, currentStageId, currentPosition, targetStageId, targetPosition);
        }
        
        return jobMapper.jobToJobResponse(job);
    }
    
    private void handlePositionChangeWithinStage(Job job, Integer currentPosition, Integer targetPosition) {
        Integer stageId = job.getStage().getId();
        
        // No change in position
        if (Objects.equals(currentPosition, targetPosition)) {
            return;
        }
        
        // Moving job up in the list (lower position number)
        if (targetPosition < currentPosition) {
            jobRepository.shiftPositionsUp(stageId, targetPosition, currentPosition - 1);
        } 
        // Moving job down in the list (higher position number)
        else {
            jobRepository.shiftPositionsDown(stageId, currentPosition + 1, targetPosition);
        }
        
        job.setPosition(targetPosition);
        jobRepository.save(job);
    }
    
    private void handlePositionChangeBetweenStages(
            Job job, 
            Integer currentStageId, 
            Integer currentPosition, 
            Integer targetStageId, 
            Integer targetPosition) {
        
        // First, close the gap in the current stage
        Integer maxPositionInCurrentStage = jobRepository.findMaxPositionByStageId(currentStageId);
        if (maxPositionInCurrentStage != null && currentPosition < maxPositionInCurrentStage) {
            jobRepository.shiftPositionsDown(currentStageId, currentPosition + 1, maxPositionInCurrentStage);
        }
        
        // Then, make space in the target stage
        Integer maxPositionInTargetStage = jobRepository.findMaxPositionByStageId(targetStageId);
        Integer jobCountInTargetStage = jobRepository.countByStageId(targetStageId);
        
        // Validate target position
        if (targetPosition > jobCountInTargetStage) {
            targetPosition = jobCountInTargetStage;
        }
        
        // Make space for the new job if needed
        if (jobCountInTargetStage > 0 && targetPosition < jobCountInTargetStage) {
            jobRepository.shiftPositionsUp(targetStageId, targetPosition, maxPositionInTargetStage);
        }
        
        // Update the job's stage and position
        job.setStage(stageRepository.getReferenceById(targetStageId));
        job.setPosition(targetPosition);
        jobRepository.save(job);
    }

    @Transactional
    public JobResponse updateJob(Integer jobId, UpdateJobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("The requested job application doesn't exist."));
        
        User currentUser = SecurityUtil.getCurrentUser();
        if (!currentUser.getId().equals(job.getBoard().getUser().getId())) {
            throw new OperationNotPermittedException("You aren't permitted to update this job.");
        }
        
        Stage targetStage = stageRepository.findById(request.getStageId())
                .orElseThrow(() -> new ResourceNotFoundException("The specified stage couldn't be found."));
        
        // Ensure the stage belongs to the same board as the job
        if (!targetStage.getBoard().getId().equals(job.getBoard().getId())) {
            throw new OperationNotPermittedException("Cannot move job to a stage from a different board.");
        }
        
        // Sanitize HTML in description if present
        if (StringUtils.hasText(request.getDescription())) {
            request.setDescription(SecurityUtil.sanitiseHtml(request.getDescription()));
        }
        
        // Handle stage change if needed
        Integer currentStageId = job.getStage().getId();
        Integer targetStageId = targetStage.getId();
        
        if (!Objects.equals(currentStageId, targetStageId)) {
            // If stage is changing, handle position changes
            Integer currentPosition = job.getPosition();
            Integer maxPositionInTargetStage = jobRepository.findMaxPositionByStageId(targetStageId);
            Integer newPosition = maxPositionInTargetStage != null ? maxPositionInTargetStage + 1 : 0;
            
            // Close the gap in the current stage
            Integer maxPositionInCurrentStage = jobRepository.findMaxPositionByStageId(currentStageId);
            if (maxPositionInCurrentStage != null && currentPosition < maxPositionInCurrentStage) {
                jobRepository.shiftPositionsDown(currentStageId, currentPosition + 1, maxPositionInCurrentStage);
            }
            
            // Update stage and position
            job.setStage(targetStage);
            job.setPosition(newPosition);
        }
        
        // Update other job properties
        jobMapper.updateJobFromRequest(request, job.getStage(), job);
        
        job = jobRepository.save(job);
        return jobMapper.jobToJobResponse(job);
    }
}
