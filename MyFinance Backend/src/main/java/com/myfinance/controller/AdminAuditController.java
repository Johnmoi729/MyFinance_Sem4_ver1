package com.myfinance.controller;

import com.myfinance.dto.response.ApiResponse;
import com.myfinance.entity.AuditLog;
import com.myfinance.security.RequiresAdmin;
import com.myfinance.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/audit")
@RequiredArgsConstructor
@Slf4j
@RequiresAdmin
public class AdminAuditController {

    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAllAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long adminUserId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<AuditLog> auditLogs = auditService.getAuditLogsWithFilters(
                userId, adminUserId, action, entityType, startDate, endDate, pageable);

            return ResponseEntity.ok(ApiResponse.success("Lấy nhật ký audit thành công", auditLogs));
        } catch (Exception e) {
            log.error("Lỗi khi lấy nhật ký audit", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy nhật ký audit"));
        }
    }

    @GetMapping("/{auditId}")
    public ResponseEntity<ApiResponse<AuditLog>> getAuditLogById(
            @PathVariable Long auditId,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            AuditLog auditLog = auditService.getAuditLogById(auditId);

            return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết nhật ký audit thành công", auditLog));
        } catch (RuntimeException e) {
            log.error("Lỗi khi lấy chi tiết nhật ký audit với ID: {}", auditId, e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi lấy chi tiết nhật ký audit", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy chi tiết nhật ký audit"));
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<List<Object[]>>> getAuditStatistics(
            @RequestParam(defaultValue = "30") int days,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            LocalDateTime since = LocalDateTime.now().minusDays(days);
            List<Object[]> statistics = auditService.getActionStatistics(since);

            return ResponseEntity.ok(ApiResponse.success("Lấy thống kê audit thành công", statistics));
        } catch (Exception e) {
            log.error("Lỗi khi lấy thống kê audit", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy thống kê audit"));
        }
    }

    @GetMapping("/admin-activity/{adminUserId}")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAdminActivity(
            @PathVariable Long adminUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
            Page<AuditLog> activities = auditService.getAuditLogsByAdmin(adminUserId, pageable);

            return ResponseEntity.ok(ApiResponse.success("Lấy hoạt động admin thành công", activities));
        } catch (Exception e) {
            log.error("Lỗi khi lấy hoạt động admin", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy hoạt động admin"));
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRecentAuditLogs(
            @RequestParam(defaultValue = "50") int limit,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            List<Map<String, Object>> recentLogs = auditService.getRecentActivities(limit);

            return ResponseEntity.ok(ApiResponse.success("Lấy nhật ký audit gần đây thành công", recentLogs));
        } catch (Exception e) {
            log.error("Lỗi khi lấy nhật ký audit gần đây", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy nhật ký audit gần đây"));
        }
    }

    @GetMapping("/export")
    public ResponseEntity<ApiResponse<List<AuditLog>>> exportAuditLogs(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "JSON") String format,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            List<AuditLog> logs;
            if (startDate != null && endDate != null) {
                logs = auditService.getAuditLogsByDateRange(startDate, endDate);
            } else {
                // Get all logs (be careful with large datasets)
                logs = auditService.getAllAuditLogs();
            }

            auditService.logAdminAction(
                authentication.getName(),
                "AUDIT_LOG_EXPORT",
                "AuditLog",
                null,
                "Xuất " + logs.size() + " nhật ký audit từ " + startDate + " đến " + endDate,
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success(
                "Xuất nhật ký audit thành công",
                logs
            ));
        } catch (Exception e) {
            log.error("Lỗi khi xuất nhật ký audit", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi xuất nhật ký audit"));
        }
    }

    @DeleteMapping("/cleanup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> cleanupAuditLogs(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime before,
            @RequestParam(defaultValue = "90") int daysOld,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            LocalDateTime cutoffDate = before != null ? before : LocalDateTime.now().minusDays(daysOld);
            int deletedCount = auditService.deleteAuditLogsBefore(cutoffDate);

            auditService.logAdminAction(
                authentication.getName(),
                "AUDIT_LOG_CLEANUP",
                "AuditLog",
                null,
                "Xóa " + deletedCount + " nhật ký audit cũ hơn " + cutoffDate,
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            Map<String, Object> result = new HashMap<>();
            result.put("deletedCount", deletedCount);
            result.put("cutoffDate", cutoffDate);

            return ResponseEntity.ok(ApiResponse.success(
                "Đã xóa " + deletedCount + " nhật ký audit cũ",
                result
            ));
        } catch (Exception e) {
            log.error("Lỗi khi xóa nhật ký audit", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi xóa nhật ký audit"));
        }
    }
}