package com.drivementor.controller;

import com.drivementor.dto.MentorDashboardResponse;
import com.drivementor.entity.MentorProfile;
import com.drivementor.entity.User;
import com.drivementor.service.MentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/mentors")
@RequiredArgsConstructor
public class MentorController {

    private final MentorService mentorService;

    @GetMapping
    public ResponseEntity<List<MentorProfile>> searchMentors(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String vehicleType,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String searchQuery
    ) {
        return ResponseEntity.ok(mentorService.searchMentors(city, vehicleType, language, minExperience, minRating, searchQuery));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MentorProfile> getProfile(@PathVariable UUID id) {
        return ResponseEntity.ok(mentorService.getMentorProfile(id));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<MentorDashboardResponse> getDashboard(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(mentorService.getMentorDashboard(user));
    }
}
