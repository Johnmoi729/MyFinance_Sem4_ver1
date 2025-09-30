package com.myfinance.service;

import com.myfinance.dto.request.UserBudgetSettingsRequest;
import com.myfinance.dto.response.UserBudgetSettingsResponse;
import com.myfinance.entity.UserBudgetSettings;
import com.myfinance.exception.BadRequestException;
import com.myfinance.exception.ResourceNotFoundException;
import com.myfinance.repository.UserBudgetSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserBudgetSettingsService {

    private final UserBudgetSettingsRepository settingsRepository;

    public UserBudgetSettingsResponse getUserBudgetSettings(Long userId) {
        UserBudgetSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultSettings(userId));

        return mapToResponse(settings);
    }

    @Transactional
    public UserBudgetSettingsResponse updateUserBudgetSettings(Long userId, UserBudgetSettingsRequest request) {
        // Validate thresholds
        if (!request.isValid()) {
            throw new BadRequestException("Ngưỡng nghiêm trọng phải lớn hơn ngưỡng cảnh báo");
        }

        UserBudgetSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultSettings(userId));

        // Update settings
        settings.setWarningThreshold(request.getWarningThreshold());
        settings.setCriticalThreshold(request.getCriticalThreshold());
        settings.setNotificationsEnabled(request.getNotificationsEnabled());
        settings.setEmailAlertsEnabled(request.getEmailAlertsEnabled());
        settings.setDailySummaryEnabled(request.getDailySummaryEnabled());

        UserBudgetSettings savedSettings = settingsRepository.save(settings);
        log.info("Updated budget settings for user: {}", userId);

        return mapToResponse(savedSettings);
    }

    @Transactional
    public void resetToDefaults(Long userId) {
        UserBudgetSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultSettings(userId));

        // Reset to default values
        settings.setWarningThreshold(75.0);
        settings.setCriticalThreshold(90.0);
        settings.setNotificationsEnabled(true);
        settings.setEmailAlertsEnabled(false);
        settings.setDailySummaryEnabled(true);

        settingsRepository.save(settings);
        log.info("Reset budget settings to defaults for user: {}", userId);
    }

    public double getWarningThreshold(Long userId) {
        return settingsRepository.findByUserId(userId)
                .map(UserBudgetSettings::getWarningThreshold)
                .orElse(75.0); // Default threshold
    }

    public double getCriticalThreshold(Long userId) {
        return settingsRepository.findByUserId(userId)
                .map(UserBudgetSettings::getCriticalThreshold)
                .orElse(90.0); // Default threshold
    }

    public boolean areNotificationsEnabled(Long userId) {
        return settingsRepository.findByUserId(userId)
                .map(UserBudgetSettings::getNotificationsEnabled)
                .orElse(true); // Default enabled
    }

    private UserBudgetSettings createDefaultSettings(Long userId) {
        UserBudgetSettings defaultSettings = new UserBudgetSettings();
        defaultSettings.setUserId(userId);
        defaultSettings.setWarningThreshold(75.0);
        defaultSettings.setCriticalThreshold(90.0);
        defaultSettings.setNotificationsEnabled(true);
        defaultSettings.setEmailAlertsEnabled(false);
        defaultSettings.setDailySummaryEnabled(true);

        return settingsRepository.save(defaultSettings);
    }

    private UserBudgetSettingsResponse mapToResponse(UserBudgetSettings settings) {
        return UserBudgetSettingsResponse.builder()
                .id(settings.getId())
                .userId(settings.getUserId())
                .warningThreshold(settings.getWarningThreshold())
                .criticalThreshold(settings.getCriticalThreshold())
                .notificationsEnabled(settings.getNotificationsEnabled())
                .emailAlertsEnabled(settings.getEmailAlertsEnabled())
                .dailySummaryEnabled(settings.getDailySummaryEnabled())
                .createdAt(settings.getCreatedAt())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}