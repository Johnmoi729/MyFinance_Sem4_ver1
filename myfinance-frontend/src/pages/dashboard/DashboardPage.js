import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { transactionAPI } from '../../services/api';
import { formatCurrency } from '../../services/api';
import BudgetOverviewWidget from '../../components/dashboard/BudgetOverviewWidget';

const DashboardPage = () => {
    const { user } = useAuth();
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactionCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch recent transactions
            const recentResponse = await transactionAPI.getRecentTransactions();
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
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome message */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Chào mừng trở lại, {user?.fullName}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Đây là tổng quan tài chính của bạn
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Thu nhập</p>
                            <p className="text-2xl font-semibold text-green-600">{formatCurrency(stats.totalIncome)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Chi tiêu</p>
                            <p className="text-2xl font-semibold text-red-600">{formatCurrency(stats.totalExpense)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Số dư</p>
                            <p className={`text-2xl font-semibold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(stats.balance)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Giao dịch</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.transactionCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent transactions */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Giao dịch gần đây</h3>
                        <Link to="/transactions" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="p-6">
                        {recentTransactions.length > 0 ? (
                            <div className="space-y-4">
                                {recentTransactions.slice(0, 5).map((transaction) => (
                                    <div key={transaction.id} className="flex justify-between items-center py-2">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                        <span className={`text-sm font-medium ${
                            transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.category.name.charAt(0)}
                        </span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {transaction.description || transaction.category.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(transaction.transactionDate).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-semibold ${
                                            transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Chưa có giao dịch nào</p>
                        )}
                    </div>
                </div>

                {/* Budget Overview Widget */}
                <BudgetOverviewWidget />

                {/* Quick actions */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <Link
                                to="/transactions/add"
                                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Thêm giao dịch mới</p>
                                    <p className="text-xs text-gray-500">Ghi lại thu chi của bạn</p>
                                </div>
                            </Link>

                            <Link
                                to="/budgets/add"
                                className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                            >
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Thêm ngân sách</p>
                                    <p className="text-xs text-gray-500">Thiết lập kế hoạch chi tiêu</p>
                                </div>
                            </Link>

                            <Link
                                to="/transactions"
                                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                            >
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Xem lịch sử giao dịch</p>
                                    <p className="text-xs text-gray-500">Quản lý và phân tích chi tiêu</p>
                                </div>
                            </Link>

                            <Link
                                to="/budgets"
                                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                            >
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Quản lý ngân sách</p>
                                    <p className="text-xs text-gray-500">Theo dõi và kiểm soát chi tiêu</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;