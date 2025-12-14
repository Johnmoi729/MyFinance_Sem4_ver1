package com.myfinance.dto.request;

import lombok.Data;

@Data
public class UserPreferencesRequest {
    // Display Preferences (1 field)
    private String viewMode; // Controls budget view display (usage/basic)

    // Notification Preferences (2 fields)
    private Boolean emailNotifications; // Master email switch
    private Boolean budgetAlerts; // Budget alert emails
}
