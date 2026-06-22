package com.drivementor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "skill_assessments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @Column(name = "parking_score")
    private Integer parkingScore;

    @Column(name = "traffic_handling")
    private Integer trafficHandling;

    @Column(name = "highway_driving")
    private Integer highwayDriving;

    @Column(name = "night_driving")
    private Integer nightDriving;

    @Column(name = "road_awareness")
    private Integer roadAwareness;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        lastUpdated = LocalDateTime.now();
    }
}
