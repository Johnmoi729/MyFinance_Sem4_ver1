import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduledReportAPI } from '../../services/api';

const ScheduledReports = () => {
    const navigate = useNavigate();
    const [scheduledReports, setScheduledReports] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        reportType: 'MONTHLY',
        frequency: 'MONTHLY',
        format: 'PDF',
        emailDelivery: true,
        isActive: true
    });

    // Load schedules on component mount
    useEffect(() => {
        fetchSchedules();
    }, []);

    // Fetch all scheduled reports
    const fetchSchedules = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await scheduledReportAPI.getSchedules();
            if (response && response.success) {
                setScheduledReports(response.data || []);
            } else {
                setError(response.message || 'Không thể tải danh sách lịch báo cáo');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddSchedule = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await scheduledReportAPI.createSchedule(formData);
            if (response && response.success) {
                setSuccessMessage('Tạo lịch báo cáo thành công!');
                setShowAddForm(false);
                setFormData({
                    reportType: 'MONTHLY',
                    frequency: 'MONTHLY',
                    format: 'PDF',
                    emailDelivery: true,
                    isActive: true
                });
                // Refresh the list
                await fetchSchedules();
            } else {
                setError(response.message || 'Không thể tạo lịch báo cáo');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tạo lịch báo cáo');
        } finally {
            setLoading(false);
        }
    };

    const calculateNextGeneration = (frequency) => {
        const now = new Date();
        switch (frequency) {
            case 'daily':
                now.setDate(now.getDate() + 1);
                break;
            case 'weekly':
                now.setDate(now.getDate() + 7);
                break;
            case 'monthly':
                now.setMonth(now.getMonth() + 1);
                break;
            case 'quarterly':
                now.setMonth(now.getMonth() + 3);
                break;
            case 'yearly':
                now.setFullYear(now.getFullYear() + 1);
                break;
        }
        return now.toISOString();
    };

    const handleToggleEnabled = async (scheduleId) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await scheduledReportAPI.toggleSchedule(scheduleId);
            if (response && response.success) {
                setSuccessMessage('Đã thay đổi trạng thái lịch báo cáo');
                // Refresh the list
                await fetchSchedules();
            } else {
                setError(response.message || 'Không thể thay đổi trạng thái');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi thay đổi trạng thái');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSchedule = async (scheduleId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa lịch báo cáo này?')) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await scheduledReportAPI.deleteSchedule(scheduleId);
            if (response && response.success) {
                setSuccessMessage('Đã xóa lịch báo cáo thành công');
                // Refresh the list
                await fetchSchedules();
            } else {
                setError(response.message || 'Không thể xóa lịch báo cáo');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi xóa lịch báo cáo');
        } finally {
            setLoading(false);
        }
    };

    const getFrequencyLabel = (frequency) => {
        const labels = {
            DAILY: 'Hàng ngày',
            WEEKLY: 'Hàng tuần',
            MONTHLY: 'Hàng tháng',
            QUARTERLY: 'Hàng quý',
            YEARLY: 'Hàng năm'
        };
        return labels[frequency] || labels[frequency?.toUpperCase()] || frequency;
    };

    const getReportTypeLabel = (type) => {
        const labels = {
            MONTHLY: 'Báo cáo tháng',
            YEARLY: 'Báo cáo năm',
            CATEGORY: 'Báo cáo danh mục'
        };
        return labels[type] || labels[type?.toUpperCase()] || type;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Lập lịch báo cáo tự động</h1>
                        <p className="mt-2 text-gray-600">Tự động tạo và gửi báo cáo theo lịch trình</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-md font-medium transition-colors"
                    >
                        {showAddForm ? 'Hủy' : '+ Thêm lịch mới'}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">❌</span>
                            <div>
                                <p className="font-semibold text-red-800">Lỗi</p>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">✅</span>
                            <div>
                                <p className="font-semibold text-green-800">Thành công</p>
                                <p className="text-sm text-green-700 mt-1">{successMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Schedule Form */}
                {showAddForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Tạo lịch báo cáo mới</h2>
                        <form onSubmit={handleAddSchedule} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Report Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại báo cáo *
                                    </label>
                                    <select
                                        name="reportType"
                                        value={formData.reportType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="MONTHLY">Báo cáo tháng</option>
                                        <option value="YEARLY">Báo cáo năm</option>
                                        <option value="CATEGORY">Báo cáo danh mục</option>
                                    </select>
                                </div>

                                {/* Frequency */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tần suất *
                                    </label>
                                    <select
                                        name="frequency"
                                        value={formData.frequency}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="DAILY">Hàng ngày</option>
                                        <option value="WEEKLY">Hàng tuần</option>
                                        <option value="MONTHLY">Hàng tháng</option>
                                        <option value="QUARTERLY">Hàng quý</option>
                                        <option value="YEARLY">Hàng năm</option>
                                    </select>
                                </div>

                                {/* Format */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Định dạng xuất *
                                    </label>
                                    <select
                                        name="format"
                                        value={formData.format}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="PDF">PDF</option>
                                        <option value="CSV">CSV</option>
                                        <option value="BOTH">Cả hai (PDF + CSV)</option>
                                    </select>
                                </div>

                            </div>

                            {/* Email Delivery Checkbox */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="emailDelivery"
                                    id="emailDelivery"
                                    checked={formData.emailDelivery}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-indigo-600"
                                />
                                <label htmlFor="emailDelivery" className="text-sm text-gray-700">
                                    Gửi báo cáo qua email tự động
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    disabled={loading}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-md font-medium transition-colors"
                                >
                                    {loading ? 'Đang lưu...' : 'Lưu lịch'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Loading State */}
                {loading && scheduledReports.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
                        <p className="text-gray-500 text-lg">Đang tải dữ liệu...</p>
                    </div>
                )}

                {/* Scheduled Reports List */}
                {!loading && scheduledReports.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại báo cáo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tần suất</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Định dạng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lần tạo tiếp theo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {scheduledReports.map(schedule => (
                                    <tr key={schedule.id} className={!schedule.isActive ? 'opacity-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {getReportTypeLabel(schedule.reportType)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {getFrequencyLabel(schedule.frequency)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 uppercase">
                                            {schedule.format}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {schedule.nextRun ? new Date(schedule.nextRun).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'Chưa xác định'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                schedule.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {schedule.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleToggleEnabled(schedule.id)}
                                                disabled={loading}
                                                className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50 mr-3"
                                            >
                                                {schedule.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSchedule(schedule.id)}
                                                disabled={loading}
                                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}

                {/* Empty State */}
                {!loading && scheduledReports.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📅</div>
                        <p className="text-gray-500 text-lg mb-2">Chưa có lịch báo cáo nào</p>
                        <p className="text-gray-400 text-sm">
                            Nhấn nút "Thêm lịch mới" để tạo lịch báo cáo tự động đầu tiên
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduledReports;
