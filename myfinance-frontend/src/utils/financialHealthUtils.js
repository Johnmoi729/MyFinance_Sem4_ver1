/**
 * Financial Health Scoring System
 * Calculates overall financial health based on multiple factors
 */

/**
 * Calculate financial health score (0-100)
 * @param {Object} data - Financial data
 * @returns {Object} - Score and breakdown
 */
export const calculateFinancialHealthScore = (data) => {
    const {
        totalIncome,
        totalExpense,
        netSavings,
        savingsRate,
        budgetAdherence = null // Optional: percentage of budgets followed
    } = data;

    let score = 0;
    const breakdown = {};

    // 1. Savings Rate Score (0-30 points)
    // Excellent: >30%, Good: 20-30%, Fair: 10-20%, Poor: <10%
    if (savingsRate >= 30) {
        breakdown.savingsRateScore = 30;
    } else if (savingsRate >= 20) {
        breakdown.savingsRateScore = 25;
    } else if (savingsRate >= 10) {
        breakdown.savingsRateScore = 15;
    } else if (savingsRate >= 0) {
        breakdown.savingsRateScore = 5;
    } else {
        breakdown.savingsRateScore = 0; // Negative savings
    }
    score += breakdown.savingsRateScore;

    // 2. Income vs Expense Ratio Score (0-25 points)
    const expenseRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 100;
    if (expenseRatio <= 50) {
        breakdown.expenseRatioScore = 25;
    } else if (expenseRatio <= 70) {
        breakdown.expenseRatioScore = 20;
    } else if (expenseRatio <= 90) {
        breakdown.expenseRatioScore = 15;
    } else if (expenseRatio < 100) {
        breakdown.expenseRatioScore = 10;
    } else {
        breakdown.expenseRatioScore = 0; // Spending more than earning
    }
    score += breakdown.expenseRatioScore;

    // 3. Net Savings Score (0-20 points)
    // Based on whether user is saving money
    if (netSavings > 0) {
        const savingsToIncomeRatio = (netSavings / totalIncome) * 100;
        if (savingsToIncomeRatio >= 30) {
            breakdown.netSavingsScore = 20;
        } else if (savingsToIncomeRatio >= 20) {
            breakdown.netSavingsScore = 15;
        } else if (savingsToIncomeRatio >= 10) {
            breakdown.netSavingsScore = 10;
        } else {
            breakdown.netSavingsScore = 5;
        }
    } else {
        breakdown.netSavingsScore = 0;
    }
    score += breakdown.netSavingsScore;

    // 4. Budget Adherence Score (0-25 points) - Optional
    if (budgetAdherence !== null) {
        if (budgetAdherence >= 90) {
            breakdown.budgetAdherenceScore = 25;
        } else if (budgetAdherence >= 75) {
            breakdown.budgetAdherenceScore = 20;
        } else if (budgetAdherence >= 50) {
            breakdown.budgetAdherenceScore = 15;
        } else if (budgetAdherence >= 25) {
            breakdown.budgetAdherenceScore = 10;
        } else {
            breakdown.budgetAdherenceScore = 5;
        }
        score += breakdown.budgetAdherenceScore;
    } else {
        // If no budget data, distribute points elsewhere
        // Add partial points to savings rate
        breakdown.budgetAdherenceScore = 0;
        const bonusPoints = Math.min(25, Math.floor(savingsRate / 2));
        score += bonusPoints;
        breakdown.noBudgetBonus = bonusPoints;
    }

    return {
        totalScore: Math.min(100, Math.round(score)),
        breakdown,
        rating: getHealthRating(score),
        recommendations: getRecommendations(breakdown, data)
    };
};

/**
 * Get health rating based on score
 */
