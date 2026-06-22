package com.drivementor.dto;

import lombok.Data;
import java.util.List;

@Data
public class FeedbackRequest {
    private Integer rating;
    private String verbalFeedback;
    private List<String> strengths;
    private List<String> weaknesses;
    private Integer parkingScore;
    private Integer trafficHandlingScore;
    private Integer highwayDrivingScore;
    private Integer nightDrivingScore;
    private Integer roadAwarenessScore;
}
