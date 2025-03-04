package dev.hstoklosa.futurify.user.service;

import dev.hstoklosa.futurify.common.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.user.dto.UpdateDailyGoalRequest;
import dev.hstoklosa.futurify.user.entity.User;
import dev.hstoklosa.futurify.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public User updateDailyApplicationGoal(Integer userId, UpdateDailyGoalRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setDailyApplicationGoal(request.getDailyApplicationGoal());
        return userRepository.save(user);
    }

    public Integer getDailyApplicationGoal(Integer userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return user.getDailyApplicationGoal();
    }
} 