package dev.hstoklosa.futurify.stage.entity;

import dev.hstoklosa.futurify.board.entity.ApplicationBoard;
import dev.hstoklosa.futurify.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "application_stage")
public class ApplicationStage extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private ApplicationBoard board;

}
