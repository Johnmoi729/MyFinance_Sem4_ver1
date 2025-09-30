import React from 'react';
import BudgetProgressBar from './BudgetProgressBar';
import BudgetStatusBadge from './BudgetStatusBadge';

const BudgetUsageCard = ({ budgetUsage, onClick, showPeriod = false }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const getRemainingAmount = () => {
        return budgetUsage.budgetAmount - budgetUsage.actualSpent;
    };

    const isOverBudget = budgetUsage.usagePercentage > 100;
    const remainingAmount = getRemainingAmount();

    return (
        <div
            className={`
                bg-white rounded-lg shadow-sm border border-gray-200 p-6
                hover:shadow-md transition-shadow duration-200
                ${onClick ? 'cursor-pointer hover:border-blue-300' : ''}
            `}
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: budgetUsage.categoryColor }}
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {budgetUsage.categoryName}
                        </h3>
                        {showPeriod && (
                            <p className="text-sm text-gray-500">
                                Tháng {budgetUsage.budgetMonth}/{budgetUsage.budgetYear}
                            </p>
                        )}
                    </div>
                </div>

                <BudgetStatusBadge
                    status={budgetUsage.status}
                    usagePercentage={budgetUsage.usagePercentage}
                />
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <BudgetProgressBar
                    budgetAmount={budgetUsage.budgetAmount}
                    actualSpent={budgetUsage.actualSpent}
                    usagePercentage={budgetUsage.usagePercentage}
                    status={budgetUsage.status}
                    showDetails={false}
                />
            </div>

            {/* Financial Details */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ngân sách:</span>
                    <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(budgetUsage.budgetAmount)}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Đã chi tiêu:</span>
                    <span className="text-sm font-semibold text-red-600">
                        {formatCurrency(budgetUsage.actualSpent)}
                    </span>
                </div>

                <div className="flex justify-between items-center border-t pt-3">
                    <span className="text-sm font-medium text-gray-700">
                        {isOverBudget ? 'Vượt quá:' : 'Còn lại:'}
                    </span>
                    <span className={`text-sm font-bold ${
                        isOverBudget ? 'text-red-600' : 'text-green-600'
                    }`}>
                        {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(remainingAmount))}
                    </span>
                </div>
            </div>

            {/* Status Message */}
            {budgetUsage.statusMessage && (
                <div className={`
                    mt-4 p-3 rounded-md text-sm
                    ${budgetUsage.status === 'RED'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : budgetUsage.status === 'YELLOW'
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }
                `}>
                    {budgetUsage.statusMessage}
                </div>
            )}

            {/* Action indicator */}
            {onClick && (
                <div className="mt-4 text-center">
                    <span className="text-xs text-gray-400">Nhấp để xem chi tiết</span>
                </div>
            )}
        </div>
    );
};

export default BudgetUsageCard;