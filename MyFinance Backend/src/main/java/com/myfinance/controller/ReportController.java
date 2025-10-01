package com.myfinance.controller;

import com.myfinance.dto.response.ApiResponse;
import com.myfinance.dto.response.CategoryReportResponse;
import com.myfinance.dto.response.MonthlyReportResponse;
import com.myfinance.dto.response.YearlyReportResponse;
import com.myfinance.service.ReportService;
import com.myfinance.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ReportService reportService;
    private final JwtUtil jwtUtil;

    /**
     * Generate monthly financial summary report
     * GET /api/reports/monthly?year=2025&month=9
     */
    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<MonthlyReportResponse>> getMonthlyReport(
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);

            // Validate month
            if (month < 1 || month > 12) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Tháng không hợp lệ. Vui lòng nhập từ 1-12"));
            }

            // Validate year (reasonable range)
            if (year < 2000 || year > 2100) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Năm không hợp lệ"));
            }

            MonthlyReportResponse report = reportService.generateMonthlySummary(userId, year, month);

            return ResponseEntity.ok(ApiResponse.success("Lấy báo cáo tháng thành công", report));

        } catch (Exception e) {
            log.error("Lỗi khi tạo báo cáo tháng cho năm {} tháng {}", year, month, e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi tạo báo cáo tháng"));
        }
    }

    /**
     * Generate yearly financial overview report
     * GET /api/reports/yearly?year=2025
     */
    @GetMapping("/yearly")
    public ResponseEntity<ApiResponse<YearlyReportResponse>> getYearlyReport(
            @RequestParam Integer year,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);

            // Validate year
            if (year < 2000 || year > 2100) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Năm không hợp lệ"));
            }

            YearlyReportResponse report = reportService.generateYearlySummary(userId, year);

            return ResponseEntity.ok(ApiResponse.success("Lấy báo cáo năm thành công", report));

        } catch (Exception e) {
            log.error("Lỗi khi tạo báo cáo năm {}", year, e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi tạo báo cáo năm"));
        }
    }

    /**
     * Generate category-specific analysis report
     * GET /api/reports/category/{categoryId}?startDate=2025-01-01&endDate=2025-12-31
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<CategoryReportResponse>> getCategoryReport(
            @PathVariable Long categoryId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);

            // Validate date range
            if (endDate.isBefore(startDate)) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Ngày kết thúc phải sau ngày bắt đầu"));
            }

            CategoryReportResponse report = reportService.generateCategoryReport(userId, categoryId, startDate, endDate);

            return ResponseEntity.ok(ApiResponse.success("Lấy báo cáo danh mục thành công", report));

        } catch (RuntimeException e) {
            log.error("Lỗi khi tạo báo cáo danh mục {} từ {} đến {}", categoryId, startDate, endDate, e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi tạo báo cáo danh mục", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi tạo báo cáo danh mục"));
        }
    }

    /**
     * Get current month report (convenience endpoint)
     * GET /api/reports/current-month
     */
    @GetMapping("/current-month")
    public ResponseEntity<ApiResponse<MonthlyReportResponse>> getCurrentMonthReport(
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);

            LocalDate now = LocalDate.now();
            MonthlyReportResponse report = reportService.generateMonthlySummary(userId, now.getYear(), now.getMonthValue());

            return ResponseEntity.ok(ApiResponse.success("Lấy báo cáo tháng hiện tại thành công", report));

        } catch (Exception e) {
            log.error("Lỗi khi tạo báo cáo tháng hiện tại", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi tạo báo cáo tháng hiện tại"));
        }
    }

    /**
     * Get current year report (convenience endpoint)
     * GET /api/reports/current-year
     */
    @GetMapping("/current-year")
    public ResponseEntity<ApiResponse<YearlyReportResponse>> getCurrentYearReport(
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);

            int currentYear = LocalDate.now().getYear();
            YearlyReportResponse report = reportService.generateYearlySummary(userId, currentYear);

            return ResponseEntity.ok(ApiResponse.success("Lấy báo cáo năm hiện tại thành công", report));

        } catch (Exception e) {
            log.error("Lỗi khi tạo báo cáo năm hiện tại", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi tạo báo cáo năm hiện tại"));
        }
    }

    /**
     * Get summary report for a specific period
     * GET /api/reports/summary/{period}
     * period can be: current-month, last-month, current-year, last-year
     */
    @GetMapping("/summary/{period}")
    public ResponseEntity<ApiResponse<?>> getSummaryReport(
            @PathVariable String period,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);

            LocalDate now = LocalDate.now();
            Object report;

            switch (period.toLowerCase()) {
                case "current-month":
                    report = reportService.generateMonthlySummary(userId, now.getYear(), now.getMonthValue());
                    break;

                case "last-month":
                    LocalDate lastMonth = now.minusMonths(1);
                    report = reportService.generateMonthlySummary(userId, lastMonth.getYear(), lastMonth.getMonthValue());
                    break;

                case "current-year":
                    report = reportService.generateYearlySummary(userId, now.getYear());
                    break;

                case "last-year":
                    report = reportService.generateYearlySummary(userId, now.getYear() - 1);
                    break;

                default:
                    return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Khoảng thời gian không hợp lệ. Sử dụng: current-month, last-month, current-year, last-year"));
            }

            return ResponseEntity.ok(ApiResponse.success("Lấy báo cáo tóm tắt thành công", report));

        } catch (Exception e) {
            log.error("Lỗi khi tạo báo cáo tóm tắt cho khoảng {}", period, e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi tạo báo cáo tóm tắt"));
        }
    }

    /**
     * Extract user ID from JWT token
     */
    private Long extractUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }
}
