import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTransaction } from '../../context/TransactionContext';
import { useCategory } from '../../context/CategoryContext';
import { usePreferences } from '../../context/PreferencesContext';
import { getTransactionTypeLabel, getTransactionTypeColor } from '../../services/api';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';
import { useDateFormatter } from '../../utils/dateFormatter';
import VietnameseDateInput from '../../components/common/VietnameseDateInput';
import SearchFilter from '../../components/common/SearchFilter';
import Breadcrumb from '../../components/common/Breadcrumb';
import FilterSummary from '../../components/common/FilterSummary';
import { Plus, Minus, Coins, TrendingUp, TrendingDown, Filter as FilterIcon } from '../../components/icons';

const TransactionsPage = () => {
 const navigate = useNavigate();
 const location = useLocation();
 const { formatCurrency } = useCurrencyFormatter();
 const { formatDate } = useDateFormatter();
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

 // Load transactions when component mounts or handle filters from URL
 useEffect(() => {
 const loadData = async () => {
 await loadCategories();

 // Parse URL parameters
 const urlParams = new URLSearchParams(location.search);
 const categoryId = urlParams.get('categoryId');
 const type = urlParams.get('type');
 const startDate = urlParams.get('startDate');
 const endDate = urlParams.get('endDate');
 const searchQuery = urlParams.get('search');
 const source = urlParams.get('source');

 // Check if we have drill-down filters from analytics
 const hasDrillDownFilters = categoryId || type || (startDate && endDate);

 if (hasDrillDownFilters) {
 // Apply filters from URL parameters
 const urlFilters = {
 type: type || '',
 categoryId: categoryId || '',
 startDate: startDate || '',
 endDate: endDate || '',
 searchTerm: ''
 };

 // Update local filter state
 setFilters(urlFilters);

 // Show advanced filters panel if we have drill-down filters
 if (source === 'analytics') {
 setShowAdvancedFilters(true);
 }

 // Apply filters automatically
 const activeFilters = {};
 if (urlFilters.type) activeFilters.type = urlFilters.type;
 if (urlFilters.categoryId) activeFilters.categoryId = parseInt(urlFilters.categoryId);
 if (urlFilters.startDate) activeFilters.startDate = urlFilters.startDate;
 if (urlFilters.endDate) activeFilters.endDate = urlFilters.endDate;

 await loadTransactionsWithFilters(activeFilters);
 } else if (searchQuery) {
 // Handle search query
 setSearchTerm(searchQuery);
 await searchTransactions(searchQuery);
 } else {
 // Load all transactions
 await loadTransactions();
 }
 };
 loadData();
 }, [location.search]);

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

 // Clear URL parameters
 navigate('/transactions', { replace: true });

 await loadTransactions();
 };

 // Clear individual filter
 const clearIndividualFilter = async (filterKey) => {
 const updatedFilters = { ...filters };

 if (filterKey === 'dateRange') {
 updatedFilters.startDate = '';
 updatedFilters.endDate = '';
 } else {
 updatedFilters[filterKey] = '';
 }

 setFilters(updatedFilters);

 // Apply updated filters
 const activeFilters = {};
 if (updatedFilters.type) activeFilters.type = updatedFilters.type;
 if (updatedFilters.categoryId) activeFilters.categoryId = parseInt(updatedFilters.categoryId);
 if (updatedFilters.startDate) activeFilters.startDate = updatedFilters.startDate;
 if (updatedFilters.endDate) activeFilters.endDate = updatedFilters.endDate;
 if (updatedFilters.searchTerm) activeFilters.searchTerm = updatedFilters.searchTerm;

 // Update URL parameters
 const urlParams = new URLSearchParams(location.search);
 if (filterKey === 'dateRange') {
 urlParams.delete('startDate');
 urlParams.delete('endDate');
 } else {
 urlParams.delete(filterKey);
 }

 const newSearch = urlParams.toString();
 navigate(`/transactions${newSearch ? '?' + newSearch : ''}`, { replace: true });

 // Reload transactions with updated filters
 if (Object.keys(activeFilters).length > 0) {
 await loadTransactionsWithFilters(activeFilters);
 } else {
 await loadTransactions();
 }
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

 // Get source and sourceName from URL
 const urlParams = new URLSearchParams(location.search);
 const source = urlParams.get('source');
 const sourceName = urlParams.get('sourceName');

 return (
 <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
 <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
 {/* Header */}
 <div className="card p-6 mb-6">
 {/* Breadcrumb Navigation */}
 <Breadcrumb
 source={source}
 sourceName={sourceName}
 onBack={() => navigate('/analytics')}
 />

 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
 <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4 sm:mb-0">Lịch sử giao dịch</h1>
 <button
 onClick={() => navigate('/transactions/add')}
 className="btn-primary"
 >
 + Thêm giao dịch
 </button>
 </div>

 {/* Filter Summary */}
 <FilterSummary
 filters={filters}
 categories={categories}
 onClearFilter={clearIndividualFilter}
 />

 {/* Summary Cards */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
 <div className="stat-card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-green-700 mb-2">Tổng thu nhập</p>
 <p className="text-2xl font-bold text-green-600 break-words">{formatCurrency(totalIncome)}</p>
 </div>
 <div className="flex-shrink-0 p-3 bg-green-200 rounded-2xl">
 <Plus className="w-6 h-6 text-green-600" />
 </div>
 </div>
 </div>
 <div className="stat-card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-red-700 mb-2">Tổng chi tiêu</p>
 <p className="text-2xl font-bold text-red-600 break-words">{formatCurrency(totalExpenses)}</p>
 </div>
 <div className="flex-shrink-0 p-3 bg-red-200 rounded-2xl">
 <Minus className="w-6 h-6 text-red-600" />
 </div>
 </div>
 </div>
 <div className={`stat-card ${
 balance >= 0
 ? 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200'
 : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
 } border`}>
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <p className={`text-sm font-medium mb-2 ${
 balance >= 0
 ? 'text-indigo-700'
 : 'text-gray-700'
 }`}>Số dư</p>
 <p className={`text-2xl font-bold break-words ${
 balance >= 0
 ? 'text-indigo-600'
 : 'text-gray-600'
 }`}>
 {formatCurrency(balance)}
 </p>
 </div>
 <div className={`flex-shrink-0 p-3 rounded-2xl ${
 balance >= 0
 ? 'bg-indigo-200'
 : 'bg-gray-200'
 }`}>
 <Coins className={`w-6 h-6 ${
 balance >= 0
 ? 'text-indigo-600'
 : 'text-gray-600'
 }`} />
 </div>
 </div>
 </div>
 </div>

 {/* Search and Quick Filters */}
 <SearchFilter
 searchTerm={searchTerm}
 onSearchChange={async (value) => {
 setSearchTerm(value);
 // Search as you type - trigger search when user types
 if (value.trim().length >= 2) {
 await searchTransactions(value.trim());
 } else if (!value.trim()) {
 await loadTransactions();
 }
 }}
 onSearchClear={async () => {
 setSearchTerm('');
 await loadTransactions();
 }}
 searchPlaceholder="Tìm kiếm theo mô tả hoặc số tiền (tối thiểu 2 ký tự)..."
 filterOptions={[
 {
 value: 'ALL',
 label: 'Tất cả',
 icon: Coins,
 },
 {
 value: 'INCOME',
 label: 'Thu nhập',
 icon: TrendingUp,
 activeClass: 'bg-green-600 text-white shadow-md'
 },
 {
 value: 'EXPENSE',
 label: 'Chi tiêu',
 icon: TrendingDown,
 activeClass: 'bg-red-600 text-white shadow-md'
 }
 ]}
 activeFilter={filter}
 onFilterChange={handleBasicFilter}
 customFilters={[
 <button
 key="advanced-filter"
 type="button"
 onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
 className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
 showAdvancedFilters
 ? 'bg-indigo-600 text-white shadow-md'
 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
 }`}
 >
 <FilterIcon className="w-4 h-4" />
 Bộ lọc nâng cao
 </button>
 ]}
 />

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
 className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
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
 className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
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
 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
 />
 </div>
 </div>

 <div className="flex gap-2">
 <button
 onClick={applyAdvancedFilters}
 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
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
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
 <p className="text-gray-500">Đang tải...</p>
 </div>
 ) : filteredTransactions.length === 0 ? (
 <div className="p-8 text-center">
 <p className="text-gray-500 mb-4">Chưa có giao dịch nào</p>
 <button
 onClick={() => navigate('/transactions/add')}
 className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
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
 className="text-indigo-600 hover:text-indigo-900"
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