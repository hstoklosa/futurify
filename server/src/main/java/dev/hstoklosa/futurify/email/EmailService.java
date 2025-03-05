package dev.hstoklosa.futurify.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String from;
    
    @Value("${application.superuser.email}")
    private String superuserEmail;

    /**
     * Sends an account activation email asynchronously.
     *
     * @param recipient             the email address to be confirmed
     * @param username              the name of the account to be activated
     * @param confirmationUrl       the front-end url for code confirmation
     * @param activationCode        the activation code for the account
     * @throws MessagingException   if there is an error while sending the email
     */
    @Async
    public void sendActivationEmail(
            String recipient,
            String username,
            String confirmationUrl,
            String activationCode
    ) throws MessagingException {
        Map<String, Object> properties = Map.of(
                "username", username,
                "confirmationUrl", confirmationUrl,
                "activation_code", activationCode
        );

        MimeMessage mimeMessage = constructEmail(recipient, "Futurify - Verify your email", EmailTemplate.ACTIVATE_ACCOUNT, properties);
        mailSender.send(mimeMessage);
    }
    
    /**
     * Sends a contact message to the superuser email asynchronously.
     *
     * @param senderName            the name of the user sending the message
     * @param senderEmail           the email of the user sending the message
     * @param title                 the title of the message
     * @param message               the content of the message
     * @throws MessagingException   if there is an error while sending the email
     */
    @Async
    public void sendContactMessage(
            String senderName,
            String senderEmail,
            String title,
            String message
    ) throws MessagingException {
        Map<String, Object> properties = Map.of(
                "senderName", senderName,
                "senderEmail", senderEmail,
                "title", title,
                "message", message
        );

        MimeMessage mimeMessage = constructEmail(superuserEmail, "Futurify - Contact Message: " + title, EmailTemplate.CONTACT_MESSAGE, properties);
        mailSender.send(mimeMessage);
    }

    /**
     * Constructs an email message with the specified parameters.
     *
     * @param to                    the recipient's email address
     * @param subject               the subject of the email
     * @param template              the email template to use
     * @param properties            a map of properties to be included in the email template
     * @return                      the constructed MimeMessage
     * @throws MessagingException   if there is an error while creating the email message
     */
    public MimeMessage constructEmail(
            String to,
            String subject,
            EmailTemplate template,
            Map<String, Object> properties
    ) throws MessagingException {
        String templateName = template.getName();

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED, StandardCharsets.UTF_8.name()
        );

        Context context = new Context();
        context.setVariables(properties);

        String html = templateEngine.process(templateName, context);
        helper.setTo(to);
        helper.setFrom(from);
        helper.setSubject(subject);
        helper.setText(html, true);

        return mimeMessage;
    }
}
