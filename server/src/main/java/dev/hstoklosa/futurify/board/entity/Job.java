package dev.hstoklosa.futurify.board.entity;

import dev.hstoklosa.futurify.common.BaseEntity;
import dev.hstoklosa.futurify.stage.entity.Stage;
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
public class Job extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String companyName;

    private String location;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private JobType type;

    private String postUrl;

    @Lob
    private String description;

    private String salary;

    private int position;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id")
    private Stage stage;

    // TODO: Create slice for Contact domain
    // private Contact contacts;
}
