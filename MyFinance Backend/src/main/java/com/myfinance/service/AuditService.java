package com.myfinance.service;

import com.myfinance.entity.AuditLog;
import com.myfinance.repository.AuditLogRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    /**
     * Log admin action
     */
    @Transactional
    public void logAdminAction(String action, String entityType, String entityId,
                              Long adminUserId, Long targetUserId, Object details,
                              String ipAddress, String userAgent) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setAction(action);
            auditLog.setEntityType(entityType);
            auditLog.setEntityId(entityId);
            auditLog.setAdminUserId(adminUserId);
            auditLog.setUserId(targetUserId);
            auditLog.setIpAddress(ipAddress);
            auditLog.setUserAgent(userAgent);
            auditLog.setTimestamp(LocalDateTime.now());

            if (details != null) {
                auditLog.setDetails(objectMapper.writeValueAsString(details));
            }

            auditLogRepository.save(auditLog);
            log.info("Audit log created: {} {} by admin {}", action, entityType, adminUserId);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize audit details: {}", e.getMessage());
            // Save without details if serialization fails
            logSimpleAction(action, entityType, entityId, adminUserId, targetUserId, ipAddress);
        } catch (Exception e) {
            log.error("Failed to create audit log: {}", e.getMessage());
        }
    }

    /**
     * Log simple action without details
     */
    @Transactional
    public void logSimpleAction(String action, String entityType, String entityId,
                               Long adminUserId, Long targetUserId, String ipAddress) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setAction(action);
            auditLog.setEntityType(entityType);
            auditLog.setEntityId(entityId);
            auditLog.setAdminUserId(adminUserId);
            auditLog.setUserId(targetUserId);
            auditLog.setIpAddress(ipAddress);
            auditLog.setTimestamp(LocalDateTime.now());

            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to create simple audit log: {}", e.getMessage());
        }
    }

    /**
     * Log user management action
     */
    public void logUserManagement(String action, Long targetUserId, Long adminUserId,
                                 Object beforeState, Object afterState, String ipAddress) {
        try {
            Map<String, Object> details = new HashMap<>();
            if (beforeState != null) {
                details.put("before", beforeState);
            }
            if (afterState != null) {
                details.put("after", afterState);
            }

            logAdminAction(action, "USER", targetUserId.toString(), adminUserId,
                          targetUserId, details, ipAddress, null);
        } catch (Exception e) {
            log.error("Failed to log user management action: {}", e.getMessage());
        }
    }

    /**
     * Log system configuration change
     */
    public void logSystemConfig(String action, String configKey, String oldValue,
                               String newValue, Long adminUserId, String ipAddress) {
        try {
            Map<String, Object> details = new HashMap<>();
            details.put("configKey", configKey);
            details.put("oldValue", oldValue);
            details.put("newValue", newValue);

            logAdminAction(action, "SYSTEM_CONFIG", configKey, adminUserId,
                          null, details, ipAddress, null);
        } catch (Exception e) {
            log.error("Failed to log system config change: {}", e.getMessage());
        }
    }

    /**
     * Log login attempt
     */
    public void logLogin(Long userId, boolean success, String ipAddress, String userAgent) {
        try {
            Map<String, Object> details = new HashMap<>();
            details.put("success", success);
            details.put("timestamp", LocalDateTime.now());

            logAdminAction(success ? "LOGIN_SUCCESS" : "LOGIN_FAILED", "AUTH",
                          userId != null ? userId.toString() : "unknown",
                          userId, userId, details, ipAddress, userAgent);
        } catch (Exception e) {
            log.error("Failed to log login attempt: {}", e.getMessage());
        }
    }

    /**
     * Get audit logs with pagination
     */
    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findByOrderByTimestampDesc(pageable);
    }

    /**
     * Get audit logs by user
     */
    public Page<AuditLog> getAuditLogsByUser(Long userId, Pageable pageable) {
        return auditLogRepository.findByUserIdOrderByTimestampDesc(userId, pageable);
    }

    /**
     * Get audit logs by admin
     */
    public Page<AuditLog> getAuditLogsByAdmin(Long adminUserId, Pageable pageable) {
        return auditLogRepository.findByAdminUserIdOrderByTimestampDesc(adminUserId, pageable);
    }

    /**
     * Get audit logs with filters
     */
    public Page<AuditLog> getAuditLogsWithFilters(Long userId, Long adminUserId, String action,
                                                 String entityType, LocalDateTime startDate,
                                                 LocalDateTime endDate, Pageable pageable) {
        return auditLogRepository.findByFilters(userId, adminUserId, action, entityType,
                                               startDate, endDate, pageable);
    }

    /**
     * Get action statistics
     */
    public List<Object[]> getActionStatistics(LocalDateTime since) {
        return auditLogRepository.getActionCountsSince(since);
    }

    /**
     * Get admin activity count
     */
    public long getAdminActivityCount(Long adminUserId) {
        return auditLogRepository.countByAdminUserId(adminUserId);
    }

    /**
     * Log admin action with username (overloaded method for controller usage)
     */
    @Transactional
    public void logAdminAction(String username, String action, String entityType, Long entityId,
                              String description, String ipAddress, String userAgent) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setAction(action);
            auditLog.setEntityType(entityType);
            auditLog.setEntityId(entityId != null ? entityId.toString() : null);
            auditLog.setUserId(entityId); // For simplicity, using entityId as userId
            auditLog.setIpAddress(ipAddress);
            auditLog.setUserAgent(userAgent);
            auditLog.setTimestamp(LocalDateTime.now());

            Map<String, Object> details = new HashMap<>();
            details.put("description", description);
            details.put("username", username);
            auditLog.setDetails(objectMapper.writeValueAsString(details));

            auditLogRepository.save(auditLog);
            log.info("Audit log created: {} {} by {}", action, entityType, username);
        } catch (JsonProcessingException e) {
            log.error("Error serializing audit details", e);
        } catch (Exception e) {
            log.error("Error creating audit log", e);
        }
    }

    /**
     * Log admin action with before/after values
     */
    @Transactional
    public void logAdminAction(String username, String action, String entityType, Long entityId,
                              String description, String oldValue, String newValue,
                              String ipAddress, String userAgent) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setAction(action);
            auditLog.setEntityType(entityType);
            auditLog.setEntityId(entityId != null ? entityId.toString() : null);
            auditLog.setUserId(entityId);
            auditLog.setIpAddress(ipAddress);
            auditLog.setUserAgent(userAgent);
            auditLog.setTimestamp(LocalDateTime.now());

            Map<String, Object> details = new HashMap<>();
            details.put("description", description);
            details.put("username", username);
            details.put("oldValue", oldValue);
            details.put("newValue", newValue);
            auditLog.setDetails(objectMapper.writeValueAsString(details));

            auditLogRepository.save(auditLog);
            log.info("Audit log created: {} {} by {}", action, entityType, username);
        } catch (JsonProcessingException e) {
            log.error("Error serializing audit details", e);
        } catch (Exception e) {
            log.error("Error creating audit log", e);
        }
    }

    /**
     * Get error count since timestamp
     */
    public Long getErrorCountSince(LocalDateTime since) {
        return auditLogRepository.countByActionContainingIgnoreCaseAndTimestampGreaterThanEqual("ERROR", since);
    }

    /**
     * Get recent activities for admin dashboard
     */
    public List<Map<String, Object>> getRecentActivities(int limit) {
        List<AuditLog> logs = auditLogRepository.findTop50ByOrderByTimestampDesc();
        return logs.stream().map(log -> {
            Map<String, Object> activity = new HashMap<>();
            activity.put("action", log.getAction());
            activity.put("entityType", log.getEntityType());
            activity.put("userEmail", "system@myfinance.com"); // System-level actions
            activity.put("timestamp", log.getTimestamp());
            activity.put("details", log.getDetails());
            return activity;
        }).toList();
    }

    /**
     * Get audit summary for dashboard
     */
    public Map<String, Object> getAuditSummary(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        Map<String, Object> summary = new HashMap<>();

        Long totalActions = auditLogRepository.countByTimestampGreaterThanEqual(since);
        summary.put("totalActions", totalActions);

        Long errorCount = getErrorCountSince(since);
        summary.put("errorCount", errorCount);

        List<Object[]> actionStats = auditLogRepository.getActionCountsSince(since);
        summary.put("actionBreakdown", actionStats);

        return summary;
    }

    /**
     * Get audit log by ID
     */
    public AuditLog getAuditLogById(Long auditId) {
        return auditLogRepository.findById(auditId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy nhật ký audit với ID: " + auditId));
    }
}