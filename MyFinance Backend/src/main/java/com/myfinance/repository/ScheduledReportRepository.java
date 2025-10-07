package com.myfinance.repository;

import com.myfinance.entity.ScheduledReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduledReportRepository extends JpaRepository<ScheduledReport, Long> {

    /**
     * Find all scheduled reports for a user
     */
    List<ScheduledReport> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Find a specific scheduled report by user ID and report ID
     */
    Optional<ScheduledReport> findByIdAndUserId(Long id, Long userId);

    /**
     * Find all active scheduled reports that are due to run
     */
    @Query("SELECT sr FROM ScheduledReport sr WHERE sr.isActive = true AND sr.nextRun <= :currentTime")
    List<ScheduledReport> findDueReports(LocalDateTime currentTime);

    /**
     * Find all active reports
     */
    List<ScheduledReport> findByIsActiveTrue();

    /**
     * Count active reports for a user
     */
    Long countByUserIdAndIsActiveTrue(Long userId);
}
