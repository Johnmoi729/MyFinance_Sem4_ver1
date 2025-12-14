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

    @Column(name = "scheduled_hour")
    private Integer scheduledHour; // 0-23, null = use current time

    @Column(name = "scheduled_minute")
    private Integer scheduledMinute = 0; // 0-59, default 0

    @Column(name = "scheduled_day_of_week")
    private Integer scheduledDayOfWeek; // 1-7 (Monday-Sunday), for WEEKLY

    @Column(name = "scheduled_day_of_month")
    private Integer scheduledDayOfMonth; // 1-31, for MONTHLY

    @Column(name = "last_manual_send")
    private LocalDateTime lastManualSend; // Last manual "Send Now" trigger (for rate limiting)

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
     * Calculate next run time based on frequency and specific time settings
     */
    public LocalDateTime calculateNextRun() {
        LocalDateTime base = lastRun != null ? lastRun : LocalDateTime.now();
        LocalDateTime next;

        // Calculate next date based on frequency
        next = switch (frequency) {
            case DAILY -> base.plusDays(1);
            case WEEKLY -> calculateNextWeekly(base);
            case MONTHLY -> calculateNextMonthly(base);
            case QUARTERLY -> base.plusMonths(3);
            case YEARLY -> base.plusYears(1);
        };

        // Set specific time if configured
        if (scheduledHour != null) {
            int minute = scheduledMinute != null ? scheduledMinute : 0;
            next = next.withHour(scheduledHour).withMinute(minute).withSecond(0).withNano(0);
        }

        return next;
    }

    /**
     * Calculate next weekly run time
     * If scheduledDayOfWeek is set, find next occurrence of that day
     */
    private LocalDateTime calculateNextWeekly(LocalDateTime base) {
        if (scheduledDayOfWeek != null) {
            // Find next occurrence of specified day
            LocalDateTime next = base.plusDays(1);
            while (next.getDayOfWeek().getValue() != scheduledDayOfWeek) {
                next = next.plusDays(1);
            }
            return next;
        }
        return base.plusWeeks(1);
    }

    /**
     * Calculate next monthly run time
     * If scheduledDayOfMonth is set, use that day (handle short months)
     */
    private LocalDateTime calculateNextMonthly(LocalDateTime base) {
        if (scheduledDayOfMonth != null) {
            LocalDateTime next = base.plusMonths(1);
            int lastDayOfMonth = next.toLocalDate().lengthOfMonth();
            int targetDay = Math.min(scheduledDayOfMonth, lastDayOfMonth);
            next = next.withDayOfMonth(targetDay);
            return next;
        }
        return base.plusMonths(1);
    }

    /**
     * Check if report should run now
     */
    public boolean shouldRun() {
        if (!isActive) return false;
        if (nextRun == null) return true;
        return LocalDateTime.now().isAfter(nextRun);
    }

    /**
     * Check if manual "Send Now" is allowed (10-second cooldown)
     * @return true if user can send manually, false if still in cooldown period
     */
    public boolean canSendManually() {
        if (lastManualSend == null) {
            return true; // Never sent manually before
        }
        LocalDateTime cooldownEnd = lastManualSend.plusSeconds(10);
        return LocalDateTime.now().isAfter(cooldownEnd);
    }

    /**
     * Get remaining cooldown time in seconds
     * @return seconds remaining, or 0 if no cooldown
     */
    public long getRemainingCooldownSeconds() {
        if (lastManualSend == null) {
            return 0;
        }
        LocalDateTime cooldownEnd = lastManualSend.plusSeconds(10);
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(cooldownEnd)) {
            return 0;
        }
        return java.time.Duration.between(now, cooldownEnd).getSeconds();
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
