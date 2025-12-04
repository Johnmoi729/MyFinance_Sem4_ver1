package com.myfinance.dto.response;

import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Builder
public class UserPreferencesResponse {
    private Long id;
    private Long userId;

    // Display Preferences
    private String language;
    private String currency;
    private String dateFormat;
    private String timezone;
    private String theme;
    private Integer itemsPerPage;
    private String viewMode;

    // Notification Preferences
    private Boolean emailNotifications;
    private Boolean budgetAlerts;
    private Boolean transactionReminders;
    private Boolean weeklySummary;
    private Boolean monthlySummary;
    private Boolean goalReminders;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
