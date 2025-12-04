package com.myfinance.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final UserPreferencesService userPreferencesService;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm", new Locale("vi", "VN"));

    /**
     * Check if email should be sent based on user preferences
     * @param userId User ID
     * @param specificPreference Specific preference to check (e.g., budgetAlerts, monthlySummary)
     * @return true if email should be sent, false otherwise
     */
    private boolean shouldSendEmail(Long userId, String specificPreference) {
        if (!emailEnabled) {
            log.info("Email globally disabled via config");
            return false;
        }

        try {
            com.myfinance.entity.UserPreferences prefs = userPreferencesService.getUserPreferences(userId);

            // First check master email notification switch
            if (prefs.getEmailNotifications() == null || !prefs.getEmailNotifications()) {
                log.info("Email notifications disabled for user: {}", userId);
                return false;
            }

            // Then check specific preference if provided
            if (specificPreference != null) {
                Boolean specificPref = switch (specificPreference) {
                    case "budgetAlerts" -> prefs.getBudgetAlerts();
                    case "monthlySummary" -> prefs.getMonthlySummary();
                    case "weeklySummary" -> prefs.getWeeklySummary();
                    case "transactionReminders" -> prefs.getTransactionReminders();
                    case "goalReminders" -> prefs.getGoalReminders();
                    default -> true; // Unknown preference type, allow email
                };

                if (specificPref == null || !specificPref) {
                    log.info("{} disabled for user: {}", specificPreference, userId);
                    return false;
                }
            }

            return true;
        } catch (Exception e) {
            log.error("Error checking email preferences for user: {}. Defaulting to not sending email.", userId, e);
            return false; // Fail safe - don't send email if we can't check preferences
        }
    }

    /**
     * Send welcome email to new user
     */
    @Async
    public void sendWelcomeEmail(Long userId, String toEmail, String fullName) {
        if (!shouldSendEmail(userId, null)) {
            log.info("Welcome email not sent to {} - notifications disabled", toEmail);
            return;
        }

        try {
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("appName", "MyFinance");

            String htmlContent = templateEngine.process("email/welcome", context);

            sendHtmlEmail(toEmail, "Chào mừng đến với MyFinance!", htmlContent);
            log.info("Welcome email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", toEmail, e);
        }
    }

    /**
     * Send password reset email
     */
    @Async
    public void sendPasswordResetEmail(Long userId, String toEmail, String fullName, String resetToken) {
        if (!shouldSendEmail(userId, null)) {
            log.info("Password reset email not sent to {} - notifications disabled", toEmail);
            return;
        }

        try {
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("resetToken", resetToken);
            context.setVariable("resetLink", "http://localhost:3000/reset-password?token=" + resetToken);
            context.setVariable("expiryTime", "24 giờ");

            String htmlContent = templateEngine.process("email/password-reset", context);

            sendHtmlEmail(toEmail, "Đặt lại mật khẩu MyFinance", htmlContent);
            log.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
        }
    }

    /**
     * Send budget alert email when threshold exceeded
     */
    @Async
    public void sendBudgetAlertEmail(Long userId, String toEmail, String fullName, String categoryName,
                                      BigDecimal budgetAmount, BigDecimal actualAmount,
                                      Double usagePercent) {
        if (!shouldSendEmail(userId, "budgetAlerts")) {
            log.info("Budget alert email not sent to {} - notifications or budgetAlerts disabled", toEmail);
            return;
        }

        try {
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("categoryName", categoryName);
            context.setVariable("budgetAmount", formatCurrency(budgetAmount));
            context.setVariable("actualAmount", formatCurrency(actualAmount));
            context.setVariable("usagePercent", String.format("%.1f", usagePercent));
            context.setVariable("alertLevel", getAlertLevel(usagePercent));

            String htmlContent = templateEngine.process("email/budget-alert", context);

            String subject = String.format("Cảnh báo ngân sách: %s đã vượt %.0f%%", categoryName, usagePercent);
            sendHtmlEmail(toEmail, subject, htmlContent);
            log.info("Budget alert email sent to: {} for category: {}", toEmail, categoryName);
        } catch (Exception e) {
            log.error("Failed to send budget alert email to: {}", toEmail, e);
        }
    }

    /**
     * Send monthly summary email
     */
    @Async
    public void sendMonthlySummaryEmail(Long userId, String toEmail, String fullName,
                                         int year, int month,
                                         BigDecimal totalIncome,
                                         BigDecimal totalExpense,
                                         BigDecimal netSavings,
                                         Double savingsRate) {
        if (!shouldSendEmail(userId, "monthlySummary")) {
            log.info("Monthly summary email not sent to {} - notifications or monthlySummary disabled", toEmail);
            return;
        }

        try {
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("year", year);
            context.setVariable("month", month);
            context.setVariable("monthName", getVietnameseMonthName(month));
            context.setVariable("totalIncome", formatCurrency(totalIncome));
            context.setVariable("totalExpense", formatCurrency(totalExpense));
            context.setVariable("netSavings", formatCurrency(netSavings));
            context.setVariable("savingsRate", String.format("%.1f", savingsRate));
            context.setVariable("currentDate", LocalDateTime.now().format(DATE_FORMATTER));

            String htmlContent = templateEngine.process("email/monthly-summary", context);

            String subject = String.format("Báo cáo tài chính tháng %d/%d", month, year);
            sendHtmlEmail(toEmail, subject, htmlContent);
            log.info("Monthly summary email sent to: {} for {}/{}", toEmail, month, year);
        } catch (Exception e) {
            log.error("Failed to send monthly summary email to: {}", toEmail, e);
        }
    }

    /**
     * Send weekly summary email
     */
    @Async
    public void sendWeeklySummaryEmail(Long userId, String toEmail, String fullName,
                                        LocalDate startDate, LocalDate endDate,
                                        BigDecimal totalIncome,
                                        BigDecimal totalExpense,
                                        BigDecimal netSavings,
                                        Double savingsRate,
                                        int transactionCount) {
        if (!shouldSendEmail(userId, "weeklySummary")) {
            log.info("Weekly summary email not sent to {} - notifications or weeklySummary disabled", toEmail);
            return;
        }

        try {
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("startDate", startDate.format(DATE_FORMATTER));
            context.setVariable("endDate", endDate.format(DATE_FORMATTER));
            context.setVariable("totalIncome", formatCurrency(totalIncome));
            context.setVariable("totalExpense", formatCurrency(totalExpense));
            context.setVariable("netSavings", formatCurrency(netSavings));
            context.setVariable("savingsRate", String.format("%.1f", savingsRate));
            context.setVariable("transactionCount", transactionCount);
            context.setVariable("currentDate", LocalDateTime.now().format(DATE_FORMATTER));

            String htmlContent = templateEngine.process("email/weekly-summary", context);

            String subject = String.format("Báo cáo tuần %s - %s",
                    startDate.format(DATE_FORMATTER), endDate.format(DATE_FORMATTER));
            sendHtmlEmail(toEmail, subject, htmlContent);
            log.info("Weekly summary email sent to: {} for {} to {}", toEmail, startDate, endDate);
        } catch (Exception e) {
            log.error("Failed to send weekly summary email to: {}", toEmail, e);
        }
    }

    /**
     * Send scheduled report email
     */
    @Async
    public void sendScheduledReportEmail(Long userId, String toEmail, String fullName,
                                          String reportType, byte[] attachment,
                                          String fileName) {
        if (!shouldSendEmail(userId, null)) {
            log.info("Scheduled report email not sent to {} - notifications disabled", toEmail);
            return;
        }

        try {
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("reportType", reportType);
            context.setVariable("fileName", fileName);
            context.setVariable("currentDate", LocalDateTime.now().format(DATE_FORMATTER));

            String htmlContent = templateEngine.process("email/scheduled-report", context);

            sendHtmlEmailWithAttachment(toEmail, "Báo cáo tài chính định kỳ", htmlContent, attachment, fileName);
            log.info("Scheduled report email sent to: {} with attachment: {}", toEmail, fileName);
        } catch (Exception e) {
            log.error("Failed to send scheduled report email to: {}", toEmail, e);
        }
    }

    /**
     * Send password change notification email
     */
    @Async
    public void sendPasswordChangeEmail(Long userId, String toEmail, String fullName, String changeTime) {
        if (!shouldSendEmail(userId, null)) {
            log.info("Password change email not sent to {} - notifications disabled", toEmail);
            return;
        }

        try {
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("email", toEmail);
            context.setVariable("changeTime", changeTime);

            String htmlContent = templateEngine.process("email/password-change", context);

            sendHtmlEmail(toEmail, "Mật khẩu đã được thay đổi", htmlContent);
            log.info("Password change notification email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password change email to: {}", toEmail, e);
        }
    }

    /**
     * Send HTML email
     */
    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    /**
     * Send HTML email with attachment
     */
    private void sendHtmlEmailWithAttachment(String to, String subject, String htmlContent,
                                              byte[] attachment, String fileName) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        if (attachment != null && attachment.length > 0) {
            helper.addAttachment(fileName, () -> new java.io.ByteArrayInputStream(attachment));
        }

        mailSender.send(message);
    }

    // Helper methods
    private String formatCurrency(BigDecimal amount) {
        return String.format("%,.0f ₫", amount);
    }

    private String getAlertLevel(Double usagePercent) {
        if (usagePercent >= 100) return "critical";
        if (usagePercent >= 90) return "warning";
        return "info";
    }

    private String getVietnameseMonthName(int month) {
        String[] months = {"Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu",
                          "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"};
        return months[month - 1];
    }
}
