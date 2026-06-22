package com.drivementor.controller;

import com.drivementor.dto.DriverDashboardResponse;
import com.drivementor.entity.Notification;
import com.drivementor.entity.ProgressReport;
import com.drivementor.entity.User;
import com.drivementor.service.DriverService;
import com.drivementor.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;
    private final NotificationService notificationService;

    @GetMapping("/dashboard")
    public ResponseEntity<DriverDashboardResponse> getDashboard(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(driverService.getDriverDashboard(user));
    }

    @GetMapping("/progress")
    public ResponseEntity<List<ProgressReport>> getProgress(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(driverService.getDriverProgress(user));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(notificationService.getNotificationsForUser(user));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<Void> markNotificationRead(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
