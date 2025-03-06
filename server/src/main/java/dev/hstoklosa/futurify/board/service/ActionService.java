package dev.hstoklosa.futurify.board.service;

import dev.hstoklosa.futurify.board.dto.ActionResponse;
import dev.hstoklosa.futurify.board.dto.CreateActionRequest;
import dev.hstoklosa.futurify.board.dto.UpdateActionRequest;

import java.util.List;

public interface ActionService {
    ActionResponse getActionById(Integer id);
    List<ActionResponse> getActionsByJobId(Integer jobId);
    ActionResponse createAction(Integer jobId, CreateActionRequest request);
    ActionResponse updateAction(Integer actionId, UpdateActionRequest request);
    void deleteAction(Integer actionId);
} 