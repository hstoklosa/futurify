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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final BoardRepository boardRepository;
    private final StageRepository stageRepository;
    private final JobMapper jobMapper;
    private final JobTimelineService timelineService;

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

    @Transactional
    public JobResponse createJob(Integer boardId, CreateJobRequest request) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("The requested board doesn't exist."));
        
        User currentUser = SecurityUtil.getCurrentUser();
        if (!currentUser.getId().equals(board.getUser().getId())) {
            throw new OperationNotPermittedException("You aren't permitted to create jobs for this board.");
        }
        
        Stage stage = stageRepository.findById(request.getStageId())
            .orElseThrow(() -> new ResourceNotFoundException("The specified stage couldn't be found."));
        
        // Ensure the stage belongs to the same board
        if (!stage.getBoard().getId().equals(boardId)) {
            throw new OperationNotPermittedException("Cannot add job to a stage from a different board.");
        }
        
        // Sanitize HTML in description if present
        if (StringUtils.hasText(request.getDescription())) {
            request.setDescription(SecurityUtil.sanitiseHtml(request.getDescription()));
        }
        
        // Get the highest position in the stage and add 1
        Integer maxPosition = jobRepository.findMaxPositionByStageId(stage.getId());
        Integer position = maxPosition != null ? maxPosition + 1 : 0;
        
        Job newJob = jobMapper.createJobRequestToJob(request, board, stage);
        newJob.setPosition(position);
        
        Job savedJob = jobRepository.save(newJob);
        
        // Record timeline event for job creation
        timelineService.recordJobCreation(savedJob);
        
        return jobMapper.jobToJobResponse(savedJob);
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
        
        Integer currentStageId = job.getStage().getId();
        Integer currentPosition = job.getPosition();
        Integer targetStageId = targetStage.getId();
        Integer targetPosition = request.getPosition();
        
        // Save stage names for timeline
        String previousStageName = job.getStage().getName();
        String newStageName = targetStage.getName();
        
        if (Objects.equals(currentStageId, targetStageId)) {
            // Same stage, just moving positions
            handlePositionChangeWithinStage(job, currentPosition, targetPosition);
            
            // Record position change in timeline
            timelineService.recordPositionChange(job, currentPosition, targetPosition);
        } else {
            // Moving to a different stage
            handlePositionChangeBetweenStages(job, currentStageId, currentPosition, targetStageId, targetPosition);
            
            // Record stage change in timeline
            timelineService.recordStageChange(job, previousStageName, newStageName);
        }
        
        job = jobRepository.save(job);
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
        
        // Capture job before changes for comparison
        String oldTitle = job.getTitle();
        String oldCompanyName = job.getCompanyName();
        String oldLocation = job.getLocation();
        String oldType = job.getType().toString();
        String oldPostUrl = job.getPostUrl();
        String oldDescription = job.getDescription();
        String oldSalary = job.getSalary();
        String oldStageName = job.getStage().getName();
        
        // Handle stage change if needed
        Integer currentStageId = job.getStage().getId();
        Integer targetStageId = targetStage.getId();
        
        boolean stageChanged = false;
        
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
            
            stageChanged = true;
        }
        
        // Update other job properties
        jobMapper.updateJobFromRequest(request, job.getStage(), job);
        
        // Save the job
        job = jobRepository.save(job);
        
        // Track changes for timeline
        Map<String, String> changes = new HashMap<>();
        
        if (!oldTitle.equals(job.getTitle())) {
            changes.put("title", "Changed from '" + oldTitle + "' to '" + job.getTitle() + "'");
        }
        
        if (!oldCompanyName.equals(job.getCompanyName())) {
            changes.put("companyName", "Changed from '" + oldCompanyName + "' to '" + job.getCompanyName() + "'");
        }
        
        if ((oldLocation == null && job.getLocation() != null) || 
            (oldLocation != null && !oldLocation.equals(job.getLocation()))) {
            changes.put("location", "Changed from '" + (oldLocation != null ? oldLocation : "none") + 
                    "' to '" + (job.getLocation() != null ? job.getLocation() : "none") + "'");
        }
        
        if (!oldType.equals(job.getType().toString())) {
            changes.put("type", "Changed from '" + oldType + "' to '" + job.getType() + "'");
        }
        
        if ((oldPostUrl == null && job.getPostUrl() != null) || 
            (oldPostUrl != null && !oldPostUrl.equals(job.getPostUrl()))) {
            changes.put("postUrl", "Changed from '" + (oldPostUrl != null ? oldPostUrl : "none") + 
                    "' to '" + (job.getPostUrl() != null ? job.getPostUrl() : "none") + "'");
        }
        
        if ((oldDescription == null && job.getDescription() != null) || 
            (oldDescription != null && !oldDescription.equals(job.getDescription()))) {
            changes.put("description", "Description was updated");
        }
        
        if ((oldSalary == null && job.getSalary() != null) || 
            (oldSalary != null && !oldSalary.equals(job.getSalary()))) {
            changes.put("salary", "Changed from '" + (oldSalary != null ? oldSalary : "none") + 
                    "' to '" + (job.getSalary() != null ? job.getSalary() : "none") + "'");
        }
        
        // Record updates in timeline
        if (!changes.isEmpty()) {
            timelineService.recordJobUpdate(job, changes);
        }
        
        // Record stage change separately
        if (stageChanged) {
            timelineService.recordStageChange(job, oldStageName, targetStage.getName());
        }
        
        return jobMapper.jobToJobResponse(job);
    }
}
