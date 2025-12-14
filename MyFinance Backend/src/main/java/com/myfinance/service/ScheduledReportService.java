package com.myfinance.service;

import com.myfinance.dto.response.CategoryReportResponse;
import com.myfinance.dto.response.MonthlyReportResponse;
import com.myfinance.dto.response.YearlyReportResponse;
import com.myfinance.entity.ScheduledReport;
import com.myfinance.entity.User;
import com.myfinance.exception.ResourceNotFoundException;
import com.myfinance.repository.ScheduledReportRepository;
import com.myfinance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledReportService {

    private final ScheduledReportRepository scheduledReportRepository;
    private final UserRepository userRepository;
    private final ReportService reportService;
    private final EmailService emailService;
    private final PDFReportGenerator pdfReportGenerator;
    private final CSVReportGenerator csvReportGenerator;

    /**
     * Create a new scheduled report
     */
    @Transactional
    public ScheduledReport createScheduledReport(Long userId, ScheduledReport.ReportType reportType,
                                                   ScheduledReport.ScheduleFrequency frequency,
                                                   ScheduledReport.ReportFormat format,
                                                   Boolean emailDelivery,
                                                   Integer scheduledHour,
                                                   Integer scheduledMinute,
                                                   Integer scheduledDayOfWeek,
                                                   Integer scheduledDayOfMonth) {
        log.info("Creating scheduled report for user {}: type={}, frequency={}, format={}, hour={}, minute={}, dayOfWeek={}, dayOfMonth={}",
                userId, reportType, frequency, format, scheduledHour, scheduledMinute, scheduledDayOfWeek, scheduledDayOfMonth);

        ScheduledReport scheduledReport = ScheduledReport.builder()
                .userId(userId)
                .reportType(reportType)
                .frequency(frequency)
                .format(format)
                .emailDelivery(emailDelivery != null ? emailDelivery : true)
                .scheduledHour(scheduledHour)
                .scheduledMinute(scheduledMinute)
                .scheduledDayOfWeek(scheduledDayOfWeek)
                .scheduledDayOfMonth(scheduledDayOfMonth)
                .isActive(true)
                .runCount(0)
                .build();

        return scheduledReportRepository.save(scheduledReport);
    }

    /**
     * Get all scheduled reports for a user
     */
    public List<ScheduledReport> getUserScheduledReports(Long userId) {
        return scheduledReportRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get a scheduled report by ID
     */
    public ScheduledReport getScheduledReport(Long reportId, Long userId) {
        return scheduledReportRepository.findByIdAndUserId(reportId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy báo cáo định kỳ"));
    }

    /**
     * Update scheduled report
     */
    @Transactional
    public ScheduledReport updateScheduledReport(Long reportId, Long userId,
                                                   ScheduledReport.ReportType reportType,
                                                   ScheduledReport.ScheduleFrequency frequency,
                                                   ScheduledReport.ReportFormat format,
                                                   Boolean emailDelivery,
                                                   Boolean isActive,
                                                   Integer scheduledHour,
                                                   Integer scheduledMinute,
                                                   Integer scheduledDayOfWeek,
                                                   Integer scheduledDayOfMonth) {
        ScheduledReport report = getScheduledReport(reportId, userId);

        boolean needsNextRunRecalculation = false;

        if (reportType != null) report.setReportType(reportType);
        if (frequency != null) {
            report.setFrequency(frequency);
            needsNextRunRecalculation = true;
        }
        if (format != null) report.setFormat(format);
        if (emailDelivery != null) report.setEmailDelivery(emailDelivery);
        if (isActive != null) report.setIsActive(isActive);

        // Update time-related fields
        if (scheduledHour != null || scheduledMinute != null || scheduledDayOfWeek != null || scheduledDayOfMonth != null) {
            if (scheduledHour != null) report.setScheduledHour(scheduledHour);
            if (scheduledMinute != null) report.setScheduledMinute(scheduledMinute);
            if (scheduledDayOfWeek != null) report.setScheduledDayOfWeek(scheduledDayOfWeek);
            if (scheduledDayOfMonth != null) report.setScheduledDayOfMonth(scheduledDayOfMonth);
            needsNextRunRecalculation = true;
        }

        // Recalculate nextRun if frequency or time settings changed
        if (needsNextRunRecalculation) {
            report.setNextRun(report.calculateNextRun());
        }

        return scheduledReportRepository.save(report);
    }

    /**
     * Delete scheduled report
     */
    @Transactional
    public void deleteScheduledReport(Long reportId, Long userId) {
        ScheduledReport report = getScheduledReport(reportId, userId);
        scheduledReportRepository.delete(report);
        log.info("Deleted scheduled report {} for user {}", reportId, userId);
    }

    /**
     * Execute all due scheduled reports
     * Runs every hour
     */
    @Scheduled(cron = "0 0 * * * *") // Every hour at minute 0
    @Transactional
    public void executeScheduledReports() {
        log.info("Executing scheduled reports check...");

        LocalDateTime now = LocalDateTime.now();
        List<ScheduledReport> dueReports = scheduledReportRepository.findDueReports(now);

        log.info("Found {} due reports to execute", dueReports.size());

        for (ScheduledReport scheduledReport : dueReports) {
            try {
                executeReport(scheduledReport);
            } catch (Exception e) {
                log.error("Failed to execute scheduled report {}: {}", scheduledReport.getId(), e.getMessage(), e);
            }
        }
    }

    /**
     * Execute a single scheduled report
     */
    @Transactional
    public void executeReport(ScheduledReport scheduledReport) {
        log.info("Executing scheduled report {}: type={}, user={}",
                scheduledReport.getId(), scheduledReport.getReportType(), scheduledReport.getUserId());

        User user = userRepository.findById(scheduledReport.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        try {
            // Generate report based on type
            byte[] reportData = generateReportData(scheduledReport, user);

            // Send email if enabled
            if (scheduledReport.getEmailDelivery() && reportData != null) {
                String fileName = String.format("%s_report_%s.%s",
                        scheduledReport.getReportType().name().toLowerCase(),
                        LocalDate.now(),
                        getFileExtension(scheduledReport.getFormat()));

                emailService.sendScheduledReportEmail(
                        user.getId(),
                        user.getEmail(),
                        user.getFullName(),
                        getReportTypeName(scheduledReport.getReportType()),
                        reportData,
                        fileName
                );
            }

            // Update schedule
            scheduledReport.setLastRun(LocalDateTime.now());
            scheduledReport.setNextRun(scheduledReport.calculateNextRun());
            scheduledReport.setRunCount(scheduledReport.getRunCount() + 1);
            scheduledReportRepository.save(scheduledReport);

            log.info("Successfully executed scheduled report {}", scheduledReport.getId());
        } catch (Exception e) {
            log.error("Error executing scheduled report {}: {}", scheduledReport.getId(), e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Execute a scheduled report manually (triggered by "Send Now" button)
     * Updates lastManualSend timestamp for rate limiting
     */
    @Transactional
    public void executeReportManually(ScheduledReport scheduledReport) {
        log.info("Manually executing scheduled report {}: type={}, user={}",
                scheduledReport.getId(), scheduledReport.getReportType(), scheduledReport.getUserId());

        // Execute the report normally
        executeReport(scheduledReport);

        // Update lastManualSend timestamp for rate limiting
        scheduledReport.setLastManualSend(LocalDateTime.now());
        scheduledReportRepository.save(scheduledReport);

        log.info("Successfully executed manual report send for schedule {}", scheduledReport.getId());
    }

    /**
     * Generate report data based on report type and format
     */
    private byte[] generateReportData(ScheduledReport scheduledReport, User user) {
        LocalDate now = LocalDate.now();
        ScheduledReport.ReportFormat format = scheduledReport.getFormat();

        return switch (scheduledReport.getReportType()) {
            case MONTHLY -> {
                MonthlyReportResponse report = reportService.generateMonthlySummary(
                        user.getId(), now.getYear(), now.getMonthValue());
                yield generateReportBytes(report, null, format);
            }
            case YEARLY -> {
                YearlyReportResponse report = reportService.generateYearlySummary(
                        user.getId(), now.getYear());
                yield generateReportBytes(null, report, format);
            }
            case CATEGORY -> {
                // For category reports, use monthly report as fallback
                // (Category-specific reports would need additional configuration)
                MonthlyReportResponse report = reportService.generateMonthlySummary(
                        user.getId(), now.getYear(), now.getMonthValue());
                yield generateReportBytes(report, null, format);
            }
        };
    }

    /**
     * Generate report bytes based on format (PDF, CSV, or BOTH)
     */
    private byte[] generateReportBytes(MonthlyReportResponse monthlyReport,
                                        YearlyReportResponse yearlyReport,
                                        ScheduledReport.ReportFormat format) {
        try {
            return switch (format) {
                case PDF -> {
                    if (monthlyReport != null) {
                        yield pdfReportGenerator.generateMonthlyReportPDF(monthlyReport);
                    } else if (yearlyReport != null) {
                        yield pdfReportGenerator.generateYearlyReportPDF(yearlyReport);
                    } else {
                        yield null;
                    }
                }
                case CSV -> {
                    if (monthlyReport != null) {
                        yield csvReportGenerator.generateMonthlyReportCSV(monthlyReport);
                    } else if (yearlyReport != null) {
                        yield csvReportGenerator.generateYearlyReportCSV(yearlyReport);
                    } else {
                        yield null;
                    }
                }
                case BOTH -> {
                    // Generate both PDF and CSV, then create a ZIP archive
                    if (monthlyReport != null) {
                        byte[] pdfData = pdfReportGenerator.generateMonthlyReportPDF(monthlyReport);
                        byte[] csvData = csvReportGenerator.generateMonthlyReportCSV(monthlyReport);
                        yield createZipFile(pdfData, csvData, "monthly_report_" +
                            monthlyReport.getYear() + "_" + monthlyReport.getMonth());
                    } else if (yearlyReport != null) {
                        byte[] pdfData = pdfReportGenerator.generateYearlyReportPDF(yearlyReport);
                        byte[] csvData = csvReportGenerator.generateYearlyReportCSV(yearlyReport);
                        yield createZipFile(pdfData, csvData, "yearly_report_" + yearlyReport.getYear());
                    } else {
                        yield null;
                    }
                }
            };
        } catch (Exception e) {
            log.error("Failed to generate report bytes", e);
            return null;
        }
    }

    /**
     * Create a ZIP file containing both PDF and CSV reports
     */
    private byte[] createZipFile(byte[] pdfData, byte[] csvData, String baseName) {
        if (pdfData == null || csvData == null) {
            log.error("Cannot create ZIP file: missing PDF or CSV data");
            return null;
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {

            // Add PDF entry
            ZipEntry pdfEntry = new ZipEntry(baseName + ".pdf");
            zos.putNextEntry(pdfEntry);
            zos.write(pdfData);
            zos.closeEntry();

            // Add CSV entry
            ZipEntry csvEntry = new ZipEntry(baseName + ".csv");
            zos.putNextEntry(csvEntry);
            zos.write(csvData);
            zos.closeEntry();

            zos.finish();
            return baos.toByteArray();
        } catch (IOException e) {
            log.error("Failed to create ZIP file", e);
            return null;
        }
    }

    /**
     * Get file extension based on format
     */
    private String getFileExtension(ScheduledReport.ReportFormat format) {
        return switch (format) {
            case PDF -> "pdf";
            case CSV -> "csv";
            case BOTH -> "zip"; // If both, create a ZIP file
        };
    }

    /**
     * Get Vietnamese report type name
     */
    private String getReportTypeName(ScheduledReport.ReportType reportType) {
        return switch (reportType) {
            case MONTHLY -> "Báo cáo tháng";
            case YEARLY -> "Báo cáo năm";
            case CATEGORY -> "Báo cáo danh mục";
        };
    }

    /**
     * Test function: Send a sample scheduled report email to user
     * Creates a temporary monthly report and sends it via email
     */
    public void sendTestScheduledReport(Long userId) {
        log.info("Sending test scheduled report email to user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        try {
            // Generate a sample monthly report
            LocalDate now = LocalDate.now();
            MonthlyReportResponse report = reportService.generateMonthlySummary(
                    userId, now.getYear(), now.getMonthValue());

            // Generate PDF report
            byte[] reportData = pdfReportGenerator.generateMonthlyReportPDF(report);

            // Send email
            String fileName = String.format("test_monthly_report_%s.pdf", LocalDate.now());
            emailService.sendScheduledReportEmail(
                    user.getId(),
                    user.getEmail(),
                    user.getFullName(),
                    "Báo cáo tháng (TEST)",
                    reportData,
                    fileName
            );

            log.info("Test scheduled report email sent successfully to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send test scheduled report to user: {}", userId, e);
            throw new RuntimeException("Không thể gửi email báo cáo: " + e.getMessage());
        }
    }
}
