package com.drivementor.dto;

import com.drivementor.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private Role role;
    private String city;

    // Driver Specific
    private String vehicleTypePreference;

    // Mentor Specific
    private Integer experienceYears;
    private String languages;
    private String vehicleTypes;
    private Double hourlyRate;
    private String bio;

    // Shared
    private String licenseNumber;
}
