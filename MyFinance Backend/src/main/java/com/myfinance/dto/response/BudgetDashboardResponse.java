package com.myfinance.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class BudgetDashboardResponse {
    private BigDecimal totalBudgetAmount;
    private BigDecimal totalActualSpent;
    private BigDecimal totalRemainingAmount;
    private Double overallUsagePercentage;
    private Integer totalBudgets;
    private Integer budgetsOnTrack;
    private Integer budgetsAtRisk;
    private Integer budgetsOverLimit;
    private List<BudgetSummary> recentBudgets;
    private List<BudgetWarningResponse.BudgetAlert> urgentAlerts;

    @Data
    @Builder
    public static class BudgetSummary {
        private Long budgetId;
        private String categoryName;
        private String categoryColor;
        private String categoryIcon;
        private BigDecimal budgetAmount;
        private BigDecimal actualSpent;
        private Double usagePercentage;
        private String status;
        private Boolean isCurrentMonth;
    }
}