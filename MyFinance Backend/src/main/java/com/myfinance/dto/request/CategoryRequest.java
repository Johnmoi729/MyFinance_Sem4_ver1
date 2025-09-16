package com.myfinance.dto.request;

import com.myfinance.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {
    
    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(max = 100, message = "Tên danh mục không được vượt quá 100 ký tự")
    private String name;
    
    @NotNull(message = "Loại danh mục không được để trống")
    private TransactionType type;
    
    @Size(max = 7, message = "Mã màu không hợp lệ")
    private String color = "#007bff";
    
    @Size(max = 50, message = "Icon không hợp lệ")
    private String icon = "default";
}