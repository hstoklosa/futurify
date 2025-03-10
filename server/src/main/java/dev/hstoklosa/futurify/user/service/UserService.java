package dev.hstoklosa.futurify.user.service;

import dev.hstoklosa.futurify.common.exception.ResourceNotFoundException;
import dev.hstoklosa.futurify.user.dto.UpdateDailyGoalRequest;
import dev.hstoklosa.futurify.user.dto.UpdateUserRequest;
import dev.hstoklosa.futurify.user.entity.User;
import dev.hstoklosa.futurify.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
    
    @Transactional
    public User updateUserDetails(Integer userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        if (request.getDailyApplicationGoal() != null) {
            user.setDailyApplicationGoal(request.getDailyApplicationGoal());
        }
        
        return userRepository.save(user);
    }
} 