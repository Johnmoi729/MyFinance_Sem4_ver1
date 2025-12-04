package com.myfinance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "category_id", "budget_year", "budget_month"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    @NotNull
    private Long userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull
    private Category category;

    @Column(name = "budget_amount", nullable = false, precision = 12, scale = 2)
    @NotNull
    @Positive
    private BigDecimal budgetAmount;

    @Column(name = "currency_code", length = 3)
    private String currencyCode = "VND"; // Default currency

    @Column(name = "budget_amount_in_base_currency", precision = 12, scale = 2)
    private BigDecimal budgetAmountInBaseCurrency;

    @Column(name = "budget_year", nullable = false)
    @NotNull
    private Integer budgetYear;

    @Column(name = "budget_month", nullable = false)
    @NotNull
    private Integer budgetMonth; // 1-12

    @Column(name = "description")
    private String description;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper method to get budget period as string
    public String getBudgetPeriod() {
        return String.format("%04d-%02d", budgetYear, budgetMonth);
    }

    // Helper method to check if budget is for current month
    public boolean isCurrentMonth() {
        LocalDateTime now = LocalDateTime.now();
        return budgetYear.equals(now.getYear()) && budgetMonth.equals(now.getMonthValue());
    }
}