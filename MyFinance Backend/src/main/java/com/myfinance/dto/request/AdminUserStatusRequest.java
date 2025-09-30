package com.myfinance.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserStatusRequest {
    @NotNull(message = "Trạng thái hoạt động không được để trống")
    private Boolean isActive;

    private String reason; // Optional reason for status change
}