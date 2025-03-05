package dev.hstoklosa.futurify.user.controller;

import dev.hstoklosa.futurify.common.api.ApiError;
import dev.hstoklosa.futurify.common.api.ApiResponse;
import dev.hstoklosa.futurify.user.dto.ContactMessageRequest;
import dev.hstoklosa.futurify.user.entity.User;
import dev.hstoklosa.futurify.user.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
public class ContactController {
    private final ContactService contactService;

    /**
     * Endpoint for sending a contact message to the superuser.
     *
     * @param user     the authenticated user sending the message
     * @param request  the contact message request containing title and message
     * @return         a response indicating success or failure
     */
    @PostMapping
    public ResponseEntity<ApiResponse<String>> sendContactMessage(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ContactMessageRequest request) {
        boolean success = contactService.sendContactMessage(user, request);
        
        if (success) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Message sent successfully", null));
        } else {
            ApiError error = new ApiError("Failed to send message. Please try again later.", Collections.emptyList());
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>(500, null, error));
        }
    }
} 