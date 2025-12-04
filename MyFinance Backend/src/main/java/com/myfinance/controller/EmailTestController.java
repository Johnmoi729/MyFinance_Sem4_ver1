package com.myfinance.controller;

import com.myfinance.dto.response.ApiResponse;
import com.myfinance.service.MonthlySummaryScheduler;
import com.myfinance.service.WeeklySummaryScheduler;
import com.myfinance.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Test controller for manually triggering email functions
 * FOR TESTING PURPOSES ONLY - Remove or secure in production
 */
@RestController
@RequestMapping("/api/test/emails")
@RequiredArgsConstructor
@Slf4j
public class EmailTestController {

    private final MonthlySummaryScheduler monthlySummaryScheduler;
    private final WeeklySummaryScheduler weeklySummaryScheduler;
    private final com.myfinance.service.ScheduledReportService scheduledReportService;
    private final JwtUtil jwtUtil;

    /**
     * Test monthly summary email for current user
     * GET /api/test/emails/monthly-summary
     */
    @GetMapping("/monthly-summary")
    public ResponseEntity<ApiResponse<String>> testMonthlySummary(
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);
            monthlySummaryScheduler.sendLastMonthSummary(userId);

            return ResponseEntity.ok(
                    ApiResponse.success("Email tóm tắt tháng đã được gửi thành công! Kiểm tra Mailtrap inbox.",
                            "Monthly summary email sent to your account")
            );
        } catch (Exception e) {
            log.error("Failed to send test monthly summary email", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Không thể gửi email: " + e.getMessage()));
        }
    }

    /**
     * Test weekly summary email for current user
     * GET /api/test/emails/weekly-summary
     */
    @GetMapping("/weekly-summary")
    public ResponseEntity<ApiResponse<String>> testWeeklySummary(
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);
            weeklySummaryScheduler.sendLastWeekSummary(userId);

            return ResponseEntity.ok(
                    ApiResponse.success("Email tóm tắt tuần đã được gửi thành công! Kiểm tra Mailtrap inbox.",
                            "Weekly summary email sent to your account")
            );
        } catch (Exception e) {
            log.error("Failed to send test weekly summary email", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Không thể gửi email: " + e.getMessage()));
        }
    }

    /**
     * Test scheduled report email for current user
     * GET /api/test/emails/scheduled-report
     */
    @GetMapping("/scheduled-report")
    public ResponseEntity<ApiResponse<String>> testScheduledReport(
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = extractUserIdFromToken(authHeader);
            scheduledReportService.sendTestScheduledReport(userId);

            return ResponseEntity.ok(
                    ApiResponse.success("Email báo cáo định kỳ đã được gửi thành công! Kiểm tra Mailtrap inbox.",
                            "Scheduled report email sent with attachment")
            );
        } catch (Exception e) {
            log.error("Failed to send test scheduled report email", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Không thể gửi email: " + e.getMessage()));
        }
    }

    private Long extractUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }
}
