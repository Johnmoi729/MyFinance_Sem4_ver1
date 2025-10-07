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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm", new Locale("vi", "VN"));

    /**
     * Send welcome email to new user
     */
    @Async
    public void sendWelcomeEmail(String toEmail, String fullName) {
        if (!emailEnabled) {
            log.info("Email disabled. Would send welcome email to: {}", toEmail);
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
    public void sendPasswordResetEmail(String toEmail, String fullName, String resetToken) {
        if (!emailEnabled) {
            log.info("Email disabled. Would send password reset email to: {}", toEmail);
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
    public void sendBudgetAlertEmail(String toEmail, String fullName, String categoryName,
                                      BigDecimal budgetAmount, BigDecimal actualAmount,
                                      Double usagePercent) {
        if (!emailEnabled) {
            log.info("Email disabled. Would send budget alert email to: {}", toEmail);
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
    public void sendMonthlySummaryEmail(String toEmail, String fullName,
                                         int year, int month,
                                         BigDecimal totalIncome,
                                         BigDecimal totalExpense,
                                         BigDecimal netSavings,
                                         Double savingsRate) {
        if (!emailEnabled) {
            log.info("Email disabled. Would send monthly summary email to: {}", toEmail);
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
     * Send scheduled report email
     */
    @Async
    public void sendScheduledReportEmail(String toEmail, String fullName,
                                          String reportType, byte[] attachment,
                                          String fileName) {
        if (!emailEnabled) {
            log.info("Email disabled. Would send scheduled report email to: {}", toEmail);
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
