package com.myfinance.dto.request;

import lombok.Data;

@Data
public class UserPreferencesRequest {
    // Display Preferences
    private String language; // vi, en
    private String currency; // VND, USD, EUR
    private String dateFormat; // dd/MM/yyyy, MM/dd/yyyy, yyyy-MM-dd
    private String timezone;
    private String theme; // light, dark
    private Integer itemsPerPage; // 5, 10, 20, 50
    private String viewMode; // detailed, compact

    // Notification Preferences
    private Boolean emailNotifications;
    private Boolean budgetAlerts;
    private Boolean transactionReminders;
    private Boolean weeklySummary;
    private Boolean monthlySummary;
    private Boolean goalReminders;
}
