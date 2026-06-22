package com.drivementor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "feedbacks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private User mentor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    private Integer rating; // 1-5

    @Column(name = "verbal_feedback", columnDefinition = "TEXT")
    private String verbalFeedback;

    private String strengths; // Comma-separated list

    private String weaknesses; // Comma-separated list

    @Column(columnDefinition = "TEXT")
    private String suggestions;

    @Column(name = "parking_score")
    private Integer parkingScore;

    @Column(name = "traffic_handling_score")
    private Integer trafficHandlingScore;

    @Column(name = "highway_driving_score")
    private Integer highwayDrivingScore;

    @Column(name = "night_driving_score")
    private Integer nightDrivingScore;

    @Column(name = "road_awareness_score")
    private Integer roadAwarenessScore;

    @Column(name = "confidence_gain")
    private Integer confidenceGain;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
