package com.myfinance.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.myfinance.dto.response.MonthlyReportResponse;
import com.myfinance.dto.response.YearlyReportResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Service for generating PDF reports
 * Generates professional PDF files from report data with Vietnamese localization
 */
@Service
@Slf4j
public class PDFReportGenerator {

    private static final DeviceRgb HEADER_COLOR = new DeviceRgb(59, 130, 246); // Blue-500
    private static final DeviceRgb SUCCESS_COLOR = new DeviceRgb(34, 197, 94); // Green-500
    private static final DeviceRgb DANGER_COLOR = new DeviceRgb(239, 68, 68); // Red-500

    /**
     * Generate monthly report as PDF
     */
    public byte[] generateMonthlyReportPDF(MonthlyReportResponse report) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Set up font (use Helvetica for now - supports basic characters)
            PdfFont font = PdfFontFactory.createFont();
            PdfFont boldFont = PdfFontFactory.createFont();

            // Title
            Paragraph title = new Paragraph("BAO CAO TAI CHINH THANG " + report.getMonth() + "/" + report.getYear())
                    .setFont(boldFont)
                    .setFontSize(20)
                    .setFontColor(HEADER_COLOR)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold();
            document.add(title);

            // Generated date
            String generatedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
            Paragraph dateInfo = new Paragraph("Ngay tao: " + generatedDate)
                    .setFont(font)
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(dateInfo);

            document.add(new Paragraph("\n"));

            // Summary section
            Paragraph summaryTitle = new Paragraph("TONG QUAN")
                    .setFont(boldFont)
                    .setFontSize(14)
                    .setBold();
            document.add(summaryTitle);

            Table summaryTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                    .useAllAvailableWidth();

            addSummaryRow(summaryTable, "Tong Thu:", formatCurrency(report.getTotalIncome()), SUCCESS_COLOR, font);
            addSummaryRow(summaryTable, "Tong Chi:", formatCurrency(report.getTotalExpense()), DANGER_COLOR, font);
            addSummaryRow(summaryTable, "Tiet Kiem:", formatCurrency(report.getNetSavings()),
                    report.getNetSavings().compareTo(java.math.BigDecimal.ZERO) >= 0 ? SUCCESS_COLOR : DANGER_COLOR, font);
            addSummaryRow(summaryTable, "Ty Le Tiet Kiem:", String.format("%.1f%%", report.getSavingsRate()), HEADER_COLOR, font);

            document.add(summaryTable);
            document.add(new Paragraph("\n"));

            // Income breakdown
            if (report.getIncomeByCategory() != null && !report.getIncomeByCategory().isEmpty()) {
                Paragraph incomeTitle = new Paragraph("CHI TIET THU NHAP")
                        .setFont(boldFont)
                        .setFontSize(14)
                        .setBold();
                document.add(incomeTitle);

                Table incomeTable = new Table(UnitValue.createPercentArray(new float[]{40, 30, 15, 15}))
                        .useAllAvailableWidth();

                // Header
                addTableHeader(incomeTable, new String[]{"Danh Muc", "So Tien", "Phan Tram", "So GD"}, SUCCESS_COLOR, boldFont);

                // Data rows
                for (MonthlyReportResponse.CategorySummary category : report.getIncomeByCategory()) {
                    incomeTable.addCell(new Cell().add(new Paragraph(romanizeVietnamese(category.getCategoryName())).setFont(font)));
                    incomeTable.addCell(new Cell().add(new Paragraph(formatCurrency(category.getAmount())).setFont(font)));
                    incomeTable.addCell(new Cell().add(new Paragraph(String.format("%.1f%%", category.getPercentage())).setFont(font)));
                    incomeTable.addCell(new Cell().add(new Paragraph(String.valueOf(category.getTransactionCount())).setFont(font)));
                }

                document.add(incomeTable);
                document.add(new Paragraph("\n"));
            }

