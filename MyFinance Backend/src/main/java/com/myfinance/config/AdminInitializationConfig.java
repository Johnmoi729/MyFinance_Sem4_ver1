package com.myfinance.config;

import com.myfinance.service.AuthService;
import com.myfinance.service.RoleService;
import com.myfinance.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

/**
 * Configuration class to initialize admin system components on application startup
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class AdminInitializationConfig implements CommandLineRunner {

    private final RoleService roleService;
    private final SystemConfigService systemConfigService;
    private final AuthService authService;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Initializing admin system components...");

        try {
            // Initialize default roles
            roleService.initializeDefaultRoles();
            log.info("Default roles initialized successfully");

            // Initialize system configurations
            systemConfigService.initializeDefaultConfigs();
            log.info("Default system configurations initialized successfully");

            // Create default admin user
            authService.createDefaultAdminUser();
            log.info("Default admin user initialized successfully");

            log.info("Admin system initialization completed successfully");
        } catch (Exception e) {
            log.error("Failed to initialize admin system components", e);
            // Don't fail application startup if admin initialization fails
        }
    }
}