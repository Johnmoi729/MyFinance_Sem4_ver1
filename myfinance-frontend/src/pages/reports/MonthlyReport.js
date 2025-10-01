import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI, formatCurrency } from '../../services/api';
import { exportMonthlyReportToCSV } from '../../utils/exportUtils';
import CategoryPieChart from '../../components/charts/CategoryPieChart';
import FinancialHealthScore from '../../components/reports/FinancialHealthScore';

const MonthlyReport = () => {
    const navigate = useNavigate();
    const currentDate = new Date();
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load report when year or month changes
    useEffect(() => {
        loadReport();
    }, [year, month]);

    const loadReport = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await reportAPI.getMonthlyReport(year, month);
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

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value);
        if (newMonth >= 1 && newMonth <= 12) {
            setMonth(newMonth);
        }
    };

    const handlePreviousMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    const handleCurrentMonth = () => {
        const now = new Date();
        setYear(now.getFullYear());
        setMonth(now.getMonth() + 1);
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
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Báo cáo tháng</h1>
                    <p className="mt-2 text-gray-600">Tổng hợp thu chi và phân tích chi tiết theo tháng</p>
                </div>

                {/* Month/Year Selector */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={handlePreviousMonth}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            ← Tháng trước
                        </button>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Tháng:</label>
                            <select
                                value={month}
                                onChange={handleMonthChange}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                    <option key={m} value={m}>Tháng {m}</option>
                                ))}
                            </select>
                        </div>

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
                            onClick={handleCurrentMonth}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                        >
                            Tháng hiện tại
                        </button>

                        <button
                            onClick={handleNextMonth}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Tháng sau →
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
                        {/* Export Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => exportMonthlyReportToCSV(report)}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors flex items-center gap-2"
                            >
                                <span>📥</span>
                                Xuất CSV
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
                                                {getChangeIcon(report.incomeChangePercent)} {Math.abs(report.incomeChangePercent).toFixed(1)}% so với tháng trước
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
                                                {getChangeIcon(report.expenseChangePercent)} {Math.abs(report.expenseChangePercent).toFixed(1)}% so với tháng trước
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
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Thống kê</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Tổng giao dịch</p>
                                    <p className="text-2xl font-bold text-gray-900">{report.totalTransactions}</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Trung bình/giao dịch</p>
                                    <p className="text-lg font-bold text-gray-900">{formatCurrency(report.averageTransaction)}</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Chi tiêu lớn nhất</p>
                                    <p className="text-lg font-bold text-red-600">{formatCurrency(report.largestExpense)}</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Thu nhập lớn nhất</p>
                                    <p className="text-lg font-bold text-green-600">{formatCurrency(report.largestIncome)}</p>
                                </div>
                            </div>
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

                        {/* Visual Charts */}
                        {(report.expenseByCategory?.length > 0 || report.incomeByCategory?.length > 0) && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Expense Pie Chart */}
                                {report.expenseByCategory && report.expenseByCategory.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-md p-6">
                                        <CategoryPieChart
                                            data={report.expenseByCategory}
                                            title="Phân bổ chi tiêu theo danh mục"
                                        />
                                    </div>
                                )}

                                {/* Income Pie Chart */}
                                {report.incomeByCategory && report.incomeByCategory.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-md p-6">
                                        <CategoryPieChart
                                            data={report.incomeByCategory}
                                            title="Phân bổ thu nhập theo danh mục"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Top Expense Categories */}
                        {report.topExpenseCategories && report.topExpenseCategories.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Top 5 danh mục chi tiêu</h2>
                                <div className="space-y-3">
                                    {report.topExpenseCategories.map((category, index) => (
                                        <div key={category.categoryId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                                                <div className="flex items-center gap-2">
                                                    <span style={{ color: category.categoryColor || '#6B7280' }}>{category.categoryIcon || '📁'}</span>
                                                    <span className="font-medium text-gray-900">{category.categoryName}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-red-600">{formatCurrency(category.amount)}</p>
                                                <p className="text-sm text-gray-600">{category.percentage.toFixed(1)}% tổng chi</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Top Income Categories */}
                        {report.topIncomeCategories && report.topIncomeCategories.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Top 5 danh mục thu nhập</h2>
                                <div className="space-y-3">
                                    {report.topIncomeCategories.map((category, index) => (
                                        <div key={category.categoryId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                                                <div className="flex items-center gap-2">
                                                    <span style={{ color: category.categoryColor || '#6B7280' }}>{category.categoryIcon || '📁'}</span>
                                                    <span className="font-medium text-gray-900">{category.categoryName}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">{formatCurrency(category.amount)}</p>
                                                <p className="text-sm text-gray-600">{category.percentage.toFixed(1)}% tổng thu</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Expense Categories */}
                        {report.expenseByCategory && report.expenseByCategory.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết chi tiêu theo danh mục</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Giao dịch</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Tổng</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {report.expenseByCategory.map(category => (
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

                        {/* All Income Categories */}
                        {report.incomeByCategory && report.incomeByCategory.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết thu nhập theo danh mục</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Giao dịch</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Tổng</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {report.incomeByCategory.map(category => (
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

export default MonthlyReport;
