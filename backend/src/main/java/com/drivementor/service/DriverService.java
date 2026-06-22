package com.drivementor.service;

import com.drivementor.dto.DriverDashboardResponse;
import com.drivementor.entity.*;
import com.drivementor.exception.ResourceNotFoundException;
import com.drivementor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverProfileRepository driverProfileRepository;
    private final SkillAssessmentRepository skillAssessmentRepository;
    private final AchievementRepository achievementRepository;
    private final BookingRepository bookingRepository;
    private final FeedbackRepository feedbackRepository;
    private final ProgressReportRepository progressReportRepository;

    public DriverDashboardResponse getDriverDashboard(User driver) {
        DriverProfile profile = driverProfileRepository.findByUserId(driver.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        SkillAssessment assessment = skillAssessmentRepository.findByDriverId(driver.getId())
                .orElseGet(() -> SkillAssessment.builder()
                        .parkingScore(50)
                        .trafficHandling(50)
                        .highwayDriving(50)
                        .nightDriving(50)
                        .roadAwareness(50)
                        .build());

        Map<String, Integer> skills = new LinkedHashMap<>();
        skills.put("Parking Skills", assessment.getParkingScore());
        skills.put("Traffic Handling", assessment.getTrafficHandling());
        skills.put("Highway Driving", assessment.getHighwayDriving());
        skills.put("Night Driving", assessment.getNightDriving());
        skills.put("Road Awareness", assessment.getRoadAwareness());

        List<Achievement> achievements = achievementRepository.findByDriverId(driver.getId());

        // Find next session (PENDING or ACCEPTED, scheduled on/after today)
        List<Booking> bookings = bookingRepository.findByDriverIdOrderByDateDesc(driver.getId());
        Booking nextSession = bookings.stream()
                .filter(b -> ("PENDING".equals(b.getStatus()) || "ACCEPTED".equals(b.getStatus())) 
                        && !b.getDate().isBefore(LocalDate.now()))
                .min(Comparator.comparing(Booking::getDate))
                .orElse(null);

        // Find recent feedback
        List<Feedback> feedbacks = feedbackRepository.findByDriverIdOrderByCreatedAtDesc(driver.getId());
        Feedback recentFeedback = feedbacks.isEmpty() ? null : feedbacks.get(0);

        // AI recommendations
        List<String> recommendations = new ArrayList<>();
        if (recentFeedback != null && recentFeedback.getSuggestions() != null) {
            recommendations = Arrays.stream(recentFeedback.getSuggestions().split("\n\n"))
                    .filter(s -> !s.trim().isEmpty())
                    .collect(Collectors.toList());
        } else {
            recommendations.add("Book a session focusing on City Driving to kickstart your real-world traffic confidence.");
            recommendations.add("Update your weekly goal in settings to stay on track.");
            recommendations.add("Practice parallel parking in a controlled sub-urban environment.");
        }

        return DriverDashboardResponse.builder()
                .confidenceScore(profile.getConfidenceScore() != null ? profile.getConfidenceScore() : 50)
                .hoursPracticed(profile.getHoursPracticed() != null ? profile.getHoursPracticed() : 0.0)
                .streakDays(profile.getStreakDays() != null ? profile.getStreakDays() : 0)
                .weeklyGoalHours(profile.getWeeklyGoalHours() != null ? profile.getWeeklyGoalHours() : 5.0)
                .nextSession(nextSession)
                .skills(skills)
                .achievements(achievements)
                .recentFeedback(recentFeedback)
                .aiRecommendations(recommendations)
                .build();
    }

    public List<ProgressReport> getDriverProgress(User driver) {
        return progressReportRepository.findByDriverIdOrderByRecordDateAsc(driver.getId());
    }
}