            // Expense breakdown
            if (report.getExpenseByCategory() != null && !report.getExpenseByCategory().isEmpty()) {
                Paragraph expenseTitle = new Paragraph("CHI TIET CHI TIEU")
                        .setFont(boldFont)
                        .setFontSize(14)
                        .setBold();
                document.add(expenseTitle);

                Table expenseTable = new Table(UnitValue.createPercentArray(new float[]{30, 20, 12, 12, 13, 13}))
                        .useAllAvailableWidth();

                // Header
                addTableHeader(expenseTable, new String[]{"Danh Muc", "So Tien", "%", "GD", "Ngan Sach", "Dung %"}, DANGER_COLOR, boldFont);

                // Data rows
                for (MonthlyReportResponse.CategorySummary category : report.getExpenseByCategory()) {
                    expenseTable.addCell(new Cell().add(new Paragraph(romanizeVietnamese(category.getCategoryName())).setFont(font)));
                    expenseTable.addCell(new Cell().add(new Paragraph(formatCurrency(category.getAmount())).setFont(font)));
                    expenseTable.addCell(new Cell().add(new Paragraph(String.format("%.1f", category.getPercentage())).setFont(font)));
                    expenseTable.addCell(new Cell().add(new Paragraph(String.valueOf(category.getTransactionCount())).setFont(font)));

                    String budgetStr = category.getBudgetAmount() != null ?
                            formatCurrency(category.getBudgetAmount()) : "N/A";
                    String usageStr = category.getBudgetUsagePercent() != null ?
                            String.format("%.1f", category.getBudgetUsagePercent()) : "N/A";

                    expenseTable.addCell(new Cell().add(new Paragraph(budgetStr).setFont(font)));
                    expenseTable.addCell(new Cell().add(new Paragraph(usageStr).setFont(font)));
                }

                document.add(expenseTable);
                document.add(new Paragraph("\n"));
            }

            // Top categories
            if (report.getTopExpenseCategories() != null && !report.getTopExpenseCategories().isEmpty()) {
                Paragraph topTitle = new Paragraph("TOP 5 DANH MUC CHI NHIEU NHAT")
                        .setFont(boldFont)
                        .setFontSize(14)
                        .setBold();
                document.add(topTitle);

                Table topTable = new Table(UnitValue.createPercentArray(new float[]{15, 50, 35}))
                        .useAllAvailableWidth();

                addTableHeader(topTable, new String[]{"#", "Danh Muc", "So Tien"}, HEADER_COLOR, boldFont);

                int rank = 1;
                for (MonthlyReportResponse.CategorySummary category : report.getTopExpenseCategories()) {
                    topTable.addCell(new Cell().add(new Paragraph(String.valueOf(rank++)).setFont(font)));
                    topTable.addCell(new Cell().add(new Paragraph(romanizeVietnamese(category.getCategoryName())).setFont(font)));
                    topTable.addCell(new Cell().add(new Paragraph(formatCurrency(category.getAmount())).setFont(font)));
                }

                document.add(topTable);
            }

            // Footer
            document.add(new Paragraph("\n"));
            Paragraph footer = new Paragraph("--- Bao cao duoc tao tu dong boi MyFinance ---")
                    .setFont(font)
                    .setFontSize(8)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(footer);

            document.close();

