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
public class MonthlyReportResponse {
    private Integer year;
    private Integer month;
    private String monthName;

    // Summary totals
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netSavings;
    private Double savingsRate; // Percentage

    // Comparisons
    private BigDecimal previousMonthIncome;
    private BigDecimal previousMonthExpense;
    private Double incomeChangePercent;
    private Double expenseChangePercent;

    // Category breakdowns
    private List<CategorySummary> incomeByCategory;
    private List<CategorySummary> expenseByCategory;

    // Top categories
    private List<CategorySummary> topExpenseCategories;
    private List<CategorySummary> topIncomeCategories;

    // Statistics
    private Long totalTransactions;
    private BigDecimal averageTransaction;
    private BigDecimal largestExpense;
    private BigDecimal largestIncome;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategorySummary {
        private Long categoryId;
        private String categoryName;
        private String categoryColor;
        private String categoryIcon;
        private BigDecimal amount;
        private Long transactionCount;
        private Double percentage; // Percentage of total

        // Budget comparison fields
        private BigDecimal budgetAmount;
        private BigDecimal budgetDifference; // amount - budget
        private Double budgetUsagePercent; // (amount / budget) * 100
    }
}
