import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransaction } from '../../context/TransactionContext';
import { useCategory } from '../../context/CategoryContext';
import { formatCurrency, formatDate, getTransactionTypeLabel, getTransactionTypeColor } from '../../services/api';
import VietnameseDateInput from '../../components/common/VietnameseDateInput';

const TransactionsPage = () => {
    const navigate = useNavigate();
    const { 
        transactions, 
        loading, 
        loadTransactions, 
        deleteTransaction,
        searchTransactions,
        loadTransactionsWithFilters,
        getTotalIncome,
        getTotalExpenses,
        getBalance
    } = useTransaction();
    
    const { categories, loadCategories } = useCategory();
    
    const [filter, setFilter] = useState('ALL'); // ALL, INCOME, EXPENSE
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        categoryId: '',
        startDate: '',
        endDate: '',
        searchTerm: ''
    });

    // Load transactions when component mounts
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                loadCategories(),
                loadTransactions()
            ]);
        };
        loadData();
    }, []);

    // Handle search
    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            await searchTransactions(searchTerm.trim());
        } else {
            await loadTransactions();
        }
    };

    // Handle filter change
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // Apply advanced filters
    const applyAdvancedFilters = async () => {
        const activeFilters = {};
        
        if (filters.type) activeFilters.type = filters.type;
        if (filters.categoryId) activeFilters.categoryId = parseInt(filters.categoryId);
        if (filters.startDate) activeFilters.startDate = filters.startDate;
        if (filters.endDate) activeFilters.endDate = filters.endDate;
        if (filters.searchTerm) activeFilters.searchTerm = filters.searchTerm;
        
        await loadTransactionsWithFilters(activeFilters);
    };

    // Clear all filters
    const clearAllFilters = async () => {
        setFilters({
            type: '',
            categoryId: '',
            startDate: '',
            endDate: '',
            searchTerm: ''
        });
        setSearchTerm('');
        setFilter('ALL');
        await loadTransactions();
    };

    // Handle basic filter (quick filters)
    const handleBasicFilter = async (filterType) => {
        setFilter(filterType);
        if (filterType === 'ALL') {
            await loadTransactions();
        } else {
            await loadTransactions(filterType);
        }
    };

    const handleDelete = async (id) => {
        const result = await deleteTransaction(id);
        
        if (result.success) {
            setMessage({ text: 'Xóa giao dịch thành công!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
            setMessage({ text: result.message, type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
        
        setDeleteConfirm(null);
    };

    const filteredTransactions = transactions || [];
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    const balance = getBalance();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Lịch sử giao dịch</h1>
                        <button
                            onClick={() => navigate('/transactions/add')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            + Thêm giao dịch
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <p className="text-sm text-green-600 font-medium">Tổng thu nhập</p>
                            <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <p className="text-sm text-red-600 font-medium">Tổng chi tiêu</p>
                            <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpenses)}</p>
                        </div>
                        <div className={`p-4 rounded-lg border ${balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                            <p className="text-sm font-medium text-gray-600">Số dư</p>
                            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-gray-700'}`}>
                                {formatCurrency(balance)}
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm theo mô tả hoặc số tiền..."
                                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Tìm kiếm
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className={`px-4 py-3 rounded-md border transition-colors ${
                                    showAdvancedFilters 
                                        ? 'bg-gray-100 border-gray-400' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                🔽 Bộ lọc
                            </button>
                        </div>
                    </form>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                                {/* Type Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                                    <select
                                        value={filters.type}
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="INCOME">Thu nhập</option>
                                        <option value="EXPENSE">Chi tiêu</option>
                                    </select>
                                </div>

                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                                    <select
                                        value={filters.categoryId}
                                        onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Tất cả</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                                    <VietnameseDateInput
                                        value={filters.startDate}
                                        onChange={(value) => handleFilterChange('startDate', value)}
                                        placeholder="dd/mm/yyyy"
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                                    <VietnameseDateInput
                                        value={filters.endDate}
                                        onChange={(value) => handleFilterChange('endDate', value)}
                                        placeholder="dd/mm/yyyy"
                                    />
                                </div>

                                {/* Search Term */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                                    <input
                                        type="text"
                                        value={filters.searchTerm}
                                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                        placeholder="Mô tả hoặc số tiền"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={applyAdvancedFilters}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Áp dụng bộ lọc
                                </button>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Quick Filter Buttons */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleBasicFilter('ALL')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                filter === 'ALL'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => handleBasicFilter('INCOME')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                filter === 'INCOME'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Thu nhập
                        </button>
                        <button
                            onClick={() => handleBasicFilter('EXPENSE')}
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

                {/* Transactions List */}
                <div className="bg-white rounded-lg shadow">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Đang tải...</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 mb-4">Chưa có giao dịch nào</p>
                            <button
                                onClick={() => navigate('/transactions/add')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Thêm giao dịch đầu tiên
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Loại
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Danh mục
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mô tả
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Số tiền
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(transaction.transactionDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    transaction.type === 'INCOME' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {getTransactionTypeLabel(transaction.type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: transaction.category?.color || '#6B7280' }}
                                                    ></div>
                                                    <span className="text-sm text-gray-900">
                                                        {transaction.category?.name || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                                {transaction.description || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                                                    {transaction.type === 'EXPENSE' ? '-' : '+'}
                                                    {formatCurrency(transaction.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => navigate(`/transactions/edit/${transaction.id}`)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(transaction.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                                        Bạn có chắc chắn muốn xóa giao dịch này? Hành động này không thể hoàn tác.
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

export default TransactionsPage;