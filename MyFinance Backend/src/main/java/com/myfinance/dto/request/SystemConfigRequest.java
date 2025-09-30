package com.myfinance.dto.request;

import com.myfinance.entity.SystemConfig;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfigRequest {
    @NotBlank(message = "Khóa cấu hình không được để trống")
    private String configKey;

    private String configValue;

    private String description;

    @NotNull(message = "Loại cấu hình không được để trống")
    private SystemConfig.ConfigType configType;

    private Boolean isPublic = false;
}