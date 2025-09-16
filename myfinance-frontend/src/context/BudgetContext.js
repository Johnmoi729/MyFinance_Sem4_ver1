import React, { createContext, useContext, useState, useEffect } from 'react';
import budgetService from '../services/budgetService';
import { useAuth } from './AuthContext';

const BudgetContext = createContext();

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

export const BudgetProvider = ({ children }) => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [currentMonthBudgets, setCurrentMonthBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBudgets = async (filters = {}) => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      console.log('Fetching budgets with filters:', filters);
      const response = await budgetService.getUserBudgets(filters);
      console.log('Raw budget response:', response);
      setBudgets(response.data.data);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách ngân sách');
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentMonthBudgets = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const response = await budgetService.getCurrentMonthBudgets();
      setCurrentMonthBudgets(response.data.data);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải ngân sách tháng hiện tại');
      console.error('Error fetching current month budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBudgetsForPeriod = async (year, month) => {
    if (!user) return [];

    setLoading(true);
    setError('');

    try {
      const response = await budgetService.getBudgetsForPeriod(year, month);
      return response.data.data;
    } catch (err) {
      setError(err.message || 'Lỗi khi tải ngân sách theo thời gian');
      console.error('Error fetching budgets for period:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (budgetData) => {
    if (!user) {
      console.error('No user available for budget creation');
      return null;
    }

    console.log('Creating budget with data:', budgetData);
    setLoading(true);
    setError('');

    try {
      const response = await budgetService.createBudget(budgetData);
      console.log('Budget service response:', response);
      
      const newBudget = response.data.data;
      console.log('Extracted budget data:', newBudget);
      
      setBudgets(prevBudgets => [newBudget, ...prevBudgets]);
      
      const now = new Date();
      if (newBudget.budgetYear === now.getFullYear() && newBudget.budgetMonth === now.getMonth() + 1) {
        setCurrentMonthBudgets(prevBudgets => [newBudget, ...prevBudgets]);
      }
      
      return newBudget;
    } catch (err) {
      const errorMessage = err.message || 'Lỗi khi tạo ngân sách';
      setError(errorMessage);
      console.error('Error creating budget:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (budgetId, budgetData) => {
    if (!user) return null;

    setLoading(true);
    setError('');

    try {
      const response = await budgetService.updateBudget(budgetId, budgetData);
      const updatedBudget = response.data.data;
      
      setBudgets(prevBudgets => 
        prevBudgets.map(budget => 
          budget.id === budgetId ? updatedBudget : budget
        )
      );
      
      setCurrentMonthBudgets(prevBudgets => 
        prevBudgets.map(budget => 
          budget.id === budgetId ? updatedBudget : budget
        )
      );
      
      return updatedBudget;
    } catch (err) {
      setError(err.message || 'Lỗi khi cập nhật ngân sách');
      console.error('Error updating budget:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBudget = async (budgetId) => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      await budgetService.deleteBudget(budgetId);
      
      setBudgets(prevBudgets => 
        prevBudgets.filter(budget => budget.id !== budgetId)
      );
      
      setCurrentMonthBudgets(prevBudgets => 
        prevBudgets.filter(budget => budget.id !== budgetId)
      );
    } catch (err) {
      setError(err.message || 'Lỗi khi xóa ngân sách');
      console.error('Error deleting budget:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBudgetById = async (budgetId) => {
    if (!user) return null;

    setLoading(true);
    setError('');

    try {
      const response = await budgetService.getBudget(budgetId);
      return response.data.data;
    } catch (err) {
      setError(err.message || 'Lỗi khi tải thông tin ngân sách');
      console.error('Error fetching budget:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError('');
  };

  useEffect(() => {
    if (user) {
      fetchBudgets();
      fetchCurrentMonthBudgets();
    }
  }, [user]); // Remove function dependencies to prevent infinite loop

  const value = {
    budgets,
    currentMonthBudgets,
    loading,
    error,
    fetchBudgets,
    fetchCurrentMonthBudgets,
    getBudgetsForPeriod,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetById,
    clearError,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};