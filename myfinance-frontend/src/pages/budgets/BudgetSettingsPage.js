import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { budgetSettingsAPI } from '../../services/api';
import { X } from '../../components/icons';

const BudgetSettingsPage = () => {
 const navigate = useNavigate();
 const [settings, setSettings] = useState({
 warningThreshold: 75,
 criticalThreshold: 90
 });
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [message, setMessage] = useState({ text: '', type: '' });

 useEffect(() => {
 loadBudgetSettings();
 }, []);

 const loadBudgetSettings = async () => {
 try {
 setLoading(true);
 const response = await budgetSettingsAPI.getBudgetSettings();
 if (response && response.success) {
 setSettings(response.data);
 }
 } catch (error) {
 console.error('Error loading budget settings:', error);
 setMessage({ text: 'Lỗi khi tải cài đặt ngân sách', type: 'error' });
 } finally {
 setLoading(false);
 }
 };

 const handleInputChange = (field, value) => {
 setSettings(prev => ({
 ...prev,
 [field]: value
 }));
 };

 const handleSave = async (e) => {
 e.preventDefault();

 // Validation
 if (settings.criticalThreshold <= settings.warningThreshold) {
 setMessage({
 text: 'Ngưỡng nghiêm trọng phải lớn hơn ngưỡng cảnh báo',
 type: 'error'
 });
 return;
 }

 try {
 setSaving(true);
 const response = await budgetSettingsAPI.updateBudgetSettings(settings);
 if (response && response.success) {
 setMessage({
 text: 'Đã lưu cài đặt ngân sách thành công!',
 type: 'success'
 });
 setTimeout(() => {
 navigate('/budgets');
 }, 2000);
 }
 } catch (error) {
 console.error('Error saving budget settings:', error);
 setMessage({
 text: error.message || 'Lỗi khi lưu cài đặt ngân sách',
 type: 'error'
 });
 } finally {
 setSaving(false);
 }
 };

 const handleReset = async () => {
 if (window.confirm('Bạn có chắc chắn muốn đặt lại tất cả cài đặt về mặc định?')) {
 try {
 setSaving(true);
 const response = await budgetSettingsAPI.resetBudgetSettings();
 if (response && response.success) {
 setMessage({
 text: 'Đã đặt lại cài đặt về mặc định thành công!',
 type: 'success'
 });
 await loadBudgetSettings();
 }
 } catch (error) {
 console.error('Error resetting budget settings:', error);
 setMessage({
 text: 'Lỗi khi đặt lại cài đặt',
 type: 'error'
 });
 } finally {
 setSaving(false);
 }
 }
 };

 if (loading) {
 return (
 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
 <div className="text-center">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
 <p className="text-gray-600">Đang tải cài đặt...</p>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-gray-50">
 <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
 {/* Header */}
 <div className="bg-white rounded-lg shadow p-6 mb-6">
 <div className="flex items-center justify-between mb-4">
 <h1 className="text-3xl font-bold text-gray-900">Cài đặt ngân sách</h1>
 <button
 onClick={() => navigate('/budgets')}
 className="text-gray-500 hover:text-gray-700"
 >
 <X className="w-6 h-6" />
 </button>
 </div>
 <p className="text-gray-600">
 Tùy chỉnh cách thức cảnh báo ngân sách của bạn
 </p>
 </div>

 {/* Message */}
 {message.text && (
 <div className={`mb-6 p-4 rounded-md ${
 message.type === 'success'
 ? 'bg-green-100 text-green-700 border border-green-300'
 : 'bg-red-100 text-red-700 border border-red-300'
 }`}>
 {message.text}
 </div>
 )}

 {/* Settings Form */}
 <form onSubmit={handleSave} className="bg-white rounded-lg shadow">
 <div className="p-6">
 <h2 className="text-xl font-semibold text-gray-900 mb-6">Ngưỡng cảnh báo</h2>

 {/* Warning Threshold */}
 <div className="mb-6">
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Ngưỡng cảnh báo (%)
 </label>
 <input
 type="number"
 min="50"
 max="95"
 value={settings.warningThreshold}
 onChange={(e) => handleInputChange('warningThreshold', parseFloat(e.target.value))}
 className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
 />
 <p className="text-sm text-gray-500 mt-1">
 Hiển thị cảnh báo màu vàng khi sử dụng {settings.warningThreshold}% ngân sách
 </p>
 </div>

 {/* Critical Threshold */}
 <div className="mb-6">
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Ngưỡng nghiêm trọng (%)
 </label>
 <input
 type="number"
 min="70"
 max="100"
 value={settings.criticalThreshold}
 onChange={(e) => handleInputChange('criticalThreshold', parseFloat(e.target.value))}
 className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
 />
 <p className="text-sm text-gray-500 mt-1">
 Hiển thị cảnh báo màu đỏ khi sử dụng {settings.criticalThreshold}% ngân sách
 </p>
 </div>

 <hr className="my-6" />

 {/* Info message directing users to Preferences page */}
 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
 <div className="flex items-start">
 <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
 </svg>
 <div>
 <h3 className="text-sm font-semibold text-blue-900 mb-1">
 Quản lý thông báo email
 </h3>
 <p className="text-sm text-blue-800">
 Để bật/tắt các thông báo email (cảnh báo ngân sách, tóm tắt tháng, tóm tắt tuần, v.v.),
 vui lòng truy cập{' '}
 <button
 type="button"
 onClick={() => navigate('/preferences')}
 className="font-semibold underline hover:text-blue-600 transition-colors"
 >
 Tùy chỉnh → Cài đặt cá nhân
 </button>
 .
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Actions */}
 <div className="bg-gray-50 px-6 py-3 flex justify-between items-center rounded-b-lg">
 <button
 type="button"
 onClick={handleReset}
 disabled={saving}
 className="text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
 >
 Đặt lại mặc định
 </button>

 <div className="flex space-x-3">
 <button
 type="button"
 onClick={() => navigate('/budgets')}
 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
 >
 Hủy
 </button>
 <button
 type="submit"
 disabled={saving}
 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
 >
 {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
 </button>
 </div>
 </div>
 </form>
 </div>
 </div>
 );
};

export default BudgetSettingsPage;