import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduledReports = () => {
    const navigate = useNavigate();
    const [scheduledReports, setScheduledReports] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        reportType: 'monthly',
        frequency: 'monthly',
        format: 'pdf',
        emailDelivery: false,
        email: '',
        enabled: true
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddSchedule = (e) => {
        e.preventDefault();

        // Placeholder implementation - would integrate with backend API
        const newSchedule = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString(),
            lastGenerated: null,
            nextGeneration: calculateNextGeneration(formData.frequency)
        };

        setScheduledReports([...scheduledReports, newSchedule]);
        setShowAddForm(false);
        setFormData({
            reportType: 'monthly',
            frequency: 'monthly',
            format: 'pdf',
            emailDelivery: false,
            email: '',
            enabled: true
        });

        alert('Lưu ý: Tính năng lập lịch báo cáo tự động đang trong giai đoạn phát triển. Hiện tại đây là giao diện demo.');
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

    const handleToggleEnabled = (scheduleId) => {
        setScheduledReports(scheduledReports.map(schedule =>
            schedule.id === scheduleId
                ? { ...schedule, enabled: !schedule.enabled }
                : schedule
        ));
    };

    const handleDeleteSchedule = (scheduleId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lịch báo cáo này?')) {
            setScheduledReports(scheduledReports.filter(schedule => schedule.id !== scheduleId));
        }
    };

    const getFrequencyLabel = (frequency) => {
        const labels = {
            daily: 'Hàng ngày',
            weekly: 'Hàng tuần',
            monthly: 'Hàng tháng',
            quarterly: 'Hàng quý',
            yearly: 'Hàng năm'
        };
        return labels[frequency] || frequency;
    };

    const getReportTypeLabel = (type) => {
        const labels = {
            monthly: 'Báo cáo tháng',
            yearly: 'Báo cáo năm',
            category: 'Báo cáo danh mục'
        };
        return labels[type] || type;
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
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md font-medium transition-colors"
                    >
                        {showAddForm ? 'Hủy' : '+ Thêm lịch mới'}
                    </button>
                </div>

                {/* Beta Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <p className="font-semibold text-yellow-800">Tính năng đang phát triển</p>
                            <p className="text-sm text-yellow-700 mt-1">
                                Tính năng lập lịch báo cáo tự động hiện đang trong giai đoạn phát triển.
                                Giao diện này là bản demo để thu thập phản hồi từ người dùng.
                                Tích hợp backend với Spring @Scheduled sẽ được hoàn thiện trong phiên bản tiếp theo.
                            </p>
                        </div>
                    </div>
                </div>

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
                                        <option value="monthly">Báo cáo tháng</option>
                                        <option value="yearly">Báo cáo năm</option>
                                        <option value="category">Báo cáo danh mục</option>
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
                                        <option value="daily">Hàng ngày</option>
                                        <option value="weekly">Hàng tuần</option>
                                        <option value="monthly">Hàng tháng</option>
                                        <option value="quarterly">Hàng quý</option>
                                        <option value="yearly">Hàng năm</option>
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
                                        <option value="pdf">PDF</option>
                                        <option value="csv">CSV</option>
                                        <option value="both">Cả hai (PDF + CSV)</option>
                                    </select>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email nhận báo cáo
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="email@example.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    />
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
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md font-medium transition-colors"
                                >
                                    Lưu lịch
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Scheduled Reports List */}
                {scheduledReports.length > 0 ? (
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
                                    <tr key={schedule.id} className={!schedule.enabled ? 'opacity-50' : ''}>
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
                                            {new Date(schedule.nextGeneration).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                schedule.enabled
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {schedule.enabled ? 'Đang hoạt động' : 'Tạm dừng'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleToggleEnabled(schedule.id)}
                                                className="text-indigo-600 hover:text-indigo-800 mr-3"
                                            >
                                                {schedule.enabled ? 'Tạm dừng' : 'Kích hoạt'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSchedule(schedule.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
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
