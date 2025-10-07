package com.myfinance.service;

import com.myfinance.dto.response.MonthlyReportResponse;
import com.myfinance.dto.response.YearlyReportResponse;
import com.opencsv.CSVWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;

/**
 * Service for generating CSV reports
 * Generates CSV files from report data with Vietnamese localization
 */
@Service
@Slf4j
public class CSVReportGenerator {

    /**
     * Generate monthly report as CSV
     */
    public byte[] generateMonthlyReportCSV(MonthlyReportResponse report) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             OutputStreamWriter osw = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
             CSVWriter writer = new CSVWriter(osw)) {

            // Add BOM for Excel compatibility with Vietnamese characters
            baos.write(0xEF);
            baos.write(0xBB);
            baos.write(0xBF);

            // Header
            writer.writeNext(new String[]{"BÁO CÁO TÀI CHÍNH THÁNG " + report.getMonth() + "/" + report.getYear()});
            writer.writeNext(new String[]{""}); // Empty line

            // Summary section
            writer.writeNext(new String[]{"TỔNG QUAN"});
            writer.writeNext(new String[]{"Tổng Thu", formatCurrency(report.getTotalIncome())});
            writer.writeNext(new String[]{"Tổng Chi", formatCurrency(report.getTotalExpense())});
            writer.writeNext(new String[]{"Tiết Kiệm", formatCurrency(report.getNetSavings())});
            writer.writeNext(new String[]{"Tỷ Lệ Tiết Kiệm", String.format("%.1f%%", report.getSavingsRate())});
            writer.writeNext(new String[]{""}); // Empty line

            // Income breakdown
            if (report.getIncomeByCategory() != null && !report.getIncomeByCategory().isEmpty()) {
                writer.writeNext(new String[]{"CHI TIẾT THU NHẬP"});
                writer.writeNext(new String[]{"Danh Mục", "Số Tiền", "Phần Trăm (%)", "Số Giao Dịch"});

                for (MonthlyReportResponse.CategorySummary category : report.getIncomeByCategory()) {
                    writer.writeNext(new String[]{
                        category.getCategoryName(),
                        formatCurrency(category.getAmount()),
                        String.format("%.1f", category.getPercentage()),
                        String.valueOf(category.getTransactionCount())
                    });
                }
                writer.writeNext(new String[]{""}); // Empty line
            }

            // Expense breakdown
            if (report.getExpenseByCategory() != null && !report.getExpenseByCategory().isEmpty()) {
                writer.writeNext(new String[]{"CHI TIẾT CHI TIÊU"});
                writer.writeNext(new String[]{"Danh Mục", "Số Tiền", "Phần Trăm (%)", "Số Giao Dịch", "Ngân Sách", "Đã Dùng (%)"});

                for (MonthlyReportResponse.CategorySummary category : report.getExpenseByCategory()) {
                    String budgetStr = category.getBudgetAmount() != null ?
                        formatCurrency(category.getBudgetAmount()) : "Không có";
                    String usageStr = category.getBudgetUsagePercent() != null ?
                        String.format("%.1f", category.getBudgetUsagePercent()) : "N/A";

                    writer.writeNext(new String[]{
                        category.getCategoryName(),
                        formatCurrency(category.getAmount()),
                        String.format("%.1f", category.getPercentage()),
                        String.valueOf(category.getTransactionCount()),
                        budgetStr,
                        usageStr
                    });
                }
                writer.writeNext(new String[]{""}); // Empty line
            }

            // Top categories
            if (report.getTopExpenseCategories() != null && !report.getTopExpenseCategories().isEmpty()) {
                writer.writeNext(new String[]{"TOP 5 DANH MỤC CHI NHIỀU NHẤT"});
                writer.writeNext(new String[]{"Xếp Hạng", "Danh Mục", "Số Tiền"});

                int rank = 1;
                for (MonthlyReportResponse.CategorySummary category : report.getTopExpenseCategories()) {
                    writer.writeNext(new String[]{
                        String.valueOf(rank++),
                        category.getCategoryName(),
                        formatCurrency(category.getAmount())
                    });
                }
            }

            writer.flush();
            osw.flush();

            log.info("Generated monthly report CSV for {}/{}", report.getMonth(), report.getYear());
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Failed to generate monthly report CSV", e);
            throw new RuntimeException("Không thể tạo báo cáo CSV: " + e.getMessage());
        }
    }

    /**
     * Generate yearly report as CSV
     */
    public byte[] generateYearlyReportCSV(YearlyReportResponse report) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             OutputStreamWriter osw = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
             CSVWriter writer = new CSVWriter(osw)) {

            // Add BOM for Excel compatibility
            baos.write(0xEF);
            baos.write(0xBB);
            baos.write(0xBF);

            // Header
            writer.writeNext(new String[]{"BÁO CÁO TÀI CHÍNH NĂM " + report.getYear()});
            writer.writeNext(new String[]{""}); // Empty line

            // Summary section
            writer.writeNext(new String[]{"TỔNG QUAN"});
            writer.writeNext(new String[]{"Tổng Thu", formatCurrency(report.getTotalIncome())});
            writer.writeNext(new String[]{"Tổng Chi", formatCurrency(report.getTotalExpense())});
            writer.writeNext(new String[]{"Tiết Kiệm", formatCurrency(report.getNetSavings())});
            writer.writeNext(new String[]{"Tỷ Lệ Tiết Kiệm", String.format("%.1f%%", report.getSavingsRate())});
            writer.writeNext(new String[]{""}); // Empty line

            // Monthly trends
            if (report.getMonthlyTrends() != null && !report.getMonthlyTrends().isEmpty()) {
                writer.writeNext(new String[]{"CHI TIẾT THEO THÁNG"});
                writer.writeNext(new String[]{"Tháng", "Thu Nhập", "Chi Tiêu", "Tiết Kiệm"});

                for (YearlyReportResponse.MonthlyTrend trend : report.getMonthlyTrends()) {
                    writer.writeNext(new String[]{
                        getVietnameseMonthName(trend.getMonth()),
                        formatCurrency(trend.getIncome()),
                        formatCurrency(trend.getExpense()),
                        formatCurrency(trend.getSavings())
                    });
                }
                writer.writeNext(new String[]{""}); // Empty line
            }

            // Top categories
            if (report.getTopExpenseCategories() != null && !report.getTopExpenseCategories().isEmpty()) {
                writer.writeNext(new String[]{"TOP 5 DANH MỤC CHI NHIỀU NHẤT"});
                writer.writeNext(new String[]{"Xếp Hạng", "Danh Mục", "Số Tiền"});

                int rank = 1;
                for (MonthlyReportResponse.CategorySummary category : report.getTopExpenseCategories()) {
                    writer.writeNext(new String[]{
                        String.valueOf(rank++),
                        category.getCategoryName(),
                        formatCurrency(category.getAmount())
                    });
                }
            }

            writer.flush();
            osw.flush();

            log.info("Generated yearly report CSV for {}", report.getYear());
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Failed to generate yearly report CSV", e);
            throw new RuntimeException("Không thể tạo báo cáo CSV: " + e.getMessage());
        }
    }

    /**
     * Format currency amount
     */
    private String formatCurrency(java.math.BigDecimal amount) {
        if (amount == null) return "0 ₫";
        return String.format("%,.0f ₫", amount);
    }

    /**
     * Get Vietnamese month name
     */
    private String getVietnameseMonthName(int month) {
        String[] months = {
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
            "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        };
        return months[month - 1];
    }
}
