import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBudget } from '../../context/BudgetContext';
import { useCategory } from '../../context/CategoryContext';

const BudgetsPage = () => {
  const { budgets, loading, error, fetchBudgets, deleteBudget, clearError } = useBudget();
  const { categories, loadCategories, getCategoriesByType } = useCategory();
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: '',
    year: '',
    month: ''
  });

  // Load data when component mounts - show all budgets initially
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadCategories(),
        fetchBudgets() // Load all budgets initially, no filters applied
      ]);
    };
    loadData();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Apply advanced filters
  const applyAdvancedFilters = async () => {
    const activeFilters = {};
    
    if (filters.categoryId) activeFilters.categoryId = parseInt(filters.categoryId);
    if (filters.year) activeFilters.year = parseInt(filters.year);
    if (filters.month) activeFilters.month = parseInt(filters.month);
    
    await fetchBudgets(activeFilters);
  };

  // Clear all filters
  const clearAllFilters = async () => {
    setFilters({
      categoryId: '',
      year: '',
      month: ''
    });
    await fetchBudgets(); // Load all budgets without filters
  };

  const handleDeleteBudget = async (budgetId, budgetName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ngân sách "${budgetName}"?`)) {
      try {
        await deleteBudget(budgetId);
      } catch (err) {
        console.error('Error deleting budget:', err);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getMonthName = (month) => {
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return monthNames[month - 1];
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Get expense categories for filtering (budgets are only for expense categories)
  const expenseCategories = getCategoriesByType('EXPENSE');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Ngân sách</h1>
          <Link
            to="/budgets/add"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Thêm Ngân sách
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filter Controls */}
        <div className="mb-4 bg-white rounded-lg shadow-md p-4">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-2 rounded-md border transition-colors ${
                showAdvancedFilters 
                  ? 'bg-gray-100 border-gray-400' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              🔽 Bộ lọc
            </button>
            <span className="text-sm text-gray-600">
              Hiển thị {budgets.length} ngân sách
            </span>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select
                    value={filters.categoryId}
                    onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả danh mục</option>
                    {expenseCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Năm</label>
                  <select
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả năm</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Month Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
                  <select
                    value={filters.month}
                    onChange={(e) => handleFilterChange('month', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả tháng</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>{getMonthName(month)}</option>
                    ))}
                  </select>
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
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">Chưa có ngân sách nào</p>
            <Link
              to="/budgets/add"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Tạo ngân sách đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <div key={budget.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: budget.category.color }}
                    ></div>
                    <div>
                      <h3 className="font-medium text-gray-800">{budget.category.name}</h3>
                      <p className="text-sm text-gray-500">
                        {getMonthName(budget.budgetMonth)} {budget.budgetYear}
                      </p>
                    </div>
                  </div>
                  {budget.isCurrentMonth && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Tháng hiện tại
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(budget.budgetAmount)}
                  </p>
                </div>

                {budget.description && (
                  <p className="text-gray-600 text-sm mb-4">{budget.description}</p>
                )}

                <div className="flex justify-between items-center">
                  <Link
                    to={`/budgets/edit/${budget.id}`}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Chỉnh sửa
                  </Link>
                  <button
                    onClick={() => handleDeleteBudget(budget.id, budget.category.name)}
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetsPage;