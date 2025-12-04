package com.myfinance.controller;

import com.myfinance.dto.request.UserPreferencesRequest;
import com.myfinance.dto.response.ApiResponse;
import com.myfinance.dto.response.UserPreferencesResponse;
import com.myfinance.entity.UserPreferences;
import com.myfinance.service.UserPreferencesService;
import com.myfinance.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
public class UserPreferencesController {

    private final UserPreferencesService preferencesService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<UserPreferencesResponse>> getPreferences(
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        UserPreferences preferences = preferencesService.getUserPreferences(userId);
        UserPreferencesResponse response = mapToResponse(preferences);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserPreferencesResponse>> updatePreferences(
            @RequestBody UserPreferencesRequest request,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        UserPreferences requestEntity = mapToEntity(request);
        UserPreferences updated = preferencesService.updatePreferences(userId, requestEntity);
        UserPreferencesResponse response = mapToResponse(updated);

        return ResponseEntity.ok(ApiResponse.success("Cài đặt đã được cập nhật thành công", response));
    }

    @PostMapping("/reset")
    public ResponseEntity<ApiResponse<UserPreferencesResponse>> resetToDefaults(
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        UserPreferences preferences = preferencesService.resetToDefaults(userId);
        UserPreferencesResponse response = mapToResponse(preferences);

        return ResponseEntity.ok(ApiResponse.success("Cài đặt đã được đặt lại về mặc định", response));
    }

    private Long extractUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }

    private UserPreferencesResponse mapToResponse(UserPreferences preferences) {
        return UserPreferencesResponse.builder()
                .id(preferences.getId())
                .userId(preferences.getUserId())
                .language(preferences.getLanguage())
                .currency(preferences.getCurrency())
                .dateFormat(preferences.getDateFormat())
                .timezone(preferences.getTimezone())
                .theme(preferences.getTheme())
                .itemsPerPage(preferences.getItemsPerPage())
                .viewMode(preferences.getViewMode())
                .emailNotifications(preferences.getEmailNotifications())
                .budgetAlerts(preferences.getBudgetAlerts())
                .transactionReminders(preferences.getTransactionReminders())
                .weeklySummary(preferences.getWeeklySummary())
                .monthlySummary(preferences.getMonthlySummary())
                .goalReminders(preferences.getGoalReminders())
                .createdAt(preferences.getCreatedAt())
                .updatedAt(preferences.getUpdatedAt())
                .build();
    }

    private UserPreferences mapToEntity(UserPreferencesRequest request) {
        UserPreferences preferences = new UserPreferences();
        preferences.setLanguage(request.getLanguage());
        preferences.setCurrency(request.getCurrency());
        preferences.setDateFormat(request.getDateFormat());
        preferences.setTimezone(request.getTimezone());
        preferences.setTheme(request.getTheme());
        preferences.setItemsPerPage(request.getItemsPerPage());
        preferences.setViewMode(request.getViewMode());
        preferences.setEmailNotifications(request.getEmailNotifications());
        preferences.setBudgetAlerts(request.getBudgetAlerts());
        preferences.setTransactionReminders(request.getTransactionReminders());
        preferences.setWeeklySummary(request.getWeeklySummary());
        preferences.setMonthlySummary(request.getMonthlySummary());
        preferences.setGoalReminders(request.getGoalReminders());
        return preferences;
    }
}
