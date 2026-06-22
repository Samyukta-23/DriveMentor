package com.drivementor.service;

import com.drivementor.dto.BookingRequest;
import com.drivementor.entity.Booking;
import com.drivementor.entity.DriverProfile;
import com.drivementor.entity.User;
import com.drivementor.exception.ResourceNotFoundException;
import com.drivementor.repository.BookingRepository;
import com.drivementor.repository.DriverProfileRepository;
import com.drivementor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public Booking createBooking(User driver, BookingRequest request) {
        User mentor = userRepository.findById(request.getMentorId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        Booking booking = Booking.builder()
                .driver(driver)
                .mentor(mentor)
                .date(request.getDate())
                .timeSlot(request.getTimeSlot())
                .skillFocus(request.getSkillFocus())
                .status("PENDING")
                .amountPaid(request.getAmountPaid())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Notify Mentor
        notificationService.createNotification(
                mentor,
                "New Booking Request",
                "You have a new request from " + driver.getFullName() + " for " + request.getDate() + " (" + request.getTimeSlot() + ") focusing on " + request.getSkillFocus() + "."
        );

        return savedBooking;
    }

    public List<Booking> getDriverBookings(User driver) {
        return bookingRepository.findByDriverIdOrderByDateDesc(driver.getId());
    }

    public List<Booking> getMentorBookings(User mentor) {
        return bookingRepository.findByMentorIdOrderByDateDesc(mentor.getId());
    }

    @Transactional
    public Booking updateBookingStatus(UUID bookingId, String status, User user) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        String oldStatus = booking.getStatus();
        booking.setStatus(status.toUpperCase());
        Booking updatedBooking = bookingRepository.save(booking);

        // Create Notifications
        if ("ACCEPTED".equalsIgnoreCase(status)) {
            notificationService.createNotification(
                    booking.getDriver(),
                    "Booking Accepted!",
                    "Mentor " + booking.getMentor().getFullName() + " accepted your driving session for " + booking.getDate() + "."
            );
        } else if ("REJECTED".equalsIgnoreCase(status)) {
            notificationService.createNotification(
                    booking.getDriver(),
                    "Booking Declined",
                    "Mentor " + booking.getMentor().getFullName() + " was unavailable and declined your session request."
            );
        } else if ("COMPLETED".equalsIgnoreCase(status) && !"COMPLETED".equalsIgnoreCase(oldStatus)) {
            // Update driver practiced hours
            DriverProfile driverProfile = driverProfileRepository.findByUserId(booking.getDriver().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));
            driverProfile.setHoursPracticed(driverProfile.getHoursPracticed() + 1.5); // Add 1.5 hours per session
            driverProfileRepository.save(driverProfile);

            notificationService.createNotification(
                    booking.getDriver(),
                    "Session Completed",
                    "Your driving session on " + booking.getDate() + " with " + booking.getMentor().getFullName() + " is completed. View dashboard for scores and AI feedback!"
            );
            notificationService.createNotification(
                    booking.getMentor(),
                    "Submit Feedback",
                    "Please submit driving evaluations and ratings for " + booking.getDriver().getFullName() + "'s session on " + booking.getDate() + "."
            );
        }

        return updatedBooking;
    }
}
