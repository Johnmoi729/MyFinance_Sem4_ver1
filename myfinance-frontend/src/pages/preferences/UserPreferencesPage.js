import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { preferencesAPI } from '../../services/api';
import { X, Sun, Moon, Eye, Bell } from '../../components/icons';

const UserPreferencesPage = () => {
    const navigate = useNavigate();
    const [preferences, setPreferences] = useState({
        theme: 'light',
        viewMode: 'detailed',
        emailNotifications: true,
        budgetAlerts: true,
        weeklySummary: false,
        monthlySummary: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            setLoading(true);
            const response = await preferencesAPI.getPreferences();
            if (response && response.success) {
                setPreferences(response.data);
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
            setMessage({ text: 'Lỗi khi tải cài đặt', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setPreferences(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            const response = await preferencesAPI.updatePreferences(preferences);
            if (response && response.success) {
                setMessage({
                    text: 'Đã lưu cài đặt thành công!',
                    type: 'success'
                });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setMessage({
                    text: response.message || 'Lỗi khi lưu cài đặt',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            setMessage({
                text: error.message || 'Lỗi khi lưu cài đặt',
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
                const response = await preferencesAPI.resetToDefaults();
                if (response && response.success) {
                    setMessage({
                        text: 'Đã đặt lại cài đặt về mặc định thành công!',
                        type: 'success'
                    });
                    await loadPreferences();
                }
            } catch (error) {
                console.error('Error resetting preferences:', error);
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
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Cài đặt tùy chỉnh</h1>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-gray-600">
                        Tùy chỉnh giao diện và thông báo của bạn
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
                        {/* Display Preferences Section */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Eye className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Tùy chỉnh hiển thị</h2>
                        </div>

                        {/* Theme */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {preferences.theme === 'light' ? <Sun className="w-4 h-4 inline mr-1" /> : <Moon className="w-4 h-4 inline mr-1" />}
                                Giao diện
                            </label>
                            <select
                                value={preferences.theme}
                                onChange={(e) => handleInputChange('theme', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="light">Sáng</option>
                                <option value="dark">Tối (sắp ra mắt)</option>
                            </select>
                        </div>

                        {/* View Mode */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chế độ hiển thị
                            </label>
                            <select
                                value={preferences.viewMode}
                                onChange={(e) => handleInputChange('viewMode', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="detailed">Chi tiết</option>
                                <option value="compact">Gọn gàng</option>
                            </select>
                        </div>

                        <hr className="my-8" />

                        {/* Notification Preferences Section */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Bell className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Thông báo</h2>
                        </div>

                        {/* Email Notifications */}
                        <div className="mb-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={preferences.emailNotifications}
                                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    Bật thông báo email
                                </span>
                            </label>
                            <p className="text-sm text-gray-500 mt-1 ml-7">
                                Nhận email thông báo về các hoạt động quan trọng
                            </p>
                        </div>

                        {/* Budget Alerts */}
                        <div className="mb-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={preferences.budgetAlerts}
                                    onChange={(e) => handleInputChange('budgetAlerts', e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    Cảnh báo ngân sách
                                </span>
                            </label>
                            <p className="text-sm text-gray-500 mt-1 ml-7">
                                Nhận thông báo khi vượt ngưỡng ngân sách
                            </p>
                        </div>

                        {/* Transaction Reminders - Coming Soon */}
                        <div className="mb-6 opacity-50">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={false}
                                    disabled
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    Nhắc nhở ghi giao dịch <span className="text-xs text-gray-400">(sắp ra mắt)</span>
                                </span>
                            </label>
                            <p className="text-sm text-gray-500 mt-1 ml-7">
                                Nhắc nhở hàng ngày về việc ghi lại giao dịch
                            </p>
                        </div>

                        {/* Weekly Summary */}
                        <div className="mb-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={preferences.weeklySummary}
                                    onChange={(e) => handleInputChange('weeklySummary', e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    Tóm tắt hàng tuần
                                </span>
                            </label>
                            <p className="text-sm text-gray-500 mt-1 ml-7">
                                Nhận báo cáo tài chính tóm tắt hàng tuần
                            </p>
                        </div>

                        {/* Monthly Summary */}
                        <div className="mb-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={preferences.monthlySummary}
                                    onChange={(e) => handleInputChange('monthlySummary', e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    Tóm tắt hàng tháng
                                </span>
                            </label>
                            <p className="text-sm text-gray-500 mt-1 ml-7">
                                Nhận báo cáo tài chính tóm tắt hàng tháng
                            </p>
                        </div>

                        {/* Goal Reminders - Coming Soon */}
                        <div className="mb-6 opacity-50">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={false}
                                    disabled
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    Nhắc nhở mục tiêu <span className="text-xs text-gray-400">(sắp ra mắt)</span>
                                </span>
                            </label>
                            <p className="text-sm text-gray-500 mt-1 ml-7">
                                Nhận nhắc nhở về tiến độ mục tiêu tài chính
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center rounded-b-lg">
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
                                onClick={() => navigate('/dashboard')}
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

export default UserPreferencesPage;
