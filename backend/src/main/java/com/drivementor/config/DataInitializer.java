package com.drivementor.config;

import com.drivementor.entity.*;
import com.drivementor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final MentorProfileRepository mentorProfileRepository;
    private final SkillAssessmentRepository skillAssessmentRepository;
    private final BookingRepository bookingRepository;
    private final FeedbackRepository feedbackRepository;
    private final ProgressReportRepository progressReportRepository;
    private final AchievementRepository achievementRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Database is already seeded. Skipping initial seeding.");
            return;
        }

        System.out.println("Seeding database with realistic Indian data for DriveMentor...");

        // 1. Create Admin
        User admin = User.builder()
                .email("admin@drivementor.com")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Rajesh Iyer")
                .phone("9876543210")
                .role(Role.ADMIN)
                .city("Bengaluru")
                .profilePicture("https://api.dicebear.com/7.x/bottts/svg?seed=RajeshIyer")
                .build();
        userRepository.save(admin);

        // 2. Create 10 Mentors
        List<User> mentorUsers = new ArrayList<>();
        List<MentorProfile> mentorProfiles = new ArrayList<>();

        String[] mentorNames = {
                "Amit Mishra", "Rajesh Kumar", "Sunita Rao", "Devendra Singh", "Manisha Patil",
                "Prakash Jha", "Suresh G", "Laxmi Narayan", "Anand K", "Nitin Desai"
        };
        String[] mentorCities = {
                "Bengaluru", "Chennai", "Hyderabad", "Mumbai", "Delhi",
                "Pune", "Kochi", "Coimbatore", "Madurai", "Ahmedabad"
        };
        String[] mentorBios = {
                "Ex-maruti driving school instructor with 15+ years of teaching defensive driving techniques.",
                "Patient driving coach specialized in helping nervous drivers conquer bumper-to-bumper city traffic.",
                "Dedicated coach focusing on night driving confidence, lane discipline, and blind-spot checks.",
                "Specialist in highway driving, high-speed merging, and long-distance driving safety.",
                "Empathetic instructor with 10 years experience helping senior citizens and new mothers resume driving.",
                "Experienced instructor focused on defensive driving, parallel parking, and reverse bay parking.",
                "Focused on city traffic navigation and clutch control for manual vehicle drivers.",
                "Certified trainer with focus on road signs, safety rules, and rain driving.",
                "Friendly driving mentor providing low-stress driving sessions in Chennai suburbs.",
                "Automotive enthusiast teaching performance road safety, highway awareness, and parking mastery."
        };
        String[] mentorLanguages = {
                "English, Hindi, Kannada", "English, Tamil", "English, Telugu", "English, Hindi, Punjabi", "English, Marathi",
                "English, Hindi, Bihari", "English, Tamil, Malayalam", "English, Telugu, Tamil", "English, Tamil", "English, Gujarati, Hindi"
        };
        Double[] mentorRates = {500.0, 450.0, 550.0, 600.0, 480.0, 500.0, 400.0, 520.0, 460.0, 580.0};
        Integer[] mentorExp = {12, 8, 10, 15, 9, 11, 7, 13, 8, 14};

        for (int i = 0; i < mentorNames.length; i++) {
            User mUser = User.builder()
                    .email("mentor" + (i + 1) + "@drivementor.com")
                    .password(passwordEncoder.encode("password"))
                    .fullName(mentorNames[i])
                    .phone("98765432" + (10 + i))
                    .role(Role.MENTOR)
                    .city(mentorCities[i])
                    .profilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=" + mentorNames[i].replaceAll("\\s+", ""))
                    .build();
            User savedMUser = userRepository.save(mUser);
            mentorUsers.add(savedMUser);

            MentorProfile mProfile = MentorProfile.builder()
                    .user(savedMUser)
                    .experienceYears(mentorExp[i])
                    .languages(mentorLanguages[i])
                    .vehicleTypes("Manual, Automatic")
                    .hourlyRate(mentorRates[i])
                    .rating(4.5 + (i % 5) * 0.1) // 4.5 to 4.9
                    .isVerified(i < 8) // Seed 8 verified and 2 unverified mentors
                    .bio(mentorBios[i])
                    .licenseNumber("DL-IN-MENTOR-" + (1000 + i))
                    .build();
            mentorProfiles.add(mentorProfileRepository.save(mProfile));
        }

        // 3. Create 20 Drivers
        List<User> driverUsers = new ArrayList<>();
        List<DriverProfile> driverProfiles = new ArrayList<>();

        String[] driverNames = {
                "Priya Sharma", "Arjun Das", "Sneha Iyer", "Vikram Patel", "Rohit Verma",
                "Ananya Sen", "Deepa Nair", "Karan Malhotra", "Aishwarya Rao", "Rohan Gupta",
                "Meera Joshi", "Siddharth Shah", "Pooja Bhatia", "Vivek Nair", "Sanjay Sen",
                "Rahul Bose", "Neha Reddy", "Sunil Dutta", "Preeti Gill", "Tanvi Rao"
        };
        String[] driverCities = {
                "Chennai", "Bengaluru", "Chennai", "Mumbai", "Delhi",
                "Kochi", "Kochi", "Bengaluru", "Hyderabad", "Pune",
                "Ahmedabad", "Mumbai", "Delhi", "Coimbatore", "Madurai",
                "Bengaluru", "Hyderabad", "Pune", "Coimbatore", "Madurai"
        };
        String[] licensePrefs = {"AUTOMATIC", "MANUAL", "BOTH", "AUTOMATIC", "MANUAL", "BOTH", "AUTOMATIC", "MANUAL", "BOTH", "AUTOMATIC", "MANUAL", "BOTH", "AUTOMATIC", "MANUAL", "BOTH", "AUTOMATIC", "MANUAL", "BOTH", "AUTOMATIC", "MANUAL"};

        for (int i = 0; i < driverNames.length; i++) {
            User dUser = User.builder()
                    .email("driver" + (i + 1) + "@drivementor.com")
                    .password(passwordEncoder.encode("password"))
                    .fullName(driverNames[i])
                    .phone("98765431" + (10 + i))
                    .role(Role.DRIVER)
                    .city(driverCities[i])
                    .profilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=" + driverNames[i].replaceAll("\\s+", ""))
                    .build();
            User savedDUser = userRepository.save(dUser);
            driverUsers.add(savedDUser);

            // Starting confidence and practice stats
            int initialConfidence = 45 + (i * 2); // 45 to 83
            double initialHours = i * 2.5; // 0 to 47.5

            DriverProfile dProfile = DriverProfile.builder()
                    .user(savedDUser)
                    .confidenceScore(initialConfidence)
                    .hoursPracticed(initialHours)
                    .weeklyGoalHours(5.0)
                    .streakDays(i % 5)
                    .licenseNumber("DL-IN-DRIVER-" + (2000 + i))
                    .vehicleTypePreference(licensePrefs[i])
                    .build();
            driverProfiles.add(driverProfileRepository.save(dProfile));

            // Starting Skill Assessment
            SkillAssessment assessment = SkillAssessment.builder()
                    .driver(savedDUser)
                    .parkingScore(initialConfidence - 5)
                    .trafficHandling(initialConfidence - 2)
                    .highwayDriving(initialConfidence + 5)
                    .nightDriving(initialConfidence - 1)
                    .roadAwareness(initialConfidence)
                    .build();
            skillAssessmentRepository.save(assessment);

            // Unlock a badge for experienced students
            if (initialHours >= 15.0) {
                achievementRepository.save(Achievement.builder()
                        .driver(savedDUser)
                        .badgeName("First Drive")
                        .description("Completed your very first practical session with DriveMentor.")
                        .build());
            }
            if (initialConfidence >= 70) {
                achievementRepository.save(Achievement.builder()
                        .driver(savedDUser)
                        .badgeName("Safe Driver")
                        .description("Achieved an overall driving confidence score of 80% or higher.")
                        .build());
            }
        }

        // 4. Seed Bookings & Feedbacks (around 100 sessions)
        String[] timeSlots = {"07:00 AM - 08:30 AM", "09:00 AM - 10:30 AM", "11:00 AM - 12:30 PM", "03:00 PM - 04:30 PM", "05:00 PM - 06:30 PM", "07:00 PM - 08:30 PM"};
        String[] skillFocusAreas = {"City Driving", "Parking", "Reverse Parking", "Traffic Navigation", "Night Driving", "Highway Driving", "Rain Driving"};
        String[] verbalFeedbacks = {
                "Excellent lane discipline and speed control. Need to work on parking steering adjustment.",
                "Good clutch control in high traffic. Remained calm. Keep checking side mirrors during merging.",
                "Conducted a great highway session. Kept safe following distance. Excellent lane changing mirror checks.",
                "First drive today. Driver was nervous initially but gained confidence with clutch control. Good start.",
                "Night session. Kept a check on headlight beams. Need to practice blind-spot checks on left turns.",
                "Excellent progress. Parallel parking is now perfect. Keep practicing reverse bay parking.",
                "Familiarized with road signs and lane changing. Driver did well under heavy rain conditions.",
                "Great improvement in traffic navigation. Braking was progressive and smooth. Maintain low speeds."
        };

        Random rand = new Random(42); // Seeded random for reproducible data

        for (int bIndex = 0; bIndex < 100; bIndex++) {
            // Pick a driver and a mentor
            User driver = driverUsers.get(bIndex % driverUsers.size());
            User mentor = mentorUsers.get(bIndex % mentorUsers.size());

            // Dates ranging from 30 days ago to 7 days in future
            int daysOffset = (bIndex % 37) - 30; // -30 to +6 days
            LocalDate bookingDate = LocalDate.now().plusDays(daysOffset);

            String status;
            if (daysOffset >= 0) {
                // Future bookings
                status = (daysOffset % 3 == 0) ? "PENDING" : "ACCEPTED";
            } else {
                // Past bookings
                status = (bIndex % 15 == 0) ? "REJECTED" : "COMPLETED";
            }

            String skill = skillFocusAreas[bIndex % skillFocusAreas.length];
            String slot = timeSlots[bIndex % timeSlots.length];
            double rate = mentorProfiles.get(bIndex % mentorProfiles.size()).getHourlyRate();
            double cost = rate * 1.5; // 1.5 hour session

            Booking booking = Booking.builder()
                    .driver(driver)
                    .mentor(mentor)
                    .date(bookingDate)
                    .timeSlot(slot)
                    .skillFocus(skill)
                    .status(status)
                    .amountPaid(cost)
                    .build();
            Booking savedBooking = bookingRepository.save(booking);

            // If COMPLETED, write a Feedback record
            if ("COMPLETED".equals(status)) {
                int baseScore = 60 + rand.nextInt(30); // 60-90
                int pScore = baseScore + (bIndex % 7 == 1 ? -15 : 5);
                int tScore = baseScore + (bIndex % 7 == 3 ? -10 : 3);
                int hScore = baseScore + (bIndex % 7 == 5 ? -12 : 8);
                int nScore = baseScore + (bIndex % 7 == 0 ? -15 : 4);
                int rScore = baseScore;

                int ratingVal = 3 + rand.nextInt(3); // 3, 4, 5 stars
                ratingVal = Math.min(5, ratingVal);

                List<String> dStrengths = new ArrayList<>();
                List<String> dWeaknesses = new ArrayList<>();

                if (hScore > 75) dStrengths.add("Highway Merging");
                if (pScore > 75) dStrengths.add("Parallel Parking");
                if (tScore > 75) dStrengths.add("Clutch Control");
                if (dStrengths.isEmpty()) dStrengths.add("Steady Speed Limit");

                if (pScore < 65) dWeaknesses.add("Reverse Bay Parking");
                if (tScore < 65) dWeaknesses.add("Mirror Checks");
                if (nScore < 65) dWeaknesses.add("High-beam control");
                if (dWeaknesses.isEmpty()) dWeaknesses.add("Sudden braking");

                String advice = "AI Recommendations:\n" +
                        "1. Strengthen your '" + skill + "' by practicing in empty spaces.\n" +
                        "2. Ensure you check side mirrors before lane changing.\n" +
                        "3. Practice smooth clutch engagement at lower gears.";

                Feedback feedback = Feedback.builder()
                        .booking(savedBooking)
                        .mentor(mentor)
                        .driver(driver)
                        .rating(ratingVal)
                        .verbalFeedback(verbalFeedbacks[bIndex % verbalFeedbacks.length])
                        .strengths(String.join(", ", dStrengths))
                        .weaknesses(String.join(", ", dWeaknesses))
                        .suggestions(advice)
                        .parkingScore(Math.min(100, Math.max(0, pScore)))
                        .trafficHandlingScore(Math.min(100, Math.max(0, tScore)))
                        .highwayDrivingScore(Math.min(100, Math.max(0, hScore)))
                        .nightDrivingScore(Math.min(100, Math.max(0, nScore)))
                        .roadAwarenessScore(Math.min(100, Math.max(0, rScore)))
                        .confidenceGain(rand.nextInt(8) + 1) // +1 to +8 confidence
                        .build();
                feedbackRepository.save(feedback);
            }
        }

        // 5. Seed historical ProgressReports for first 5 drivers to show Recharts growth curves
        for (int i = 0; i < 5; i++) {
            User driver = driverUsers.get(i);
            int baseConf = 45 + (i * 5);
            for (int week = 4; week >= 0; week--) {
                ProgressReport report = ProgressReport.builder()
                        .driver(driver)
                        .recordDate(LocalDate.now().minusWeeks(week))
                        .confidenceScore(baseConf + ((4 - week) * 5)) // confidence grows by 5% every week
                        .hoursCompleted(i * 1.5 + (4 - week) * 3.0)
                        .sessionsCompleted((4 - week) * 2)
                        .build();
                progressReportRepository.save(report);
            }
        }

        // 6. Seed some Notifications
        for (int i = 0; i < 5; i++) {
            notificationRepository.save(Notification.builder()
                    .user(driverUsers.get(i))
                    .title("Welcome to DriveMentor!")
                    .message("Start by looking up mentors in " + driverUsers.get(i).getCity() + " and scheduling your first City traffic session.")
                    .isRead(false)
                    .build());
        }

        System.out.println("Database seeding completed successfully!");
    }
}
