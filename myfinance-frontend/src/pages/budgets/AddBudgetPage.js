import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../../context/BudgetContext';
import { useCategory } from '../../context/CategoryContext';

const AddBudgetPage = () => {
  const navigate = useNavigate();
  const { createBudget, loading, error, clearError } = useBudget();
  const { loadCategories, getCategoriesByType } = useCategory();

  const [formData, setFormData] = useState({
    categoryId: '',
    budgetAmount: '',
    budgetYear: new Date().getFullYear(),
    budgetMonth: new Date().getMonth() + 1,
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []); // Remove loadCategories dependency to prevent infinite loop

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const budgetData = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
      budgetAmount: parseFloat(formData.budgetAmount),
      budgetYear: parseInt(formData.budgetYear),
      budgetMonth: parseInt(formData.budgetMonth)
    };

    console.log('Submitting budget data:', budgetData);

    try {
      const result = await createBudget(budgetData);
      console.log('Budget created successfully:', result);
      navigate('/budgets');
    } catch (err) {
      console.error('Error creating budget:', err);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50">Thêm Ngân sách</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Tạo ngân sách mới cho danh mục chi tiêu</p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Danh mục chi tiêu *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Chọn danh mục</option>
                {getCategoriesByType('EXPENSE').map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số tiền ngân sách (VND) *
              </label>
              <input
                type="number"
                name="budgetAmount"
                value={formData.budgetAmount}
                onChange={handleInputChange}
                min="0"
                step="1000"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập số tiền ngân sách"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Năm *
                </label>
                <select
                  name="budgetYear"
                  value={formData.budgetYear}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tháng *
                </label>
                <select
                  name="budgetMonth"
                  value={formData.budgetMonth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>{getMonthName(month)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Mô tả ngân sách (tùy chọn)"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                {loading ? 'Đang tạo...' : 'Tạo Ngân sách'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/budgets')}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
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

export default AddBudgetPage;