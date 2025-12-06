import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI } from '../../services/api';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';
import EnhancedCategoryPieChart from '../../components/charts/EnhancedCategoryPieChart';
import EnhancedBarChart from '../../components/charts/EnhancedBarChart';
import { TrendingUp, TrendingDown } from '../../components/icons';

const FinancialAnalytics = () => {
    const navigate = useNavigate();
    const { formatCurrency } = useCurrencyFormatter();
    const [loading, setLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState(null);
    const [yearlyData, setYearlyData] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

    const fetchAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;

            // Store current year and month for drill-down navigation
            setCurrentYear(year);
            setCurrentMonth(month);

            // Fetch monthly report
            const monthlyResponse = await reportAPI.getMonthlyReport(year, month);
            if (monthlyResponse && monthlyResponse.success) {
                setMonthlyData(monthlyResponse.data);
            }

            // Fetch yearly report
            const yearlyResponse = await reportAPI.getYearlyReport(year);
            if (yearlyResponse && yearlyResponse.success) {
                setYearlyData(yearlyResponse.data);
            }

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    // Helper function to calculate month date range
    const getMonthDateRange = (year, month) => {
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        return { startDate, endDate };
    };

    // Helper function to extract month number from Vietnamese month name
    const extractMonthNumber = (monthName) => {
        // monthName format: "Tháng 1", "Tháng 2", etc.
        const match = monthName.match(/Tháng (\d+)/);
        return match ? parseInt(match[1]) : null;
    };

    // Handle category click - drill down to transactions filtered by category
    const handleCategoryClick = (category) => {
        if (!category.categoryId) return;

        // Get current month date range
        const { startDate, endDate } = getMonthDateRange(currentYear, currentMonth);

        // Navigate to transactions page with filters
        const params = new URLSearchParams({
            categoryId: category.categoryId,
            type: 'EXPENSE',
            startDate: startDate,
            endDate: endDate,
            source: 'analytics',
            sourceName: category.name
        });

        navigate(`/transactions?${params.toString()}`);
    };

    // Handle month click - drill down to transactions filtered by month
    const handleMonthClick = (monthData) => {
        setSelectedPeriod(monthData);

        // Extract month number from Vietnamese month name
        const monthNumber = extractMonthNumber(monthData.month);
        if (!monthNumber) return;

        // Get date range for the clicked month
        const { startDate, endDate } = getMonthDateRange(currentYear, monthNumber);

        // Navigate to transactions page with filters
        const params = new URLSearchParams({
            startDate: startDate,
            endDate: endDate,
            source: 'analytics',
            sourceName: monthData.month
        });

        navigate(`/transactions?${params.toString()}`);
    };

    const calculateMonthOverMonth = () => {
        if (!yearlyData || !yearlyData.monthlyData || yearlyData.monthlyData.length < 2) {
            return null;
        }

        const months = yearlyData.monthlyData;
        const currentMonth = months[months.length - 1];
        const previousMonth = months[months.length - 2];

        const expenseChange = currentMonth.expense - previousMonth.expense;
        const expenseGrowth = previousMonth.expense !== 0
            ? ((expenseChange / previousMonth.expense) * 100)
            : 0;

        const incomeChange = currentMonth.income - previousMonth.income;
        const incomeGrowth = previousMonth.income !== 0
            ? ((incomeChange / previousMonth.income) * 100)
            : 0;

        return {
            currentMonth: currentMonth.monthName,
            previousMonth: previousMonth.monthName,
            expenseChange,
            expenseGrowth,
            incomeChange,
            incomeGrowth
        };
    };

    const comparison = calculateMonthOverMonth();

    const calculateHealthScore = () => {
        if (!monthlyData) return 0;

        let score = 0;

        // 1. Savings rate (40 points max)
        const savingsRate = monthlyData.savingsRate || 0;
        if (savingsRate >= 30) score += 40;
        else if (savingsRate >= 20) score += 30;
        else if (savingsRate >= 10) score += 20;
        else if (savingsRate > 0) score += 10;

        // 2. Positive net savings (30 points)
        if (monthlyData.netSavings > 0) {
            score += 30;
        } else if (monthlyData.netSavings === 0) {
            score += 15;
        }

        // 3. Budget adherence (30 points)
        if (monthlyData.expenseByCategory && monthlyData.expenseByCategory.length > 0) {
            const categoriesWithBudget = monthlyData.expenseByCategory.filter(c => c.budgetAmount && c.budgetAmount > 0);
            if (categoriesWithBudget.length > 0) {
                const withinBudgetCount = categoriesWithBudget.filter(c => c.budgetUsagePercent && c.budgetUsagePercent <= 100).length;
                const budgetAdherence = (withinBudgetCount / categoriesWithBudget.length) * 100;
                score += Math.round((budgetAdherence / 100) * 30);
            } else {
                // No budgets set, give partial points
                score += 15;
            }
        } else {
            score += 15;
        }

        return Math.min(score, 100);
    };

    const healthScore = calculateHealthScore();

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Phân Tích Tài Chính</h1>
                <p className="text-gray-600 mt-2">
                    Theo dõi chi tiết về tình hình tài chính cá nhân của bạn
                </p>
            </div>

            {/* Month-over-Month Comparison */}
            {comparison && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        So sánh {comparison.currentMonth} với {comparison.previousMonth}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Thu nhập</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(Math.abs(comparison.incomeChange))}
                                </p>
                                <div className={`flex items-center mt-1 ${comparison.incomeGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {comparison.incomeGrowth >= 0 ? (
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 mr-1" />
                                    )}
                                    <span className="text-sm font-medium">{Math.abs(comparison.incomeGrowth).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Chi tiêu</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(Math.abs(comparison.expenseChange))}
                                </p>
                                <div className={`flex items-center mt-1 ${comparison.expenseGrowth >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {comparison.expenseGrowth >= 0 ? (
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 mr-1" />
                                    )}
                                    <span className="text-sm font-medium">{Math.abs(comparison.expenseGrowth).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            {monthlyData && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
                        <p className="text-sm opacity-90">Thu nhập tháng này</p>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(monthlyData.totalIncome)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md p-6 text-white">
                        <p className="text-sm opacity-90">Chi tiêu tháng này</p>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(monthlyData.totalExpense)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                        <p className="text-sm opacity-90">Tiết kiệm</p>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(monthlyData.netSavings)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                        <p className="text-sm opacity-90">Tỷ lệ tiết kiệm</p>
                        <p className="text-3xl font-bold mt-2">{monthlyData.savingsRate?.toFixed(1) || 0}%</p>
                    </div>
                </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Category Breakdown */}
                {monthlyData && monthlyData.expenseByCategory && monthlyData.expenseByCategory.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <EnhancedCategoryPieChart
                            data={monthlyData.expenseByCategory}
                            title="Phân bổ chi tiêu theo danh mục"
                            onCategoryClick={handleCategoryClick}
                        />
                    </div>
                )}

                {/* Top Spending Categories */}
                {monthlyData && monthlyData.topExpenseCategories && monthlyData.topExpenseCategories.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Danh Mục Chi Tiêu</h3>
                        <div className="space-y-3">
                            {monthlyData.topExpenseCategories.slice(0, 5).map((category, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">{category.categoryName}</span>
                                            <span className="text-sm font-semibold text-gray-900">{formatCurrency(category.amount)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${category.percentage || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Monthly Trends */}
            {yearlyData && yearlyData.monthlyData && yearlyData.monthlyData.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <EnhancedBarChart
                        data={yearlyData.monthlyData}
                        title="Xu hướng thu chi theo tháng"
                        onBarClick={handleMonthClick}
                        showComparison={true}
                    />
                </div>
            )}

            {/* Selected Period Details */}
            {selectedPeriod && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        Chi tiết tháng {selectedPeriod.month}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-blue-700">Thu nhập</p>
                            <p className="text-xl font-bold text-green-600">{formatCurrency(selectedPeriod.income)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-blue-700">Chi tiêu</p>
                            <p className="text-xl font-bold text-red-600">{formatCurrency(selectedPeriod.expense)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-blue-700">Tiết kiệm</p>
                            <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedPeriod.netSavings)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Financial Health Score */}
            {monthlyData && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Điểm Sức Khỏe Tài Chính</h3>
                    <div className="flex items-center">
                        <div className="flex-1">
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block text-blue-600">
                                            {healthScore}/100
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
                                    <div
                                        style={{ width: `${healthScore}%` }}
                                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                                            healthScore >= 70 ? 'bg-green-500' :
                                            healthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                {healthScore >= 70 ? 'Tuyệt vời! Tài chính của bạn đang rất tốt.' :
                                 healthScore >= 40 ? 'Khá tốt, nhưng còn cơ hội cải thiện.' :
                                 'Cần chú ý! Nên cải thiện quản lý tài chính.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialAnalytics;
