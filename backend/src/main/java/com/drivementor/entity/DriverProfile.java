package com.drivementor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "driver_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "confidence_score")
    private Integer confidenceScore;

    @Column(name = "hours_practiced")
    private Double hoursPracticed;

    @Column(name = "weekly_goal_hours")
    private Double weeklyGoalHours;

    @Column(name = "streak_days")
    private Integer streakDays;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "vehicle_type_preference")
    private String vehicleTypePreference;
}
