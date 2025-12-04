import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';
import { Users, DollarSign, BarChart3, Zap, TrendingUp, Activity, Plus, CheckCircle, AlertTriangle, Database, UserCheck, PieChart } from '../../components/icons';

const AdminDashboard = () => {
    const { formatCurrency } = useCurrencyFormatter();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await adminAPI.getDashboard();

            if (response && response.success) {
                console.log('Admin Dashboard Data:', response.data); // Debug log
                setDashboardData(response.data);
            } else {
                setError(response?.message || 'Failed to load dashboard data');
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError('Error loading dashboard data');
        } finally {
            setLoading(false);
        }
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

    if (error) {
        return (
            <AdminLayout>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong className="font-bold">Error: </strong>
                    <span>{error}</span>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">System overview and key metrics</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Users className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData?.userStats?.totalUsers || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <UserCheck className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Users</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData?.userStats?.activeUsers || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData?.transactionStats?.totalTransactions || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Zap className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">System Health</p>
                                <p className={`text-2xl font-bold ${
                                    dashboardData?.systemHealth?.status === 'HEALTHY' ? 'text-green-600' :
                                    dashboardData?.systemHealth?.status === 'WARNING' ? 'text-yellow-600' :
                                    dashboardData?.systemHealth?.status === 'ERROR' ? 'text-red-600' :
                                    dashboardData?.systemHealth?.status === 'MAINTENANCE' ? 'text-indigo-600' :
                                    'text-gray-600'
                                }`}>
                                    {dashboardData?.systemHealth?.status || 'Unknown'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">New Users Today</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData?.userStats?.newUsersToday || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-pink-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-pink-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData?.transactionStats?.totalVolume ?
                                        formatCurrency(dashboardData.transactionStats.totalVolume) : '₫0'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Activity className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Transactions Today</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData?.transactionStats?.transactionsToday || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-teal-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-teal-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                                <p className={`text-2xl font-bold ${
                                    (dashboardData?.userStats?.growthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {dashboardData?.userStats?.growthPercentage?.toFixed(1) || '0.0'}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent User Activity</h3>
                        <div className="space-y-3">
                            {dashboardData?.recentActivities?.slice(0, 5).map((activity, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{activity.action || 'Activity'}</p>
                                        <p className="text-xs text-gray-500">
                                            {activity.userEmail || 'System'} • {activity.entityType || ''}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Recent'}
                                        </p>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                        {activity.action?.includes('CREATE') ? 'Created' :
                                         activity.action?.includes('UPDATE') ? 'Updated' :
                                         activity.action?.includes('DELETE') ? 'Deleted' : 'Action'}
                                    </span>
                                </div>
                            )) || (
                                <p className="text-gray-500 text-sm">No recent activity</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center">
                                    <Plus className="w-5 h-5 text-indigo-600 mr-3" />
                                    <span className="font-medium">Create Admin User</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Add new administrator to the system</p>
                            </button>

                            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                    <span className="font-medium">System Health Check</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Run comprehensive system diagnostics</p>
                            </button>

                            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center">
                                    <Database className="w-5 h-5 text-yellow-600 mr-3" />
                                    <span className="font-medium">Export Audit Logs</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Download system audit trail</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;