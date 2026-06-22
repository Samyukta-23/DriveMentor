package com.drivementor.repository;

import com.drivementor.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByDriverIdOrderByDateDesc(UUID driverId);
    List<Booking> findByMentorIdOrderByDateDesc(UUID mentorId);
    long countByDriverIdAndStatus(UUID driverId, String status);
    long countByMentorIdAndStatus(UUID mentorId, String status);
}
