package com.myfinance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "system_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfig {
    @Id
    @Column(name = "config_key")
    @NotBlank
    private String configKey;

    @Column(name = "config_value", columnDefinition = "TEXT")
    private String configValue;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "config_type", nullable = false)
    @NotNull
    private ConfigType configType;

    @Column(name = "is_public", nullable = false)
    @NotNull
    private Boolean isPublic = false; // Whether config is visible to regular users

    @Column(name = "updated_by_user_id")
    private Long updatedByUserId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ConfigType {
        APPLICATION,
        SECURITY,
        FEATURE,
        UI,
        DATABASE,
        INTEGRATION,
        NOTIFICATION,
        PERFORMANCE,
        LOGGING,
        MAINTENANCE
    }
}