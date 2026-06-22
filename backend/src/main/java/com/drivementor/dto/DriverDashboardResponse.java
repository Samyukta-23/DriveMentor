package com.drivementor.dto;

import com.drivementor.entity.Booking;
import com.drivementor.entity.Feedback;
import com.drivementor.entity.Achievement;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DriverDashboardResponse {
    private Integer confidenceScore;
    private Double hoursPracticed;
    private Integer streakDays;
    private Double weeklyGoalHours;
    private Booking nextSession;
    private Map<String, Integer> skills;
    private List<Achievement> achievements;
    private Feedback recentFeedback;
    private List<String> aiRecommendations;
}
