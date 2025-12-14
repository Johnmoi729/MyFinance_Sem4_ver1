package com.myfinance.service;

import com.myfinance.entity.UserPreferences;
import com.myfinance.exception.ResourceNotFoundException;
import com.myfinance.repository.UserPreferencesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserPreferencesService {

    private final UserPreferencesRepository preferencesRepository;

    /**
     * Get user preferences by user ID
     * Creates default preferences if not exists
     */
    public UserPreferences getUserPreferences(Long userId) {
        return preferencesRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultPreferences(userId));
    }

    /**
     * Create default preferences for a new user
     */
    @Transactional
    public UserPreferences createDefaultPreferences(Long userId) {
        log.info("Creating default preferences for user: {}", userId);

        // Check if preferences already exist
        if (preferencesRepository.existsByUserId(userId)) {
            return preferencesRepository.findByUserId(userId).get();
        }

        UserPreferences preferences = new UserPreferences();
        preferences.setUserId(userId);

        // Set default values (already defined in entity, but explicit here for clarity)
        // Display Preferences (1 field)
        preferences.setViewMode("detailed");

        // Notification Preferences (2 fields)
        preferences.setEmailNotifications(true);
        preferences.setBudgetAlerts(true);

        UserPreferences savedPreferences = preferencesRepository.save(preferences);
        log.info("Default preferences created for user: {}", userId);

        return savedPreferences;
    }

    /**
     * Update user preferences
     */
    @Transactional
    public UserPreferences updatePreferences(Long userId, UserPreferences updatedPreferences) {
        log.info("Updating preferences for user: {}", userId);

        UserPreferences preferences = getUserPreferences(userId);

        // Update display preferences (1 field)
        if (updatedPreferences.getViewMode() != null) {
            preferences.setViewMode(updatedPreferences.getViewMode());
        }

        // Update notification preferences (2 fields)
        if (updatedPreferences.getEmailNotifications() != null) {
            preferences.setEmailNotifications(updatedPreferences.getEmailNotifications());
        }
        if (updatedPreferences.getBudgetAlerts() != null) {
            preferences.setBudgetAlerts(updatedPreferences.getBudgetAlerts());
        }

        UserPreferences savedPreferences = preferencesRepository.save(preferences);
        log.info("Preferences updated successfully for user: {}", userId);

        return savedPreferences;
    }

    /**
     * Reset preferences to default
     */
    @Transactional
    public UserPreferences resetToDefaults(Long userId) {
        log.info("Resetting preferences to default for user: {}", userId);

        UserPreferences preferences = getUserPreferences(userId);

        // Reset to default values
        // Display Preferences (1 field)
        preferences.setViewMode("detailed");

        // Notification Preferences (2 fields)
        preferences.setEmailNotifications(true);
        preferences.setBudgetAlerts(true);

        UserPreferences savedPreferences = preferencesRepository.save(preferences);
        log.info("Preferences reset to default for user: {}", userId);

        return savedPreferences;
    }

    /**
     * Delete user preferences (for cleanup when user is deleted)
     */
    @Transactional
    public void deletePreferences(Long userId) {
        log.info("Deleting preferences for user: {}", userId);
        preferencesRepository.deleteByUserId(userId);
    }
}
