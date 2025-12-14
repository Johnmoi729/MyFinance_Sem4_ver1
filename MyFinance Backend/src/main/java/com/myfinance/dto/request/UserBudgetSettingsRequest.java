package com.myfinance.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserBudgetSettingsRequest {

    @NotNull(message = "Ngưỡng cảnh báo không được để trống")
    @Min(value = 50, message = "Ngưỡng cảnh báo phải từ 50% trở lên")
    @Max(value = 95, message = "Ngưỡng cảnh báo không được vượt quá 95%")
    private Double warningThreshold;

    @NotNull(message = "Ngưỡng nghiêm trọng không được để trống")
    @Min(value = 70, message = "Ngưỡng nghiêm trọng phải từ 70% trở lên")
    @Max(value = 100, message = "Ngưỡng nghiêm trọng không được vượt quá 100%")
    private Double criticalThreshold;

    // Custom validation to ensure criticalThreshold > warningThreshold
    public boolean isValid() {
        return criticalThreshold > warningThreshold;
    }
}