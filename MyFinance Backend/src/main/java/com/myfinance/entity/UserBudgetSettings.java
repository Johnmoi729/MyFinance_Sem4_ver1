package com.myfinance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_budget_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBudgetSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "warning_threshold", nullable = false)
    private Double warningThreshold = 75.0; // Default 75%

    @Column(name = "critical_threshold", nullable = false)
    private Double criticalThreshold = 90.0; // Default 90%

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Helper methods
    public boolean isWarningThreshold(double usagePercentage) {
        return usagePercentage >= warningThreshold && usagePercentage < criticalThreshold;
    }

    public boolean isCriticalThreshold(double usagePercentage) {
        return usagePercentage >= criticalThreshold;
    }

    public String getThresholdStatus(double usagePercentage) {
        if (usagePercentage >= 100.0) {
            return "OVER_BUDGET";
        } else if (isCriticalThreshold(usagePercentage)) {
            return "CRITICAL";
        } else if (isWarningThreshold(usagePercentage)) {
            return "WARNING";
        } else {
            return "NORMAL";
        }
    }
}