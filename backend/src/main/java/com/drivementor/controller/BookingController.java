package com.drivementor.controller;

import com.drivementor.dto.BookingRequest;
import com.drivementor.dto.FeedbackRequest;
import com.drivementor.entity.Booking;
import com.drivementor.entity.Feedback;
import com.drivementor.entity.User;
import com.drivementor.service.BookingService;
import com.drivementor.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody BookingRequest request,
            @AuthenticationPrincipal User user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(bookingService.createBooking(user, request));
    }

    @GetMapping("/driver")
    public ResponseEntity<List<Booking>> getDriverBookings(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(bookingService.getDriverBookings(user));
    }

    @GetMapping("/mentor")
    public ResponseEntity<List<Booking>> getMentorBookings(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(bookingService.getMentorBookings(user));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        String status = payload.get("status");
        if (status == null) {
            throw new IllegalArgumentException("Status field is required");
        }
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, user));
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<Feedback> submitFeedback(
            @PathVariable UUID id,
            @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal User user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(feedbackService.submitFeedback(id, request, user));
    }
}
