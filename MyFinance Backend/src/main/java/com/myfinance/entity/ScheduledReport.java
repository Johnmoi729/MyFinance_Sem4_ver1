package com.myfinance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "scheduled_reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "report_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private ReportType reportType;

    @Column(name = "frequency", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ScheduleFrequency frequency;

    @Column(name = "format", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private ReportFormat format;

    @Column(name = "email_delivery", nullable = false)
    private Boolean emailDelivery = true;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "last_run")
    private LocalDateTime lastRun;

    @Column(name = "next_run")
    private LocalDateTime nextRun;

    @Column(name = "run_count")
    private Integer runCount = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (nextRun == null) {
            nextRun = calculateNextRun();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Calculate next run time based on frequency
     */
    public LocalDateTime calculateNextRun() {
        LocalDateTime base = lastRun != null ? lastRun : LocalDateTime.now();

        return switch (frequency) {
            case DAILY -> base.plusDays(1);
            case WEEKLY -> base.plusWeeks(1);
            case MONTHLY -> base.plusMonths(1);
            case QUARTERLY -> base.plusMonths(3);
            case YEARLY -> base.plusYears(1);
        };
    }

    /**
     * Check if report should run now
     */
    public boolean shouldRun() {
        if (!isActive) return false;
        if (nextRun == null) return true;
        return LocalDateTime.now().isAfter(nextRun);
    }

    public enum ReportType {
        MONTHLY,
        YEARLY,
        CATEGORY
    }

    public enum ScheduleFrequency {
        DAILY,
        WEEKLY,
        MONTHLY,
        QUARTERLY,
        YEARLY
    }

    public enum ReportFormat {
        PDF,
        CSV,
        BOTH
    }
}
