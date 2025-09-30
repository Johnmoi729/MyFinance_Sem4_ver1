package com.myfinance.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class BudgetWarningResponse {
    private Integer totalBudgets;
    private Integer warningCount;
    private Integer overBudgetCount;
    private List<BudgetAlert> alerts;

    @Data
    @Builder
    public static class BudgetAlert {
        private Long budgetId;
        private String categoryName;
        private String categoryColor;
        private String alertType; // WARNING, OVER_BUDGET
        private String alertLevel; // YELLOW, RED
        private BigDecimal budgetAmount;
        private BigDecimal actualSpent;
        private Double usagePercentage;
        private String message;
        private Integer budgetYear;
        private Integer budgetMonth;
    }
}