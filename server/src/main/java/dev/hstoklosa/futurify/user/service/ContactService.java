package dev.hstoklosa.futurify.user.service;

import dev.hstoklosa.futurify.email.EmailService;
import dev.hstoklosa.futurify.user.dto.ContactMessageRequest;
import dev.hstoklosa.futurify.user.entity.User;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {
    private final EmailService emailService;

    /**
     * Sends a contact message to the superuser.
     *
     * @param user     the user sending the message
     * @param request  the contact message request containing title and message
     * @return         true if the message was sent successfully, false otherwise
     */
    public boolean sendContactMessage(User user, ContactMessageRequest request) {
        try {
            String fullName = user.getFirstName() + " " + user.getLastName();
            emailService.sendContactMessage(
                    fullName,
                    user.getEmail(),
                    request.getTitle(),
                    request.getMessage()
            );
            return true;
        } catch (MessagingException e) {
            log.error("Failed to send contact message from user {}: {}", user.getId(), e.getMessage());
            return false;
        }
    }
} 