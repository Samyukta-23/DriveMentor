package com.drivementor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "achievements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @Column(name = "badge_name", nullable = false)
    private String badgeName;

    private String description;

    @Column(name = "unlocked_at")
    private LocalDateTime unlockedAt;

    @PrePersist
    protected void onCreate() {
        unlockedAt = LocalDateTime.now();
    }
}
