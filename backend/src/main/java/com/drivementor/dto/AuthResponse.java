package com.drivementor.dto;

import com.drivementor.entity.Role;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UUID id;
    private String email;
    private String fullName;
    private Role role;
    private String city;
    private String profilePicture;
}
