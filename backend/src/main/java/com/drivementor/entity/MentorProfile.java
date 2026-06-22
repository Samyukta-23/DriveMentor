package com.drivementor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "mentor_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "experience_years")
    private Integer experienceYears;

    private String languages;

    @Column(name = "vehicle_types")
    private String vehicleTypes;

    @Column(name = "hourly_rate")
    private Double hourlyRate;

    private Double rating;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "license_number")
    private String licenseNumber;
}
