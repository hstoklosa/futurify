package dev.hstoklosa.futurify.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ActivationToken {

    @Id
    @GeneratedValue
    private Integer id;

    @Column(unique = true, updatable = false, nullable = false)
    private String token;

    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Column(updatable = false, nullable = false)
    private LocalDateTime expiresAt;

    @Column(insertable = false)
    private LocalDateTime validatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
