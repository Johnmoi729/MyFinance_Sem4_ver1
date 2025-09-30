package com.myfinance.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BudgetUsageResponse {
    private Long budgetId;
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;
    private BigDecimal budgetAmount;
    private BigDecimal actualSpent;
    private BigDecimal remainingAmount;
    private Double usagePercentage;
    private String status; // GREEN, YELLOW, RED
    private Integer budgetYear;
    private Integer budgetMonth;
    private String budgetPeriod;
    private Boolean isOverBudget;
    private String statusMessage;
}