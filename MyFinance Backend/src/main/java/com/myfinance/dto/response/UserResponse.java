package com.myfinance.dto.response;

import lombok.Data;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;
    private String avatar;
    private Boolean isActive;
    private Boolean isEmailVerified;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> roles;
}