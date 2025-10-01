package com.myfinance.controller;

import com.myfinance.dto.response.AdminDashboardResponse;
import com.myfinance.dto.response.ApiResponse;
import com.myfinance.security.RequiresAdmin;
import com.myfinance.service.AuditService;
import com.myfinance.service.DashboardService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Slf4j
@RequiresAdmin
public class AdminDashboardController {

    private final DashboardService dashboardService;
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard(
            Authentication authentication,
            HttpServletRequest request) {

        try {
            AdminDashboardResponse dashboard = dashboardService.getAdminDashboard();

            // No audit log for dashboard views - non-actionable data

            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin dashboard thành công", dashboard));
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin dashboard", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy thông tin dashboard"));
        }
    }

    @GetMapping("/user-activity")
    public ResponseEntity<ApiResponse<List<Object>>> getUserActivity(
            @RequestParam(defaultValue = "7") int days,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            List<Object> activities = dashboardService.getUserActivityForDays(days);

            // No audit log for aggregate activity views - no specific user data

            return ResponseEntity.ok(ApiResponse.success("Lấy hoạt động người dùng thành công", activities));
        } catch (Exception e) {
            log.error("Lỗi khi lấy hoạt động người dùng", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy hoạt động người dùng"));
        }
    }

    @GetMapping("/transaction-trends")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTransactionTrends(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            if (startDate == null) {
                startDate = LocalDate.now().minusMonths(3);
            }
            if (endDate == null) {
                endDate = LocalDate.now();
            }

            Map<String, Object> trends = dashboardService.getTransactionTrends(startDate, endDate);

            // No audit log for aggregate trend views - no specific user data

            return ResponseEntity.ok(ApiResponse.success("Lấy xu hướng giao dịch thành công", trends));
        } catch (Exception e) {
            log.error("Lỗi khi lấy xu hướng giao dịch", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy xu hướng giao dịch"));
        }
    }

    @GetMapping("/system-health")
    public ResponseEntity<ApiResponse<Object>> getSystemHealth(
            Authentication authentication,
            HttpServletRequest request) {

        try {
            Object health = dashboardService.getSystemHealth();

            // No audit log for system health views - routine monitoring

            return ResponseEntity.ok(ApiResponse.success("Lấy tình trạng hệ thống thành công", health));
        } catch (Exception e) {
            log.error("Lỗi khi lấy tình trạng hệ thống", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy tình trạng hệ thống"));
        }
    }

    @GetMapping("/audit-summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAuditSummary(
            @RequestParam(defaultValue = "30") int days,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            Map<String, Object> summary = auditService.getAuditSummary(days);

            // No audit log for audit summary views - creates circular logging

            return ResponseEntity.ok(ApiResponse.success("Lấy tóm tắt audit thành công", summary));
        } catch (Exception e) {
            log.error("Lỗi khi lấy tóm tắt audit", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy tóm tắt audit"));
        }
    }
}