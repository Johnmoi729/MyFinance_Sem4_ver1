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

            auditService.logAdminAction(
                authentication.getName(),
                "ADMIN_DASHBOARD_VIEW",
                "Dashboard",
                null,
                "Xem dashboard quản trị",
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

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

            auditService.logAdminAction(
                authentication.getName(),
                "USER_ACTIVITY_VIEW",
                "Activity",
                null,
                "Xem hoạt động người dùng trong " + days + " ngày",
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

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

            auditService.logAdminAction(
                authentication.getName(),
                "TRANSACTION_TRENDS_VIEW",
                "Transaction",
                null,
                "Xem xu hướng giao dịch từ " + startDate + " đến " + endDate,
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

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

            auditService.logAdminAction(
                authentication.getName(),
                "SYSTEM_HEALTH_VIEW",
                "System",
                null,
                "Xem tình trạng hệ thống",
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

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

            auditService.logAdminAction(
                authentication.getName(),
                "AUDIT_SUMMARY_VIEW",
                "Audit",
                null,
                "Xem tóm tắt audit trong " + days + " ngày",
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success("Lấy tóm tắt audit thành công", summary));
        } catch (Exception e) {
            log.error("Lỗi khi lấy tóm tắt audit", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy tóm tắt audit"));
        }
    }
}