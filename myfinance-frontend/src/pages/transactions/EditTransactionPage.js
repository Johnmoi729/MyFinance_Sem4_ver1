import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransaction } from '../../context/TransactionContext';

const EditTransactionPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { categories, getTransaction, updateTransaction, loadCategories, loading } = useTransaction();

    const [formData, setFormData] = useState({
        amount: '',
        type: 'EXPENSE',
        categoryId: '',
        description: '',
        transactionDate: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);

    // Load transaction and categories when component mounts
    useEffect(() => {
        const loadData = async () => {
            try {
                setInitialLoading(true);
                await loadCategories();
                
                const result = await getTransaction(id);
                if (result.success) {
                    const transaction = result.data;
                    setFormData({
                        amount: transaction.amount.toString(),
                        type: transaction.type,
                        categoryId: transaction.category.id.toString(),
                        description: transaction.description || '',
                        transactionDate: transaction.transactionDate
                    });
                } else {
                    setMessage({ text: result.message || 'Không thể tải giao dịch', type: 'error' });
                }
            } catch (error) {
                setMessage({ text: 'Đã xảy ra lỗi khi tải dữ liệu', type: 'error' });
            } finally {
                setInitialLoading(false);
            }
        };
        
        if (id) {
            loadData();
        }
    }, [id]);

    // Filter categories by type
    useEffect(() => {
        const filtered = categories.filter(category => category.type === formData.type);
        setFilteredCategories(filtered);
        
        // Reset category selection if current category doesn't match new type
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

        const result = await updateTransaction(id, transactionData);

        if (result.success) {
            setMessage({ text: 'Cập nhật giao dịch thành công!', type: 'success' });
            
            // Redirect to transactions page after 1 second
            setTimeout(() => {
                navigate('/transactions');
            }, 1500);
        } else {
            setMessage({ text: result.message, type: 'error' });
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Chỉnh sửa giao dịch</h1>
                        <button
                            onClick={() => navigate('/transactions')}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm flex items-center"
                        >
                            ← Quay lại danh sách
                        </button>
                    </div>

                    {message.text && (
                        <div className={`mb-4 p-4 rounded-md ${
                            message.type === 'success'
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800'
                                : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Transaction Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Loại giao dịch *
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'INCOME' }))}
                                    className={`p-4 rounded-lg border-2 text-center font-medium transition-colors ${
                                        formData.type === 'INCOME'
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                >
                                    💰 Thu nhập
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'EXPENSE' }))}
                                    className={`p-4 rounded-lg border-2 text-center font-medium transition-colors ${
                                        formData.type === 'EXPENSE'
                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                                >
                                    💸 Chi tiêu
                                </button>
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Số tiền (VND) *
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Nhập số tiền"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Danh mục *
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Không có danh mục nào cho loại giao dịch này
                                </p>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ngày giao dịch *
                            </label>
                            <input
                                type="date"
                                name="transactionDate"
                                value={formData.transactionDate}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ghi chú
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                            >
                                {loading ? 'Đang xử lý...' : 'Cập nhật giao dịch'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/transactions')}
                                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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

export default EditTransactionPage;