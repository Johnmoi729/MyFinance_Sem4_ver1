package com.myfinance.controller;

import com.myfinance.dto.request.SystemConfigRequest;
import com.myfinance.dto.response.ApiResponse;
import com.myfinance.entity.SystemConfig;
import com.myfinance.security.RequiresAdmin;
import com.myfinance.service.AuditService;
import com.myfinance.service.SystemConfigService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/config")
@RequiredArgsConstructor
@Slf4j
@RequiresAdmin
public class AdminConfigController {

    private final SystemConfigService systemConfigService;
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SystemConfig>>> getAllConfigs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "configKey") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) SystemConfig.ConfigType type,
            @RequestParam(required = false) Boolean isPublic,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<SystemConfig> configs = systemConfigService.getAllConfigs(pageable, type, isPublic);

            auditService.logAdminAction(
                authentication.getName(),
                "CONFIG_LIST_VIEW",
                "SystemConfig",
                null,
                "Xem danh sách cấu hình hệ thống",
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách cấu hình thành công", configs));
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách cấu hình", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy danh sách cấu hình"));
        }
    }

    @GetMapping("/{configKey}")
    public ResponseEntity<ApiResponse<SystemConfig>> getConfigByKey(
            @PathVariable String configKey,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            SystemConfig config = systemConfigService.getConfigByKey(configKey);

            auditService.logAdminAction(
                authentication.getName(),
                "CONFIG_DETAIL_VIEW",
                "SystemConfig",
                null,
                "Xem chi tiết cấu hình: " + configKey,
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success("Lấy cấu hình thành công", config));
        } catch (RuntimeException e) {
            log.error("Lỗi khi lấy cấu hình với key: {}", configKey, e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi lấy cấu hình", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy cấu hình"));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SystemConfig>> createConfig(
            @Valid @RequestBody SystemConfigRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {

        try {
            SystemConfig config = systemConfigService.createConfig(
                request.getConfigKey(),
                request.getConfigValue(),
                request.getDescription(),
                request.getConfigType(),
                request.getIsPublic()
            );

            auditService.logAdminAction(
                authentication.getName(),
                "CONFIG_CREATE",
                "SystemConfig",
                null,
                "Tạo cấu hình mới: " + request.getConfigKey(),
                null,
                request.getConfigValue(),
                httpRequest.getRemoteAddr(),
                httpRequest.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success("Tạo cấu hình thành công", config));
        } catch (RuntimeException e) {
            log.error("Lỗi khi tạo cấu hình", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi tạo cấu hình", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi tạo cấu hình"));
        }
    }

    @PutMapping("/{configKey}")
    public ResponseEntity<ApiResponse<SystemConfig>> updateConfig(
            @PathVariable String configKey,
            @Valid @RequestBody SystemConfigRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {

        try {
            String oldValue = systemConfigService.getConfigValueRequired(configKey);
            SystemConfig config = systemConfigService.updateConfig(
                configKey,
                request.getConfigValue(),
                request.getDescription(),
                request.getConfigType(),
                request.getIsPublic()
            );

            auditService.logAdminAction(
                authentication.getName(),
                "CONFIG_UPDATE",
                "SystemConfig",
                null,
                "Cập nhật cấu hình: " + configKey,
                oldValue,
                request.getConfigValue(),
                httpRequest.getRemoteAddr(),
                httpRequest.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success("Cập nhật cấu hình thành công", config));
        } catch (RuntimeException e) {
            log.error("Lỗi khi cập nhật cấu hình với key: {}", configKey, e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi cập nhật cấu hình", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi cập nhật cấu hình"));
        }
    }

    @DeleteMapping("/{configKey}")
    public ResponseEntity<ApiResponse<String>> deleteConfig(
            @PathVariable String configKey,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            String oldValue = systemConfigService.getConfigValueRequired(configKey);
            systemConfigService.deleteConfigByKey(configKey);

            auditService.logAdminAction(
                authentication.getName(),
                "CONFIG_DELETE",
                "SystemConfig",
                null,
                "Xóa cấu hình: " + configKey,
                oldValue,
                null,
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success("Xóa cấu hình thành công", null));
        } catch (RuntimeException e) {
            log.error("Lỗi khi xóa cấu hình với key: {}", configKey, e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi xóa cấu hình", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi xóa cấu hình"));
        }
    }

    @GetMapping("/maintenance-mode")
    public ResponseEntity<ApiResponse<Boolean>> getMaintenanceMode(
            Authentication authentication,
            HttpServletRequest request) {

        try {
            Boolean maintenanceMode = systemConfigService.isMaintenanceMode();

            auditService.logAdminAction(
                authentication.getName(),
                "MAINTENANCE_MODE_VIEW",
                "SystemConfig",
                null,
                "Xem trạng thái bảo trì hệ thống",
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success("Lấy trạng thái bảo trì thành công", maintenanceMode));
        } catch (Exception e) {
            log.error("Lỗi khi lấy trạng thái bảo trì", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy trạng thái bảo trì"));
        }
    }

    @PutMapping("/maintenance-mode")
    public ResponseEntity<ApiResponse<String>> setMaintenanceMode(
            @RequestParam Boolean enabled,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            Boolean oldMode = systemConfigService.isMaintenanceMode();
            systemConfigService.setMaintenanceModeAdmin(enabled);

            String action = enabled ? "MAINTENANCE_MODE_ENABLE" : "MAINTENANCE_MODE_DISABLE";
            String description = enabled ? "Bật chế độ bảo trì" : "Tắt chế độ bảo trì";

            auditService.logAdminAction(
                authentication.getName(),
                action,
                "SystemConfig",
                null,
                description,
                oldMode.toString(),
                enabled.toString(),
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            String message = enabled ? "Đã bật chế độ bảo trì" : "Đã tắt chế độ bảo trì";
            return ResponseEntity.ok(ApiResponse.success(message, null));
        } catch (Exception e) {
            log.error("Lỗi khi thiết lập chế độ bảo trì", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi thiết lập chế độ bảo trì"));
        }
    }

    @GetMapping("/feature-flags")
    public ResponseEntity<ApiResponse<List<SystemConfig>>> getFeatureFlags(
            Authentication authentication,
            HttpServletRequest request) {

        try {
            List<SystemConfig> flags = systemConfigService.getAllFeatureFlags();

            auditService.logAdminAction(
                authentication.getName(),
                "FEATURE_FLAGS_VIEW",
                "SystemConfig",
                null,
                "Xem danh sách feature flags",
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success("Lấy feature flags thành công", flags));
        } catch (Exception e) {
            log.error("Lỗi khi lấy feature flags", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy feature flags"));
        }
    }
}