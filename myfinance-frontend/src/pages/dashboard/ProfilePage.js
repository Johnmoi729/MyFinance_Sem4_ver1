import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTransaction } from '../../context/TransactionContext';
import { useBudget } from '../../context/BudgetContext';
import { useCategory } from '../../context/CategoryContext';
import { userAPI } from '../../services/api';
import { getIconComponent } from '../../utils/iconMapper';
import { Receipt, Wallet, Tag, TrendingUp, TrendingDown, ClipboardList, Lock, Eye, EyeOff, User, Calendar, MapPin, Upload, Camera } from 'lucide-react';

const ProfilePage = () => {
 const { user, updateExtendedProfile } = useAuth();
 const { transactions, loadTransactions, getTotalIncome, getTotalExpenses } = useTransaction();
 const { budgets, fetchBudgets } = useBudget();
 const { categories, loadCategories } = useCategory();
 const [stats, setStats] = useState({
 totalTransactions: 0,
 totalBudgets: 0,
 totalCategories: 0,
 totalIncome: 0,
 totalExpense: 0,
 balance: 0,
 savingsRate: 0
 });
 const [recentActivity, setRecentActivity] = useState([]);
 const [categoryStats, setCategoryStats] = useState([]);
 const [dataLoading, setDataLoading] = useState(true);

 // Password change state
 const [showPasswordSection, setShowPasswordSection] = useState(false);
 const [passwordData, setPasswordData] = useState({
 currentPassword: '',
 newPassword: '',
 confirmNewPassword: ''
 });
 const [showPasswords, setShowPasswords] = useState({
 current: false,
 new: false,
 confirm: false
 });
 const [passwordLoading, setPasswordLoading] = useState(false);
 const [passwordSuccess, setPasswordSuccess] = useState('');
 const [passwordError, setPasswordError] = useState('');

 // Profile edit state
 const [showProfileSection, setShowProfileSection] = useState(false);
 const [profileData, setProfileData] = useState({
 fullName: '',
 phoneNumber: '',
 address: '',
 dateOfBirth: '',
 avatar: ''
 });
 const [profileLoading, setProfileLoading] = useState(false);
 const [profileSuccess, setProfileSuccess] = useState('');
 const [profileError, setProfileError] = useState('');
 const [avatarPreview, setAvatarPreview] = useState('');

 // Load all data on mount
 useEffect(() => {
 const loadAllData = async () => {
 setDataLoading(true);
 try {
 await Promise.all([
 loadTransactions(),
 fetchBudgets(),
 loadCategories()
 ]);
 } catch (error) {
 console.error('Error loading profile data:', error);
 } finally {
 setDataLoading(false);
 }
 };

 loadAllData();
 }, []); // Only run on mount

 // Calculate stats whenever data changes
 useEffect(() => {
 const income = transactions
 .filter(t => t.type === 'INCOME')
 .reduce((sum, t) => sum + t.amount, 0);
 const expense = transactions
 .filter(t => t.type === 'EXPENSE')
 .reduce((sum, t) => sum + t.amount, 0);
 const balance = income - expense;
 const savingsRate = income > 0 ? ((balance / income) * 100) : 0;

 setStats({
 totalTransactions: transactions.length,
 totalBudgets: budgets?.length || 0,
 totalCategories: categories?.length || 0,
 totalIncome: income,
 totalExpense: expense,
 balance: balance,
 savingsRate: savingsRate
 });

 // Get recent activity (last 5 transactions)
 const recent = [...transactions]
 .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
 .slice(0, 5);
 setRecentActivity(recent);

 // Calculate category statistics for top spending categories
 if (categories.length > 0 && transactions.length > 0) {
 const expenseCategories = categories.filter(c => c.type === 'EXPENSE');
 const categoryTotals = expenseCategories.map(category => {
 const categoryTotal = transactions
 .filter(t => t.category?.id === category.id && t.type === 'EXPENSE')
 .reduce((sum, t) => sum + t.amount, 0);
 return {
 ...category,
 total: categoryTotal,
 percentage: expense > 0 ? (categoryTotal / expense * 100) : 0
 };
 }).filter(c => c.total > 0)
 .sort((a, b) => b.total - a.total)
 .slice(0, 5); // Top 5 expense categories

 setCategoryStats(categoryTotals);
 }
 }, [transactions, budgets, categories]);

 // Populate profile data when user changes
 useEffect(() => {
 if (user) {
 setProfileData({
 fullName: user.fullName || '',
 phoneNumber: user.phoneNumber || '',
 address: user.address || '',
 dateOfBirth: user.dateOfBirth || '',
 avatar: user.avatar || ''
 });
 setAvatarPreview(user.avatar || '');
 }
 }, [user]);

 const formatCurrency = (amount) => {
 return new Intl.NumberFormat('vi-VN', {
 style: 'currency',
 currency: 'VND'
 }).format(amount);
 };

 const formatDate = (dateString) => {
 return new Date(dateString).toLocaleDateString('vi-VN');
 };

 const getInitials = (name) => {
 if (!name) return 'U';
 const parts = name.split(' ');
 if (parts.length >= 2) {
 return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
 }
 return name.charAt(0).toUpperCase();
 };

 const handlePasswordInputChange = (e) => {
 const { name, value } = e.target;
 setPasswordData(prev => ({
 ...prev,
 [name]: value
 }));
 setPasswordError('');
 setPasswordSuccess('');
 };

 const togglePasswordVisibility = (field) => {
 setShowPasswords(prev => ({
 ...prev,
 [field]: !prev[field]
 }));
 };

 const handlePasswordChange = async (e) => {
 e.preventDefault();
 setPasswordError('');
 setPasswordSuccess('');

 // Validation
 if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
 setPasswordError('Vui lòng điền đầy đủ thông tin');
 return;
 }

 if (passwordData.newPassword.length < 6) {
 setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
 return;
 }

 if (passwordData.newPassword !== passwordData.confirmNewPassword) {
 setPasswordError('Mật khẩu xác nhận không khớp');
 return;
 }

 setPasswordLoading(true);

 try {
 const response = await userAPI.changePassword(passwordData);

 if (response && response.success) {
 setPasswordSuccess('Đổi mật khẩu thành công! Email thông báo đã được gửi.');
 setPasswordData({
 currentPassword: '',
 newPassword: '',
 confirmNewPassword: ''
 });
 // Auto-hide password section after 3 seconds
 setTimeout(() => {
 setShowPasswordSection(false);
 setPasswordSuccess('');
 }, 3000);
 } else {
 setPasswordError(response?.message || 'Không thể đổi mật khẩu');
 }
 } catch (err) {
 setPasswordError(err.message || 'Đã xảy ra lỗi khi đổi mật khẩu');
 } finally {
 setPasswordLoading(false);
 }
 };

 const handleProfileInputChange = (e) => {
 const { name, value } = e.target;
 setProfileData(prev => ({
 ...prev,
 [name]: value
 }));
 setProfileError('');
 setProfileSuccess('');
 };

 const handleAvatarUpload = (e) => {
 const file = e.target.files[0];
 if (!file) return;

 // Validate file type
 if (!file.type.startsWith('image/')) {
 setProfileError('Vui lòng chọn file ảnh');
 return;
 }

 // Validate file size (max 2MB)
 if (file.size > 2 * 1024 * 1024) {
 setProfileError('Kích thước ảnh không được vượt quá 2MB');
 return;
 }

 // Convert to base64
 const reader = new FileReader();
 reader.onloadend = () => {
 const base64String = reader.result;
 setAvatarPreview(base64String);
 setProfileData(prev => ({
 ...prev,
 avatar: base64String
 }));
 setProfileError('');
 };
 reader.onerror = () => {
 setProfileError('Không thể đọc file ảnh');
 };
 reader.readAsDataURL(file);
 };

 const handleProfileSubmit = async (e) => {
 e.preventDefault();
 setProfileError('');
 setProfileSuccess('');

 // Validation
 if (!profileData.fullName || profileData.fullName.length < 2) {
 setProfileError('Họ tên phải có ít nhất 2 ký tự');
 return;
 }

 setProfileLoading(true);

 try {
 const response = await updateExtendedProfile(profileData);

 if (response && response.success) {
 setProfileSuccess('Cập nhật hồ sơ thành công!');
 // Auto-hide profile section after 3 seconds
 setTimeout(() => {
 setShowProfileSection(false);
 setProfileSuccess('');
 }, 3000);
 } else {
 setProfileError(response?.message || 'Không thể cập nhật hồ sơ');
 }
 } catch (err) {
 setProfileError(err.message || 'Đã xảy ra lỗi khi cập nhật hồ sơ');
 } finally {
 setProfileLoading(false);
 }
 };

 return (
 <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
 <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
 {/* Header with Avatar */}
 <div className="card p-8 mb-6">
 <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
 {/* Avatar */}
 <div className="relative group">
 {user?.avatar ? (
 <img
 src={user.avatar}
 alt="Avatar"
 className="w-32 h-32 rounded-full object-cover shadow-xl group-hover:shadow-2xl transition-all border-4 border-white"
 />
 ) : (
 <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all">
 <span className="text-white font-bold text-5xl">
 {getInitials(user?.fullName)}
 </span>
 </div>
 )}
 <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
 </div>

 {/* User Info */}
 <div className="flex-1 text-center md:text-left">
 <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-2">
 {user?.fullName || 'Người dùng'}
 </h1>
 <p className="text-gray-600 mb-1">{user?.email}</p>

 {/* Additional Info */}
 <div className="space-y-1 mb-4">
 {user?.phoneNumber && (
 <p className="text-sm text-gray-600 flex items-center gap-2 justify-center md:justify-start">
 <span className="font-medium">SĐT:</span> {user.phoneNumber}
 </p>
 )}
 {user?.address && (
 <p className="text-sm text-gray-600 flex items-center gap-2 justify-center md:justify-start">
 <MapPin className="w-4 h-4 inline" />
 {user.address}
 </p>
 )}
 {user?.dateOfBirth && (
 <p className="text-sm text-gray-600 flex items-center gap-2 justify-center md:justify-start">
 <Calendar className="w-4 h-4 inline" />
 Sinh nhật: {formatDate(user.dateOfBirth)}
 </p>
 )}
 </div>

 <div className="flex flex-wrap gap-2 justify-center md:justify-start">
 <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
 Thành viên
 </span>
 <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
 Hoạt động
 </span>
 </div>
 </div>

 {/* Quick Actions */}
 <div className="flex flex-col space-y-2">
 <Link
 to="/preferences"
 className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-sm font-medium text-center"
 >
 Cài đặt tùy chỉnh
 </Link>
 <Link
 to="/budgets/settings"
 className="px-4 py-2 border-2 border-violet-600 text-violet-600 rounded-xl hover:bg-violet-600 hover:text-white transition-all text-sm font-medium text-center"
 >
 Cài đặt ngân sách
 </Link>
 <Link
 to="/dashboard"
 className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium text-center"
 >
 Dashboard
 </Link>
 </div>
 </div>
 </div>

 {/* Edit Profile Section */}
 <div className="card p-6 mb-6">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
 <User className="w-5 h-5 text-violet-600" />
 </div>
 <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h2>
 </div>
 <button
 onClick={() => {
 setShowProfileSection(!showProfileSection);
 setProfileError('');
 setProfileSuccess('');
 }}
 className="px-4 py-2 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
 >
 {showProfileSection ? 'Ẩn' : 'Hiện'}
 </button>
 </div>

 {showProfileSection && (
 <form onSubmit={handleProfileSubmit} className="space-y-4">
 {/* Success Message */}
 {profileSuccess && (
 <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
 {profileSuccess}
 </div>
 )}

 {/* Error Message */}
 {profileError && (
 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
 {profileError}
 </div>
 )}

 {/* Avatar Upload */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Ảnh đại diện
 </label>
 <div className="flex items-center gap-4">
 {avatarPreview ? (
 <img
 src={avatarPreview}
 alt="Preview"
 className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
 />
 ) : (
 <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center">
 <span className="text-white font-bold text-2xl">
 {getInitials(profileData.fullName)}
 </span>
 </div>
 )}
 <div className="flex-1">
 <input
 type="file"
 id="avatar-upload"
 accept="image/*"
 onChange={handleAvatarUpload}
 className="hidden"
 />
 <label
 htmlFor="avatar-upload"
 className="inline-flex items-center gap-2 px-4 py-2 border-2 border-violet-600 text-violet-600 rounded-xl hover:bg-violet-600 hover:text-white transition-all cursor-pointer font-medium"
 >
 <Camera className="w-4 h-4" />
 Chọn ảnh
 </label>
 <p className="text-xs text-gray-500 mt-2">
 Định dạng: JPG, PNG. Tối đa 2MB
 </p>
 </div>
 </div>
 </div>

 {/* Full Name */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Họ và tên *
 </label>
 <input
 type="text"
 name="fullName"
 value={profileData.fullName}
 onChange={handleProfileInputChange}
 required
 minLength={2}
 className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
 placeholder="Nhập họ và tên"
 />
 </div>

 {/* Phone Number */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Số điện thoại
 </label>
 <input
 type="tel"
 name="phoneNumber"
 value={profileData.phoneNumber}
 onChange={handleProfileInputChange}
 className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
 placeholder="Nhập số điện thoại"
 />
 </div>

 {/* Address */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Địa chỉ
 </label>
 <input
 type="text"
 name="address"
 value={profileData.address}
 onChange={handleProfileInputChange}
 className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
 placeholder="Nhập địa chỉ"
 />
 </div>

 {/* Date of Birth */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Ngày sinh
 </label>
 <input
 type="date"
 name="dateOfBirth"
 value={profileData.dateOfBirth}
 onChange={handleProfileInputChange}
 className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
 />
 </div>

 {/* Submit Buttons */}
 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 type="button"
 onClick={() => {
 setShowProfileSection(false);
 setProfileData({
 fullName: user?.fullName || '',
 phoneNumber: user?.phoneNumber || '',
 address: user?.address || '',
 dateOfBirth: user?.dateOfBirth || '',
 avatar: user?.avatar || ''
 });
 setAvatarPreview(user?.avatar || '');
 setProfileError('');
 setProfileSuccess('');
 }}
 className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
 >
 Hủy
 </button>
 <button
 type="submit"
 disabled={profileLoading}
 className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
 >
 {profileLoading ? 'Đang xử lý...' : 'Cập nhật hồ sơ'}
 </button>
 </div>

 {/* Info Note */}
 <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
 <p className="text-sm text-blue-800">
 <strong>Lưu ý:</strong> Thông tin cá nhân của bạn sẽ được lưu trữ an toàn và chỉ hiển thị trong trang cá nhân của bạn.
 </p>
 </div>
 </form>
 )}
 </div>

 {/* Password Change Section */}
 <div className="card p-6 mb-6">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
 <Lock className="w-5 h-5 text-indigo-600" />
 </div>
 <h2 className="text-xl font-bold text-gray-900">Đổi mật khẩu</h2>
 </div>
 <button
 onClick={() => {
 setShowPasswordSection(!showPasswordSection);
 setPasswordError('');
 setPasswordSuccess('');
 setPasswordData({
 currentPassword: '',
 newPassword: '',
 confirmNewPassword: ''
 });
 }}
 className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
 >
 {showPasswordSection ? 'Ẩn' : 'Hiện'}
 </button>
 </div>

 {showPasswordSection && (
 <form onSubmit={handlePasswordChange} className="space-y-4">
 {/* Success Message */}
 {passwordSuccess && (
 <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
 {passwordSuccess}
 </div>
 )}

 {/* Error Message */}
 {passwordError && (
 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
 {passwordError}
 </div>
 )}

 {/* Current Password */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Mật khẩu hiện tại *
 </label>
 <div className="relative">
 <input
 type={showPasswords.current ? 'text' : 'password'}
 name="currentPassword"
 value={passwordData.currentPassword}
 onChange={handlePasswordInputChange}
 required
 className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
 placeholder="Nhập mật khẩu hiện tại"
 />
 <button
 type="button"
 onClick={() => togglePasswordVisibility('current')}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
 >
 {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
 </button>
 </div>
 </div>

 {/* New Password */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Mật khẩu mới * (tối thiểu 6 ký tự)
 </label>
 <div className="relative">
 <input
 type={showPasswords.new ? 'text' : 'password'}
 name="newPassword"
 value={passwordData.newPassword}
 onChange={handlePasswordInputChange}
 required
 minLength={6}
 className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
 placeholder="Nhập mật khẩu mới"
 />
 <button
 type="button"
 onClick={() => togglePasswordVisibility('new')}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
 >
 {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
 </button>
 </div>
 </div>

 {/* Confirm New Password */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Xác nhận mật khẩu mới *
 </label>
 <div className="relative">
 <input
 type={showPasswords.confirm ? 'text' : 'password'}
 name="confirmNewPassword"
 value={passwordData.confirmNewPassword}
 onChange={handlePasswordInputChange}
 required
 className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
 placeholder="Nhập lại mật khẩu mới"
 />
 <button
 type="button"
 onClick={() => togglePasswordVisibility('confirm')}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
 >
 {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
 </button>
 </div>
 </div>

 {/* Submit Button */}
 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 type="button"
 onClick={() => {
 setShowPasswordSection(false);
 setPasswordData({
 currentPassword: '',
 newPassword: '',
 confirmNewPassword: ''
 });
 setPasswordError('');
 setPasswordSuccess('');
 }}
 className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
 >
 Hủy
 </button>
 <button
 type="submit"
 disabled={passwordLoading}
 className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
 >
 {passwordLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
 </button>
 </div>

 {/* Security Note */}
 <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
 <p className="text-sm text-blue-800">
 <strong>Lưu ý:</strong> Sau khi đổi mật khẩu thành công, hệ thống sẽ gửi email thông báo đến địa chỉ email của bạn.
 </p>
 </div>
 </form>
 )}
 </div>

 {/* Financial Overview Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
 {/* Balance Card */}
 <div className="card p-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
 <h3 className="text-sm font-medium opacity-90 mb-2">Số dư hiện tại</h3>
 <p className="text-3xl font-bold mb-4">{formatCurrency(stats.balance)}</p>
 <div className="grid grid-cols-2 gap-4">
 <div className="bg-white bg-opacity-20 rounded-lg p-3">
 <p className="text-xs opacity-90 mb-1">Thu nhập</p>
 <p className="text-lg font-semibold">{formatCurrency(stats.totalIncome)}</p>
 </div>
 <div className="bg-white bg-opacity-20 rounded-lg p-3">
 <p className="text-xs opacity-90 mb-1">Chi tiêu</p>
 <p className="text-lg font-semibold">{formatCurrency(stats.totalExpense)}</p>
 </div>
 </div>
 </div>

 {/* Savings Rate Card */}
 <div className="card p-6">
 <h3 className="text-sm font-medium text-gray-600 mb-2">Tỷ lệ tiết kiệm</h3>
 <p className="text-3xl font-bold text-indigo-600 mb-4">{stats.savingsRate.toFixed(1)}%</p>
 <div className="space-y-2">
 <div className="flex items-center justify-between text-sm">
 <span className="text-gray-600">Giao dịch</span>
 <span className="font-semibold text-gray-900">{stats.totalTransactions}</span>
 </div>
 <div className="flex items-center justify-between text-sm">
 <span className="text-gray-600">Ngân sách</span>
 <span className="font-semibold text-gray-900">{stats.totalBudgets}</span>
 </div>
 <div className="flex items-center justify-between text-sm">
 <span className="text-gray-600">Danh mục</span>
 <span className="font-semibold text-gray-900">{stats.totalCategories}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Top Spending Categories */}
 {categoryStats.length > 0 && (
 <div className="card p-6 mb-6">
 <h2 className="text-xl font-bold text-gray-900 mb-4">Top 5 danh mục chi tiêu</h2>
 <div className="space-y-4">
 {categoryStats.map((category, index) => (
 <div key={category.id}>
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-2">
 {getIconComponent(category.icon, 'w-6 h-6 text-gray-600')}
 <span className="font-medium text-gray-900">{category.name}</span>
 </div>
 <div className="text-right">
 <p className="font-bold text-red-600">{formatCurrency(category.total)}</p>
 <p className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</p>
 </div>
 </div>
 <div className="w-full bg-gray-200 rounded-full h-2">
 <div
 className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500"
 style={{ width: `${Math.min(category.percentage, 100)}%` }}
 ></div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Stats Cards - Horizontal Scroll on Mobile */}
 <div className="mb-6">
 <h2 className="text-xl font-bold text-gray-900 mb-4">Thống kê chi tiết</h2>
 <div className="overflow-x-auto pb-4">
 <div className="flex space-x-4 min-w-max md:min-w-0 md:grid md:grid-cols-5 md:gap-4">
 {/* Total Transactions */}
 <div className="card p-6 min-w-[200px] md:min-w-0 hover:shadow-lg transition-all">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-gray-600 mb-1">Giao dịch</p>
 <p className="text-2xl font-bold text-indigo-600">{stats.totalTransactions}</p>
 </div>
 <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
 <ClipboardList className="w-6 h-6 text-indigo-600" />
 </div>
 </div>
 </div>

 {/* Total Budgets */}
 <div className="card p-6 min-w-[200px] md:min-w-0 hover:shadow-lg transition-all">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-gray-600 mb-1">Ngân sách</p>
 <p className="text-2xl font-bold text-violet-600">{stats.totalBudgets}</p>
 </div>
 <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
 <Wallet className="w-6 h-6 text-violet-600" />
 </div>
 </div>
 </div>

 {/* Total Categories */}
 <div className="card p-6 min-w-[200px] md:min-w-0 hover:shadow-lg transition-all">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-gray-600 mb-1">Danh mục</p>
 <p className="text-2xl font-bold text-blue-600">{stats.totalCategories}</p>
 </div>
 <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
 <Tag className="w-6 h-6 text-blue-600" />
 </div>
 </div>
 </div>

 {/* Total Income */}
 <div className="card p-6 min-w-[200px] md:min-w-0 hover:shadow-lg transition-all">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-gray-600 mb-1">Thu nhập</p>
 <p className="text-xl font-bold text-green-600">{formatCurrency(stats.totalIncome)}</p>
 </div>
 <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
 <TrendingUp className="w-6 h-6 text-green-600" />
 </div>
 </div>
 </div>

 {/* Total Expense */}
 <div className="card p-6 min-w-[200px] md:min-w-0 hover:shadow-lg transition-all">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-gray-600 mb-1">Chi tiêu</p>
 <p className="text-xl font-bold text-red-600">{formatCurrency(stats.totalExpense)}</p>
 </div>
 <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
 <TrendingDown className="w-6 h-6 text-red-600" />
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Recent Activity */}
 <div className="card p-6">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h2>
 <Link
 to="/transactions"
 className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
 >
 Xem tất cả →
 </Link>
 </div>

 {recentActivity.length > 0 ? (
 <div className="space-y-4">
 {recentActivity.map((transaction) => (
 <div
 key={transaction.id}
 className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all"
 >
 <div className="flex items-center space-x-4">
 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
 transaction.type === 'INCOME'
 ? 'bg-green-100 text-green-600'
 : 'bg-red-100 text-red-600'
 }`}>
 {transaction.type === 'INCOME' ? (
 <TrendingUp className="w-6 h-6" />
 ) : (
 <TrendingDown className="w-6 h-6" />
 )}
 </div>
 <div>
 <p className="font-medium text-gray-900">{transaction.description}</p>
 <p className="text-sm text-gray-500">{formatDate(transaction.transactionDate)}</p>
 </div>
 </div>
 <div className="text-right">
 <p className={`font-bold ${
 transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
 }`}>
 {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
 </p>
 <p className="text-sm text-gray-500">{transaction.category?.name}</p>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="text-center py-12 text-gray-500">
 <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
 <p>Chưa có hoạt động nào</p>
 </div>
 )}
 </div>
 </div>
 </div>
 );
};

export default ProfilePage;