package com.myfinance.controller;

import com.myfinance.dto.response.ApiResponse;
import com.myfinance.entity.ScheduledReport;
import com.myfinance.service.ScheduledReportService;
import com.myfinance.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheduled-reports")
@RequiredArgsConstructor
@Slf4j
public class ScheduledReportController {

    private final ScheduledReportService scheduledReportService;
    private final JwtUtil jwtUtil;

    /**
     * Create a new scheduled report
     * POST /api/scheduled-reports
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ScheduledReport>> createScheduledReport(
            @Valid @RequestBody ScheduledReportRequest request,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);

            ScheduledReport report = scheduledReportService.createScheduledReport(
                    userId,
                    request.getReportType(),
                    request.getFrequency(),
                    request.getFormat(),
                    request.getEmailDelivery()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Tạo báo cáo định kỳ thành công", report));
        } catch (Exception e) {
            log.error("Error creating scheduled report", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Lỗi khi tạo báo cáo định kỳ"));
        }
    }

    /**
     * Get all scheduled reports for current user
     * GET /api/scheduled-reports
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduledReport>>> getUserScheduledReports(
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);
            List<ScheduledReport> reports = scheduledReportService.getUserScheduledReports(userId);

            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách báo cáo định kỳ thành công", reports));
        } catch (Exception e) {
            log.error("Error fetching scheduled reports", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Lỗi khi lấy danh sách báo cáo định kỳ"));
        }
    }

    /**
     * Get a specific scheduled report
     * GET /api/scheduled-reports/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduledReport>> getScheduledReport(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);
            ScheduledReport report = scheduledReportService.getScheduledReport(id, userId);

            return ResponseEntity.ok(ApiResponse.success("Lấy báo cáo định kỳ thành công", report));
        } catch (Exception e) {
            log.error("Error fetching scheduled report {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Không tìm thấy báo cáo định kỳ"));
        }
    }

    /**
     * Update a scheduled report
     * PUT /api/scheduled-reports/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduledReport>> updateScheduledReport(
            @PathVariable Long id,
            @Valid @RequestBody ScheduledReportRequest request,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);

            ScheduledReport report = scheduledReportService.updateScheduledReport(
                    id,
                    userId,
                    request.getReportType(),
                    request.getFrequency(),
                    request.getFormat(),
                    request.getEmailDelivery(),
                    request.getIsActive()
            );

            return ResponseEntity.ok(ApiResponse.success("Cập nhật báo cáo định kỳ thành công", report));
        } catch (Exception e) {
            log.error("Error updating scheduled report {}", id, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Lỗi khi cập nhật báo cáo định kỳ"));
        }
    }

    /**
     * Delete a scheduled report
     * DELETE /api/scheduled-reports/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteScheduledReport(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);
            scheduledReportService.deleteScheduledReport(id, userId);

            return ResponseEntity.ok(ApiResponse.success("Xóa báo cáo định kỳ thành công", null));
        } catch (Exception e) {
            log.error("Error deleting scheduled report {}", id, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Lỗi khi xóa báo cáo định kỳ"));
        }
    }

    /**
     * Toggle scheduled report active status
     * PATCH /api/scheduled-reports/{id}/toggle
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<ScheduledReport>> toggleScheduledReport(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);
            ScheduledReport report = scheduledReportService.getScheduledReport(id, userId);

            report = scheduledReportService.updateScheduledReport(
                    id,
                    userId,
                    null,
                    null,
                    null,
                    null,
                    !report.getIsActive()
            );

            String message = report.getIsActive() ? "Bật báo cáo định kỳ thành công" : "Tắt báo cáo định kỳ thành công";
            return ResponseEntity.ok(ApiResponse.success(message, report));
        } catch (Exception e) {
            log.error("Error toggling scheduled report {}", id, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Lỗi khi thay đổi trạng thái báo cáo định kỳ"));
        }
    }

    // Helper method
    private Long extractUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }

    // DTOs
    @lombok.Data
    public static class ScheduledReportRequest {
        private ScheduledReport.ReportType reportType;
        private ScheduledReport.ScheduleFrequency frequency;
        private ScheduledReport.ReportFormat format;
        private Boolean emailDelivery = true;
        private Boolean isActive = true;
    }
}
