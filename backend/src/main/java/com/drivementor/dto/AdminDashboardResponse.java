package com.drivementor.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class AdminDashboardResponse {
    private Long totalDrivers;
    private Long totalMentors;
    private Long totalBookings;
    private Double totalRevenue;
    private Map<String, Long> cityWiseUsage;
    private List<Map<String, Object>> growthData;
}
