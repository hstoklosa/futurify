package dev.hstoklosa.futurify.board.entity;

import dev.hstoklosa.futurify.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true, exclude = {"job"})
@ToString(exclude = {"job"})
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@DynamicUpdate
@Table(name = "actions")
public class Action extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ActionType type;

    @Column(nullable = false)
    private LocalDateTime startDateTime;

    @Column(nullable = false)
    private LocalDateTime endDateTime;

    @Column(nullable = false, length = 50)
    private String color;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private boolean completed = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;
} 