package com.myfinance.service;

import com.myfinance.dto.response.MonthlyReportResponse;
import com.myfinance.entity.User;
import com.myfinance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Scheduler service to send monthly financial summary emails
 * Runs automatically on the 1st day of each month
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MonthlySummaryScheduler {

    private final UserRepository userRepository;
    private final ReportService reportService;
    private final EmailService emailService;

    /**
     * Send monthly summary emails to all active users
     * Runs on the 1st day of each month at 8:00 AM
     * Cron: second minute hour day month day-of-week
     */
    @Scheduled(cron = "0 0 8 1 * ?") // 8:00 AM on 1st day of every month
    public void sendMonthlySummaryToAllUsers() {
        log.info("Starting monthly summary email scheduler...");

        LocalDate today = LocalDate.now();
        int currentYear = today.getYear();
        int lastMonth = today.getMonthValue() == 1 ? 12 : today.getMonthValue() - 1;
        int yearForReport = today.getMonthValue() == 1 ? currentYear - 1 : currentYear;

        List<User> activeUsers = userRepository.findByIsActive(true);
        log.info("Found {} active users to send monthly summary", activeUsers.size());

        int successCount = 0;
        int failCount = 0;

        for (User user : activeUsers) {
            try {
                sendMonthlySummaryToUser(user, yearForReport, lastMonth);
                successCount++;
            } catch (Exception e) {
                log.error("Failed to send monthly summary to user: {}", user.getEmail(), e);
                failCount++;
            }
        }

        log.info("Monthly summary email scheduler completed. Success: {}, Failed: {}", successCount, failCount);
    }

    /**
     * Send monthly summary email to a specific user
     * Can be called manually for testing
     */
    public void sendMonthlySummaryToUser(User user, int year, int month) {
        try {
            // Generate monthly report
            MonthlyReportResponse report = reportService.generateMonthlySummary(user.getId(), year, month);

            // Send email
            emailService.sendMonthlySummaryEmail(
                    user.getEmail(),
                    user.getFullName(),
                    year,
                    month,
                    report.getTotalIncome(),
                    report.getTotalExpense(),
                    report.getNetSavings(),
                    report.getSavingsRate()
            );

            log.info("Monthly summary email sent to: {} for {}/{}", user.getEmail(), month, year);
        } catch (Exception e) {
            log.error("Failed to send monthly summary to user: {} for {}/{}", user.getEmail(), month, year, e);
            throw e; // Re-throw to count as failure
        }
    }

    /**
     * Manual trigger for testing - send last month's summary to a specific user
     */
    public void sendLastMonthSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        LocalDate today = LocalDate.now();
        int lastMonth = today.getMonthValue() == 1 ? 12 : today.getMonthValue() - 1;
        int year = today.getMonthValue() == 1 ? today.getYear() - 1 : today.getYear();

        sendMonthlySummaryToUser(user, year, lastMonth);
        log.info("Last month summary sent manually to user: {}", user.getEmail());
    }
}
