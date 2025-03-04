package dev.hstoklosa.futurify.user.controller;

import dev.hstoklosa.futurify.common.api.ApiResponse;
import dev.hstoklosa.futurify.user.dto.UpdateDailyGoalRequest;
import dev.hstoklosa.futurify.user.entity.User;
import dev.hstoklosa.futurify.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PatchMapping("/daily-goal")
    public ResponseEntity<ApiResponse<User>> updateDailyApplicationGoal(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateDailyGoalRequest request) {
        User updatedUser = userService.updateDailyApplicationGoal(user.getId(), request);
        return ResponseEntity.ok(new ApiResponse<>(200, updatedUser, null));
    }

    @GetMapping("/daily-goal")
    public ResponseEntity<ApiResponse<Integer>> getDailyApplicationGoal(
            @AuthenticationPrincipal User user) {
        Integer goal = userService.getDailyApplicationGoal(user.getId());
        return ResponseEntity.ok(new ApiResponse<>(200, goal, null));
    }
} 