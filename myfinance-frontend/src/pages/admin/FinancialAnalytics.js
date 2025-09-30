import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI, formatCurrency } from '../../services/api';

const FinancialAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeFrame, setTimeFrame] = useState('month'); // month, quarter, year
    const [selectedPeriod, setSelectedPeriod] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        quarter: Math.ceil((new Date().getMonth() + 1) / 3)
    });

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeFrame, selectedPeriod]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await adminAPI.getFinancialAnalytics({
                timeFrame,
                year: selectedPeriod.year,
                month: timeFrame === 'month' ? selectedPeriod.month : undefined,
                quarter: timeFrame === 'quarter' ? selectedPeriod.quarter : undefined
            });

            if (response && response.success) {
                setAnalyticsData(response.data);
            } else {
                setError(response?.message || 'Failed to load analytics data');
            }
        } catch (err) {
            console.error('Analytics fetch error:', err);
            setError('Error loading analytics data');
        } finally {
            setLoading(false);
        }
    };

    const handleTimeFrameChange = (newTimeFrame) => {
        setTimeFrame(newTimeFrame);
    };

    const handlePeriodChange = (field, value) => {
        setSelectedPeriod(prev => ({
            ...prev,
            [field]: parseInt(value)
        }));
    };

    const calculateGrowthRate = (current, previous) => {
        if (!previous || previous === 0) return 0;
        return ((current - previous) / previous * 100);
    };

    const formatGrowthRate = (rate) => {
        const formatted = Math.abs(rate).toFixed(1);
        return rate >= 0 ? `+${formatted}%` : `-${formatted}%`;
    };

    const getGrowthColor = (rate) => {
        return rate >= 0 ? 'text-green-600' : 'text-red-600';
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
                        <p className="text-gray-600">
                            Comprehensive financial insights and trends analysis
                        </p>
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={() => alert('Export functionality will be implemented in next phase')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Export Report
                    </button>
                </div>

                {/* Time Frame Controls */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Time Period Selection</h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Time Frame Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time Frame</label>
                            <select
                                value={timeFrame}
                                onChange={(e) => handleTimeFrameChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="month">Monthly</option>
                                <option value="quarter">Quarterly</option>
                                <option value="year">Yearly</option>
                            </select>
                        </div>

                        {/* Year Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                            <select
                                value={selectedPeriod.year}
                                onChange={(e) => handlePeriodChange('year', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        {/* Month/Quarter Selection */}
                        {timeFrame === 'month' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                                <select
                                    value={selectedPeriod.month}
                                    onChange={(e) => handlePeriodChange('month', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                        <option key={month} value={month}>
                                            {new Date(2000, month - 1).toLocaleDateString('vi-VN', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {timeFrame === 'quarter' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quarter</label>
                                <select
                                    value={selectedPeriod.quarter}
                                    onChange={(e) => handlePeriodChange('quarter', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={1}>Q1 (Jan-Mar)</option>
                                    <option value={2}>Q2 (Apr-Jun)</option>
                                    <option value={3}>Q3 (Jul-Sep)</option>
                                    <option value={4}>Q4 (Oct-Dec)</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <strong className="font-bold">Error: </strong>
                        <span>{error}</span>
                    </div>
                )}

                {/* Key Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {analyticsData?.totalRevenue ? formatCurrency(analyticsData.totalRevenue) : '₫0'}
                                </p>
                                <p className={`text-sm ${getGrowthColor(analyticsData?.revenueGrowth || 0)}`}>
                                    {formatGrowthRate(analyticsData?.revenueGrowth || 0)} vs previous period
                                </p>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {analyticsData?.totalExpenses ? formatCurrency(analyticsData.totalExpenses) : '₫0'}
                                </p>
                                <p className={`text-sm ${getGrowthColor(-(analyticsData?.expenseGrowth || 0))}`}>
                                    {formatGrowthRate(analyticsData?.expenseGrowth || 0)} vs previous period
                                </p>
                            </div>
                            <div className="p-2 bg-red-100 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {analyticsData?.netProfit ? formatCurrency(analyticsData.netProfit) : '₫0'}
                                </p>
                                <p className={`text-sm ${getGrowthColor(analyticsData?.profitGrowth || 0)}`}>
                                    {formatGrowthRate(analyticsData?.profitGrowth || 0)} vs previous period
                                </p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Users</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {analyticsData?.activeUsers || 0}
                                </p>
                                <p className={`text-sm ${getGrowthColor(analyticsData?.userGrowth || 0)}`}>
                                    {formatGrowthRate(analyticsData?.userGrowth || 0)} vs previous period
                                </p>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Expense Categories</h3>
                        <div className="space-y-4">
                            {analyticsData?.topExpenseCategories?.slice(0, 5).map((category, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: category.color || '#3B82F6' }}></div>
                                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatCurrency(category.amount)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {((category.amount / (analyticsData?.totalExpenses || 1)) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            )) || (
                                <p className="text-gray-500 text-sm">No expense data available</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Income Categories</h3>
                        <div className="space-y-4">
                            {analyticsData?.topIncomeCategories?.slice(0, 5).map((category, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: category.color || '#10B981' }}></div>
                                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatCurrency(category.amount)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {((category.amount / (analyticsData?.totalRevenue || 1)) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            )) || (
                                <p className="text-gray-500 text-sm">No income data available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Activity Analysis */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">User Engagement Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">
                                {analyticsData?.avgTransactionsPerUser?.toFixed(1) || '0.0'}
                            </p>
                            <p className="text-sm text-gray-600">Avg Transactions per User</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">
                                {analyticsData?.avgSessionDuration || '0'} min
                            </p>
                            <p className="text-sm text-gray-600">Avg Session Duration</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-purple-600">
                                {((analyticsData?.retentionRate || 0) * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-600">User Retention Rate</p>
                        </div>
                    </div>
                </div>

                {/* System Performance Indicators */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">System Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">Database Size</p>
                            <p className="text-xl font-bold text-gray-900">
                                {analyticsData?.systemMetrics?.databaseSize || 'N/A'}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">API Response Time</p>
                            <p className="text-xl font-bold text-gray-900">
                                {analyticsData?.systemMetrics?.avgResponseTime || 'N/A'} ms
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">Error Rate</p>
                            <p className="text-xl font-bold text-gray-900">
                                {((analyticsData?.systemMetrics?.errorRate || 0) * 100).toFixed(2)}%
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">Uptime</p>
                            <p className="text-xl font-bold text-gray-900">
                                {((analyticsData?.systemMetrics?.uptime || 0) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default FinancialAnalytics;