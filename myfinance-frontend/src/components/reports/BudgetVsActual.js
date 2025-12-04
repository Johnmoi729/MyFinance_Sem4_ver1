import React from 'react';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';

const BudgetVsActual = ({ categoryData, type = 'expense' }) => {
    const { formatCurrency } = useCurrencyFormatter();
    if (!categoryData || categoryData.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Ngân sách vs Thực tế - {type === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
                </h2>
                <div className="text-center py-8 text-gray-500">
                    Không có dữ liệu ngân sách cho kỳ này
                </div>
            </div>
        );
    }

    const calculatePerformance = (actual, budget) => {
        if (!budget || budget === 0) return null;
        const percentage = (actual / budget) * 100;
        return {
            percentage: percentage.toFixed(1),
            difference: actual - budget,
            status: type === 'expense'
                ? (percentage <= 100 ? 'good' : 'over')
                : (percentage >= 100 ? 'good' : 'under')
        };
    };

    const getStatusColor = (status) => {
        if (!status) return 'text-gray-500';
        switch (status) {
            case 'good':
                return 'text-green-600';
            case 'over':
                return 'text-red-600';
            case 'under':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusBgColor = (status) => {
        if (!status) return 'bg-gray-100';
        switch (status) {
            case 'good':
                return 'bg-green-100';
            case 'over':
                return 'bg-red-100';
            case 'under':
                return 'bg-yellow-100';
            default:
                return 'bg-gray-100';
        }
    };

    const getProgressBarColor = (status) => {
        if (!status) return 'bg-gray-400';
        switch (status) {
            case 'good':
                return 'bg-green-500';
            case 'over':
                return 'bg-red-500';
            case 'under':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-400';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                Ngân sách vs Thực tế - {type === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
            </h2>

            <div className="space-y-4">
                {categoryData.map((item, index) => {
                    const performance = calculatePerformance(item.actual, item.budget);

                    return (
                        <div key={index} className={`border rounded-lg p-4 ${getStatusBgColor(performance?.status)}`}>
                            {/* Category Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{item.categoryIcon || '📁'}</span>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.categoryName}</h3>
                                        {performance && (
                                            <p className={`text-sm font-medium ${getStatusColor(performance.status)}`}>
                                                {performance.percentage}% sử dụng
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {performance && (
                                    <div className="text-right">
                                        <p className={`text-sm font-medium ${getStatusColor(performance.status)}`}>
                                            {performance.difference >= 0 ? '+' : ''}{formatCurrency(performance.difference)}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {type === 'expense'
                                                ? (performance.status === 'good' ? 'Còn lại' : 'Vượt')
                                                : (performance.status === 'good' ? 'Đạt được' : 'Chưa đạt')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Budget vs Actual */}
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">Ngân sách</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {item.budget ? formatCurrency(item.budget) : 'Chưa đặt'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">Thực tế</p>
                                    <p className={`text-lg font-semibold ${performance ? getStatusColor(performance.status) : 'text-gray-900'}`}>
                                        {formatCurrency(item.actual)}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {performance && (
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(performance.status)}`}
                                        style={{
                                            width: `${Math.min(performance.percentage, 100)}%`
                                        }}
                                    ></div>
                                </div>
                            )}

                            {/* No Budget Message */}
                            {!performance && (
                                <div className="text-center py-2 text-gray-500 text-sm italic">
                                    Chưa thiết lập ngân sách cho danh mục này
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Summary Section */}
            <div className="mt-6 pt-6 border-t border-gray-300">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Tổng ngân sách</p>
                        <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(categoryData.reduce((sum, item) => sum + (item.budget || 0), 0))}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Tổng thực tế</p>
                        <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(categoryData.reduce((sum, item) => sum + item.actual, 0))}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetVsActual;
