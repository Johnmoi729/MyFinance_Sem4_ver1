package com.myfinance.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompleteStepRequest {
    @NotNull(message = "Số bước không được để trống")
    @Min(value = 1, message = "Số bước phải từ 1-4")
    @Max(value = 4, message = "Số bước phải từ 1-4")
    private Integer stepNumber;
}
