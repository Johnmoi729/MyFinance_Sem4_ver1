package com.myfinance.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AdminUserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Boolean isActive;
    private Boolean isEmailVerified;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // User statistics
    private Long totalTransactions;
    private Long totalBudgets;
    private Long totalCategories;

    // User roles
    private List<String> roles;

    // Activity summary
    private Long loginCount;
    private LocalDateTime lastActivity;
}