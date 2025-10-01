package com.myfinance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryReportResponse {
    private Long categoryId;
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;
    private String categoryType; // INCOME or EXPENSE

    private LocalDate startDate;
    private LocalDate endDate;

    // Summary
    private BigDecimal totalAmount;
    private Long transactionCount;
    private BigDecimal averageTransaction;
    private BigDecimal minTransaction;
    private BigDecimal maxTransaction;

    // Trends over time
    private List<PeriodSummary> periodSummaries;

    // Budget comparison (if applicable)
    private BigDecimal budgetedAmount;
    private BigDecimal budgetVariance;
    private Double budgetAdherenceRate;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeriodSummary {
        private String periodLabel; // e.g., "2025-09", "Week 39"
        private LocalDate periodStart;
        private LocalDate periodEnd;
        private BigDecimal amount;
        private Long transactionCount;
    }
}
