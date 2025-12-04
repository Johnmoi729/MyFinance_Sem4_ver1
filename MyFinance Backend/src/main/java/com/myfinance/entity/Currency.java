package com.myfinance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "currencies", uniqueConstraints = {
    @UniqueConstraint(columnNames = "code")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Currency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 3)
    @NotBlank
    private String code; // e.g., "VND", "USD", "EUR"

    @Column(nullable = false)
    @NotBlank
    private String name; // e.g., "Vietnamese Dong", "US Dollar"

    @Column(nullable = false, length = 10)
    @NotBlank
    private String symbol; // e.g., "₫", "$", "€"

    @Column(name = "exchange_rate", nullable = false, precision = 20, scale = 6)
    @NotNull
    @Positive
    private BigDecimal exchangeRate; // Rate relative to base currency (VND = 1.0)

    @Column(name = "is_active", nullable = false)
    @NotNull
    private Boolean isActive = true;

    @Column(name = "is_base_currency", nullable = false)
    @NotNull
    private Boolean isBaseCurrency = false;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (lastUpdated == null) {
            lastUpdated = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
