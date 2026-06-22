package com.drivementor.service;

import com.drivementor.dto.AdminDashboardResponse;
import com.drivementor.entity.Booking;
import com.drivementor.entity.MentorProfile;
import com.drivementor.entity.User;
import com.drivementor.exception.ResourceNotFoundException;
import com.drivementor.repository.BookingRepository;
import com.drivementor.repository.DriverProfileRepository;
import com.drivementor.repository.MentorProfileRepository;
import com.drivementor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final MentorProfileRepository mentorProfileRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final NotificationService notificationService;

    public AdminDashboardResponse getAdminDashboard() {
        long totalDrivers = driverProfileRepository.count();
        long totalMentors = mentorProfileRepository.count();
        long totalBookings = bookingRepository.count();

        // Calculate Revenue from completed bookings
        List<Booking> bookings = bookingRepository.findAll();
        double totalRevenue = bookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .mapToDouble(b -> b.getAmountPaid() != null ? b.getAmountPaid() : 0.0)
                .sum();

        // City wise usage distribution
        Map<String, Long> cityWiseUsage = bookings.stream()
                .filter(b -> b.getDriver() != null && b.getDriver().getCity() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getDriver().getCity(),
                        Collectors.counting()
                ));

        // Ensure target cities are populated in stats even with 0 counts
        List<String> cities = List.of("Chennai", "Coimbatore", "Madurai", "Bengaluru", "Hyderabad", "Mumbai", "Delhi", "Pune", "Kochi", "Ahmedabad");
        for (String city : cities) {
            cityWiseUsage.putIfAbsent(city, 0L);
        }

        // Mock Growth Data for charts
        List<Map<String, Object>> growthData = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            Map<String, Object> point = new HashMap<>();
            point.put("date", date.toString());
            point.put("users", totalDrivers + totalMentors - (i * 2));
            point.put("bookings", totalBookings - (i * 3));
            point.put("revenue", totalRevenue - (i * 1500));
            growthData.add(point);
        }

        return AdminDashboardResponse.builder()
                .totalDrivers(totalDrivers)
                .totalMentors(totalMentors)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .cityWiseUsage(cityWiseUsage)
                .growthData(growthData)
                .build();
    }

    public List<MentorProfile> getPendingMentors() {
        return mentorProfileRepository.findByIsVerifiedFalse();
    }

    @Transactional
    public void verifyMentor(UUID profileId) {
        MentorProfile profile = mentorProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));

        profile.setIsVerified(true);
        mentorProfileRepository.save(profile);

        // Notify Mentor
        notificationService.createNotification(
                profile.getUser(),
                "Profile Approved!",
                "Congratulations! An administrator has verified your credentials. Your profile is now live and visible in the marketplace."
        );
    }
}
