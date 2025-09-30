package com.myfinance.controller;

import com.myfinance.dto.request.UserBudgetSettingsRequest;
import com.myfinance.dto.response.ApiResponse;
import com.myfinance.dto.response.UserBudgetSettingsResponse;
import com.myfinance.service.UserBudgetSettingsService;
import com.myfinance.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget-settings")
@RequiredArgsConstructor
@Slf4j
public class UserBudgetSettingsController {

    private final UserBudgetSettingsService userBudgetSettingsService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<UserBudgetSettingsResponse>> getBudgetSettings(
            @RequestHeader("Authorization") String authHeader) {

        log.info("GET /api/budget-settings called");
        Long userId = extractUserIdFromToken(authHeader);
        UserBudgetSettingsResponse settings = userBudgetSettingsService.getUserBudgetSettings(userId);

        return ResponseEntity.ok(ApiResponse.success("Đã tải cài đặt ngân sách", settings));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserBudgetSettingsResponse>> updateBudgetSettings(
            @Valid @RequestBody UserBudgetSettingsRequest request,
            @RequestHeader("Authorization") String authHeader) {

        log.info("PUT /api/budget-settings called with request: {}", request);
        Long userId = extractUserIdFromToken(authHeader);
        UserBudgetSettingsResponse settings = userBudgetSettingsService.updateUserBudgetSettings(userId, request);

        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật cài đặt ngân sách thành công", settings));
    }

    @PostMapping("/reset")
    public ResponseEntity<ApiResponse<Void>> resetBudgetSettings(
            @RequestHeader("Authorization") String authHeader) {

        log.info("POST /api/budget-settings/reset called");
        Long userId = extractUserIdFromToken(authHeader);
        userBudgetSettingsService.resetToDefaults(userId);

        return ResponseEntity.ok(ApiResponse.success("Đã đặt lại cài đặt ngân sách về mặc định", null));
    }

    private Long extractUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }
}