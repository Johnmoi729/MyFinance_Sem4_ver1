import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { transactionAPI, budgetAPI, onboardingAPI } from '../../services/api';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';
import { useDateFormatter } from '../../utils/dateFormatter';
import BudgetOverviewWidget from '../../components/dashboard/BudgetOverviewWidget';
import BudgetAlertToastPersistent from '../../components/budget/BudgetAlertToastPersistent';
import PersonalizedGreeting from '../../components/dashboard/PersonalizedGreeting';
import OnboardingWizard from '../../components/onboarding/OnboardingWizard';
import { Plus, Minus, Coins, Receipt, ChevronRight, Calendar, Target, BarChart3 } from '../../components/icons';

const DashboardPage = () => {
    const { user } = useAuth();
    const { formatCurrency } = useCurrencyFormatter();
    const { formatDate, getRelativeTime } = useDateFormatter();
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactionCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [budgetAlerts, setBudgetAlerts] = useState([]);
    const [showBudgetToast, setShowBudgetToast] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        fetchDashboardData();
        checkOnboardingStatus();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch recent transactions and budget warnings in parallel
            const [recentResponse, warningsResponse] = await Promise.all([
                transactionAPI.getRecentTransactions(),
                budgetAPI.getBudgetWarnings()
            ]);

            if (recentResponse.success) {
                setRecentTransactions(recentResponse.data);

                // Calculate stats from recent transactions
                const totalIncome = recentResponse.data
                    .filter(t => t.type === 'INCOME')
                    .reduce((sum, t) => sum + t.amount, 0);

                const totalExpense = recentResponse.data
                    .filter(t => t.type === 'EXPENSE')
                    .reduce((sum, t) => sum + t.amount, 0);

                setStats({
                    totalIncome,
                    totalExpense,
                    balance: totalIncome - totalExpense,
                    transactionCount: recentResponse.data.length
                });
            }

            // Check for budget alerts
            if (warningsResponse && warningsResponse.success) {
                const alerts = warningsResponse.data?.alerts || [];
                const criticalAlerts = alerts.filter(alert =>
                    alert.alertLevel === 'RED' || (alert.usagePercentage && alert.usagePercentage >= 90)
                );

                if (criticalAlerts.length > 0) {
                    setBudgetAlerts(criticalAlerts);
                    setShowBudgetToast(true);
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkOnboardingStatus = async () => {
        try {
            const response = await onboardingAPI.getProgress();
            if (response && response.success) {
                const progress = response.data;
                // Show onboarding if not completed and not skipped
                if (progress.shouldShowOnboarding) {
                    // Delay showing to allow dashboard to load first
                    setTimeout(() => {
                        setShowOnboarding(true);
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Error checking onboarding status:', error);
        }
    };

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Persistent Budget Alert Toast */}
            {showBudgetToast && budgetAlerts.length > 0 && (
                <BudgetAlertToastPersistent
                    alerts={budgetAlerts}
                    onClose={() => setShowBudgetToast(false)}
                />
            )}

            {/* Onboarding Wizard */}
            {showOnboarding && (
                <OnboardingWizard
                    onClose={() => setShowOnboarding(false)}
                    onComplete={handleOnboardingComplete}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Personalized Greeting */}
                <div className="mb-8">
                    <PersonalizedGreeting userName={user?.fullName} />
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="stat-card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-green-700 mb-2">Thu nhập</p>
                                <p className="text-2xl lg:text-3xl font-bold text-green-600 break-words">{formatCurrency(stats.totalIncome)}</p>
                                <p className="text-xs text-green-600 mt-2">↗ Tháng này</p>
                            </div>
                            <div className="flex-shrink-0 p-3 bg-green-200 rounded-2xl">
                                <Plus className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-red-700 mb-2">Chi tiêu</p>
                                <p className="text-2xl lg:text-3xl font-bold text-red-600 break-words">{formatCurrency(stats.totalExpense)}</p>
                                <p className="text-xs text-red-600 mt-2">↘ Tháng này</p>
                            </div>
                            <div className="flex-shrink-0 p-3 bg-red-200 rounded-2xl">
                                <Minus className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-indigo-700 mb-2">Số dư</p>
                                <p className={`text-2xl lg:text-3xl font-bold break-words ${stats.balance >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                                    {formatCurrency(stats.balance)}
                                </p>
                                <p className="text-xs text-indigo-600 mt-2">Hiện tại</p>
                            </div>
                            <div className="flex-shrink-0 p-3 bg-indigo-200 rounded-2xl">
                                <Coins className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-violet-700 mb-2">Giao dịch</p>
                                <p className="text-2xl lg:text-3xl font-bold text-violet-600 break-words">{stats.transactionCount}</p>
                                <p className="text-xs text-violet-600 mt-2">Tổng số</p>
                            </div>
                            <div className="flex-shrink-0 p-3 bg-violet-200 rounded-2xl">
                                <Receipt className="w-6 h-6 text-violet-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent transactions */}
                    <div className="card">
                        <div className="card-header flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Giao dịch gần đây</h3>
                            <Link to="/transactions" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium flex items-center">
                                Xem tất cả
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                        <div className="card-body">
                        {recentTransactions.length > 0 ? (
                            <div className="space-y-4">
                                {recentTransactions.slice(0, 5).map((transaction) => (
                                    <div key={transaction.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                        <div className="flex items-center flex-1">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                                <span className={`text-base font-semibold ${
                                                    transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {transaction.category.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                                                    {transaction.description || transaction.category.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatDate(transaction.transactionDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-base font-bold ${
                                            transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Chưa có giao dịch nào</p>
                        )}
                    </div>
                </div>

                {/* Budget Overview Widget */}
                <BudgetOverviewWidget />

                    {/* Quick actions */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Thao tác nhanh</h3>
                        </div>
                        <div className="card-body">
                            <div className="space-y-3">
                                <Link
                                    to="/transactions/add"
                                    className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl hover:shadow-md transition-all group border border-indigo-200"
                                >
                                    <div className="p-3 bg-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <Plus className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">Thêm giao dịch</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Ghi lại thu chi của bạn</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-indigo-600" />
                                </Link>

                                <Link
                                    to="/budgets/add"
                                    className="flex items-center p-4 bg-gradient-to-r from-violet-50 to-violet-100 rounded-xl hover:shadow-md transition-all group border border-violet-200"
                                >
                                    <div className="p-3 bg-violet-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">Thêm ngân sách</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Thiết lập kế hoạch chi tiêu</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-violet-600" />
                                </Link>

                                <Link
                                    to="/analytics"
                                    className="flex items-center p-4 bg-gradient-to-r from-indigo-50 via-violet-50 to-violet-100 rounded-xl hover:shadow-md transition-all group border border-violet-200"
                                >
                                    <div className="p-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">Phân tích tài chính</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Xem báo cáo chi tiết</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-indigo-600" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;