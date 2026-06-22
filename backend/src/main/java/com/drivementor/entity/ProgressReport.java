package com.drivementor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "progress_reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(name = "confidence_score", nullable = false)
    private Integer confidenceScore;

    @Column(name = "hours_completed", nullable = false)
    private Double hoursCompleted;

    @Column(name = "sessions_completed", nullable = false)
    private Integer sessionsCompleted;
}
