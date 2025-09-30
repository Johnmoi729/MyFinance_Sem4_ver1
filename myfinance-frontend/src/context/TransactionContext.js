import React, { createContext, useContext, useState } from 'react';
import { transactionAPI } from '../services/api';

const TransactionContext = createContext();

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransaction must be used within a TransactionProvider');
    }
    return context;
};

export const TransactionProvider = ({ children, onBudgetRefreshNeeded }) => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentTransactions, setRecentTransactions] = useState([]);

    // Helper function to trigger budget refresh if callback provided
    const triggerBudgetRefresh = async () => {
        if (onBudgetRefreshNeeded && typeof onBudgetRefreshNeeded === 'function') {
            try {
                await onBudgetRefreshNeeded();
            } catch (error) {
                console.error('Error refreshing budget data:', error);
            }
        }
    };

    // Load transactions
    const loadTransactions = async (type = '') => {
        try {
            setLoading(true);
            const response = await transactionAPI.getUserTransactions(type);
            
            if (response && response.success) {
                setTransactions(response.data || []);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error('Failed to load transactions:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    // Load recent transactions
    const loadRecentTransactions = async () => {
        try {
            const response = await transactionAPI.getRecentTransactions();
            
            if (response && response.success) {
                setRecentTransactions(response.data || []);
            } else {
                setRecentTransactions([]);
            }
        } catch (error) {
            console.error('Failed to load recent transactions:', error);
            setRecentTransactions([]);
        }
    };

    // Load categories
    const loadCategories = async (type = '') => {
        try {
            const response = await transactionAPI.getCategories(type);
            
            if (response && response.success) {
                setCategories(response.data || []);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
            setCategories([]);
        }
    };

    // Get single transaction
    const getTransaction = async (id) => {
        try {
            const response = await transactionAPI.getTransaction(id);
            
            if (response && response.success) {
                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Failed to get transaction:', error);
            return { success: false, message: 'Đã xảy ra lỗi khi tải giao dịch' };
        }
    };

    // Add new transaction
    const addTransaction = async (transactionData) => {
        try {
            setLoading(true);
            const response = await transactionAPI.addTransaction(transactionData);

            if (response && response.success) {
                // Refresh transactions and recent transactions
                await Promise.all([
                    loadTransactions(),
                    loadRecentTransactions()
                ]);

                // Trigger budget refresh for expense transactions
                if (transactionData.type === 'EXPENSE') {
                    await triggerBudgetRefresh();
                }

                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Failed to add transaction:', error);
            return { success: false, message: 'Đã xảy ra lỗi khi thêm giao dịch' };
        } finally {
            setLoading(false);
        }
    };

    // Update transaction
    const updateTransaction = async (id, transactionData) => {
        try {
            setLoading(true);
            const response = await transactionAPI.updateTransaction(id, transactionData);

            if (response && response.success) {
                // Refresh transactions and recent transactions
                await Promise.all([
                    loadTransactions(),
                    loadRecentTransactions()
                ]);

                // Always trigger budget refresh for updates (could affect existing budget calculations)
                await triggerBudgetRefresh();

                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Failed to update transaction:', error);
            return { success: false, message: 'Đã xảy ra lỗi khi cập nhật giao dịch' };
        } finally {
            setLoading(false);
        }
    };

    // Delete transaction
    const deleteTransaction = async (id) => {
        try {
            setLoading(true);
            const response = await transactionAPI.deleteTransaction(id);

            if (response && response.success) {
                // Refresh transactions and recent transactions
                await Promise.all([
                    loadTransactions(),
                    loadRecentTransactions()
                ]);

                // Always trigger budget refresh for deletions (affects budget calculations)
                await triggerBudgetRefresh();

                return { success: true };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Failed to delete transaction:', error);
            return { success: false, message: 'Đã xảy ra lỗi khi xóa giao dịch' };
        } finally {
            setLoading(false);
        }
    };

    // Get transactions by type
    const getTransactionsByType = (type) => {
        return transactions.filter(transaction => transaction.type === type);
    };

    // Calculate total income
    const getTotalIncome = () => {
        return transactions
            .filter(transaction => transaction.type === 'INCOME')
            .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
    };

    // Calculate total expenses
    const getTotalExpenses = () => {
        return transactions
            .filter(transaction => transaction.type === 'EXPENSE')
            .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
    };

    // Calculate balance
    const getBalance = () => {
        return getTotalIncome() - getTotalExpenses();
    };

    // Get categories by type
    const getCategoriesByType = (type) => {
        return categories.filter(category => category.type === type);
    };

    // Search transactions
    const searchTransactions = async (searchTerm) => {
        try {
            setLoading(true);
            const response = await transactionAPI.searchTransactions(searchTerm);
            
            if (response && response.success) {
                setTransactions(response.data || []);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error('Failed to search transactions:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    // Load transactions with filters
    const loadTransactionsWithFilters = async (filters) => {
        try {
            setLoading(true);
            const response = await transactionAPI.getTransactionsWithFilters(filters);
            
            if (response && response.success) {
                setTransactions(response.data || []);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error('Failed to load filtered transactions:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    // Refresh all data
    const refreshData = async () => {
        await Promise.all([
            loadTransactions(),
            loadRecentTransactions(),
            loadCategories()
        ]);
    };

    const value = {
        transactions,
        recentTransactions,
        categories,
        loading,
        loadTransactions,
        loadRecentTransactions,
        loadCategories,
        getTransaction,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        searchTransactions,
        loadTransactionsWithFilters,
        getTransactionsByType,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
        getCategoriesByType,
        refreshData
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};