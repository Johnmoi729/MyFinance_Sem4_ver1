import React from 'react';
import { calculateFinancialHealthScore } from '../../utils/financialHealthUtils';

const FinancialHealthScore = ({ data }) => {
    if (!data) {
        return null;
    }

    const healthData = calculateFinancialHealthScore(data);
    const { totalScore, rating, recommendations, breakdown } = healthData;

    const getScoreColor = () => {
        if (totalScore >= 80) return 'text-green-600';
        if (totalScore >= 60) return 'text-blue-600';
        if (totalScore >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProgressBarColor = () => {
        if (totalScore >= 80) return 'bg-green-500';
        if (totalScore >= 60) return 'bg-blue-500';
        if (totalScore >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-100 text-red-700 border-red-300';
            case 'high':
                return 'bg-orange-100 text-orange-700 border-orange-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            default:
                return 'bg-blue-100 text-blue-700 border-blue-300';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá sức khỏe tài chính</h2>

            {/* Score Display */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-6xl">{rating.icon}</span>
                    <div>
                        <p className={`text-5xl font-bold ${getScoreColor()}`}>{totalScore}</p>
                        <p className="text-gray-500 text-sm">/100 điểm</p>
                    </div>
                </div>

                <p className={`text-2xl font-semibold mb-2`} style={{ color: rating.color }}>
                    {rating.level}
                </p>
                <p className="text-gray-600">{rating.description}</p>

                {/* Progress Bar */}
                <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
                    <div
                        className={`h-4 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
                        style={{ width: `${totalScore}%` }}
                    ></div>
                </div>
            </div>

            {/* Score Breakdown */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Chi tiết điểm số</h3>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700">Tỷ lệ tiết kiệm</span>
                        <span className="font-medium">{breakdown.savingsRateScore}/30</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700">Tỷ lệ chi tiêu</span>
                        <span className="font-medium">{breakdown.expenseRatioScore}/25</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700">Tiết kiệm ròng</span>
                        <span className="font-medium">{breakdown.netSavingsScore}/20</span>
                    </div>
                    {breakdown.budgetAdherenceScore > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Tuân thủ ngân sách</span>
                            <span className="font-medium">{breakdown.budgetAdherenceScore}/25</span>
                        </div>
                    )}
                    {breakdown.noBudgetBonus > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Điểm thưởng</span>
                            <span className="font-medium">+{breakdown.noBudgetBonus}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Recommendations */}
            {recommendations && recommendations.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Khuyến nghị</h3>
                    <div className="space-y-3">
                        {recommendations.map((rec, index) => (
                            <div
                                key={index}
                                className={`border rounded-lg p-4 ${getPriorityColor(rec.priority)}`}
                            >
                                <div className="flex items-start gap-2">
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm mb-1">
                                            {rec.category}
                                            {rec.priority === 'critical' && <span className="ml-2">🚨</span>}
                                            {rec.priority === 'high' && <span className="ml-2">⚠️</span>}
                                        </p>
                                        <p className="text-sm mb-2">{rec.message}</p>
                                        <p className="text-xs italic">💡 {rec.action}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialHealthScore;
