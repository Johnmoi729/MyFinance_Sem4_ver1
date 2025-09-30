import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBudget } from '../../context/BudgetContext';
import { useCategory } from '../../context/CategoryContext';

const EditBudgetPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getBudgetById, updateBudget, loading, error, clearError } = useBudget();
  const { loadCategories, getCategoriesByType } = useCategory();
  
  const [formData, setFormData] = useState({
    categoryId: '',
    budgetAmount: '',
    budgetYear: new Date().getFullYear(),
    budgetMonth: new Date().getMonth() + 1,
    description: ''
  });
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []); // Remove loadCategories dependency to prevent infinite loop

  useEffect(() => {
    const loadBudget = async () => {
      try {
        const budget = await getBudgetById(parseInt(id));
        if (budget) {
          setFormData({
            categoryId: budget.category.id,
            budgetAmount: budget.budgetAmount,
            budgetYear: budget.budgetYear,
            budgetMonth: budget.budgetMonth,
            description: budget.description || ''
          });
        } else {
          navigate('/budgets');
        }
      } catch (err) {
        console.error('Error loading budget:', err);
        navigate('/budgets');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      loadBudget();
    }
  }, [id]); // Remove function dependencies to prevent infinite loop

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

    try {
      await updateBudget(parseInt(id), budgetData);
      navigate('/budgets');
    } catch (err) {
      console.error('Error updating budget:', err);
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

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-6">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Đang tải thông tin ngân sách...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Chỉnh sửa Ngân sách</h1>
          <p className="text-gray-600 mt-2">Cập nhật thông tin ngân sách</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục chi tiêu *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn danh mục</option>
                {getCategoriesByType('EXPENSE').map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền ngân sách *
              </label>
              <input
                type="number"
                name="budgetAmount"
                value={formData.budgetAmount}
                onChange={handleInputChange}
                min="0"
                step="1000"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập số tiền ngân sách"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Năm *
                </label>
                <select
                  name="budgetYear"
                  value={formData.budgetYear}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tháng *
                </label>
                <select
                  name="budgetMonth"
                  value={formData.budgetMonth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>{getMonthName(month)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả ngân sách (tùy chọn)"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật Ngân sách'}
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

export default EditBudgetPage;