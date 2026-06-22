package com.drivementor.dto;

import com.drivementor.entity.Booking;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class MentorDashboardResponse {
    private Double earnings;
    private Double totalHours;
    private Double rating;
    private Boolean isVerified;
    private Long totalSessions;
    private List<Booking> pendingSessions;
    private List<Booking> upcomingSessions;
    private List<Booking> pastSessions;
}
