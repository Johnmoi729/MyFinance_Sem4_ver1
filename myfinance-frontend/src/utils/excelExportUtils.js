import * as XLSX from 'xlsx';

/**
 * Excel Export Utilities for Reports
 * Uses xlsx library for Excel file generation with full Vietnamese Unicode support
 */

/**
 * Format currency for Excel (with proper number formatting)
 */
const formatCurrencyForExcel = (amount) => {
 return new Intl.NumberFormat('vi-VN').format(amount);
};

/**
 * Apply header style to a range of cells
 */
const applyHeaderStyle = (worksheet, range, color) => {
 // XLSX library styling requires xlsx-style or manual cell formatting
 // For simplicity, we'll use bold text in headers
 // Colors can be added with additional configuration
 return worksheet;
};

/**
 * Auto-size columns based on content
 */
const autoSizeColumns = (worksheet) => {
 const range = XLSX.utils.decode_range(worksheet['!ref']);
 const colWidths = [];

 for (let C = range.s.c; C <= range.e.c; ++C) {
 let maxWidth = 10;
 for (let R = range.s.r; R <= range.e.r; ++R) {
 const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
 const cell = worksheet[cellAddress];
 if (cell && cell.v) {
 const cellValue = cell.v.toString();
 maxWidth = Math.max(maxWidth, cellValue.length);
 }
 }
 colWidths.push({ wch: Math.min(maxWidth + 2, 50) });
 }

 worksheet['!cols'] = colWidths;
 return worksheet;
};

/**
 * Export Monthly Report to Excel
 */
export const exportMonthlyReportToExcel = (report) => {
 if (!report) {
 alert('Không có dữ liệu báo cáo');
 return;
 }

 try {
 const workbook = XLSX.utils.book_new();

 // Sheet 1: Tổng quan (Summary)
 const summaryData = [
 ['BÁO CÁO THÁNG ' + report.month + '/' + report.year],
 [''],
 ['Mục', 'Giá trị'],
 ['Tổng thu nhập', formatCurrencyForExcel(report.totalIncome) + ' VND'],
 ['Tổng chi tiêu', formatCurrencyForExcel(report.totalExpense) + ' VND'],
 ['Tiết kiệm ròng', formatCurrencyForExcel(report.netSavings) + ' VND'],
 ['Tỷ lệ tiết kiệm', (report.savingsRate?.toFixed(1) || '0') + '%'],
 ['Tổng giao dịch', report.totalTransactions.toString()],
 ['Trung bình/giao dịch', formatCurrencyForExcel(report.averageTransaction) + ' VND']
 ];

 const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
 autoSizeColumns(summarySheet);
 XLSX.utils.book_append_sheet(workbook, summarySheet, 'Tổng quan');

 // Sheet 2: Chi tiết thu nhập (Income Details)
 if (report.incomeByCategory && report.incomeByCategory.length > 0) {
 const incomeData = [
 ['CHI TIẾT THU NHẬP'],
 [''],
 ['Danh mục', 'Số tiền (VND)', 'Phần trăm (%)', 'Số giao dịch']
 ];

 report.incomeByCategory.forEach(cat => {
 incomeData.push([
 cat.categoryName,
 formatCurrencyForExcel(cat.amount),
 cat.percentage.toFixed(1),
 cat.transactionCount.toString()
 ]);
 });

 const incomeSheet = XLSX.utils.aoa_to_sheet(incomeData);
 autoSizeColumns(incomeSheet);
 XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Thu nhập');
 }

 // Sheet 3: Chi tiết chi tiêu (Expense Details)
 if (report.expenseByCategory && report.expenseByCategory.length > 0) {
 const expenseData = [
 ['CHI TIẾT CHI TIÊU'],
 [''],
 ['Danh mục', 'Số tiền (VND)', 'Phần trăm (%)', 'Số giao dịch', 'Ngân sách (VND)', 'Đã dùng (%)']
 ];

 report.expenseByCategory.forEach(cat => {
 const budgetAmount = cat.budgetAmount ? formatCurrencyForExcel(cat.budgetAmount) : 'N/A';
 const budgetUsage = cat.budgetUsagePercent ? cat.budgetUsagePercent.toFixed(1) : 'N/A';

 expenseData.push([
 cat.categoryName,
 formatCurrencyForExcel(cat.amount),
 cat.percentage.toFixed(1),
 cat.transactionCount.toString(),
 budgetAmount,
 budgetUsage
 ]);
 });

 const expenseSheet = XLSX.utils.aoa_to_sheet(expenseData);
 autoSizeColumns(expenseSheet);
 XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Chi tiêu');
 }

 // Sheet 4: Top 5 danh mục (Top Categories)
 if (report.topExpenseCategories && report.topExpenseCategories.length > 0) {
 const topData = [
 ['TOP 5 DANH MỤC CHI NHIỀU NHẤT'],
 [''],
 ['#', 'Danh mục', 'Số tiền (VND)', 'Phần trăm (%)']
 ];

 report.topExpenseCategories.forEach((cat, index) => {
 topData.push([
 (index + 1).toString(),
 cat.categoryName,
 formatCurrencyForExcel(cat.amount),
 cat.percentage.toFixed(1)
 ]);
 });

 const topSheet = XLSX.utils.aoa_to_sheet(topData);
 autoSizeColumns(topSheet);
 XLSX.utils.book_append_sheet(workbook, topSheet, 'Top 5');
 }

 // Generate and download
 XLSX.writeFile(workbook, `bao-cao-thang-${report.month}-${report.year}.xlsx`);
 } catch (error) {
 console.error('Error exporting to Excel:', error);
 alert('Không thể xuất file Excel: ' + error.message);
 }
};

