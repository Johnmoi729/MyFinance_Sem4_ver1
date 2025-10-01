import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI, formatCurrency } from '../../services/api';
import { useCategory } from '../../context/CategoryContext';
import { exportCategoryReportToCSV } from '../../utils/exportUtils';
import SpendingLineChart from '../../components/charts/SpendingLineChart';

const CategoryReport = () => {
    const navigate = useNavigate();
    const { categories, loadCategories } = useCategory();

    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load categories on mount
    useEffect(() => {
        loadCategories();
    }, []);

    // Set default dates (current month)
    useEffect(() => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setStartDate(firstDay.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
    }, []);

    const loadReport = async () => {
        if (!selectedCategoryId) {
            setError('Vui lòng chọn danh mục');
            return;
        }

        if (!startDate || !endDate) {
            setError('Vui lòng chọn khoảng thời gian');
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            setError('Ngày kết thúc phải sau ngày bắt đầu');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await reportAPI.getCategoryReport(selectedCategoryId, startDate, endDate);
            if (response && response.success) {
                setReport(response.data);
            } else {
                setError(response.message || 'Không thể tải báo cáo');
                setReport(null);
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải báo cáo');
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategoryId(e.target.value);
        setReport(null); // Clear previous report
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setReport(null); // Clear previous report
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setReport(null); // Clear previous report
    };

    const handleSetCurrentMonth = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setStartDate(firstDay.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
        setReport(null);
    };

    const handleSetLastMonth = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);

        setStartDate(firstDay.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
        setReport(null);
    };

    const handleSetCurrentYear = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), 0, 1);
        const lastDay = new Date(now.getFullYear(), 11, 31);

        setStartDate(firstDay.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
        setReport(null);
    };

    const selectedCategory = categories.find(cat => cat.id === parseInt(selectedCategoryId));

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Báo cáo theo danh mục</h1>
                    <p className="mt-2 text-gray-600">Phân tích chi tiết giao dịch theo danh mục và thời gian</p>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Tùy chọn báo cáo</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Category Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục *
                            </label>
                            <select
                                value={selectedCategoryId}
                                onChange={handleCategoryChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.icon || '📁'} {category.name} ({category.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Từ ngày *
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={handleStartDateChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đến ngày *
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Quick Date Buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            onClick={handleSetCurrentMonth}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
                        >
                            Tháng này
                        </button>
                        <button
                            onClick={handleSetLastMonth}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
                        >
                            Tháng trước
                        </button>
                        <button
                            onClick={handleSetCurrentYear}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
                        >
                            Năm nay
                        </button>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={loadReport}
                        disabled={loading || !selectedCategoryId}
                        className="w-full md:w-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-md font-medium transition-colors"
                    >
                        {loading ? 'Đang tải...' : 'Tạo báo cáo'}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Report Content */}
                {report && (
                    <div className="space-y-6">
                        {/* Export Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => exportCategoryReportToCSV(report)}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors flex items-center gap-2"
                            >
                                <span>📥</span>
                                Xuất CSV
                            </button>
                        </div>
                        {/* Category Info Header */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center gap-4">
                                <div className="text-6xl" style={{ color: report.categoryColor || '#6B7280' }}>
                                    {report.categoryIcon || '📁'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{report.categoryName}</h2>
                                    <p className="text-gray-600">
                                        {report.categoryType === 'INCOME' ? 'Danh mục thu nhập' : 'Danh mục chi tiêu'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Từ {new Date(report.startDate).toLocaleDateString('vi-VN')} đến {new Date(report.endDate).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Summary Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-sm font-medium text-gray-600">Tổng số tiền</p>
                                <p className={`text-2xl font-bold mt-2 ${report.categoryType === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(report.totalAmount)}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-sm font-medium text-gray-600">Số giao dịch</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {report.transactionCount}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-sm font-medium text-gray-600">Trung bình/giao dịch</p>
                                <p className="text-2xl font-bold text-blue-600 mt-2">
                                    {formatCurrency(report.averageTransaction)}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-sm font-medium text-gray-600">Khoảng giá trị</p>
                                <p className="text-sm text-gray-700 mt-2">
                                    <span className="font-semibold">Min:</span> {formatCurrency(report.minTransaction)}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Max:</span> {formatCurrency(report.maxTransaction)}
                                </p>
                            </div>
                        </div>

                        {/* Period Summaries Chart */}
                        {report.periodSummaries && report.periodSummaries.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <SpendingLineChart
                                    data={report.periodSummaries}
                                    title="Biểu đồ xu hướng theo thời gian"
                                    dataKeys={['amount']}
                                />
                            </div>
                        )}

                        {/* Period Summaries (Time-series data) */}
                        {report.periodSummaries && report.periodSummaries.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết xu hướng theo thời gian</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khoảng thời gian</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Từ ngày</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đến ngày</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Giao dịch</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {report.periodSummaries.map((period, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">
                                                        {period.periodLabel}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {new Date(period.periodStart).toLocaleDateString('vi-VN')}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {new Date(period.periodEnd).toLocaleDateString('vi-VN')}
                                                    </td>
                                                    <td className={`px-4 py-3 text-right font-medium ${report.categoryType === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatCurrency(period.amount)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-gray-600">
                                                        {period.transactionCount}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* No transactions message */}
                        {report.transactionCount === 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                                <p className="text-yellow-700">
                                    Không có giao dịch nào trong khoảng thời gian đã chọn cho danh mục này.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* No Report Generated Yet */}
                {!loading && !error && !report && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <p className="text-gray-500 text-lg">Chọn danh mục và khoảng thời gian để xem báo cáo</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryReport;
