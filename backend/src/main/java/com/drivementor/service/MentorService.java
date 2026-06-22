package com.drivementor.service;

import com.drivementor.dto.MentorDashboardResponse;
import com.drivementor.entity.Booking;
import com.drivementor.entity.MentorProfile;
import com.drivementor.entity.User;
import com.drivementor.exception.ResourceNotFoundException;
import com.drivementor.repository.BookingRepository;
import com.drivementor.repository.MentorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MentorService {

    private final MentorProfileRepository mentorProfileRepository;
    private final BookingRepository bookingRepository;

    public List<MentorProfile> searchMentors(
            String city, String vehicleType, String language,
            Integer minExperience, Double minRating, String searchQuery
    ) {
        // Handle empty strings as null to align with SQL parameters
        String c = (city != null && !city.trim().isEmpty()) ? city.trim() : null;
        String vt = (vehicleType != null && !vehicleType.trim().isEmpty()) ? vehicleType.trim() : null;
        String lang = (language != null && !language.trim().isEmpty()) ? language.trim() : null;
        String search = (searchQuery != null && !searchQuery.trim().isEmpty()) ? searchQuery.trim() : null;

        return mentorProfileRepository.searchMentors(c, vt, lang, minExperience, minRating, search);
    }

    public MentorProfile getMentorProfile(UUID id) {
        return mentorProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
    }

    public MentorProfile getMentorProfileByUserId(UUID userId) {
        return mentorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
    }

    public MentorDashboardResponse getMentorDashboard(User mentor) {
        MentorProfile profile = mentorProfileRepository.findByUserId(mentor.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));

        List<Booking> allBookings = bookingRepository.findByMentorIdOrderByDateDesc(mentor.getId());

        long completedSessions = allBookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .count();

        double totalHours = completedSessions * 1.5;
        double earnings = completedSessions * profile.getHourlyRate();

        List<Booking> pending = allBookings.stream()
                .filter(b -> "PENDING".equals(b.getStatus()))
                .collect(Collectors.toList());

        List<Booking> upcoming = allBookings.stream()
                .filter(b -> "ACCEPTED".equals(b.getStatus()) && !b.getDate().isBefore(LocalDate.now()))
                .collect(Collectors.toList());

        List<Booking> past = allBookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()) 
                        || "REJECTED".equals(b.getStatus()) 
                        || "CANCELLED".equals(b.getStatus())
                        || ("ACCEPTED".equals(b.getStatus()) && b.getDate().isBefore(LocalDate.now())))
                .collect(Collectors.toList());

        return MentorDashboardResponse.builder()
                .earnings(earnings)
                .totalHours(totalHours)
                .rating(profile.getRating() != null ? profile.getRating() : 5.0)
                .isVerified(profile.getIsVerified())
                .totalSessions(completedSessions)
                .pendingSessions(pending)
                .upcomingSessions(upcoming)
                .pastSessions(past)
                .build();
    }
}
