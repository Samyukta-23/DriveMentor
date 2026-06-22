package com.drivementor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private User mentor;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "time_slot", nullable = false)
    private String timeSlot;

    @Column(name = "skill_focus", nullable = false)
    private String skillFocus;

    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED

    @Column(name = "amount_paid")
    private Double amountPaid;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
