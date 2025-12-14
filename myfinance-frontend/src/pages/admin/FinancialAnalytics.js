import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';
import { TrendingUp, TrendingDown, BarChart3, Users } from '../../components/icons';

const FinancialAnalytics = () => {
 const { formatCurrency } = useCurrencyFormatter();
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
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
 </div>
 </AdminLayout>
 );
 }

 return (
 <AdminLayout>
 <div className="space-y-6">
 {/* Header */}
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
 <p className="text-gray-600">
 Comprehensive financial insights and trends analysis
 </p>
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
 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
 <TrendingUp className="w-6 h-6 text-green-600" />
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
 <TrendingDown className="w-6 h-6 text-red-600" />
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
 <div className="p-2 bg-indigo-100 rounded-lg">
 <BarChart3 className="w-6 h-6 text-indigo-600" />
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
 <Users className="w-6 h-6 text-purple-600" />
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
 <div className="grid grid-cols-1 gap-6">
 <div className="text-center">
 <p className="text-3xl font-bold text-indigo-600">
 {analyticsData?.avgTransactionsPerUser?.toFixed(1) || '0.0'}
 </p>
 <p className="text-sm text-gray-600">Avg Transactions per User</p>
 </div>
 </div>
 </div>
 </div>
 </AdminLayout>
 );
};

export default FinancialAnalytics;