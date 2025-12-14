/**
 * Utility functions for exporting data to various formats
 */

/**
 * Convert data to CSV format and trigger download
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of the file to download
 * @param {Array} headers - Optional custom headers
 */
export const exportToCSV = (data, filename, headers = null) => {
 if (!data || data.length === 0) {
 alert('Không có dữ liệu để xuất');
 return;
 }

 // Get headers from first object if not provided
 const csvHeaders = headers || Object.keys(data[0]);

 // Create CSV content
 let csvContent = '\uFEFF'; // UTF-8 BOM for Excel compatibility

 // Add headers
 csvContent += csvHeaders.join(',') + '\n';

 // Add data rows
 data.forEach(row => {
 const values = csvHeaders.map(header => {
 const value = row[header];

 // Handle null/undefined
 if (value === null || value === undefined) {
 return '';
 }

 // Handle values that need escaping
 const stringValue = String(value);
 if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
 return `"${stringValue.replace(/"/g, '""')}"`;
 }

 return stringValue;
 });

 csvContent += values.join(',') + '\n';
 });

 // Create blob and download
 const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
 const link = document.createElement('a');
 const url = URL.createObjectURL(blob);

 link.setAttribute('href', url);
 link.setAttribute('download', filename);
 link.style.visibility = 'hidden';

 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
};

/**
 * Export monthly report to CSV
 */
export const exportMonthlyReportToCSV = (report) => {
 if (!report) {
 alert('Không có dữ liệu báo cáo');
 return;
 }

 const filename = `bao-cao-thang-${report.month}-${report.year}.csv`;

 // Summary data
 const summaryData = [
 { 'Mục': 'Tháng/Năm', 'Giá trị': `${report.month}/${report.year}` },
 { 'Mục': 'Tổng thu nhập', 'Giá trị': report.totalIncome },
 { 'Mục': 'Tổng chi tiêu', 'Giá trị': report.totalExpense },
 { 'Mục': 'Tiết kiệm ròng', 'Giá trị': report.netSavings },
 { 'Mục': 'Tỷ lệ tiết kiệm (%)', 'Giá trị': report.savingsRate?.toFixed(2) },
 { 'Mục': 'Tổng giao dịch', 'Giá trị': report.totalTransactions },
 { 'Mục': 'Trung bình/giao dịch', 'Giá trị': report.averageTransaction },
 { 'Mục': 'Chi tiêu lớn nhất', 'Giá trị': report.largestExpense },
 { 'Mục': 'Thu nhập lớn nhất', 'Giá trị': report.largestIncome },
 ];

 // Expense categories
 const expenseData = report.expenseByCategory?.map(cat => ({
 'Loại': 'Chi tiêu',
 'Danh mục': cat.categoryName,
 'Số tiền': cat.amount,
 'Số giao dịch': cat.transactionCount,
 'Phần trăm (%)': cat.percentage?.toFixed(2)
 })) || [];

 // Income categories
 const incomeData = report.incomeByCategory?.map(cat => ({
 'Loại': 'Thu nhập',
 'Danh mục': cat.categoryName,
 'Số tiền': cat.amount,
 'Số giao dịch': cat.transactionCount,
 'Phần trăm (%)': cat.percentage?.toFixed(2)
 })) || [];

 // Combine all data
 const allData = [
 ...summaryData,
 { 'Mục': '', 'Giá trị': '' }, // Empty row
 { 'Mục': 'CHI TIẾT THEO DANH MỤC', 'Giá trị': '' },
 ...expenseData,
 ...incomeData
 ];

 exportToCSV(allData, filename);
};

/**
 * Export yearly report to CSV
 */
