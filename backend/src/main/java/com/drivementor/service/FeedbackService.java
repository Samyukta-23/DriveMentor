package com.drivementor.service;

import com.drivementor.dto.FeedbackRequest;
import com.drivementor.entity.*;
import com.drivementor.exception.ResourceNotFoundException;
import com.drivementor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final BookingRepository bookingRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final SkillAssessmentRepository skillAssessmentRepository;
    private final ProgressReportRepository progressReportRepository;
    private final AchievementRepository achievementRepository;
    private final NotificationService notificationService;

    @Transactional
    public Feedback submitFeedback(UUID bookingId, FeedbackRequest request, User mentor) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getMentor().getId().equals(mentor.getId())) {
            throw new IllegalArgumentException("You are not authorized to submit feedback for this booking");
        }

        User driver = booking.getDriver();

        // 1. Get/Create SkillAssessment
        SkillAssessment skillAssessment = skillAssessmentRepository.findByDriverId(driver.getId())
                .orElseGet(() -> SkillAssessment.builder().driver(driver).build());

        skillAssessment.setParkingScore(request.getParkingScore());
        skillAssessment.setTrafficHandling(request.getTrafficHandlingScore());
        skillAssessment.setHighwayDriving(request.getHighwayDrivingScore());
        skillAssessment.setNightDriving(request.getNightDrivingScore());
        skillAssessment.setRoadAwareness(request.getRoadAwarenessScore());
        skillAssessmentRepository.save(skillAssessment);

        // 2. Calculate New Confidence Score
        int newConfidenceScore = (
                request.getParkingScore() +
                request.getTrafficHandlingScore() +
                request.getHighwayDrivingScore() +
                request.getNightDrivingScore() +
                request.getRoadAwarenessScore()
        ) / 5;

        // 3. Update Driver Profile
        DriverProfile driverProfile = driverProfileRepository.findByUserId(driver.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        int oldScore = driverProfile.getConfidenceScore() != null ? driverProfile.getConfidenceScore() : 50;
        driverProfile.setConfidenceScore(newConfidenceScore);
        driverProfile.setStreakDays(driverProfile.getStreakDays() + 1); // Increment streak on feedback submission
        driverProfileRepository.save(driverProfile);

        int confidenceGain = newConfidenceScore - oldScore;

        // 4. Generate AI Recommendations Locally (Heuristic-based)
        String aiSuggestions = generateLocalAiSuggestions(booking.getSkillFocus(), request);

        // 5. Create Feedback Entity
        Feedback feedback = Feedback.builder()
                .booking(booking)
                .mentor(mentor)
                .driver(driver)
                .rating(request.getRating())
                .verbalFeedback(request.getVerbalFeedback())
                .strengths(String.join(", ", request.getStrengths()))
                .weaknesses(String.join(", ", request.getWeaknesses()))
                .suggestions(aiSuggestions)
                .parkingScore(request.getParkingScore())
                .trafficHandlingScore(request.getTrafficHandlingScore())
                .highwayDrivingScore(request.getHighwayDrivingScore())
                .nightDrivingScore(request.getNightDrivingScore())
                .roadAwarenessScore(request.getRoadAwarenessScore())
                .confidenceGain(confidenceGain)
                .build();

        Feedback savedFeedback = feedbackRepository.save(feedback);

        // 6. Save Progress Snapshot
        long completedSessionsCount = bookingRepository.countByDriverIdAndStatus(driver.getId(), "COMPLETED");
        ProgressReport progressReport = ProgressReport.builder()
                .driver(driver)
                .recordDate(LocalDate.now())
                .confidenceScore(newConfidenceScore)
                .hoursCompleted(driverProfile.getHoursPracticed())
                .sessionsCompleted((int) completedSessionsCount)
                .build();
        progressReportRepository.save(progressReport);

        // 7. Check & Unlock Achievements
        checkAndUnlockAchievements(driver, newConfidenceScore, request, (int) completedSessionsCount);

        // 8. Notify Driver
        notificationService.createNotification(
                driver,
                "New AI Driving Insights",
                "Mentor " + mentor.getFullName() + " submitted your session report. Your confidence score updated to " + newConfidenceScore + "% (Change: " + (confidenceGain >= 0 ? "+" : "") + confidenceGain + "%). Read feedback insights."
        );

        return savedFeedback;
    }

    private String generateLocalAiSuggestions(String focus, FeedbackRequest request) {
        List<String> bulletPoints = new ArrayList<>();

        bulletPoints.add("Target Focus Assessment: You practiced '" + focus + "' during this session. Your mentor evaluated your overall control level.");

        // Skill based advice
        if (request.getParkingScore() < 60) {
            bulletPoints.add("Parking Check: Your parking alignment is low. Focus on matching reference lines. Try starting your steering lock only when your rear wheel is aligned with the bumper of the adjacent vehicle.");
        } else if (request.getParkingScore() >= 80) {
            bulletPoints.add("Parking Check: Excellent spatial control! Your parallel and reverse parking display solid control.");
        }

        if (request.getTrafficHandlingScore() < 60) {
            bulletPoints.add("Traffic Handling: You struggled with high-density Indian traffic. Practice clutch control in low-speed conditions and improve mirror scans (internal and side mirrors) every 8-10 seconds.");
        }

        if (request.getHighwayDrivingScore() < 60) {
            bulletPoints.add("Highway merging: Practice acceleration lanes. Make sure you match cruising speeds before merging to avoid forcing high-speed vehicles to brake.");
        }

        if (request.getNightDrivingScore() < 60) {
            bulletPoints.add("Night Control: Twilight and dark conditions require high awareness. Toggle high-beams responsibly when encountering oncoming traffic on undivided roads to avoid blinding other drivers.");
        }

        if (request.getRoadAwarenessScore() < 60) {
            bulletPoints.add("Road Awareness: Focus on lane discipline. Avoid weaving across lanes without signalling and verify blind spots early.");
        }

        // Add advice based on selected weaknesses
        if (request.getWeaknesses() != null && !request.getWeaknesses().isEmpty()) {
            bulletPoints.add("Improvement Focus: Address the weaknesses listed (" + String.join(", ", request.getWeaknesses()) + "). We recommend practicing clutch bite points and progressive braking control in empty lots.");
        }

        bulletPoints.add("Practice Recommendation: Try practicing driving in quiet sub-urban roads for 30 minutes daily before taking on city highways.");

        return String.join("\n\n", bulletPoints);
    }

    private void checkAndUnlockAchievements(User driver, int confidenceScore, FeedbackRequest request, int completedSessions) {
        // Achievement Helper
        if (completedSessions == 1) {
            unlockBadge(driver, "First Drive", "Completed your very first practical session with DriveMentor.");
        }
        if (confidenceScore >= 80) {
            unlockBadge(driver, "Safe Driver", "Achieved an overall driving confidence score of 80% or higher.");
        }
        if (request.getParkingScore() >= 85) {
            unlockBadge(driver, "Parking Expert", "Demonstrated precise control in parallel and reverse parking evaluations.");
        }
        if (request.getTrafficHandlingScore() >= 85) {
            unlockBadge(driver, "Traffic Warrior", "Mastered bumper-to-bumper city traffic conditions with high control.");
        }
        if (request.getHighwayDrivingScore() >= 85) {
            unlockBadge(driver, "Highway Hero", "Demonstrated confident high-speed lane control and merging capabilities.");
        }
    }

    private void unlockBadge(User driver, String badgeName, String description) {
        if (!achievementRepository.existsByDriverIdAndBadgeName(driver.getId(), badgeName)) {
            Achievement achievement = Achievement.builder()
                    .driver(driver)
                    .badgeName(badgeName)
                    .description(description)
                    .build();
            achievementRepository.save(achievement);

            notificationService.createNotification(
                    driver,
                    "🏆 Achievement Unlocked: " + badgeName,
                    "Congratulations! You've earned the '" + badgeName + "' badge: " + description
            );
        }
    }
}
