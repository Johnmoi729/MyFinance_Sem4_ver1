import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';
import {
 Search,
 X,
 Plus,
 User,
 Receipt,
 Wallet,
 Tag,
 BarChart3,
 FileText,
 Calendar,
 Clock,
 Settings,
 Shield,
 LogOut,
 ChevronDown,
 Menu
} from '../icons';

const Header = () => {
 const { user, isAuthenticated, isAdmin, logout } = useAuth();
 const navigate = useNavigate();
 const location = useLocation();
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [showSearch, setShowSearch] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');


 const handleLogout = () => {
 logout();
 navigate('/login');
 };

 const handleSearch = (e) => {
 e.preventDefault();
 if (searchQuery.trim()) {
 navigate(`/transactions?search=${encodeURIComponent(searchQuery)}`);
 setSearchQuery('');
 setShowSearch(false);
 }
 };

 if (!isAuthenticated) {
 return null;
 }

 const isActive = (path) => {
 return location.pathname === path;
 };

 return (
 <header className="bg-white shadow-sm sticky top-0 z-50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex justify-between items-center h-16">
 {/* Logo */}
 <div className="flex-shrink-0">
 <Logo size="normal" showText={true} linkEnabled={true} />
 </div>

 {/* Desktop Navigation */}
 <nav className="hidden md:flex items-center space-x-1">
 <Link
 to="/dashboard"
 className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
 isActive('/dashboard')
 ? 'bg-indigo-100 text-indigo-700'
 : 'text-gray-700 hover:bg-gray-100'
 }`}
 >
 Tổng quan
 </Link>
 <Link
 to="/transactions"
 className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
 isActive('/transactions')
 ? 'bg-indigo-100 text-indigo-700'
 : 'text-gray-700 hover:bg-gray-100'
 }`}
 >
 Giao dịch
 </Link>
 <Link
 to="/budgets"
 className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
 isActive('/budgets')
 ? 'bg-indigo-100 text-indigo-700'
 : 'text-gray-700 hover:bg-gray-100'
 }`}
 >
 Ngân sách
 </Link>
 <Link
 to="/analytics"
 className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
 isActive('/analytics')
 ? 'bg-indigo-100 text-indigo-700'
 : 'text-gray-700 hover:bg-gray-100'
 }`}
 >
 Phân tích
 </Link>

 {/* Reports Dropdown */}
 <div className="relative group">
 <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
 Báo cáo
 <ChevronDown className="w-4 h-4 ml-1" />
 </button>
 <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-large py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
 <Link
 to="/reports/monthly"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
 >
 Báo cáo tháng
 </Link>
 <Link
 to="/reports/yearly"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
 >
 Báo cáo năm
 </Link>
 <Link
 to="/reports/category"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
 >
 Báo cáo danh mục
 </Link>
 </div>
 </div>
 </nav>

 {/* Right side actions */}
 <div className="flex items-center space-x-2 md:space-x-3">
 {/* Search button/bar */}
 <div className="relative">
 {showSearch ? (
 <form onSubmit={handleSearch} className="flex items-center">
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Tìm giao dịch..."
 className="w-48 md:w-64 px-4 py-2 pr-10 text-sm border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
 autoFocus
 />
 <button
 type="button"
 onClick={() => { setShowSearch(false); setSearchQuery(''); }}
 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
 >
 <X className="w-4 h-4" />
 </button>
 </form>
 ) : (
 <button
 onClick={() => setShowSearch(true)}
 className="p-2 text-gray-600 hover:bg-indigo-50 rounded-xl transition-all hover:text-indigo-600"
 title="Tìm kiếm"
 >
 <Search className="w-5 h-5" />
 </button>
 )}
 </div>

 {/* Quick Add Transaction button */}
 <Link
 to="/transactions/add"
 className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-medium"
 title="Thêm giao dịch"
 >
 <Plus className="w-4 h-4" />
 <span>Thêm</span>
 </Link>

 {/* User menu */}
 <div className="relative group">
 <button className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all">
 <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center shadow-sm">
 <span className="text-white font-semibold text-sm">
 {user?.fullName?.charAt(0).toUpperCase() || 'U'}
 </span>
 </div>
 <div className="hidden md:block text-left">
 <p className="text-sm font-medium text-gray-900">{user?.fullName || 'User'}</p>
 <p className="text-xs text-gray-500">{user?.email}</p>
 </div>
 </button>

 {/* Dropdown menu */}
 <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-large py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
 <Link
 to="/profile"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
 >
 <div className="flex items-center">
 <User className="w-4 h-4 mr-3" />
 Hồ sơ cá nhân
 </div>
 </Link>
 <Link
 to="/transactions"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
 >
 <div className="flex items-center">
 <Receipt className="w-4 h-4 mr-3" />
 Giao dịch
 </div>
 </Link>
 <Link
 to="/budgets"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
 >
 <div className="flex items-center">
 <Wallet className="w-4 h-4 mr-3" />
 Ngân sách
 </div>
 </Link>
 <Link
 to="/categories"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
 >
 <div className="flex items-center">
 <Tag className="w-4 h-4 mr-3" />
 Quản lý danh mục
 </div>
 </Link>
 <Link
 to="/analytics"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
 >
 <div className="flex items-center">
 <BarChart3 className="w-4 h-4 mr-3" />
 Phân tích tài chính
 </div>
 </Link>
 <div className="border-t border-gray-100 my-2"></div>
 <Link
 to="/reports/monthly"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
 >
 <div className="flex items-center">
 <FileText className="w-4 h-4 mr-3" />
 Báo cáo tháng
 </div>
 </Link>
 <Link
 to="/reports/yearly"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
 >
 <div className="flex items-center">
 <Calendar className="w-4 h-4 mr-3" />
 Báo cáo năm
 </div>
 </Link>
 <Link
 to="/reports/scheduled"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
 >
 <div className="flex items-center">
 <Clock className="w-4 h-4 mr-3" />
 Báo cáo định kỳ
 </div>
 </Link>
 <div className="border-t border-gray-100 my-2"></div>
 <Link
 to="/budgets/settings"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
 >
 <div className="flex items-center">
 <Settings className="w-4 h-4 mr-3" />
 Cài đặt ngân sách
 </div>
 </Link>
 <Link
 to="/preferences"
 className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
 >
 <div className="flex items-center">
 <Settings className="w-4 h-4 mr-3" />
 Cài đặt tùy chỉnh
 </div>
 </Link>
 {isAdmin() && (
 <>
 <div className="border-t border-gray-100 my-2"></div>
 <Link
 to="/admin/dashboard"
 className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
 >
 <div className="flex items-center">
 <Shield className="w-4 h-4 mr-3" />
 Bảng quản trị
 </div>
 </Link>
 </>
 )}
 <div className="border-t border-gray-100 my-2"></div>
 <button
 onClick={handleLogout}
 className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
 >
 <div className="flex items-center">
 <LogOut className="w-4 h-4 mr-3" />
 Đăng xuất
 </div>
 </button>
 </div>
 </div>

 {/* Mobile menu button */}
 <button
 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
 className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-50"
 >
 {mobileMenuOpen ? (
 <X className="w-6 h-6" />
 ) : (
 <Menu className="w-6 h-6" />
 )}
 </button>
 </div>
 </div>

 {/* Mobile menu */}
 {mobileMenuOpen && (
 <div className="md:hidden py-4 border-t border-gray-100">
 <nav className="flex flex-col space-y-2">
 <Link
 to="/dashboard"
 className={`px-4 py-2 rounded-lg text-sm font-medium ${
 isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
 }`}
 onClick={() => setMobileMenuOpen(false)}
 >
 Tổng quan
 </Link>
 <Link
 to="/transactions"
 className={`px-4 py-2 rounded-lg text-sm font-medium ${
 isActive('/transactions') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
 }`}
 onClick={() => setMobileMenuOpen(false)}
 >
 Giao dịch
 </Link>
 <Link
 to="/budgets"
 className={`px-4 py-2 rounded-lg text-sm font-medium ${
 isActive('/budgets') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
 }`}
 onClick={() => setMobileMenuOpen(false)}
 >
 Ngân sách
 </Link>
 <Link
 to="/analytics"
 className={`px-4 py-2 rounded-lg text-sm font-medium ${
 isActive('/analytics') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
 }`}
 onClick={() => setMobileMenuOpen(false)}
 >
 Phân tích
 </Link>
 <Link
 to="/reports/monthly"
 className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700"
 onClick={() => setMobileMenuOpen(false)}
 >
 Báo cáo tháng
 </Link>
 <Link
 to="/reports/yearly"
 className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700"
 onClick={() => setMobileMenuOpen(false)}
 >
 Báo cáo năm
 </Link>
 </nav>
 </div>
 )}
 </div>
 </header>
 );
};

export default Header;