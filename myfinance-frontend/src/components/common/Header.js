import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null; // Don't show header on auth pages
    }

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-700' : '';
    };

    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/dashboard" className="text-xl font-bold">
                            MyFinance
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            to="/dashboard"
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/dashboard')}`}
                        >
                            Tổng quan
                        </Link>
                        <Link
                            to="/transactions"
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/transactions')}`}
                        >
                            Giao dịch
                        </Link>
                        <Link
                            to="/transactions/add"
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/transactions/add')}`}
                        >
                            Thêm giao dịch
                        </Link>
                        <Link
                            to="/categories"
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/categories')}`}
                        >
                            Danh mục
                        </Link>
                        <Link
                            to="/budgets"
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/budgets')}`}
                        >
                            Ngân sách
                        </Link>
                    </nav>

                    {/* User menu */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm">Xin chào, {user?.fullName || 'User'}</span>
                        <div className="relative group">
                            <button className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors">
                <span className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
                            </button>

                            {/* Dropdown menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Hồ sơ
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;