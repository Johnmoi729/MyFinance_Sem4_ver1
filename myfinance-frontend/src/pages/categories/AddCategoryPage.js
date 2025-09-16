import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategory } from '../../context/CategoryContext';

const AddCategoryPage = () => {
    const navigate = useNavigate();
    const { addCategory, loading } = useCategory();
    
    const [formData, setFormData] = useState({
        name: '',
        type: 'EXPENSE',
        color: '#EF4444',
        icon: 'default'
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    // Predefined colors for categories
    const colorOptions = [
        { name: 'Đỏ', value: '#EF4444' },
        { name: 'Cam', value: '#F97316' },
        { name: 'Vàng', value: '#EAB308' },
        { name: 'Xanh lá', value: '#10B981' },
        { name: 'Xanh dương', value: '#3B82F6' },
        { name: 'Tím', value: '#8B5CF6' },
        { name: 'Hồng', value: '#EC4899' },
        { name: 'Xám', value: '#6B7280' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleColorSelect = (color) => {
        setFormData(prev => ({
            ...prev,
            color: color
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        // Validation
        if (!formData.name.trim()) {
            setMessage({ text: 'Vui lòng nhập tên danh mục', type: 'error' });
            return;
        }

        const categoryData = {
            ...formData,
            name: formData.name.trim()
        };

        const result = await addCategory(categoryData);

        if (result.success) {
            setMessage({ text: 'Thêm danh mục thành công!', type: 'success' });
            
            // Redirect to categories page after 1 second
            setTimeout(() => {
                navigate('/categories');
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
                        <h1 className="text-3xl font-bold text-gray-900">Thêm danh mục mới</h1>
                        <button
                            onClick={() => navigate('/categories')}
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
                        {/* Category Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại danh mục *
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

                        {/* Category Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên danh mục *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập tên danh mục"
                                required
                                maxLength="100"
                            />
                        </div>

                        {/* Color Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Màu sắc
                            </label>
                            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                                {colorOptions.map((colorOption) => (
                                    <button
                                        key={colorOption.value}
                                        type="button"
                                        onClick={() => handleColorSelect(colorOption.value)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                                            formData.color === colorOption.value
                                                ? 'border-gray-900 scale-110'
                                                : 'border-gray-300 hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: colorOption.value }}
                                        title={colorOption.name}
                                    />
                                ))}
                            </div>
                            <div className="mt-2 flex items-center">
                                <div
                                    className="w-6 h-6 rounded-full border border-gray-300 mr-2"
                                    style={{ backgroundColor: formData.color }}
                                ></div>
                                <span className="text-sm text-gray-600">Màu đã chọn: {formData.color}</span>
                            </div>
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
                                {loading ? 'Đang xử lý...' : 'Thêm danh mục'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/categories')}
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

export default AddCategoryPage;