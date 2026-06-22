package com.drivementor.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class BookingRequest {
    private UUID mentorId;
    private LocalDate date;
    private String timeSlot;
    private String skillFocus;
    private Double amountPaid;
}
