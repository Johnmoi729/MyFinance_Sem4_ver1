package com.myfinance.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetRequest {
    
    @NotNull(message = "ID danh mục không được để trống")
    private Long categoryId;
    
    @NotNull(message = "Số tiền ngân sách không được để trống")
    @Positive(message = "Số tiền ngân sách phải lớn hơn 0")
    private BigDecimal budgetAmount;

    @NotNull(message = "Năm ngân sách không được để trống")
    @Min(value = 2000, message = "Năm ngân sách không hợp lệ")
    @Max(value = 2100, message = "Năm ngân sách không hợp lệ")
    private Integer budgetYear;
    
    @NotNull(message = "Tháng ngân sách không được để trống")
    @Min(value = 1, message = "Tháng phải từ 1-12")
    @Max(value = 12, message = "Tháng phải từ 1-12")
    private Integer budgetMonth;
    
    private String description;
}