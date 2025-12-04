package com.myfinance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private Long userId;

    // Display Preferences
    @Column(name = "language")
    private String language = "vi"; // vi, en

    @Column(name = "currency")
    private String currency = "VND"; // VND, USD, EUR

    @Column(name = "date_format")
    private String dateFormat = "dd/MM/yyyy"; // dd/MM/yyyy, MM/dd/yyyy, yyyy-MM-dd

    @Column(name = "timezone")
    private String timezone = "Asia/Ho_Chi_Minh";

    @Column(name = "theme")
    private String theme = "light"; // light, dark

    @Column(name = "items_per_page")
    private Integer itemsPerPage = 10; // 5, 10, 20, 50

    @Column(name = "view_mode")
    private String viewMode = "detailed"; // detailed, compact

    // Notification Preferences
    @Column(name = "email_notifications")
    private Boolean emailNotifications = true;

    @Column(name = "budget_alerts")
    private Boolean budgetAlerts = true;

    @Column(name = "transaction_reminders")
    private Boolean transactionReminders = false;

    @Column(name = "weekly_summary")
    private Boolean weeklySummary = false;

    @Column(name = "monthly_summary")
    private Boolean monthlySummary = true;

    @Column(name = "goal_reminders")
    private Boolean goalReminders = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
