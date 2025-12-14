package com.myfinance.dto.response;

import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Builder
public class UserPreferencesResponse {
    private Long id;
    private Long userId;

    // Display Preferences (1 field)
    private String viewMode; // Controls budget view display (usage/basic)

    // Notification Preferences (2 fields)
    private Boolean emailNotifications; // Master email switch
    private Boolean budgetAlerts; // Budget alert emails

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