/**
 * Export Yearly Report to Excel
 */
export const exportYearlyReportToExcel = (report) => {
 if (!report) {
 alert('Không có dữ liệu báo cáo');
 return;
 }

 try {
 const workbook = XLSX.utils.book_new();

 // Sheet 1: Tổng quan năm (Yearly Summary)
 const summaryData = [
 ['BÁO CÁO NĂM ' + report.year],
 [''],
 ['Mục', 'Giá trị'],
 ['Tổng thu nhập', formatCurrencyForExcel(report.totalIncome) + ' VND'],
 ['Tổng chi tiêu', formatCurrencyForExcel(report.totalExpense) + ' VND'],
 ['Tiết kiệm ròng', formatCurrencyForExcel(report.netSavings) + ' VND'],
 ['Tỷ lệ tiết kiệm', (report.savingsRate?.toFixed(1) || '0') + '%'],
 ['Tổng giao dịch', report.totalTransactions.toString()],
 ['TB thu nhập/tháng', formatCurrencyForExcel(report.averageMonthlyIncome) + ' VND'],
 ['TB chi tiêu/tháng', formatCurrencyForExcel(report.averageMonthlyExpense) + ' VND']
 ];

 const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
 autoSizeColumns(summarySheet);
 XLSX.utils.book_append_sheet(workbook, summarySheet, 'Tổng quan');

 // Sheet 2: Xu hướng theo tháng (Monthly Trends)
 if (report.monthlyTrends && report.monthlyTrends.length > 0) {
 const trendsData = [
 ['XU HƯỚNG THEO THÁNG'],
 [''],
 ['Tháng', 'Thu nhập (VND)', 'Chi tiêu (VND)', 'Tiết kiệm (VND)', 'TL Tiết kiệm (%)']
 ];

 report.monthlyTrends.forEach(trend => {
 trendsData.push([
 trend.monthName,
 formatCurrencyForExcel(trend.income),
 formatCurrencyForExcel(trend.expense),
 formatCurrencyForExcel(trend.savings),
 (trend.savingsRate?.toFixed(1) || '0')
 ]);
 });

 const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData);
 autoSizeColumns(trendsSheet);
 XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Xu hướng tháng');
 }

 // Sheet 3: Top 5 danh mục chi tiêu
 if (report.topExpenseCategories && report.topExpenseCategories.length > 0) {
 const topExpenseData = [
 ['TOP 5 DANH MỤC CHI NHIỀU NHẤT'],
 [''],
 ['#', 'Danh mục', 'Số tiền (VND)', 'Phần trăm (%)']
 ];

 report.topExpenseCategories.forEach((cat, index) => {
 topExpenseData.push([
 (index + 1).toString(),
 cat.categoryName,
 formatCurrencyForExcel(cat.amount),
 cat.percentage.toFixed(1)
 ]);
 });

 const topExpenseSheet = XLSX.utils.aoa_to_sheet(topExpenseData);
 autoSizeColumns(topExpenseSheet);
 XLSX.utils.book_append_sheet(workbook, topExpenseSheet, 'Top 5 Chi tiêu');
 }

 // Sheet 4: Top 5 danh mục thu nhập
 if (report.topIncomeCategories && report.topIncomeCategories.length > 0) {
 const topIncomeData = [
 ['TOP 5 DANH MỤC THU NHIỀU NHẤT'],
 [''],
 ['#', 'Danh mục', 'Số tiền (VND)', 'Phần trăm (%)']
 ];

 report.topIncomeCategories.forEach((cat, index) => {
 topIncomeData.push([
 (index + 1).toString(),
 cat.categoryName,
 formatCurrencyForExcel(cat.amount),
 cat.percentage.toFixed(1)
 ]);
 });

 const topIncomeSheet = XLSX.utils.aoa_to_sheet(topIncomeData);
 autoSizeColumns(topIncomeSheet);
 XLSX.utils.book_append_sheet(workbook, topIncomeSheet, 'Top 5 Thu nhập');
 }

 // Generate and download
 XLSX.writeFile(workbook, `bao-cao-nam-${report.year}.xlsx`);
 } catch (error) {
 console.error('Error exporting to Excel:', error);
 alert('Không thể xuất file Excel: ' + error.message);
 }
};

