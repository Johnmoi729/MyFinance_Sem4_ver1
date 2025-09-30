package com.myfinance.controller;

import com.myfinance.dto.response.ApiResponse;
import com.myfinance.security.RequiresAdmin;
import com.myfinance.service.AuditService;
import com.myfinance.service.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@Slf4j
@RequiresAdmin
public class AdminAnalyticsController {

    private final AnalyticsService analyticsService;
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFinancialAnalytics(
            @RequestParam(required = false, defaultValue = "month") String timeFrame,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer quarter,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            // Set default year if not provided
            if (year == null) {
                year = java.time.Year.now().getValue();
            }

            // Set default month if timeFrame is month and month is not provided
            if ("month".equals(timeFrame) && month == null) {
                month = java.time.LocalDate.now().getMonthValue();
            }

            // Set default quarter if timeFrame is quarter and quarter is not provided
            if ("quarter".equals(timeFrame) && quarter == null) {
                quarter = (java.time.LocalDate.now().getMonthValue() - 1) / 3 + 1;
            }

            Map<String, Object> analyticsData = analyticsService.getFinancialAnalytics(timeFrame, year, month, quarter);

            auditService.logAdminAction(
                authentication.getName(),
                "ANALYTICS_VIEW",
                "Analytics",
                null,
                "Xem báo cáo phân tích tài chính: " + timeFrame,
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success("Lấy dữ liệu phân tích thành công", analyticsData));
        } catch (Exception e) {
            log.error("Lỗi khi lấy dữ liệu phân tích tài chính", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy dữ liệu phân tích"));
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalyticsSummary(
            Authentication authentication,
            HttpServletRequest request) {

        try {
            Map<String, Object> summary = analyticsService.getAnalyticsSummary();

            auditService.logAdminAction(
                authentication.getName(),
                "ANALYTICS_SUMMARY_VIEW",
                "Analytics",
                null,
                "Xem tổng quan phân tích tài chính",
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success("Lấy tổng quan phân tích thành công", summary));
        } catch (Exception e) {
            log.error("Lỗi khi lấy tổng quan phân tích", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy tổng quan phân tích"));
        }
    }

    @GetMapping("/export")
    public ResponseEntity<ApiResponse<String>> exportAnalytics(
            @RequestParam(required = false, defaultValue = "month") String timeFrame,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer quarter,
            @RequestParam(required = false, defaultValue = "csv") String format,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            // For now, return a placeholder response
            auditService.logAdminAction(
                authentication.getName(),
                "ANALYTICS_EXPORT",
                "Analytics",
                null,
                "Xuất báo cáo phân tích: " + timeFrame + " - " + format,
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            return ResponseEntity.ok(ApiResponse.success("Tính năng xuất báo cáo sẽ được triển khai trong phase tiếp theo", null));
        } catch (Exception e) {
            log.error("Lỗi khi xuất báo cáo phân tích", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi xuất báo cáo"));
        }
    }
}