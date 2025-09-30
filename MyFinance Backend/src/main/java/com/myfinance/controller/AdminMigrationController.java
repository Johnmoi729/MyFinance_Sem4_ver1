package com.myfinance.controller;

import com.myfinance.dto.response.ApiResponse;
import com.myfinance.security.RequiresAdmin;
import com.myfinance.service.AuditService;
import com.myfinance.service.MigrationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/migration")
@RequiredArgsConstructor
@Slf4j
@RequiresAdmin
public class AdminMigrationController {

    private final MigrationService migrationService;
    private final AuditService auditService;

    @PostMapping("/system-config-enum")
    public ResponseEntity<ApiResponse<String>> migrateSystemConfigEnum(
            Authentication authentication,
            HttpServletRequest request) {

        try {
            boolean needsMigration = migrationService.needsEnumMigration();

            if (!needsMigration) {
                return ResponseEntity.ok(ApiResponse.success("Không cần migration - tất cả enum values đã được cập nhật", null));
            }

            migrationService.migrateSystemConfigEnumValues();

            auditService.logAdminAction(
                authentication.getName(),
                "SYSTEM_CONFIG_ENUM_MIGRATION",
                "SystemConfig",
                null,
                "Thực hiện migration enum values cho SystemConfig",
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success("Migration SystemConfig enum values thành công", null));

        } catch (Exception e) {
            log.error("Lỗi khi thực hiện migration SystemConfig enum", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi thực hiện migration"));
        }
    }

    @GetMapping("/system-config-enum/check")
    public ResponseEntity<ApiResponse<Boolean>> checkSystemConfigEnumMigration(
            Authentication authentication,
            HttpServletRequest request) {

        try {
            boolean needsMigration = migrationService.needsEnumMigration();

            auditService.logAdminAction(
                authentication.getName(),
                "SYSTEM_CONFIG_ENUM_MIGRATION_CHECK",
                "SystemConfig",
                null,
                "Kiểm tra trạng thái migration enum values",
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            String message = needsMigration
                ? "Cần thực hiện migration để cập nhật enum values"
                : "Tất cả enum values đã được cập nhật";

            return ResponseEntity.ok(ApiResponse.success(message, needsMigration));

        } catch (Exception e) {
            log.error("Lỗi khi kiểm tra migration SystemConfig enum", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi kiểm tra migration"));
        }
    }
}