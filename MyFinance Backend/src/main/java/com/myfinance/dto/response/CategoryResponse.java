package com.myfinance.dto.response;

import com.myfinance.entity.TransactionType;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private TransactionType type;
    private String color;
    private String icon;
    private Boolean isDefault;
}