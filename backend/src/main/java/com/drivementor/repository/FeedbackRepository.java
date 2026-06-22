package com.drivementor.repository;

import com.drivementor.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
    Optional<Feedback> findByBookingId(UUID bookingId);
    List<Feedback> findByDriverIdOrderByCreatedAtDesc(UUID driverId);
    List<Feedback> findByMentorIdOrderByCreatedAtDesc(UUID mentorId);
}
