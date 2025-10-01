package com.myfinance.repository;

import com.myfinance.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findByOrderByTimestampDesc(Pageable pageable);

    Page<AuditLog> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);

    Page<AuditLog> findByAdminUserIdOrderByTimestampDesc(Long adminUserId, Pageable pageable);

    Page<AuditLog> findByActionOrderByTimestampDesc(String action, Pageable pageable);

    Page<AuditLog> findByEntityTypeOrderByTimestampDesc(String entityType, Pageable pageable);

    Page<AuditLog> findByTimestampBetweenOrderByTimestampDesc(
            LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    @Query("SELECT al FROM AuditLog al WHERE " +
           "(:userId IS NULL OR al.userId = :userId) AND " +
           "(:adminUserId IS NULL OR al.adminUserId = :adminUserId) AND " +
           "(:action IS NULL OR al.action = :action) AND " +
           "(:entityType IS NULL OR al.entityType = :entityType) AND " +
           "(:startDate IS NULL OR al.timestamp >= :startDate) AND " +
           "(:endDate IS NULL OR al.timestamp <= :endDate) " +
           "ORDER BY al.timestamp DESC")
    Page<AuditLog> findByFilters(
            @Param("userId") Long userId,
            @Param("adminUserId") Long adminUserId,
            @Param("action") String action,
            @Param("entityType") String entityType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query("SELECT COUNT(al) FROM AuditLog al WHERE al.adminUserId = :adminUserId")
    long countByAdminUserId(@Param("adminUserId") Long adminUserId);

    @Query("SELECT al.action, COUNT(al) FROM AuditLog al WHERE al.timestamp >= :startDate GROUP BY al.action")
    List<Object[]> getActionCountsSince(@Param("startDate") LocalDateTime startDate);

    // Additional methods for admin dashboard
    Long countByActionContainingIgnoreCaseAndTimestampGreaterThanEqual(String action, LocalDateTime timestamp);

    List<AuditLog> findTop50ByOrderByTimestampDesc();

    Long countByTimestampGreaterThanEqual(LocalDateTime timestamp);

    // For export and cleanup
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime startDate, LocalDateTime endDate);

    List<AuditLog> findByTimestampBefore(LocalDateTime cutoffDate);
}