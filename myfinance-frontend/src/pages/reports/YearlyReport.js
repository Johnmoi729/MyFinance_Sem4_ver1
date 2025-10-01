import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI, formatCurrency } from '../../services/api';
import { exportYearlyReportToCSV } from '../../utils/exportUtils';
import { exportYearlyReportToPDF } from '../../utils/pdfExportUtils';
import CategoryPieChart from '../../components/charts/CategoryPieChart';
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart';
import FinancialHealthScore from '../../components/reports/FinancialHealthScore';

const YearlyReport = () => {
    const navigate = useNavigate();
    const currentDate = new Date();
    const [year, setYear] = useState(currentDate.getFullYear());
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load report when year changes
    useEffect(() => {
        loadReport();
    }, [year]);

    const loadReport = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await reportAPI.getYearlyReport(year);
            if (response && response.success) {
                setReport(response.data);
            } else {
                setError(response.message || 'Không thể tải báo cáo');
                setReport(null);
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải báo cáo');
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value);
        if (newYear >= 2000 && newYear <= 2100) {
            setYear(newYear);
        }
    };

    const handlePreviousYear = () => {
        setYear(year - 1);
    };

    const handleNextYear = () => {
        setYear(year + 1);
    };

    const handleCurrentYear = () => {
        setYear(new Date().getFullYear());
    };

    const getChangeColor = (percent) => {
        if (percent > 0) return 'text-green-600';
        if (percent < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getChangeIcon = (percent) => {
        if (percent > 0) return '↑';
        if (percent < 0) return '↓';
        return '→';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-600">Đang tải báo cáo...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Báo cáo năm</h1>
                    <p className="mt-2 text-gray-600">Tổng quan tài chính và xu hướng theo năm</p>
                </div>

                {/* Year Selector */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={handlePreviousYear}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            ← Năm trước
                        </button>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Năm:</label>
                            <input
                                type="number"
                                value={year}
                                onChange={handleYearChange}
                                min="2000"
                                max="2100"
                                className="px-3 py-2 border border-gray-300 rounded-md w-24 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            onClick={handleCurrentYear}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                        >
                            Năm hiện tại
                        </button>

                        <button
                            onClick={handleNextYear}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Năm sau →
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Report Content */}
                {report && (
                    <div className="space-y-6">
                        {/* Export Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => exportYearlyReportToCSV(report)}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors flex items-center gap-2"
                            >
                                <span>📥</span>
                                Xuất CSV
                            </button>
                            <button
                                onClick={() => exportYearlyReportToPDF(report)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors flex items-center gap-2"
                            >
                                <span>📄</span>
                                Xuất PDF
                            </button>
                        </div>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Total Income */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Tổng thu nhập</p>
                                        <p className="text-2xl font-bold text-green-600 mt-2">
                                            {formatCurrency(report.totalIncome)}
                                        </p>
                                        {report.incomeChangePercent !== undefined && (
                                            <p className={`text-sm mt-1 ${getChangeColor(report.incomeChangePercent)}`}>
                                                {getChangeIcon(report.incomeChangePercent)} {Math.abs(report.incomeChangePercent).toFixed(1)}% so với năm trước
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-4xl">💰</div>
                                </div>
                            </div>

                            {/* Total Expense */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Tổng chi tiêu</p>
                                        <p className="text-2xl font-bold text-red-600 mt-2">
                                            {formatCurrency(report.totalExpense)}
                                        </p>
                                        {report.expenseChangePercent !== undefined && (
                                            <p className={`text-sm mt-1 ${getChangeColor(report.expenseChangePercent)}`}>
                                                {getChangeIcon(report.expenseChangePercent)} {Math.abs(report.expenseChangePercent).toFixed(1)}% so với năm trước
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-4xl">💸</div>
                                </div>
                            </div>

                            {/* Net Savings */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Tiết kiệm ròng</p>
                                        <p className={`text-2xl font-bold mt-2 ${report.netSavings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                            {formatCurrency(report.netSavings)}
                                        </p>
                                        {report.savingsRate !== undefined && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                Tỷ lệ tiết kiệm: {report.savingsRate.toFixed(1)}%
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-4xl">💎</div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Thống kê năm</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Tổng giao dịch</p>
                                    <p className="text-2xl font-bold text-gray-900">{report.totalTransactions}</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Trung bình thu nhập/tháng</p>
                                    <p className="text-lg font-bold text-green-600">{formatCurrency(report.averageMonthlyIncome)}</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Trung bình chi tiêu/tháng</p>
                                    <p className="text-lg font-bold text-red-600">{formatCurrency(report.averageMonthlyExpense)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Best/Worst Months Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Best Savings Month */}
                            {report.bestSavingsMonth && (
                                <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                                    <p className="text-sm font-medium text-gray-600">Tháng tiết kiệm tốt nhất</p>
                                    <p className="text-lg font-bold text-gray-900 mt-1">{report.bestSavingsMonth.monthName}</p>
                                    <p className="text-sm font-bold text-green-600">{formatCurrency(report.bestSavingsMonth.savings)}</p>
                                </div>
                            )}

                            {/* Worst Savings Month */}
                            {report.worstSavingsMonth && (
                                <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
                                    <p className="text-sm font-medium text-gray-600">Tháng tiết kiệm thấp nhất</p>
                                    <p className="text-lg font-bold text-gray-900 mt-1">{report.worstSavingsMonth.monthName}</p>
                                    <p className="text-sm font-bold text-red-600">{formatCurrency(report.worstSavingsMonth.savings)}</p>
                                </div>
                            )}

                            {/* Highest Income Month */}
                            {report.highestIncomeMonth && (
                                <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                                    <p className="text-sm font-medium text-gray-600">Tháng thu nhập cao nhất</p>
                                    <p className="text-lg font-bold text-gray-900 mt-1">{report.highestIncomeMonth.monthName}</p>
                                    <p className="text-sm font-bold text-blue-600">{formatCurrency(report.highestIncomeMonth.income)}</p>
                                </div>
                            )}

                            {/* Highest Expense Month */}
                            {report.highestExpenseMonth && (
                                <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
                                    <p className="text-sm font-medium text-gray-600">Tháng chi tiêu cao nhất</p>
                                    <p className="text-lg font-bold text-gray-900 mt-1">{report.highestExpenseMonth.monthName}</p>
                                    <p className="text-sm font-bold text-orange-600">{formatCurrency(report.highestExpenseMonth.expense)}</p>
                                </div>
                            )}
                        </div>

                        {/* Financial Health Score */}
                        <FinancialHealthScore
                            data={{
                                totalIncome: report.totalIncome,
                                totalExpense: report.totalExpense,
                                netSavings: report.netSavings,
                                savingsRate: report.savingsRate
                            }}
                        />

                        {/* Monthly Trends Chart */}
                        {report.monthlyTrends && report.monthlyTrends.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <MonthlyTrendChart
                                    data={report.monthlyTrends}
                                    title="Xu hướng thu chi theo tháng"
                                />
                            </div>
                        )}

                        {/* Monthly Trends Table */}
                        {report.monthlyTrends && report.monthlyTrends.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết xu hướng theo tháng</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tháng</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thu nhập</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Chi tiêu</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tiết kiệm</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tỷ lệ tiết kiệm</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {report.monthlyTrends.map(trend => (
                                                <tr key={trend.month} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{trend.monthName}</td>
                                                    <td className="px-4 py-3 text-right font-medium text-green-600">
                                                        {formatCurrency(trend.income)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium text-red-600">
                                                        {formatCurrency(trend.expense)}
                                                    </td>
                                                    <td className={`px-4 py-3 text-right font-medium ${trend.savings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                                        {formatCurrency(trend.savings)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-gray-600">
                                                        {trend.savingsRate ? trend.savingsRate.toFixed(1) : '0.0'}%
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Category Distribution Charts */}
                        {(report.yearlyExpenseByCategory?.length > 0 || report.yearlyIncomeByCategory?.length > 0) && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Yearly Expense Pie Chart */}
                                {report.yearlyExpenseByCategory && report.yearlyExpenseByCategory.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-md p-6">
                                        <CategoryPieChart
                                            data={report.yearlyExpenseByCategory}
                                            title="Phân bổ chi tiêu năm"
                                        />
                                    </div>
                                )}

                                {/* Yearly Income Pie Chart */}
                                {report.yearlyIncomeByCategory && report.yearlyIncomeByCategory.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-md p-6">
                                        <CategoryPieChart
                                            data={report.yearlyIncomeByCategory}
                                            title="Phân bổ thu nhập năm"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Yearly Expense Categories */}
                        {report.yearlyExpenseByCategory && report.yearlyExpenseByCategory.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết chi tiêu theo danh mục</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Giao dịch</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Tổng</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {report.yearlyExpenseByCategory.map(category => (
                                                <tr key={category.categoryId} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span style={{ color: category.categoryColor || '#6B7280' }}>{category.categoryIcon || '📁'}</span>
                                                            <span className="font-medium text-gray-900">{category.categoryName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium text-red-600">
                                                        {formatCurrency(category.amount)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-gray-600">
                                                        {category.transactionCount}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-gray-600">
                                                        {category.percentage.toFixed(1)}%
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Yearly Income Categories */}
                        {report.yearlyIncomeByCategory && report.yearlyIncomeByCategory.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết thu nhập theo danh mục</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Giao dịch</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Tổng</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {report.yearlyIncomeByCategory.map(category => (
                                                <tr key={category.categoryId} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span style={{ color: category.categoryColor || '#6B7280' }}>{category.categoryIcon || '📁'}</span>
                                                            <span className="font-medium text-gray-900">{category.categoryName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium text-green-600">
                                                        {formatCurrency(category.amount)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-gray-600">
                                                        {category.transactionCount}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-gray-600">
                                                        {category.percentage.toFixed(1)}%
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* No Data Message */}
                {!loading && !error && !report && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-500">Không có dữ liệu báo cáo</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YearlyReport;
