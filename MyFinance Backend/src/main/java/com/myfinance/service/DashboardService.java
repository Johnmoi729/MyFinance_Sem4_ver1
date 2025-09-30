package com.myfinance.service;

import com.myfinance.dto.response.AdminDashboardResponse;
import com.myfinance.entity.Transaction;
import com.myfinance.entity.User;
import com.myfinance.repository.TransactionRepository;
import com.myfinance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final AuditService auditService;
    private final SystemConfigService systemConfigService;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        // Get user statistics
        AdminDashboardResponse.UserStats userStats = getUserStats();

        // Get transaction statistics
        AdminDashboardResponse.TransactionStats transactionStats = getTransactionStats();

        // Get system health
        AdminDashboardResponse.SystemHealth systemHealth = getSystemHealthInternal();

        // Get recent activities
        List<AdminDashboardResponse.RecentActivity> recentActivities = getRecentActivities();

        return AdminDashboardResponse.builder()
            .userStats(userStats)
            .transactionStats(transactionStats)
            .systemHealth(systemHealth)
            .recentActivities(recentActivities)
            .build();
    }

    @Transactional(readOnly = true)
    public List<Object> getUserActivityForDays(int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);

        List<Object> activities = new ArrayList<>();

        // Get daily user registrations
        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(23, 59, 59);

            Long registrations = userRepository.countByCreatedAtBetween(startOfDay, endOfDay);
            Long logins = userRepository.countByLastLoginBetween(startOfDay, endOfDay);

            Map<String, Object> dailyActivity = new HashMap<>();
            dailyActivity.put("date", date);
            dailyActivity.put("registrations", registrations);
            dailyActivity.put("logins", logins);

            activities.add(dailyActivity);
        }

        return activities;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getTransactionTrends(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> trends = new HashMap<>();

        // Get transactions in date range
        List<Transaction> transactions = transactionRepository.findByTransactionDateBetween(startDate, endDate);

        // Group by date
        Map<LocalDate, List<Transaction>> transactionsByDate = transactions.stream()
            .collect(Collectors.groupingBy(Transaction::getTransactionDate));

        // Calculate daily trends
        List<Map<String, Object>> dailyTrends = new ArrayList<>();
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            List<Transaction> dayTransactions = transactionsByDate.getOrDefault(currentDate, new ArrayList<>());

            BigDecimal income = dayTransactions.stream()
                .filter(t -> "INCOME".equals(t.getType().name()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal expense = dayTransactions.stream()
                .filter(t -> "EXPENSE".equals(t.getType().name()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> dayTrend = new HashMap<>();
            dayTrend.put("date", currentDate);
            dayTrend.put("income", income);
            dayTrend.put("expense", expense);
            dayTrend.put("netAmount", income.subtract(expense));
            dayTrend.put("transactionCount", dayTransactions.size());

            dailyTrends.add(dayTrend);
            currentDate = currentDate.plusDays(1);
        }

        trends.put("dailyTrends", dailyTrends);

        // Calculate summary statistics
        BigDecimal totalIncome = transactions.stream()
            .filter(t -> "INCOME".equals(t.getType().name()))
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = transactions.stream()
            .filter(t -> "EXPENSE".equals(t.getType().name()))
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        trends.put("totalIncome", totalIncome);
        trends.put("totalExpense", totalExpense);
        trends.put("netAmount", totalIncome.subtract(totalExpense));
        trends.put("totalTransactions", transactions.size());

        return trends;
    }

    @Transactional(readOnly = true)
    public Object getSystemHealth() {
        AdminDashboardResponse.SystemHealth systemHealth = getSystemHealthInternal();

        // Convert to Map for generic Object return type
        Map<String, Object> health = new HashMap<>();
        health.put("maintenanceMode", systemHealth.getMaintenanceMode());
        health.put("errorCount", systemHealth.getErrorCount());
        health.put("responseTime", systemHealth.getResponseTime());
        health.put("lastBackup", systemHealth.getLastBackup());
        health.put("status", systemHealth.getStatus());

        return health;
    }

    private AdminDashboardResponse.UserStats getUserStats() {
        Long totalUsers = userRepository.count();
        Long activeUsers = userRepository.countByIsActive(true);

        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        Long newUsersToday = userRepository.countByCreatedAtGreaterThanEqual(startOfDay);

        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        Long newUsersThisMonth = userRepository.countByCreatedAtGreaterThanEqual(startOfMonth);

        // Calculate growth percentage
        LocalDateTime startOfPrevMonth = startOfMonth.minusMonths(1);
        Long newUsersPrevMonth = userRepository.countByCreatedAtBetween(startOfPrevMonth, startOfMonth);

        Double growthPercentage = 0.0;
        if (newUsersPrevMonth > 0) {
            growthPercentage = ((double) (newUsersThisMonth - newUsersPrevMonth) / newUsersPrevMonth) * 100;
        } else if (newUsersThisMonth > 0) {
            growthPercentage = 100.0;
        }

        return AdminDashboardResponse.UserStats.builder()
            .totalUsers(totalUsers)
            .activeUsers(activeUsers)
            .newUsersToday(newUsersToday)
            .newUsersThisMonth(newUsersThisMonth)
            .growthPercentage(Math.round(growthPercentage * 100.0) / 100.0)
            .build();
    }

    private AdminDashboardResponse.TransactionStats getTransactionStats() {
        Long totalTransactions = transactionRepository.count();

        BigDecimal totalVolume = transactionRepository.findAll().stream()
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDate today = LocalDate.now();
        List<Transaction> todayTransactions = transactionRepository.findByTransactionDate(today);
        Long transactionsToday = (long) todayTransactions.size();

        BigDecimal volumeToday = todayTransactions.stream()
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Get top categories
        Map<String, Object> topCategories = getTopCategories();

        return AdminDashboardResponse.TransactionStats.builder()
            .totalTransactions(totalTransactions)
            .totalVolume(totalVolume)
            .transactionsToday(transactionsToday)
            .volumeToday(volumeToday)
            .topCategories(topCategories)
            .build();
    }

    private AdminDashboardResponse.SystemHealth getSystemHealthInternal() {
        Boolean maintenanceMode = systemConfigService.isMaintenanceMode();

        LocalDateTime last24Hours = LocalDateTime.now().minusHours(24);
        Long errorCount = auditService.getErrorCountSince(last24Hours);

        Double responseTime = calculateAverageResponseTime();

        LocalDateTime lastBackup = LocalDateTime.now().minusHours(6); // Mock data

        String status = determineSystemStatus(maintenanceMode, errorCount, responseTime);

        return AdminDashboardResponse.SystemHealth.builder()
            .maintenanceMode(maintenanceMode)
            .errorCount(errorCount)
            .responseTime(responseTime)
            .lastBackup(lastBackup)
            .status(status)
            .build();
    }

    private List<AdminDashboardResponse.RecentActivity> getRecentActivities() {
        return auditService.getRecentActivities(10).stream()
            .map(activity -> AdminDashboardResponse.RecentActivity.builder()
                .action((String) activity.get("action"))
                .entityType((String) activity.get("entityType"))
                .userEmail((String) activity.get("userEmail"))
                .timestamp((LocalDateTime) activity.get("timestamp"))
                .details((String) activity.get("details"))
                .build())
            .collect(Collectors.toList());
    }

    private Map<String, Object> getTopCategories() {
        // This would be implemented based on your transaction/category analysis needs
        Map<String, Object> topCategories = new HashMap<>();
        topCategories.put("message", "Top categories analysis placeholder");
        return topCategories;
    }

    private Double calculateAverageResponseTime() {
        // This would typically be calculated from actual monitoring data
        // For now, return a mock value
        return 150.0 + (Math.random() * 100); // 150-250ms mock response time
    }

    private String determineSystemStatus(Boolean maintenanceMode, Long errorCount, Double responseTime) {
        if (maintenanceMode) {
            return "MAINTENANCE";
        } else if (errorCount > 100 || responseTime > 1000) {
            return "ERROR";
        } else if (errorCount > 20 || responseTime > 500) {
            return "WARNING";
        } else {
            return "HEALTHY";
        }
    }
}