import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { budgetAPI } from '../services/api';
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
 const [budgetUsages, setBudgetUsages] = useState([]);
 const [budgetWarnings, setBudgetWarnings] = useState(null);
 const [budgetDashboard, setBudgetDashboard] = useState(null);
 const [loading, setLoading] = useState(false);
 const [analyticsLoading, setAnalyticsLoading] = useState(false);
 const [error, setError] = useState('');

 const fetchBudgets = useCallback(async (filters = {}) => {
 if (!user) return;

 setLoading(true);
 setError('');

 try {
 console.log('Fetching budgets with filters:', filters);
 const response = await budgetAPI.getUserBudgets(filters);
 console.log('Raw budget response:', response);
 if (response && response.success) {
 setBudgets(response.data || []);
 } else {
 setBudgets([]);
 setError(response.message || 'Lỗi khi tải danh sách ngân sách');
 }
 } catch (err) {
 setError(err.message || 'Lỗi khi tải danh sách ngân sách');
 console.error('Error fetching budgets:', err);
 setBudgets([]);
 } finally {
 setLoading(false);
 }
 }, [user]);

 const fetchCurrentMonthBudgets = useCallback(async () => {
 if (!user) return;

 setLoading(true);
 setError('');

 try {
 const response = await budgetAPI.getCurrentMonthBudgets();
 if (response && response.success) {
 setCurrentMonthBudgets(response.data || []);
 } else {
 setCurrentMonthBudgets([]);
 setError(response.message || 'Lỗi khi tải ngân sách tháng hiện tại');
 }
 } catch (err) {
 setError(err.message || 'Lỗi khi tải ngân sách tháng hiện tại');
 console.error('Error fetching current month budgets:', err);
 setCurrentMonthBudgets([]);
 } finally {
 setLoading(false);
 }
 }, [user]);

 const getBudgetsForPeriod = useCallback(async (year, month) => {
 if (!user) return [];

 setLoading(true);
 setError('');

 try {
 const response = await budgetAPI.getBudgetsForPeriod(year, month);
 if (response && response.success) {
 return response.data || [];
 } else {
 setError(response.message || 'Lỗi khi tải ngân sách theo thời gian');
 return [];
 }
 } catch (err) {
 setError(err.message || 'Lỗi khi tải ngân sách theo thời gian');
 console.error('Error fetching budgets for period:', err);
 return [];
 } finally {
 setLoading(false);
 }
 }, [user]);

 const createBudget = useCallback(async (budgetData) => {
 if (!user) {
 console.error('No user available for budget creation');
 return null;
 }

 console.log('Creating budget with data:', budgetData);
 setLoading(true);
 setError('');

 try {
 const response = await budgetAPI.createBudget(budgetData);
 console.log('Budget API response:', response);

 if (response && response.success) {
 const newBudget = response.data;
 console.log('Extracted budget data:', newBudget);

 setBudgets(prevBudgets => [newBudget, ...prevBudgets]);

 const now = new Date();
 if (newBudget.budgetYear === now.getFullYear() && newBudget.budgetMonth === now.getMonth() + 1) {
 setCurrentMonthBudgets(prevBudgets => [newBudget, ...prevBudgets]);
 }

 return newBudget;
 } else {
 const errorMessage = response.message || 'Lỗi khi tạo ngân sách';
 setError(errorMessage);
 throw new Error(errorMessage);
 }
 } catch (err) {
 const errorMessage = err.message || 'Lỗi khi tạo ngân sách';
 setError(errorMessage);
 console.error('Error creating budget:', err);
 throw err;
 } finally {
 setLoading(false);
 }
 }, [user]);

 const updateBudget = useCallback(async (budgetId, budgetData) => {
 if (!user) return null;

 setLoading(true);
 setError('');

 try {
 const response = await budgetAPI.updateBudget(budgetId, budgetData);

 if (response && response.success) {
 const updatedBudget = response.data;

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
 } else {
 const errorMessage = response.message || 'Lỗi khi cập nhật ngân sách';
 setError(errorMessage);
 throw new Error(errorMessage);
 }
 } catch (err) {
 setError(err.message || 'Lỗi khi cập nhật ngân sách');
 console.error('Error updating budget:', err);
 throw err;
 } finally {
 setLoading(false);
 }
 }, [user]);

 const deleteBudget = useCallback(async (budgetId) => {
 if (!user) return;

 setLoading(true);
 setError('');

 try {
 const response = await budgetAPI.deleteBudget(budgetId);

 if (response && response.success) {
 setBudgets(prevBudgets =>
 prevBudgets.filter(budget => budget.id !== budgetId)
 );

 setCurrentMonthBudgets(prevBudgets =>
 prevBudgets.filter(budget => budget.id !== budgetId)
 );
 } else {
 const errorMessage = response.message || 'Lỗi khi xóa ngân sách';
 setError(errorMessage);
 throw new Error(errorMessage);
 }
 } catch (err) {
 setError(err.message || 'Lỗi khi xóa ngân sách');
 console.error('Error deleting budget:', err);
 throw err;
 } finally {
 setLoading(false);
 }
 }, [user]);

 const getBudgetById = useCallback(async (budgetId) => {
 if (!user) return null;

 setLoading(true);
 setError('');

 try {
 const response = await budgetAPI.getBudget(budgetId);
 if (response && response.success) {
 return response.data;
 } else {
 setError(response.message || 'Lỗi khi tải thông tin ngân sách');
 return null;
 }
 } catch (err) {
 setError(err.message || 'Lỗi khi tải thông tin ngân sách');
 console.error('Error fetching budget:', err);
 return null;
 } finally {
 setLoading(false);
 }
 }, [user]);

 const clearError = useCallback(() => {
 setError('');
 }, []);

 // ===== BUDGET ANALYTICS METHODS =====

 const refreshBudgetAnalytics = useCallback(async () => {
 if (!user) return;

 setAnalyticsLoading(true);
 try {
 const [usageResponse, warningsResponse, dashboardResponse] = await Promise.all([
 budgetAPI.getCurrentMonthBudgetUsage(),
 budgetAPI.getBudgetWarnings(),
 budgetAPI.getBudgetDashboard()
 ]);

 if (usageResponse && usageResponse.success) {
 setBudgetUsages(usageResponse.data || []);
 }

 if (warningsResponse && warningsResponse.success) {
 setBudgetWarnings(warningsResponse.data);
 }

 if (dashboardResponse && dashboardResponse.success) {
 setBudgetDashboard(dashboardResponse.data);
 }
 } catch (err) {
 console.error('Error refreshing budget analytics:', err);
 // Don't set error state for analytics - it's not critical
 } finally {
 setAnalyticsLoading(false);
 }
 }, [user]);

 const refreshBudgetUsage = useCallback(async () => {
 if (!user) return;

 try {
 const response = await budgetAPI.getCurrentMonthBudgetUsage();
 if (response && response.success) {
 setBudgetUsages(response.data || []);
 }
 } catch (err) {
 console.error('Error refreshing budget usage:', err);
 }
 }, [user]);

 const refreshBudgetWarnings = useCallback(async () => {
 if (!user) return;

 try {
 const response = await budgetAPI.getBudgetWarnings();
 if (response && response.success) {
 setBudgetWarnings(response.data);
 }
 } catch (err) {
 console.error('Error refreshing budget warnings:', err);
 }
 }, [user]);

 const refreshBudgetDashboard = useCallback(async () => {
 if (!user) return;

 try {
 const response = await budgetAPI.getBudgetDashboard();
 if (response && response.success) {
 setBudgetDashboard(response.data);
 }
 } catch (err) {
 console.error('Error refreshing budget dashboard:', err);
 }
 }, [user]);

 // Method to refresh all budget data when transactions change
 const refreshAllBudgetData = useCallback(async () => {
 if (!user) return;

 // Refresh both basic budgets and analytics in parallel
 await Promise.all([
 fetchBudgets(),
 fetchCurrentMonthBudgets(),
 refreshBudgetAnalytics()
 ]);
 }, [user]); // Only depend on user to prevent recreation loops

 useEffect(() => {
 if (user) {
 fetchBudgets();
 fetchCurrentMonthBudgets();
 refreshBudgetAnalytics();
 }
 }, [user]); // Remove function dependencies to prevent infinite loop

 const value = {
 budgets,
 currentMonthBudgets,
 budgetUsages,
 budgetWarnings,
 budgetDashboard,
 loading,
 analyticsLoading,
 error,
 fetchBudgets,
 fetchCurrentMonthBudgets,
 getBudgetsForPeriod,
 createBudget,
 updateBudget,
 deleteBudget,
 getBudgetById,
 clearError,
 refreshBudgetAnalytics,
 refreshBudgetUsage,
 refreshBudgetWarnings,
 refreshBudgetDashboard,
 refreshAllBudgetData,
 };

 return (
 <BudgetContext.Provider value={value}>
 {children}
 </BudgetContext.Provider>
 );
};