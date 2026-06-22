package com.drivementor.service;

import com.drivementor.config.JwtService;
import com.drivementor.dto.AuthResponse;
import com.drivementor.dto.LoginRequest;
import com.drivementor.dto.RegisterRequest;
import com.drivementor.entity.*;
import com.drivementor.repository.DriverProfileRepository;
import com.drivementor.repository.MentorProfileRepository;
import com.drivementor.repository.SkillAssessmentRepository;
import com.drivementor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final MentorProfileRepository mentorProfileRepository;
    private final SkillAssessmentRepository skillAssessmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(request.getRole())
                .city(request.getCity())
                .profilePicture("https://api.dicebear.com/7.x/bottts/svg?seed=" + request.getFullName().replaceAll("\\s+", ""))
                .build();

        User savedUser = userRepository.save(user);

        if (request.getRole() == Role.DRIVER) {
            DriverProfile driverProfile = DriverProfile.builder()
                    .user(savedUser)
                    .confidenceScore(50) // starting score
                    .hoursPracticed(0.0)
                    .weeklyGoalHours(5.0)
                    .streakDays(0)
                    .licenseNumber(request.getLicenseNumber())
                    .vehicleTypePreference(request.getVehicleTypePreference() != null ? request.getVehicleTypePreference() : "BOTH")
                    .build();
            driverProfileRepository.save(driverProfile);

            SkillAssessment skillAssessment = SkillAssessment.builder()
                    .driver(savedUser)
                    .parkingScore(50)
                    .trafficHandling(50)
                    .highwayDriving(50)
                    .nightDriving(50)
                    .roadAwareness(50)
                    .build();
            skillAssessmentRepository.save(skillAssessment);
        } else if (request.getRole() == Role.MENTOR) {
            MentorProfile mentorProfile = MentorProfile.builder()
                    .user(savedUser)
                    .experienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 5)
                    .languages(request.getLanguages() != null ? request.getLanguages() : "English, Hindi")
                    .vehicleTypes(request.getVehicleTypes() != null ? request.getVehicleTypes() : "Manual, Automatic")
                    .hourlyRate(request.getHourlyRate() != null ? request.getHourlyRate() : 500.0)
                    .bio(request.getBio() != null ? request.getBio() : "Experienced driving mentor dedicated to building road confidence.")
                    .rating(5.0)
                    .isVerified(false) // requires admin approval
                    .licenseNumber(request.getLicenseNumber())
                    .build();
            mentorProfileRepository.save(mentorProfile);
        }

        String jwtToken = jwtService.generateToken(savedUser);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole())
                .city(savedUser.getCity())
                .profilePicture(savedUser.getProfilePicture())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .city(user.getCity())
                .profilePicture(user.getProfilePicture())
                .build();
    }
}
