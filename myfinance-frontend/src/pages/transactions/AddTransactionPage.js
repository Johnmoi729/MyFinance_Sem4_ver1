import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransaction } from '../../context/TransactionContext';

const AddTransactionPage = () => {
    const navigate = useNavigate();
    const { categories, addTransaction, loadCategories, loading } = useTransaction();
    
    const [formData, setFormData] = useState({
        amount: '',
        type: 'EXPENSE',
        categoryId: '',
        description: '',
        transactionDate: new Date().toISOString().split('T')[0]
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [filteredCategories, setFilteredCategories] = useState([]);

    // Load categories when component mounts or type changes
    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        const filtered = categories.filter(category => category.type === formData.type);
        setFilteredCategories(filtered);
        // Reset category selection when type changes
        if (formData.categoryId && !filtered.find(cat => cat.id === parseInt(formData.categoryId))) {
            setFormData(prev => ({ ...prev, categoryId: '' }));
        }
    }, [categories, formData.type]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        // Validation
        if (!formData.amount || !formData.categoryId || !formData.transactionDate) {
            setMessage({ text: 'Vui lòng điền đầy đủ thông tin bắt buộc', type: 'error' });
            return;
        }

        if (parseFloat(formData.amount) <= 0) {
            setMessage({ text: 'Số tiền phải lớn hơn 0', type: 'error' });
            return;
        }

        const transactionData = {
            ...formData,
            amount: parseFloat(formData.amount),
            categoryId: parseInt(formData.categoryId)
        };

        const result = await addTransaction(transactionData);

        if (result.success) {
            setMessage({ text: 'Thêm giao dịch thành công!', type: 'success' });
            // Reset form
            setFormData({
                amount: '',
                type: 'EXPENSE',
                categoryId: '',
                description: '',
                transactionDate: new Date().toISOString().split('T')[0]
            });
            
            // Redirect to transactions page after 1 second
            setTimeout(() => {
                navigate('/transactions');
            }, 1500);
        } else {
            setMessage({ text: result.message, type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Thêm giao dịch mới</h1>
                        <button
                            onClick={() => navigate('/transactions')}
                            className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
                        >
                            ← Quay lại danh sách
                        </button>
                    </div>

                    {message.text && (
                        <div className={`mb-4 p-4 rounded-md ${
                            message.type === 'success'
                                ? 'bg-green-100 text-green-700 border border-green-300'
                                : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Transaction Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại giao dịch *
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'INCOME' }))}
                                    className={`p-4 rounded-lg border-2 text-center font-medium transition-colors ${
                                        formData.type === 'INCOME'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                    }`}
                                >
                                    💰 Thu nhập
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'EXPENSE' }))}
                                    className={`p-4 rounded-lg border-2 text-center font-medium transition-colors ${
                                        formData.type === 'EXPENSE'
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                    }`}
                                >
                                    💸 Chi tiêu
                                </button>
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số tiền *
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập số tiền"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục *
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Chọn danh mục</option>
                                {filteredCategories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {filteredCategories.length === 0 && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Không có danh mục nào cho loại giao dịch này
                                </p>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày giao dịch *
                            </label>
                            <input
                                type="date"
                                name="transactionDate"
                                value={formData.transactionDate}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ghi chú
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Mô tả chi tiết về giao dịch (tùy chọn)"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                                    loading
                                        ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {loading ? 'Đang xử lý...' : 'Thêm giao dịch'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/transactions')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionPage;