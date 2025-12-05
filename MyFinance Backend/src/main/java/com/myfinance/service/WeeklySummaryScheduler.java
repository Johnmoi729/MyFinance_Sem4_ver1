package com.myfinance.service;

import com.myfinance.dto.response.MonthlyReportResponse;
import com.myfinance.entity.Transaction;
import com.myfinance.entity.TransactionType;
import com.myfinance.entity.User;
import com.myfinance.repository.TransactionRepository;
import com.myfinance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Scheduler service to send weekly financial summary emails
 * Runs automatically every Monday at 8:00 AM
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WeeklySummaryScheduler {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final EmailService emailService;

    /**
     * Send weekly summary emails to all active users
     * Runs every Monday at 8:00 AM
     * Cron: second minute hour day month day-of-week (MON=1)
     */
    @Scheduled(cron = "0 0 8 * * MON") // 8:00 AM every Monday
    public void sendWeeklySummaryToAllUsers() {
        log.info("Starting weekly summary email scheduler...");

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7); // Last 7 days

        List<User> activeUsers = userRepository.findByIsActive(true);
        log.info("Found {} active users to send weekly summary", activeUsers.size());

        int successCount = 0;
        int failCount = 0;

        for (User user : activeUsers) {
            try {
                sendWeeklySummaryToUser(user, startDate, endDate);
                successCount++;
            } catch (Exception e) {
                log.error("Failed to send weekly summary to user: {}", user.getEmail(), e);
                failCount++;
            }
        }

        log.info("Weekly summary email scheduler completed. Success: {}, Failed: {}", successCount, failCount);
    }

    /**
     * Send weekly summary email to a specific user
     * Can be called manually for testing
     */
    public void sendWeeklySummaryToUser(User user, LocalDate startDate, LocalDate endDate) {
        try {
            // Get transactions for the week
            List<Transaction> transactions = transactionRepository.findByUserIdAndDateRange(
                    user.getId(), startDate, endDate
            );

            // Calculate totals
            BigDecimal totalIncome = transactions.stream()
                    .filter(t -> t.getType() == TransactionType.INCOME)
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalExpense = transactions.stream()
                    .filter(t -> t.getType() == TransactionType.EXPENSE)
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal netSavings = totalIncome.subtract(totalExpense);

            // Calculate savings rate
            Double savingsRate = totalIncome.compareTo(BigDecimal.ZERO) > 0
                    ? netSavings.divide(totalIncome, 4, BigDecimal.ROUND_HALF_UP)
                            .multiply(BigDecimal.valueOf(100))
                            .doubleValue()
                    : 0.0;

            int transactionCount = transactions.size();

            // Send email
            emailService.sendWeeklySummaryEmail(
                    user.getId(),
                    user.getEmail(),
                    user.getFullName(),
                    startDate,
                    endDate,
                    totalIncome,
                    totalExpense,
                    netSavings,
                    savingsRate,
                    transactionCount
            );

            log.info("Weekly summary email sent to: {} for {}/{}",
                    user.getEmail(), startDate, endDate);
        } catch (Exception e) {
            log.error("Failed to send weekly summary to user: {} for {}/{}",
                    user.getEmail(), startDate, endDate, e);
            throw e; // Re-throw to count as failure
        }
    }

    /**
     * Manual trigger for testing - send last week's summary to a specific user
     */
    public void sendLastWeekSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);

        sendWeeklySummaryToUser(user, startDate, endDate);
        log.info("Last week summary sent manually to user: {}", user.getEmail());
    }
}
