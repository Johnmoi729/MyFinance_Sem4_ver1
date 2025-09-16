package com.myfinance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetResponse {
    private Long id;
    private CategoryResponse category;
    private BigDecimal budgetAmount;
    private Integer budgetYear;
    private Integer budgetMonth;
    private String budgetPeriod; // "2024-03" format
    private String description;
    private Boolean isActive;
    private Boolean isCurrentMonth;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}