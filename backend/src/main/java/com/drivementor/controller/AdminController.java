package com.drivementor.controller;

import com.drivementor.dto.AdminDashboardResponse;
import com.drivementor.entity.MentorProfile;
import com.drivementor.entity.User;
import com.drivementor.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/analytics")
    public ResponseEntity<AdminDashboardResponse> getAnalytics() {
        return ResponseEntity.ok(adminService.getAdminDashboard());
    }

    @GetMapping("/mentors/pending")
    public ResponseEntity<List<MentorProfile>> getPendingMentors() {
        return ResponseEntity.ok(adminService.getPendingMentors());
    }

    @PutMapping("/mentors/{id}/verify")
    public ResponseEntity<Void> verifyMentor(@PathVariable UUID id) {
        adminService.verifyMentor(id);
        return ResponseEntity.ok().build();
    }
}
