package com.myfinance.dto.response;

import com.myfinance.entity.TransactionType;
import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {
    private Long id;
    private BigDecimal amount;
    private String currencyCode;
    private BigDecimal amountInBaseCurrency;
    private TransactionType type;
    private String description;
    private LocalDate transactionDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CategoryResponse category;
}