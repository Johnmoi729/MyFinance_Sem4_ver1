package com.myfinance.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class AdminDashboardResponse {
    // User statistics
    private UserStats userStats;

    // Transaction statistics
    private TransactionStats transactionStats;

    // System health
    private SystemHealth systemHealth;

    // Recent activities
    private List<RecentActivity> recentActivities;

    @Data
    @Builder
    public static class UserStats {
        private Long totalUsers;
        private Long activeUsers;
        private Long newUsersToday;
        private Long newUsersThisMonth;
        private Double growthPercentage;
    }

    @Data
    @Builder
    public static class TransactionStats {
        private Long totalTransactions;
        private BigDecimal totalVolume;
        private Long transactionsToday;
        private BigDecimal volumeToday;
        private Map<String, Object> topCategories;
    }

    @Data
    @Builder
    public static class SystemHealth {
        private Boolean maintenanceMode;
        private Long errorCount;
        private Double responseTime;
        private LocalDateTime lastBackup;
        private String status; // HEALTHY, WARNING, ERROR
    }

    @Data
    @Builder
    public static class RecentActivity {
        private String action;
        private String entityType;
        private String userEmail;
        private LocalDateTime timestamp;
        private String details;
    }
}