            log.info("Generated monthly report PDF for {}/{}", report.getMonth(), report.getYear());
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Failed to generate monthly report PDF", e);
            throw new RuntimeException("Khong the tao bao cao PDF: " + e.getMessage());
        }
    }

    /**
     * Generate yearly report as PDF
     */
    public byte[] generateYearlyReportPDF(YearlyReportResponse report) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            PdfFont font = PdfFontFactory.createFont();
            PdfFont boldFont = PdfFontFactory.createFont();

            // Title
            Paragraph title = new Paragraph("BAO CAO TAI CHINH NAM " + report.getYear())
                    .setFont(boldFont)
                    .setFontSize(20)
                    .setFontColor(HEADER_COLOR)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold();
            document.add(title);

            // Generated date
            String generatedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
            Paragraph dateInfo = new Paragraph("Ngay tao: " + generatedDate)
                    .setFont(font)
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(dateInfo);

            document.add(new Paragraph("\n"));

            // Summary section
            Paragraph summaryTitle = new Paragraph("TONG QUAN")
                    .setFont(boldFont)
                    .setFontSize(14)
                    .setBold();
            document.add(summaryTitle);

            Table summaryTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                    .useAllAvailableWidth();

            addSummaryRow(summaryTable, "Tong Thu:", formatCurrency(report.getTotalIncome()), SUCCESS_COLOR, font);
            addSummaryRow(summaryTable, "Tong Chi:", formatCurrency(report.getTotalExpense()), DANGER_COLOR, font);
            addSummaryRow(summaryTable, "Tiet Kiem:", formatCurrency(report.getNetSavings()),
                    report.getNetSavings().compareTo(java.math.BigDecimal.ZERO) >= 0 ? SUCCESS_COLOR : DANGER_COLOR, font);
            addSummaryRow(summaryTable, "Ty Le Tiet Kiem:", String.format("%.1f%%", report.getSavingsRate()), HEADER_COLOR, font);

            document.add(summaryTable);
            document.add(new Paragraph("\n"));

            // Monthly trends
            if (report.getMonthlyTrends() != null && !report.getMonthlyTrends().isEmpty()) {
                Paragraph trendsTitle = new Paragraph("CHI TIET THEO THANG")
                        .setFont(boldFont)
                        .setFontSize(14)
                        .setBold();
                document.add(trendsTitle);

                Table trendsTable = new Table(UnitValue.createPercentArray(new float[]{25, 25, 25, 25}))
                        .useAllAvailableWidth();

                addTableHeader(trendsTable, new String[]{"Thang", "Thu Nhap", "Chi Tieu", "Tiet Kiem"}, HEADER_COLOR, boldFont);

                for (YearlyReportResponse.MonthlyTrend trend : report.getMonthlyTrends()) {
                    trendsTable.addCell(new Cell().add(new Paragraph(getVietnameseMonthName(trend.getMonth())).setFont(font)));
                    trendsTable.addCell(new Cell().add(new Paragraph(formatCurrency(trend.getIncome())).setFont(font)));
                    trendsTable.addCell(new Cell().add(new Paragraph(formatCurrency(trend.getExpense())).setFont(font)));
                    trendsTable.addCell(new Cell().add(new Paragraph(formatCurrency(trend.getSavings())).setFont(font)));
                }

                document.add(trendsTable);
                document.add(new Paragraph("\n"));
            }

            // Top categories
            if (report.getTopExpenseCategories() != null && !report.getTopExpenseCategories().isEmpty()) {
                Paragraph topTitle = new Paragraph("TOP 5 DANH MUC CHI NHIEU NHAT")
                        .setFont(boldFont)
                        .setFontSize(14)
                        .setBold();
                document.add(topTitle);

                Table topTable = new Table(UnitValue.createPercentArray(new float[]{15, 50, 35}))
                        .useAllAvailableWidth();

                addTableHeader(topTable, new String[]{"#", "Danh Muc", "So Tien"}, HEADER_COLOR, boldFont);

                int rank = 1;
                for (MonthlyReportResponse.CategorySummary category : report.getTopExpenseCategories()) {
                    topTable.addCell(new Cell().add(new Paragraph(String.valueOf(rank++)).setFont(font)));
                    topTable.addCell(new Cell().add(new Paragraph(romanizeVietnamese(category.getCategoryName())).setFont(font)));
                    topTable.addCell(new Cell().add(new Paragraph(formatCurrency(category.getAmount())).setFont(font)));
                }

                document.add(topTable);
            }

            // Footer
            document.add(new Paragraph("\n"));
            Paragraph footer = new Paragraph("--- Bao cao duoc tao tu dong boi MyFinance ---")
                    .setFont(font)
                    .setFontSize(8)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(footer);

            document.close();

            log.info("Generated yearly report PDF for {}", report.getYear());
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Failed to generate yearly report PDF", e);
            throw new RuntimeException("Khong the tao bao cao PDF: " + e.getMessage());
        }
    }

    /**
     * Helper method to add summary row
     */
    private void addSummaryRow(Table table, String label, String value, DeviceRgb color, PdfFont font) {
        table.addCell(new Cell().add(new Paragraph(label).setFont(font).setBold()));
        table.addCell(new Cell().add(new Paragraph(value).setFont(font).setFontColor(color).setBold()));
    }

    /**
     * Helper method to add table header
     */
    private void addTableHeader(Table table, String[] headers, DeviceRgb color, PdfFont font) {
        for (String header : headers) {
            Cell cell = new Cell()
                    .add(new Paragraph(header).setFont(font).setBold().setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(color);
            table.addHeaderCell(cell);
        }
    }

    /**
     * Format currency amount
     */
    private String formatCurrency(java.math.BigDecimal amount) {
        if (amount == null) return "0 VND";
        return String.format("%,.0f VND", amount);
    }

    /**
     * Get Vietnamese month name
     */
    private String getVietnameseMonthName(int month) {
        String[] months = {
            "T1", "T2", "T3", "T4", "T5", "T6",
            "T7", "T8", "T9", "T10", "T11", "T12"
        };
        return months[month - 1];
    }

    /**
     * Romanize Vietnamese text by removing diacritics
     * Converts Vietnamese characters to ASCII equivalents for PDF compatibility
     * This is necessary because Helvetica font (default in PDF) doesn't support Vietnamese Unicode
     */
    private String romanizeVietnamese(String text) {
        if (text == null) return null;

        // Vietnamese character mappings to ASCII
        String[][] replacements = {
            // Lowercase vowels with tones
            {"á", "a"}, {"à", "a"}, {"ả", "a"}, {"ã", "a"}, {"ạ", "a"},
            {"ă", "a"}, {"ắ", "a"}, {"ằ", "a"}, {"ẳ", "a"}, {"ẵ", "a"}, {"ặ", "a"},
            {"â", "a"}, {"ấ", "a"}, {"ầ", "a"}, {"ẩ", "a"}, {"ẫ", "a"}, {"ậ", "a"},
            {"é", "e"}, {"è", "e"}, {"ẻ", "e"}, {"ẽ", "e"}, {"ẹ", "e"},
            {"ê", "e"}, {"ế", "e"}, {"ề", "e"}, {"ể", "e"}, {"ễ", "e"}, {"ệ", "e"},
            {"í", "i"}, {"ì", "i"}, {"ỉ", "i"}, {"ĩ", "i"}, {"ị", "i"},
            {"ó", "o"}, {"ò", "o"}, {"ỏ", "o"}, {"õ", "o"}, {"ọ", "o"},
            {"ô", "o"}, {"ố", "o"}, {"ồ", "o"}, {"ổ", "o"}, {"ỗ", "o"}, {"ộ", "o"},
            {"ơ", "o"}, {"ớ", "o"}, {"ờ", "o"}, {"ở", "o"}, {"ỡ", "o"}, {"ợ", "o"},
            {"ú", "u"}, {"ù", "u"}, {"ủ", "u"}, {"ũ", "u"}, {"ụ", "u"},
            {"ư", "u"}, {"ứ", "u"}, {"ừ", "u"}, {"ử", "u"}, {"ữ", "u"}, {"ự", "u"},
            {"ý", "y"}, {"ỳ", "y"}, {"ỷ", "y"}, {"ỹ", "y"}, {"ỵ", "y"},
            {"đ", "d"},

            // Uppercase vowels with tones
            {"Á", "A"}, {"À", "A"}, {"Ả", "A"}, {"Ã", "A"}, {"Ạ", "A"},
            {"Ă", "A"}, {"Ắ", "A"}, {"Ằ", "A"}, {"Ẳ", "A"}, {"Ẵ", "A"}, {"Ặ", "A"},
            {"Â", "A"}, {"Ấ", "A"}, {"Ầ", "A"}, {"Ẩ", "A"}, {"Ẫ", "A"}, {"Ậ", "A"},
            {"É", "E"}, {"È", "E"}, {"Ẻ", "E"}, {"Ẽ", "E"}, {"Ẹ", "E"},
            {"Ê", "E"}, {"Ế", "E"}, {"Ề", "E"}, {"Ể", "E"}, {"Ễ", "E"}, {"Ệ", "E"},
            {"Í", "I"}, {"Ì", "I"}, {"Ỉ", "I"}, {"Ĩ", "I"}, {"Ị", "I"},
            {"Ó", "O"}, {"Ò", "O"}, {"Ỏ", "O"}, {"Õ", "O"}, {"Ọ", "O"},
            {"Ô", "O"}, {"Ố", "O"}, {"Ồ", "O"}, {"Ổ", "O"}, {"Ỗ", "O"}, {"Ộ", "O"},
            {"Ơ", "O"}, {"Ớ", "O"}, {"Ờ", "O"}, {"Ở", "O"}, {"Ỡ", "O"}, {"Ợ", "O"},
            {"Ú", "U"}, {"Ù", "U"}, {"Ủ", "U"}, {"Ũ", "U"}, {"Ụ", "U"},
            {"Ư", "U"}, {"Ứ", "U"}, {"Ừ", "U"}, {"Ử", "U"}, {"Ữ", "U"}, {"Ự", "U"},
            {"Ý", "Y"}, {"Ỳ", "Y"}, {"Ỷ", "Y"}, {"Ỹ", "Y"}, {"Ỵ", "Y"},
            {"Đ", "D"}
        };

        String result = text;
        for (String[] pair : replacements) {
            result = result.replace(pair[0], pair[1]);
        }

        return result;
    }
}
