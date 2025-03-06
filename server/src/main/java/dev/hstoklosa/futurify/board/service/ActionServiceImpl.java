package dev.hstoklosa.futurify.board.service;

import dev.hstoklosa.futurify.board.ActionMapper;
import dev.hstoklosa.futurify.board.dto.ActionResponse;
import dev.hstoklosa.futurify.board.dto.CreateActionRequest;
import dev.hstoklosa.futurify.board.dto.UpdateActionRequest;
import dev.hstoklosa.futurify.board.entity.Action;
import dev.hstoklosa.futurify.board.entity.Job;
import dev.hstoklosa.futurify.board.repository.ActionRepository;
import dev.hstoklosa.futurify.board.repository.JobRepository;
import dev.hstoklosa.futurify.common.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.common.exception.OperationNotPermittedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.DataException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActionServiceImpl implements ActionService {
    private final ActionRepository actionRepository;
    private final JobRepository jobRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public ActionResponse getActionById(Integer id) {
        try {
            Action action = actionRepository.findByIdWithJob(id);
            if (action == null) {
                throw new ResourceNotFoundException("Action not found with id: " + id);
            }
            return ActionMapper.toResponse(action);
        } catch (JpaSystemException | DataException e) {
            log.error("Database error while fetching action {}: {}", id, e.getMessage());
            throw new OperationNotPermittedException("Unable to fetch action details. Please try again.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActionResponse> getActionsByJobId(Integer jobId) {
        try {
            // Verify job exists
            if (!jobRepository.existsById(jobId)) {
                throw new ResourceNotFoundException("Job not found with id: " + jobId);
            }
            
            List<Action> actions = actionRepository.findByJobId(jobId);
            
            // Initialize the collection to prevent lazy loading issues
            actions.forEach(action -> {
                if (action.getNotes() != null) {
                    entityManager.detach(action); // Detach to prevent lazy loading issues
                }
            });
            
            return actions.stream()
                    .map(action -> {
                        try {
                            return ActionMapper.toResponse(action);
                        } catch (JpaSystemException | DataException e) {
                            log.error("Error mapping action {}: {}", action.getId(), e.getMessage());
                            return null;
                        }
                    })
                    .filter(action -> action != null)
                    .collect(Collectors.toList());
        } catch (JpaSystemException | DataException e) {
            log.error("Database error while fetching actions for job {}: {}", jobId, e.getMessage());
            throw new OperationNotPermittedException("Unable to fetch actions. Please try again.");
        }
    }

    @Override
    @Transactional
    public ActionResponse createAction(Integer jobId, CreateActionRequest request) {
        try {
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

            validateActionDates(request.getStartDateTime(), request.getEndDateTime());
            validateNotes(request.getNotes());
            
            Action action = ActionMapper.toEntity(request, job);
            Action savedAction = actionRepository.save(action);
            entityManager.flush(); // Ensure the entity is saved before detaching
            entityManager.detach(savedAction); // Detach to prevent lazy loading issues
            
            log.debug("Created new action with id: {} for job: {}", savedAction.getId(), jobId);
            return ActionMapper.toResponse(savedAction);
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while creating action for job {}: {}", jobId, e.getMessage());
            throw new OperationNotPermittedException("Unable to create action due to data constraints.");
        } catch (JpaSystemException | DataException e) {
            log.error("Database error while creating action for job {}: {}", jobId, e.getMessage());
            throw new OperationNotPermittedException("Unable to create action. Please try again.");
        } catch (Exception e) {
            log.error("Error creating action for job {}: {}", jobId, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public ActionResponse updateAction(Integer actionId, UpdateActionRequest request) {
        try {
            Action action = actionRepository.findById(actionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Action not found with id: " + actionId));
            
            // Validate dates if both are provided
            LocalDateTime newStartDate = request.getStartDateTime() != null ? request.getStartDateTime() : action.getStartDateTime();
            LocalDateTime newEndDate = request.getEndDateTime() != null ? request.getEndDateTime() : action.getEndDateTime();
            validateActionDates(newStartDate, newEndDate);
            
            if (request.getNotes() != null) {
                validateNotes(request.getNotes());
            }

            updateActionFields(action, request);
            
            Action updatedAction = actionRepository.save(action);
            log.debug("Updated action with id: {}", actionId);
            return ActionMapper.toResponse(updatedAction);
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while updating action {}: {}", actionId, e.getMessage());
            throw new OperationNotPermittedException("Unable to update action due to data constraints.");
        } catch (JpaSystemException | DataException e) {
            log.error("Database error while updating action {}: {}", actionId, e.getMessage());
            throw new OperationNotPermittedException("Unable to update action. Please try again.");
        } catch (Exception e) {
            log.error("Error updating action {}: {}", actionId, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public void deleteAction(Integer actionId) {
        try {
            if (!actionRepository.existsById(actionId)) {
                throw new ResourceNotFoundException("Action not found with id: " + actionId);
            }
            
            actionRepository.deleteById(actionId);
            log.debug("Deleted action with id: {}", actionId);
        } catch (JpaSystemException | DataException e) {
            log.error("Database error while deleting action {}: {}", actionId, e.getMessage());
            throw new OperationNotPermittedException("Unable to delete action. Please try again.");
        } catch (Exception e) {
            log.error("Error deleting action {}: {}", actionId, e.getMessage());
            throw e;
        }
    }

    private void validateActionDates(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (startDateTime != null && endDateTime != null && !startDateTime.isBefore(endDateTime)) {
            throw new OperationNotPermittedException("Start date must be before end date");
        }

        if (startDateTime != null && startDateTime.isBefore(LocalDateTime.now())) {
            throw new OperationNotPermittedException("Start date cannot be in the past");
        }
    }

    private void validateNotes(String notes) {
        if (notes != null && notes.length() > 10000) {
            throw new OperationNotPermittedException("Notes cannot exceed 10000 characters");
        }
    }

    private void updateActionFields(Action action, UpdateActionRequest request) {
        if (request.getTitle() != null) {
            action.setTitle(request.getTitle());
        }
        
        if (request.getType() != null) {
            action.setType(request.getType());
            
            // If color is not provided but type is changed, update color to default for new type
            if (request.getColor() == null) {
                action.setColor(ActionMapper.getDefaultColorForType(request.getType()));
            }
        }
        
        if (request.getStartDateTime() != null) {
            action.setStartDateTime(request.getStartDateTime());
        }
        
        if (request.getEndDateTime() != null) {
            action.setEndDateTime(request.getEndDateTime());
        }
        
        if (request.getColor() != null) {
            action.setColor(request.getColor());
        }
        
        if (request.getNotes() != null) {
            action.setNotes(request.getNotes());
        }

        if (request.getCompleted() != null) {
            action.setCompleted(request.getCompleted());
        }
    }
} 