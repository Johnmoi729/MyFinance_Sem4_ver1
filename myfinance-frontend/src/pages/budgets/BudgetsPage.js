import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useBudget } from '../../context/BudgetContext';
import { useCategory } from '../../context/CategoryContext';
import { usePreferences } from '../../context/PreferencesContext';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';
import BudgetUsageCard from '../../components/budget/BudgetUsageCard';
import BudgetWarningAlert from '../../components/budget/BudgetWarningAlert';
import BudgetAlertToast from '../../components/budget/BudgetAlertToast';
import { budgetAPI } from '../../services/api';

const BudgetsPage = () => {
  const { budgets, loading, error, fetchBudgets, deleteBudget } = useBudget();
  const { loadCategories, getCategoriesByType } = useCategory();
  const { getCurrency, getViewMode, updatePreference } = usePreferences();
  const { formatCurrency } = useCurrencyFormatter();

  const [filters, setFilters] = useState({
    categoryId: '',
    year: '',
    month: ''
  });

  // New state for budget analytics
  const [budgetUsages, setBudgetUsages] = useState([]);
  const [budgetWarnings, setBudgetWarnings] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [viewMode, setViewModeLocal] = useState(getViewMode() || 'usage'); // Get from preferences
  const [showAlertToast, setShowAlertToast] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState([]);

  // Update view mode and persist to preferences
  const setViewMode = useCallback(async (mode) => {
    setViewModeLocal(mode);
    await updatePreference('viewMode', mode);
  }, [updatePreference]);

  // Load budget analytics data
  const loadBudgetAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const [usageResponse, warningsResponse] = await Promise.all([
        budgetAPI.getCurrentMonthBudgetUsage(),
        budgetAPI.getBudgetWarnings()
      ]);

      if (usageResponse && usageResponse.success) {
        setBudgetUsages(usageResponse.data || []);
      }

      if (warningsResponse && warningsResponse.success) {
        setBudgetWarnings(warningsResponse.data);

        // Check for critical alerts (RED status or over 90%)
        const alerts = warningsResponse.data?.alerts || [];
        const critical = alerts.filter(alert =>
          alert.alertLevel === 'RED' || (alert.usagePercentage && alert.usagePercentage >= 90)
        );

        if (critical.length > 0) {
          setCriticalAlerts(critical);
          setShowAlertToast(true);
        }
      }
    } catch (err) {
      console.error('Error loading budget analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Load data when component mounts - show all budgets initially
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadCategories(),
        fetchBudgets(), // Load all budgets initially, no filters applied
        loadBudgetAnalytics()
      ]);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount


  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Apply advanced filters
  const applyAdvancedFilters = useCallback(async () => {
    if (loading) return; // Prevent concurrent requests

    const activeFilters = {};

    if (filters.categoryId) activeFilters.categoryId = parseInt(filters.categoryId);
    if (filters.year) activeFilters.year = parseInt(filters.year);
    if (filters.month) activeFilters.month = parseInt(filters.month);

    await fetchBudgets(activeFilters);
    // Note: We don't reload analytics here since we filter them client-side
    // This keeps the performance good and shows filtered results immediately
  }, [filters, loading, fetchBudgets]);

  // Clear all filters
  const clearAllFilters = useCallback(async () => {
    if (loading) return; // Prevent concurrent requests

    setFilters({
      categoryId: '',
      year: '',
      month: ''
    });
    await Promise.all([
      fetchBudgets(), // Load all budgets without filters
      loadBudgetAnalytics() // Refresh analytics data
    ]);
  }, [loading, fetchBudgets, loadBudgetAnalytics]);

  const handleDeleteBudget = async (budgetId, budgetName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ngân sách "${budgetName}"?`)) {
      try {
        await deleteBudget(budgetId);
      } catch (err) {
        console.error('Error deleting budget:', err);
      }
    }
  };

  // formatCurrency is now imported from useCurrencyFormatter hook

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

  // Filter budgetUsages based on current filters
  const getFilteredBudgetUsages = () => {
    if (!budgetUsages || budgetUsages.length === 0) return [];

    return budgetUsages.filter(usage => {
      // Category filter - match by category name since we don't have category ID in usage
      if (filters.categoryId) {
        const selectedCategory = expenseCategories.find(cat => cat.id.toString() === filters.categoryId);
        if (selectedCategory && usage.categoryName !== selectedCategory.name) {
          return false;
        }
      }

      // Year filter
      if (filters.year && usage.budgetYear && usage.budgetYear.toString() !== filters.year) {
        return false;
      }

      // Month filter
      if (filters.month && usage.budgetMonth && usage.budgetMonth.toString() !== filters.month) {
        return false;
      }

      return true;
    });
  };

  const filteredBudgetUsages = getFilteredBudgetUsages();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Budget Alert Toast - appears at top-right when budgets are in alert zone */}
      {showAlertToast && criticalAlerts.length > 0 && (
        <BudgetAlertToast
          alerts={criticalAlerts}
          onClose={() => setShowAlertToast(false)}
        />
      )}

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50">Quản lý Ngân sách</h1>
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('usage')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'usage'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Thống kê
              </button>
              <button
                onClick={() => setViewMode('basic')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'basic'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Cơ bản
              </button>
            </div>

            <div className="flex space-x-3">
              <Link
                to="/budgets/settings"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cài đặt
              </Link>
              <Link
                to="/budgets/add"
                className="bg-blue-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Thêm Ngân sách
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Budget Warnings */}
        {viewMode === 'usage' && budgetWarnings && budgetWarnings.alerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-50 mb-3">Cảnh báo ngân sách</h2>
            <BudgetWarningAlert
              alerts={budgetWarnings.alerts}
              compact={true}
              onViewDetails={() => {
                // Could navigate to detailed view
                console.log('View budget alert details');
              }}
            />
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Danh mục:</label>
              <select
                value={filters.categoryId}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tất cả</option>
                {expenseCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Năm:</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tất cả</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tháng:</label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tất cả</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>{getMonthName(month)}</option>
                ))}
              </select>
            </div>

            <button
              onClick={applyAdvancedFilters}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Áp dụng
            </button>

            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {loading || analyticsLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải...</p>
          </div>
        ) : viewMode === 'usage' && filteredBudgetUsages.length > 0 ? (
          /* Usage Analytics View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBudgetUsages.map((usage) => (
              <BudgetUsageCard
                key={usage.budgetId}
                budgetUsage={usage}
                onClick={() => {
                  // Use proper React router navigation instead of window.location
                  window.location.href = `/budgets/edit/${usage.budgetId}`;
                }}
                showPeriod={true}
              />
            ))}
          </div>
        ) : viewMode === 'basic' && budgets.length > 0 ? (
          /* Basic Budget View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <div key={budget.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: budget.category.color }}
                    ></div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-50">{budget.category.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getMonthName(budget.budgetMonth)} {budget.budgetYear}
                      </p>
                    </div>
                  </div>
                  {budget.isCurrentMonth && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                      Tháng hiện tại
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex flex-col">
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-50">
                      {formatCurrency(budget.budgetAmount, budget.currencyCode || getCurrency())}
                    </p>
                    {budget.currencyCode && budget.currencyCode !== getCurrency() && budget.budgetAmountInBaseCurrency && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ≈ {formatCurrency(budget.budgetAmountInBaseCurrency, 'VND')}
                      </p>
                    )}
                  </div>
                </div>

                {budget.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{budget.description}</p>
                )}

                <div className="flex justify-between items-center">
                  <Link
                    to={`/budgets/edit/${budget.id}`}
                    className="text-blue-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 font-medium"
                  >
                    Chỉnh sửa
                  </Link>
                  <button
                    onClick={() => handleDeleteBudget(budget.id, budget.category.name)}
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              {viewMode === 'usage'
                ? (budgetUsages.length === 0
                   ? 'Chưa có dữ liệu sử dụng ngân sách'
                   : 'Không tìm thấy ngân sách phù hợp với bộ lọc')
                : (budgets.length === 0
                   ? 'Chưa có ngân sách nào'
                   : 'Không tìm thấy ngân sách phù hợp với bộ lọc')}
            </p>
            <Link
              to="/budgets/add"
              className="bg-blue-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Tạo ngân sách đầu tiên
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetsPage;