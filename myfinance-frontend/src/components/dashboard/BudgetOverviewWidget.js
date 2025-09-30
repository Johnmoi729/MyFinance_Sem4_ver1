import React from 'react';
import { Link } from 'react-router-dom';
import { useBudget } from '../../context/BudgetContext';
import BudgetProgressBar from '../budget/BudgetProgressBar';

const BudgetOverviewWidget = () => {
    const { budgetDashboard, analyticsLoading } = useBudget();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (analyticsLoading) {
        return (
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Tổng quan ngân sách</h3>
                </div>
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!budgetDashboard) {
        return (
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Tổng quan ngân sách</h3>
                </div>
                <div className="p-6">
                    <p className="text-gray-500 text-center py-8">
                        Chưa có dữ liệu ngân sách
                    </p>
                    <div className="text-center">
                        <Link
                            to="/budgets"
                            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                            Quản lý ngân sách
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const {
        totalBudgetAmount,
        totalActualSpent,
        overallUsagePercentage,
        budgetsOnTrack,
        budgetsAtRisk,
        budgetsOverLimit,
        recentBudgets,
        urgentAlerts
    } = budgetDashboard;

    const getOverallStatus = () => {
        if (overallUsagePercentage >= 100) return 'RED';
        if (overallUsagePercentage >= 75) return 'YELLOW';
        return 'GREEN';
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Tổng quan ngân sách</h3>
                <Link
                    to="/budgets"
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                    Xem tất cả
                </Link>
            </div>

            <div className="p-6">
                {/* Overall Budget Summary */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Tổng ngân sách tháng này</span>
                        <span className="text-sm font-bold text-gray-900">
                            {formatCurrency(totalBudgetAmount)}
                        </span>
                    </div>

                    <BudgetProgressBar
                        budgetAmount={totalBudgetAmount}
                        actualSpent={totalActualSpent}
                        usagePercentage={overallUsagePercentage}
                        status={getOverallStatus()}
                        showDetails={true}
                        size="medium"
                    />
                </div>

                {/* Budget Status Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{budgetsOnTrack}</div>
                        <div className="text-xs text-gray-500">Ổn định</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">{budgetsAtRisk}</div>
                        <div className="text-xs text-gray-500">Cảnh báo</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{budgetsOverLimit}</div>
                        <div className="text-xs text-gray-500">Vượt hạn</div>
                    </div>
                </div>

                {/* Urgent Alerts */}
                {urgentAlerts && urgentAlerts.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center">
                            <span className="mr-1">🚨</span>
                            Cảnh báo khẩn cấp
                        </h4>
                        <div className="space-y-2">
                            {urgentAlerts.slice(0, 2).map((alert, index) => (
                                <div key={index} className="bg-red-50 border border-red-200 rounded p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-red-800">
                                            {alert.categoryName}
                                        </span>
                                        <span className="text-xs font-bold text-red-600">
                                            {alert.usagePercentage.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="text-xs text-red-600 mt-1">
                                        {alert.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Budget Status */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Ngân sách tháng hiện tại</h4>
                    <div className="space-y-3">
                        {recentBudgets.slice(0, 3).map((budget) => (
                            <div key={budget.budgetId} className="flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: budget.categoryColor }}
                                    />
                                    <span className="text-sm text-gray-700 truncate">
                                        {budget.categoryName}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                        budget.status === 'GREEN' ? 'bg-green-500' :
                                        budget.status === 'YELLOW' ? 'bg-yellow-500' :
                                        'bg-red-500'
                                    }`} />
                                    <span className="text-xs font-medium text-gray-600">
                                        {budget.usagePercentage.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                        <Link
                            to="/budgets/add"
                            className="flex-1 text-center py-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition-colors"
                        >
                            Thêm ngân sách
                        </Link>
                        <Link
                            to="/budgets"
                            className="flex-1 text-center py-2 px-3 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium transition-colors"
                        >
                            Quản lý
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetOverviewWidget;