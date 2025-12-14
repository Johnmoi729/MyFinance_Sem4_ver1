package com.myfinance.service;

import com.myfinance.entity.SystemConfig;
import com.myfinance.repository.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemConfigService {

    private final SystemConfigRepository systemConfigRepository;
    private final AuditService auditService;

    /**
     * Get configuration value by key
     */
    public Optional<String> getConfigValue(String key) {
        return systemConfigRepository.findValueByKey(key);
    }

    /**
     * Get configuration as string with default value
     */
    public String getStringConfig(String key, String defaultValue) {
        return getConfigValue(key).orElse(defaultValue);
    }

    /**
     * Get configuration as boolean
     */
    public boolean getBooleanConfig(String key, boolean defaultValue) {
        return getConfigValue(key)
                .map(value -> "true".equalsIgnoreCase(value) || "1".equals(value))
                .orElse(defaultValue);
    }

    /**
     * Get configuration as integer
     */
    public int getIntConfig(String key, int defaultValue) {
        return getConfigValue(key)
                .map(value -> {
                    try {
                        return Integer.parseInt(value);
                    } catch (NumberFormatException e) {
                        log.warn("Invalid integer config value for key {}: {}", key, value);
                        return defaultValue;
                    }
                })
                .orElse(defaultValue);
    }

    /**
     * Get configuration as double
     */
    public double getDoubleConfig(String key, double defaultValue) {
        return getConfigValue(key)
                .map(value -> {
                    try {
                        return Double.parseDouble(value);
                    } catch (NumberFormatException e) {
                        log.warn("Invalid double config value for key {}: {}", key, value);
                        return defaultValue;
                    }
                })
                .orElse(defaultValue);
    }

    /**
     * Set configuration value
     */
    @Transactional
    public void setConfig(String key, String value, String description,
                         SystemConfig.ConfigType type, boolean isPublic,
                         Long updatedByUserId, String ipAddress) {

        String oldValue = getConfigValue(key).orElse(null);

        SystemConfig config = systemConfigRepository.findByConfigKey(key)
                .orElse(new SystemConfig());

        config.setConfigKey(key);
        config.setConfigValue(value);
        config.setDescription(description);
        config.setConfigType(type);
        config.setIsPublic(isPublic);
        config.setUpdatedByUserId(updatedByUserId);

        systemConfigRepository.save(config);

        // Log the change
        auditService.logSystemConfig(
                oldValue == null ? "CREATE_CONFIG" : "UPDATE_CONFIG",
                key, oldValue, value, updatedByUserId, ipAddress);

        log.info("System config updated: {} = {} by user {}", key, value, updatedByUserId);
    }

    /**
     * Set simple string configuration
     */
    public void setStringConfig(String key, String value, Long updatedByUserId, String ipAddress) {
        setConfig(key, value, null, SystemConfig.ConfigType.APPLICATION, false, updatedByUserId, ipAddress);
    }

    /**
     * Set boolean configuration
     */
    public void setBooleanConfig(String key, boolean value, Long updatedByUserId, String ipAddress) {
        setConfig(key, String.valueOf(value), null, SystemConfig.ConfigType.APPLICATION, false, updatedByUserId, ipAddress);
    }

    /**
     * Delete configuration
     */
    @Transactional
    public void deleteConfig(String key, Long deletedByUserId, String ipAddress) {
        Optional<SystemConfig> config = systemConfigRepository.findByConfigKey(key);
        if (config.isPresent()) {
            String oldValue = config.get().getConfigValue();
            systemConfigRepository.deleteById(key);

            auditService.logSystemConfig("DELETE_CONFIG", key, oldValue, null, deletedByUserId, ipAddress);
            log.info("System config deleted: {} by user {}", key, deletedByUserId);
        }
    }

    /**
     * Get all configurations
     */
    public List<SystemConfig> getAllConfigs() {
        return systemConfigRepository.findAll();
    }

    /**
     * Get public configurations
     */
    public List<SystemConfig> getPublicConfigs() {
        return systemConfigRepository.findPublicConfigs();
    }

    /**
     * Check if feature is enabled
     */
    public boolean isFeatureEnabled(String featureName) {
        return getBooleanConfig("FEATURE_" + featureName.toUpperCase(), false);
    }

    /**
     * Enable/disable feature
     */
    public void setFeatureEnabled(String featureName, boolean enabled, Long updatedByUserId, String ipAddress) {
        setBooleanConfig("FEATURE_" + featureName.toUpperCase(), enabled, updatedByUserId, ipAddress);
    }

    /**
     * Set maintenance mode
     */
    public void setMaintenanceMode(boolean enabled, Long updatedByUserId, String ipAddress) {
        setBooleanConfig("MAINTENANCE_MODE", enabled, updatedByUserId, ipAddress);
    }

    /**
     * Check if system is in maintenance mode
     */
    public boolean isMaintenanceMode() {
        return getBooleanConfig("MAINTENANCE_MODE", false);
    }

    /**
     * Initialize default configurations
     */
    @Transactional
    public void initializeDefaultConfigs() {
        // System settings
        setDefaultConfig("MAINTENANCE_MODE", "false", "Chế độ bảo trì hệ thống",
                        SystemConfig.ConfigType.MAINTENANCE, false);

        setDefaultConfig("MAX_LOGIN_ATTEMPTS", "5", "Số lần đăng nhập tối đa (Tính năng tương lai - chưa kích hoạt)",
                        SystemConfig.ConfigType.SECURITY, false);

        setDefaultConfig("SESSION_TIMEOUT_HOURS", "24", "Thời gian hết hạn phiên (giờ)",
                        SystemConfig.ConfigType.SECURITY, false);

        // Feature flags - REMOVED (core features should always be enabled)
        // Budget analytics and export are core functionality, not optional features

        // Public settings
        setDefaultConfig("APP_NAME", "MyFinance", "Tên ứng dụng (Tính năng tương lai - white-labeling)",
                        SystemConfig.ConfigType.APPLICATION, true);

        // DEFAULT_CURRENCY removed - conflicts with VND-only architecture decision

        log.info("Default system configurations initialized");
    }

    private void setDefaultConfig(String key, String value, String description,
                                 SystemConfig.ConfigType type, boolean isPublic) {
        if (!systemConfigRepository.existsByConfigKey(key)) {
            SystemConfig config = new SystemConfig();
            config.setConfigKey(key);
            config.setConfigValue(value);
            config.setDescription(description);
            config.setConfigType(type);
            config.setIsPublic(isPublic);
            systemConfigRepository.save(config);
        }
    }

    // Admin API methods
    public Page<SystemConfig> getAllConfigs(Pageable pageable, SystemConfig.ConfigType type, Boolean isPublic) {
        if (type != null && isPublic != null) {
            return systemConfigRepository.findByConfigTypeAndIsPublic(type, isPublic, pageable);
        } else if (type != null) {
            return systemConfigRepository.findByConfigType(type, pageable);
        } else if (isPublic != null) {
            return systemConfigRepository.findByIsPublic(isPublic, pageable);
        } else {
            return systemConfigRepository.findAll(pageable);
        }
    }

    public SystemConfig getConfigByKey(String configKey) {
        return systemConfigRepository.findByConfigKey(configKey)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy cấu hình với key: " + configKey));
    }

    public String getConfigValueRequired(String configKey) {
        return systemConfigRepository.findValueByKey(configKey)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy cấu hình với key: " + configKey));
    }

    // REMOVED: createConfig() method - configs are code-first only
    // New configs must be added in initializeDefaultConfigs() method

    @Transactional
    public SystemConfig updateConfig(String configKey, String configValue, String description,
                                   SystemConfig.ConfigType configType, Boolean isPublic) {
        SystemConfig config = getConfigByKey(configKey);

        config.setConfigValue(configValue);
        if (description != null) {
            config.setDescription(description);
        }
        if (configType != null) {
            config.setConfigType(configType);
        }
        if (isPublic != null) {
            config.setIsPublic(isPublic);
        }

        return systemConfigRepository.save(config);
    }

    // REMOVED: deleteConfigByKey() method - prevents accidental deletion of critical configs
    // System configs should persist throughout application lifecycle

    @Transactional
    public void setMaintenanceModeAdmin(Boolean enabled) {
        SystemConfig config = systemConfigRepository.findByConfigKey("MAINTENANCE_MODE")
            .orElse(new SystemConfig());

        config.setConfigKey("MAINTENANCE_MODE");
        config.setConfigValue(enabled.toString());
        config.setDescription("Chế độ bảo trì hệ thống");
        config.setConfigType(SystemConfig.ConfigType.MAINTENANCE);
        config.setIsPublic(false);

        systemConfigRepository.save(config);
    }

    public List<SystemConfig> getAllFeatureFlags() {
        return systemConfigRepository.findByConfigKeyStartingWith("FEATURE_");
    }
}