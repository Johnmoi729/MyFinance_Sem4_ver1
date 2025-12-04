import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategory } from '../../context/CategoryContext';
import * as Icons from '../../components/icons';

const CategoriesPage = () => {
    const navigate = useNavigate();
    const { categories, loading, loadCategories, deleteCategory } = useCategory();
    
    const [filter, setFilter] = useState('ALL'); // ALL, INCOME, EXPENSE
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Load categories when component mounts
    useEffect(() => {
        const loadData = async () => {
            if (filter === 'ALL') {
                await loadCategories();
            } else {
                await loadCategories(filter);
            }
        };
        loadData();
    }, [filter]);

    const handleDelete = async (id) => {
        const result = await deleteCategory(id);
        
        if (result.success) {
            setMessage({ text: 'Xóa danh mục thành công!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
            setMessage({ text: result.message, type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
        
        setDeleteConfirm(null);
    };

    const filteredCategories = categories || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Quản lý danh mục</h1>
                        <button
                            onClick={() => navigate('/categories/add')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            + Thêm danh mục
                        </button>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setFilter('ALL')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                filter === 'ALL'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setFilter('INCOME')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                filter === 'INCOME'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Thu nhập
                        </button>
                        <button
                            onClick={() => setFilter('EXPENSE')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                filter === 'EXPENSE'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Chi tiêu
                        </button>
                    </div>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`mb-4 p-4 rounded-md ${
                        message.type === 'success'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* Categories Grid */}
                <div className="bg-white rounded-lg shadow">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Đang tải...</p>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 mb-4">Chưa có danh mục nào</p>
                            <button
                                onClick={() => navigate('/categories/add')}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Thêm danh mục đầu tiên
                            </button>
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredCategories.map((category) => {
                                    const IconComponent = Icons[category.icon] || Icons.Tag;
                                    return (
                                        <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                        style={{ backgroundColor: category.color + '20' }}
                                                    >
                                                        <IconComponent
                                                            className="w-5 h-5"
                                                            style={{ color: category.color }}
                                                        />
                                                    </div>
                                                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                                                </div>
                                                {category.isDefault && (
                                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                                        Mặc định
                                                    </span>
                                                )}
                                            </div>
                                        
                                        <div className="mb-3">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                category.type === 'INCOME' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {category.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}
                                            </span>
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => navigate(`/categories/edit/${category.id}`)}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm"
                                            >
                                                Sửa
                                            </button>
                                            {!category.isDefault && (
                                                <button
                                                    onClick={() => setDeleteConfirm(category.id)}
                                                    className="text-red-600 hover:text-red-900 text-sm"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3 text-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Xác nhận xóa</h3>
                                <div className="mt-2 px-7 py-3">
                                    <p className="text-sm text-gray-500">
                                        Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
                                    </p>
                                </div>
                                <div className="items-center px-4 py-3 space-x-3">
                                    <button
                                        onClick={() => handleDelete(deleteConfirm)}
                                        className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md hover:bg-red-700"
                                    >
                                        Xóa
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md hover:bg-gray-400"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;