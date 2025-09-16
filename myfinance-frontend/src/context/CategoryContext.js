import React, { createContext, useContext, useState } from 'react';
import { categoryAPI } from '../services/api';

const CategoryContext = createContext();

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
};

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load categories
    const loadCategories = async (type = '') => {
        try {
            setLoading(true);
            const response = await categoryAPI.getUserCategories(type);
            
            if (response && response.success) {
                setCategories(response.data || []);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    // Get single category
    const getCategory = async (id) => {
        try {
            const response = await categoryAPI.getCategory(id);
            
            if (response && response.success) {
                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Failed to get category:', error);
            return { success: false, message: 'Đã xảy ra lỗi khi tải danh mục' };
        }
    };

    // Add new category
    const addCategory = async (categoryData) => {
        try {
            setLoading(true);
            const response = await categoryAPI.addCategory(categoryData);
            
            if (response && response.success) {
                // Refresh categories
                await loadCategories();
                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Failed to add category:', error);
            return { success: false, message: 'Đã xảy ra lỗi khi thêm danh mục' };
        } finally {
            setLoading(false);
        }
    };

    // Update category
    const updateCategory = async (id, categoryData) => {
        try {
            setLoading(true);
            const response = await categoryAPI.updateCategory(id, categoryData);
            
            if (response && response.success) {
                // Refresh categories
                await loadCategories();
                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Failed to update category:', error);
            return { success: false, message: 'Đã xảy ra lỗi khi cập nhật danh mục' };
        } finally {
            setLoading(false);
        }
    };

    // Delete category
    const deleteCategory = async (id) => {
        try {
            setLoading(true);
            const response = await categoryAPI.deleteCategory(id);
            
            if (response && response.success) {
                // Refresh categories
                await loadCategories();
                return { success: true };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Failed to delete category:', error);
            return { success: false, message: 'Đã xảy ra lỗi khi xóa danh mục' };
        } finally {
            setLoading(false);
        }
    };

    // Get categories by type
    const getCategoriesByType = (type) => {
        return categories.filter(category => category.type === type);
    };

    const value = {
        categories,
        loading,
        loadCategories,
        getCategory,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoriesByType
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};