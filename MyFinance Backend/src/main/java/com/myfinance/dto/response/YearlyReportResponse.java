package com.myfinance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YearlyReportResponse {
    private Integer year;

    // Annual summary
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netSavings;
    private Double savingsRate;

    // Year-over-year comparison
    private BigDecimal previousYearIncome;
    private BigDecimal previousYearExpense;
    private Double incomeChangePercent;
    private Double expenseChangePercent;

    // Monthly trends
    private List<MonthlyTrend> monthlyTrends;

    // Best/worst months
    private MonthlyTrend bestSavingsMonth;
    private MonthlyTrend worstSavingsMonth;
    private MonthlyTrend highestIncomeMonth;
    private MonthlyTrend highestExpenseMonth;

    // Category totals for the year
    private List<MonthlyReportResponse.CategorySummary> yearlyIncomeByCategory;
    private List<MonthlyReportResponse.CategorySummary> yearlyExpenseByCategory;

    // Statistics
    private Long totalTransactions;
    private BigDecimal averageMonthlyIncome;
    private BigDecimal averageMonthlyExpense;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyTrend {
        private Integer month;
        private String monthName;
        private BigDecimal income;
        private BigDecimal expense;
        private BigDecimal savings;
        private Double savingsRate;
    }
}
