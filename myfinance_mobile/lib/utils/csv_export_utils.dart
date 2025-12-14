import 'dart:io';
import 'package:csv/csv.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:intl/intl.dart';
import '../models/monthly_report.dart';

class CsvExportUtils {
  static Future<void> exportMonthlyReportToCsv(MonthlyReport report) async {
    try {
      // Create CSV data
      List<List<dynamic>> csvData = [];

      // Header
      csvData.add(['MyFinance - Báo cáo tháng ${report.month}/${report.year}']);
      csvData.add([]);

      // Summary Section
      csvData.add(['TỔNG QUAN']);
      csvData.add(['Thu nhập', _formatCurrency(report.totalIncome)]);
      csvData.add(['Chi tiêu', _formatCurrency(report.totalExpense)]);
      csvData.add(['Tiết kiệm', _formatCurrency(report.netSavings)]);
      csvData.add(['Tỷ lệ tiết kiệm', '${report.savingsRate.toStringAsFixed(1)}%']);
      csvData.add([]);

      // Income Categories
      if (report.incomeByCategory.isNotEmpty) {
        csvData.add(['DANH MỤC THU NHẬP']);
        csvData.add(['Danh mục', 'Số tiền', 'Số giao dịch']);
        for (var category in report.incomeByCategory) {
          csvData.add([
            category.categoryName,
            _formatCurrency(category.amount),
            category.transactionCount,
          ]);
        }
        csvData.add([]);
      }

      // Expense Categories
      if (report.expenseByCategory.isNotEmpty) {
        csvData.add(['DANH MỤC CHI TIÊU']);
        csvData.add(['Danh mục', 'Số tiền', 'Số giao dịch']);
        for (var category in report.expenseByCategory) {
          csvData.add([
            category.categoryName,
            _formatCurrency(category.amount),
            category.transactionCount,
          ]);
        }
        csvData.add([]);
      }

      // Top Expense Categories
      if (report.topExpenseCategories.isNotEmpty) {
        csvData.add(['TOP 5 DANH MỤC CHI TIÊU']);
        csvData.add(['Hạng', 'Danh mục', 'Số tiền', 'Số giao dịch']);
        for (var i = 0; i < report.topExpenseCategories.length; i++) {
          var category = report.topExpenseCategories[i];
          csvData.add([
            i + 1,
            category.categoryName,
            _formatCurrency(category.amount),
            category.transactionCount,
          ]);
        }
        csvData.add([]);
      }

      // Top Income Categories
      if (report.topIncomeCategories.isNotEmpty) {
        csvData.add(['TOP 5 DANH MỤC THU NHẬP']);
        csvData.add(['Hạng', 'Danh mục', 'Số tiền', 'Số giao dịch']);
        for (var i = 0; i < report.topIncomeCategories.length; i++) {
          var category = report.topIncomeCategories[i];
          csvData.add([
            i + 1,
            category.categoryName,
            _formatCurrency(category.amount),
            category.transactionCount,
          ]);
        }
      }

      // Convert to CSV string
      String csv = const ListToCsvConverter().convert(csvData);

      // Add UTF-8 BOM for Excel compatibility
      String csvWithBom = '\uFEFF$csv';

      // Save to temporary file
      final directory = await getTemporaryDirectory();
      final timestamp = DateFormat('yyyyMMdd_HHmmss').format(DateTime.now());
      final filePath = '${directory.path}/monthly_report_${report.month}_${report.year}_$timestamp.csv';
      final file = File(filePath);
      await file.writeAsString(csvWithBom);

      // Share the file
      await Share.shareXFiles(
        [XFile(filePath)],
        subject: 'Báo cáo tháng ${report.month}/${report.year}',
        text: 'Báo cáo tài chính tháng ${report.month}/${report.year}',
      );
    } catch (e) {
      rethrow;
    }
  }

  static String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }
}
