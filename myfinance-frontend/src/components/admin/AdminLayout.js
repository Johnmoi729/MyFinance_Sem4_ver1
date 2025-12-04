import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Settings, BarChart3, FileText } from '../icons';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navigation = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />
        },
        {
            name: 'User Management',
            href: '/admin/users',
            icon: <Users className="w-5 h-5" />
        },
        {
            name: 'System Config',
            href: '/admin/config',
            icon: <Settings className="w-5 h-5" />
        },
        {
            name: 'Financial Analytics',
            href: '/admin/analytics',
            icon: <BarChart3 className="w-5 h-5" />
        },
        {
            name: 'Audit Logs',
            href: '/admin/audit',
            icon: <FileText className="w-5 h-5" />
        }
    ];

    const isCurrentPath = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-gray-900">MyFinance Admin</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Welcome, {user?.fullName}</span>
                            <Link
                                to="/dashboard"
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                User View
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white shadow-sm min-h-screen">
                    <nav className="mt-8">
                        <div className="px-4 space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                                        isCurrentPath(item.href)
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <span className={`mr-3 ${isCurrentPath(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;