/**
 * Export Category Report to Excel
 */
export const exportCategoryReportToExcel = (report) => {
 if (!report) {
 alert('Không có dữ liệu báo cáo');
 return;
 }

 try {
 const workbook = XLSX.utils.book_new();

 // Sheet 1: Thống kê tổng hợp (Summary)
 const summaryData = [
 ['BÁO CÁO DANH MỤC: ' + report.categoryName],
 ['Từ ' + report.startDate + ' đến ' + report.endDate],
 [''],
 ['Mục', 'Giá trị'],
 ['Loại danh mục', report.categoryType === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'],
 ['Tổng số tiền', formatCurrencyForExcel(report.totalAmount) + ' VND'],
 ['Số giao dịch', report.transactionCount.toString()],
 ['Trung bình/giao dịch', formatCurrencyForExcel(report.averageTransaction) + ' VND'],
 ['Giá trị nhỏ nhất', formatCurrencyForExcel(report.minTransaction) + ' VND'],
 ['Giá trị lớn nhất', formatCurrencyForExcel(report.maxTransaction) + ' VND']
 ];

 const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
 autoSizeColumns(summarySheet);
 XLSX.utils.book_append_sheet(workbook, summarySheet, 'Thống kê');

 // Sheet 2: Xu hướng theo thời gian (Time Series)
 if (report.periodSummaries && report.periodSummaries.length > 0) {
 const periodData = [
 ['XU HƯỚNG THEO THỜI GIAN'],
 [''],
 ['Khoảng thời gian', 'Số tiền (VND)', 'Số giao dịch']
 ];

 report.periodSummaries.forEach(period => {
 periodData.push([
 period.periodLabel,
 formatCurrencyForExcel(period.amount),
 period.transactionCount.toString()
 ]);
 });

 const periodSheet = XLSX.utils.aoa_to_sheet(periodData);
 autoSizeColumns(periodSheet);
 XLSX.utils.book_append_sheet(workbook, periodSheet, 'Xu hướng');
 }

 // Generate and download
 const filename = `bao-cao-danh-muc-${report.categoryName.replace(/\s+/g, '-')}.xlsx`;
 XLSX.writeFile(workbook, filename);
 } catch (error) {
 console.error('Error exporting to Excel:', error);
 alert('Không thể xuất file Excel: ' + error.message);
 }
};
