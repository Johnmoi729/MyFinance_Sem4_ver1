package com.myfinance.controller;

import com.myfinance.dto.response.ApiResponse;
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

    private final com.myfinance.service.ScheduledReportService scheduledReportService;
    private final JwtUtil jwtUtil;

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
