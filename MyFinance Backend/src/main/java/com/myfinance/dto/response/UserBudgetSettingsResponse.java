package com.myfinance.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserBudgetSettingsResponse {
    private Long id;
    private Long userId;
    private Double warningThreshold;
    private Double criticalThreshold;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}