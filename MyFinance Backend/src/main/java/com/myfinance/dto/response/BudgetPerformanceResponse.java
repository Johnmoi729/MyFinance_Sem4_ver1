package com.myfinance.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class BudgetPerformanceResponse {
    private BigDecimal totalBudgetAmount;
    private BigDecimal totalActualSpent;
    private BigDecimal totalRemainingAmount;
    private Double overallUsagePercentage;
    private Integer activeBudgets;
    private Integer budgetsOnTrack;
    private Integer budgetsAtRisk;
    private Integer budgetsOverLimit;
    private List<CategoryPerformance> categoryPerformances;

    @Data
    @Builder
    public static class CategoryPerformance {
        private Long categoryId;
        private String categoryName;
        private String categoryColor;
        private String categoryIcon;
        private BigDecimal budgetAmount;
        private BigDecimal actualSpent;
        private Double usagePercentage;
        private String status;
        private String trend; // IMPROVING, STABLE, WORSENING
    }
}