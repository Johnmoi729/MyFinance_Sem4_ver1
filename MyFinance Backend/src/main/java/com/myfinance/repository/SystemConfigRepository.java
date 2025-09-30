package com.myfinance.repository;

import com.myfinance.entity.SystemConfig;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, String> {
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.configKey = :key")
    Optional<SystemConfig> findByConfigKey(@Param("key") String key);

    @Query("SELECT sc FROM SystemConfig sc WHERE sc.isPublic = true")
    List<SystemConfig> findPublicConfigs();

    @Query("SELECT sc FROM SystemConfig sc WHERE sc.configType = :type")
    List<SystemConfig> findByConfigType(@Param("type") SystemConfig.ConfigType type);

    @Query("SELECT sc.configValue FROM SystemConfig sc WHERE sc.configKey = :key")
    Optional<String> findValueByKey(@Param("key") String key);

    boolean existsByConfigKey(String configKey);

    // Admin pagination methods
    Page<SystemConfig> findByConfigType(SystemConfig.ConfigType type, Pageable pageable);

    Page<SystemConfig> findByIsPublic(Boolean isPublic, Pageable pageable);

    Page<SystemConfig> findByConfigTypeAndIsPublic(SystemConfig.ConfigType type, Boolean isPublic, Pageable pageable);

    // Feature flag methods
    List<SystemConfig> findByConfigKeyStartingWith(String prefix);
}