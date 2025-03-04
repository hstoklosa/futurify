package dev.hstoklosa.futurify.board.entity;

import dev.hstoklosa.futurify.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
public class JobTimelineEvent extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private Job job;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private JobEventType eventType;

    @Column(nullable = false)
    private String description;

    @Lob
    private String details;
} 