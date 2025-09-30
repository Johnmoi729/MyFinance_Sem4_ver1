package com.myfinance.service;

import com.myfinance.entity.Category;
import com.myfinance.entity.Transaction;
import com.myfinance.entity.User;
import com.myfinance.repository.CategoryRepository;
import com.myfinance.repository.TransactionRepository;
import com.myfinance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public Map<String, Object> getFinancialAnalytics(String timeFrame, Integer year, Integer month, Integer quarter) {
        Map<String, Object> result = new HashMap<>();

        LocalDate startDate = calculateStartDate(timeFrame, year, month, quarter);
        LocalDate endDate = calculateEndDate(timeFrame, year, month, quarter);

        // Get previous period for comparison
        LocalDate prevStartDate = calculatePreviousStartDate(timeFrame, startDate);
        LocalDate prevEndDate = calculatePreviousEndDate(timeFrame, endDate);

        // Current period data
        Map<String, Object> currentData = getAnalyticsForPeriod(startDate, endDate);
        Map<String, Object> previousData = getAnalyticsForPeriod(prevStartDate, prevEndDate);

        // Calculate main metrics
        BigDecimal totalRevenue = (BigDecimal) currentData.get("totalRevenue");
        BigDecimal totalExpenses = (BigDecimal) currentData.get("totalExpenses");
        BigDecimal netProfit = totalRevenue.subtract(totalExpenses);

        BigDecimal prevTotalRevenue = (BigDecimal) previousData.get("totalRevenue");
        BigDecimal prevTotalExpenses = (BigDecimal) previousData.get("totalExpenses");
        BigDecimal prevNetProfit = prevTotalRevenue.subtract(prevTotalExpenses);

        // Calculate growth rates
        double revenueGrowth = calculateGrowthRate(totalRevenue, prevTotalRevenue);
        double expenseGrowth = calculateGrowthRate(totalExpenses, prevTotalExpenses);
        double profitGrowth = calculateGrowthRate(netProfit, prevNetProfit);

        // User analytics
        long activeUsers = userRepository.countActiveUsers();
        long prevActiveUsers = userRepository.countActiveUsersBefore(prevEndDate.atStartOfDay());
        double userGrowth = calculateGrowthRate(BigDecimal.valueOf(activeUsers), BigDecimal.valueOf(prevActiveUsers));

        // Build result
        result.put("totalRevenue", totalRevenue);
        result.put("totalExpenses", totalExpenses);
        result.put("netProfit", netProfit);
        result.put("activeUsers", activeUsers);

        result.put("revenueGrowth", revenueGrowth);
        result.put("expenseGrowth", expenseGrowth);
        result.put("profitGrowth", profitGrowth);
        result.put("userGrowth", userGrowth);

        result.put("topExpenseCategories", currentData.get("topExpenseCategories"));
        result.put("topIncomeCategories", currentData.get("topIncomeCategories"));

        // User engagement metrics
        result.put("avgTransactionsPerUser", calculateAvgTransactionsPerUser(startDate, endDate));
        result.put("avgSessionDuration", 15.5); // Placeholder
        result.put("retentionRate", 0.75); // Placeholder

        // System metrics (placeholders for future implementation)
        Map<String, Object> systemMetrics = new HashMap<>();
        systemMetrics.put("databaseSize", "2.5 GB");
        systemMetrics.put("avgResponseTime", 120);
        systemMetrics.put("errorRate", 0.001);
        systemMetrics.put("uptime", 0.995);
        result.put("systemMetrics", systemMetrics);

        return result;
    }

    public Map<String, Object> getAnalyticsSummary() {
        Map<String, Object> result = new HashMap<>();

        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = currentMonth.plusMonths(1).minusDays(1);

        Map<String, Object> monthlyData = getAnalyticsForPeriod(currentMonth, endOfMonth);

        result.put("monthlyRevenue", monthlyData.get("totalRevenue"));
        result.put("monthlyExpenses", monthlyData.get("totalExpenses"));
        result.put("totalUsers", userRepository.count());
        result.put("activeUsers", userRepository.countActiveUsers());
        result.put("totalTransactions", transactionRepository.count());

        return result;
    }

    private Map<String, Object> getAnalyticsForPeriod(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> result = new HashMap<>();

        // Get transactions for the period
        List<Transaction> transactions = transactionRepository.findByTransactionDateBetween(startDate, endDate);

        // Calculate totals
        BigDecimal totalRevenue = transactions.stream()
            .filter(t -> "INCOME".equals(t.getType().name()))
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = transactions.stream()
            .filter(t -> "EXPENSE".equals(t.getType().name()))
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        result.put("totalRevenue", totalRevenue);
        result.put("totalExpenses", totalExpenses);

        // Top categories
        Map<Category, BigDecimal> expenseByCategory = transactions.stream()
            .filter(t -> "EXPENSE".equals(t.getType().name()))
            .collect(Collectors.groupingBy(
                Transaction::getCategory,
                Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
            ));

        Map<Category, BigDecimal> incomeByCategory = transactions.stream()
            .filter(t -> "INCOME".equals(t.getType().name()))
            .collect(Collectors.groupingBy(
                Transaction::getCategory,
                Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
            ));

        List<Map<String, Object>> topExpenseCategories = expenseByCategory.entrySet().stream()
            .sorted(Map.Entry.<Category, BigDecimal>comparingByValue().reversed())
            .limit(5)
            .map(entry -> {
                Map<String, Object> categoryData = new HashMap<>();
                categoryData.put("name", entry.getKey().getName());
                categoryData.put("amount", entry.getValue());
                categoryData.put("color", entry.getKey().getColor());
                return categoryData;
            })
            .collect(Collectors.toList());

        List<Map<String, Object>> topIncomeCategories = incomeByCategory.entrySet().stream()
            .sorted(Map.Entry.<Category, BigDecimal>comparingByValue().reversed())
            .limit(5)
            .map(entry -> {
                Map<String, Object> categoryData = new HashMap<>();
                categoryData.put("name", entry.getKey().getName());
                categoryData.put("amount", entry.getValue());
                categoryData.put("color", entry.getKey().getColor());
                return categoryData;
            })
            .collect(Collectors.toList());

        result.put("topExpenseCategories", topExpenseCategories);
        result.put("topIncomeCategories", topIncomeCategories);

        return result;
    }

    private LocalDate calculateStartDate(String timeFrame, Integer year, Integer month, Integer quarter) {
        switch (timeFrame.toLowerCase()) {
            case "month":
                return LocalDate.of(year, month, 1);
            case "quarter":
                int startMonth = (quarter - 1) * 3 + 1;
                return LocalDate.of(year, startMonth, 1);
            case "year":
                return LocalDate.of(year, 1, 1);
            default:
                return LocalDate.now().withDayOfMonth(1);
        }
    }

    private LocalDate calculateEndDate(String timeFrame, Integer year, Integer month, Integer quarter) {
        switch (timeFrame.toLowerCase()) {
            case "month":
                return LocalDate.of(year, month, 1).plusMonths(1).minusDays(1);
            case "quarter":
                int startMonth = (quarter - 1) * 3 + 1;
                return LocalDate.of(year, startMonth, 1).plusMonths(3).minusDays(1);
            case "year":
                return LocalDate.of(year, 12, 31);
            default:
                return LocalDate.now().plusMonths(1).minusDays(1);
        }
    }

    private LocalDate calculatePreviousStartDate(String timeFrame, LocalDate currentStart) {
        switch (timeFrame.toLowerCase()) {
            case "month":
                return currentStart.minusMonths(1);
            case "quarter":
                return currentStart.minusMonths(3);
            case "year":
                return currentStart.minusYears(1);
            default:
                return currentStart.minusMonths(1);
        }
    }

    private LocalDate calculatePreviousEndDate(String timeFrame, LocalDate currentEnd) {
        switch (timeFrame.toLowerCase()) {
            case "month":
                return currentEnd.minusMonths(1);
            case "quarter":
                return currentEnd.minusMonths(3);
            case "year":
                return currentEnd.minusYears(1);
            default:
                return currentEnd.minusMonths(1);
        }
    }

    private double calculateGrowthRate(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) == 0 ? 0.0 : 100.0;
        }
        return current.subtract(previous)
            .divide(previous, 4, BigDecimal.ROUND_HALF_UP)
            .multiply(BigDecimal.valueOf(100))
            .doubleValue();
    }

    private double calculateAvgTransactionsPerUser(LocalDate startDate, LocalDate endDate) {
        long totalTransactions = transactionRepository.countByTransactionDateBetween(startDate, endDate);
        long activeUsers = userRepository.countActiveUsers();
        return activeUsers > 0 ? (double) totalTransactions / activeUsers : 0.0;
    }
}