export const exportYearlyReportToCSV = (report) => {
 if (!report) {
 alert('Không có dữ liệu báo cáo');
 return;
 }

 const filename = `bao-cao-nam-${report.year}.csv`;

 // Summary data
 const summaryData = [
 { 'Mục': 'Năm', 'Giá trị': report.year },
 { 'Mục': 'Tổng thu nhập', 'Giá trị': report.totalIncome },
 { 'Mục': 'Tổng chi tiêu', 'Giá trị': report.totalExpense },
 { 'Mục': 'Tiết kiệm ròng', 'Giá trị': report.netSavings },
 { 'Mục': 'Tỷ lệ tiết kiệm (%)', 'Giá trị': report.savingsRate?.toFixed(2) },
 { 'Mục': 'Tổng giao dịch', 'Giá trị': report.totalTransactions },
 { 'Mục': 'TB thu nhập/tháng', 'Giá trị': report.averageMonthlyIncome },
 { 'Mục': 'TB chi tiêu/tháng', 'Giá trị': report.averageMonthlyExpense },
 { 'Mục': '', 'Giá trị': '' },
 ];

 // Monthly trends
 const monthlyData = report.monthlyTrends?.map(trend => ({
 'Tháng': trend.monthName,
 'Thu nhập': trend.income,
 'Chi tiêu': trend.expense,
 'Tiết kiệm': trend.savings,
 'Tỷ lệ tiết kiệm (%)': trend.savingsRate?.toFixed(2)
 })) || [];

 // Expense categories
 const expenseData = report.yearlyExpenseByCategory?.map(cat => ({
 'Loại': 'Chi tiêu',
 'Danh mục': cat.categoryName,
 'Số tiền': cat.amount,
 'Số giao dịch': cat.transactionCount,
 'Phần trăm (%)': cat.percentage?.toFixed(2)
 })) || [];

 // Income categories
 const incomeData = report.yearlyIncomeByCategory?.map(cat => ({
 'Loại': 'Thu nhập',
 'Danh mục': cat.categoryName,
 'Số tiền': cat.amount,
 'Số giao dịch': cat.transactionCount,
 'Phần trăm (%)': cat.percentage?.toFixed(2)
 })) || [];

 // Combine all data
 const allData = [
 ...summaryData,
 { 'Mục': 'XU HƯỚNG THEO THÁNG', 'Giá trị': '' },
 ...monthlyData,
 { 'Tháng': '', 'Thu nhập': '', 'Chi tiêu': '', 'Tiết kiệm': '', 'Tỷ lệ tiết kiệm (%)': '' },
 { 'Tháng': 'CHI TIẾT THEO DANH MỤC', 'Thu nhập': '', 'Chi tiêu': '', 'Tiết kiệm': '', 'Tỷ lệ tiết kiệm (%)': '' },
 ...expenseData,
 ...incomeData
 ];

 exportToCSV(allData, filename);
};

/**
 * Export category report to CSV
 */
export const exportCategoryReportToCSV = (report) => {
 if (!report) {
 alert('Không có dữ liệu báo cáo');
 return;
 }

 const filename = `bao-cao-danh-muc-${report.categoryName.replace(/\s+/g, '-')}.csv`;

 // Summary data
 const summaryData = [
 { 'Mục': 'Danh mục', 'Giá trị': report.categoryName },
 { 'Mục': 'Loại', 'Giá trị': report.categoryType === 'INCOME' ? 'Thu nhập' : 'Chi tiêu' },
 { 'Mục': 'Từ ngày', 'Giá trị': report.startDate },
 { 'Mục': 'Đến ngày', 'Giá trị': report.endDate },
 { 'Mục': 'Tổng số tiền', 'Giá trị': report.totalAmount },
 { 'Mục': 'Số giao dịch', 'Giá trị': report.transactionCount },
 { 'Mục': 'Trung bình/giao dịch', 'Giá trị': report.averageTransaction },
 { 'Mục': 'Giá trị nhỏ nhất', 'Giá trị': report.minTransaction },
 { 'Mục': 'Giá trị lớn nhất', 'Giá trị': report.maxTransaction },
 { 'Mục': '', 'Giá trị': '' },
 ];

 // Period summaries
 const periodData = report.periodSummaries?.map(period => ({
 'Khoảng thời gian': period.periodLabel,
 'Từ ngày': period.periodStart,
 'Đến ngày': period.periodEnd,
 'Số tiền': period.amount,
 'Số giao dịch': period.transactionCount
 })) || [];

 // Combine all data
 const allData = [
 ...summaryData,
 { 'Mục': 'XU HƯỚNG THEO THỜI GIAN', 'Giá trị': '' },
 ...periodData
 ];

 exportToCSV(allData, filename);
};