const getHealthRating = (score) => {
    if (score >= 80) {
        return {
            level: 'Xuất sắc',
            color: 'green',
            icon: '🌟',
            description: 'Tình hình tài chính rất tốt! Hãy duy trì thói quen này.'
        };
    } else if (score >= 60) {
        return {
            level: 'Tốt',
            color: 'blue',
            icon: '👍',
            description: 'Tài chính ổn định. Còn một số điểm cần cải thiện.'
        };
    } else if (score >= 40) {
        return {
            level: 'Trung bình',
            color: 'yellow',
            icon: '⚠️',
            description: 'Cần chú ý quản lý tài chính tốt hơn.'
        };
    } else {
        return {
            level: 'Cần cải thiện',
            color: 'red',
            icon: '❗',
            description: 'Tình hình tài chính cần được cải thiện gấp.'
        };
    }
};

/**
 * Generate personalized recommendations
 */
const getRecommendations = (breakdown, data) => {
    const recommendations = [];

    // Savings rate recommendations
    if (breakdown.savingsRateScore < 15) {
        recommendations.push({
            category: 'Tiết kiệm',
            priority: 'high',
            message: 'Tỷ lệ tiết kiệm của bạn thấp. Hãy cố gắng tiết kiệm ít nhất 10-20% thu nhập mỗi tháng.',
            action: 'Xem lại các khoản chi tiêu không cần thiết và cắt giảm'
        });
    }

    // Expense ratio recommendations
    if (breakdown.expenseRatioScore < 15) {
        recommendations.push({
            category: 'Chi tiêu',
            priority: 'high',
            message: 'Chi tiêu của bạn quá cao so với thu nhập. Cần kiểm soát ngay.',
            action: 'Lập kế hoạch ngân sách chi tiết và tuân thủ nghiêm túc'
        });
    }

    // Net savings recommendations
    if (data.netSavings <= 0) {
        recommendations.push({
            category: 'Cân đối thu chi',
            priority: 'critical',
            message: 'Bạn đang chi tiêu nhiều hơn thu nhập. Đây là tín hiệu nguy hiểm!',
            action: 'Cắt giảm chi tiêu không thiết yếu ngay lập tức'
        });
    }

    // Budget adherence recommendations
    if (breakdown.budgetAdherenceScore < 15 && breakdown.budgetAdherenceScore > 0) {
        recommendations.push({
            category: 'Ngân sách',
            priority: 'medium',
            message: 'Bạn chưa tuân thủ tốt ngân sách đã đặt ra.',
            action: 'Theo dõi chi tiêu hàng ngày và điều chỉnh ngân sách phù hợp'
        });
    }

    // Positive reinforcement
    if (breakdown.savingsRateScore >= 25) {
        recommendations.push({
            category: 'Khen ngợi',
            priority: 'low',
            message: 'Tuyệt vời! Tỷ lệ tiết kiệm của bạn rất tốt.',
            action: 'Tiếp tục duy trì và xem xét đầu tư để tăng thu nhập thụ động'
        });
    }

    return recommendations;
};

/**
 * Calculate spending patterns
 */
export const analyzeSpendingPatterns = (transactions) => {
    if (!transactions || transactions.length === 0) {
        return null;
    }

    // Group by day of week
    const byDayOfWeek = {};
    const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

    transactions.forEach(transaction => {
        const date = new Date(transaction.transactionDate);
        const day = daysOfWeek[date.getDay()];

        if (!byDayOfWeek[day]) {
            byDayOfWeek[day] = { count: 0, total: 0 };
        }

        byDayOfWeek[day].count++;
        byDayOfWeek[day].total += parseFloat(transaction.amount);
    });

    // Find peak spending day
    let peakDay = null;
    let maxSpending = 0;

    Object.keys(byDayOfWeek).forEach(day => {
        if (byDayOfWeek[day].total > maxSpending) {
            maxSpending = byDayOfWeek[day].total;
            peakDay = day;
        }
    });

    return {
        byDayOfWeek,
        peakSpendingDay: peakDay,
        peakSpendingAmount: maxSpending
    };
};
