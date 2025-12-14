import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { preferencesAPI } from '../services/api';
import { useAuth } from './AuthContext';

const PreferencesContext = createContext();

export const usePreferences = () => {
 const context = useContext(PreferencesContext);
 if (!context) {
 throw new Error('usePreferences must be used within a PreferencesProvider');
 }
 return context;
};

export const PreferencesProvider = ({ children }) => {
 const { user } = useAuth();
 const [preferences, setPreferences] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');

 // Load preferences only when user is authenticated
 useEffect(() => {
 if (user) {
 loadPreferences();
 } else {
 // Use default preferences for non-authenticated users
 setPreferences(getDefaultPreferences());
 setLoading(false);
 }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [user]);

 const loadPreferences = async () => {
 try {
 setLoading(true);
 setError('');

 const response = await preferencesAPI.getPreferences();

 if (response && response.success) {
 setPreferences(response.data);
 } else {
 // If preferences don't exist, use defaults
 setPreferences(getDefaultPreferences());
 setError(response.message || 'Không thể tải cài đặt người dùng');
 }
 } catch (err) {
 console.error('Failed to load preferences:', err);
 setPreferences(getDefaultPreferences());
 setError('Đã xảy ra lỗi khi tải cài đặt');
 } finally {
 setLoading(false);
 }
 };

 const updatePreferences = async (newPreferences) => {
 try {
 setError('');

 const response = await preferencesAPI.updatePreferences(newPreferences);

 if (response && response.success) {
 setPreferences(response.data);
 return { success: true, message: 'Cập nhật cài đặt thành công' };
 } else {
 setError(response.message || 'Không thể cập nhật cài đặt');
 return { success: false, message: response.message };
 }
 } catch (err) {
 console.error('Failed to update preferences:', err);
 setError('Đã xảy ra lỗi khi cập nhật cài đặt');
 return { success: false, message: 'Đã xảy ra lỗi khi cập nhật cài đặt' };
 }
 };

 const updatePreference = async (key, value) => {
 try {
 setError('');

 const updatedPreferences = {
 ...preferences,
 [key]: value
 };

 // Optimistically update UI
 setPreferences(updatedPreferences);

 const response = await preferencesAPI.updatePreferences(updatedPreferences);

 if (response && response.success) {
 setPreferences(response.data);
 return { success: true, message: 'Cập nhật cài đặt thành công' };
 } else {
 // Revert on error
 setPreferences(preferences);
 setError(response.message || 'Không thể cập nhật cài đặt');
 return { success: false, message: response.message };
 }
 } catch (err) {
 console.error('Failed to update preference:', err);
 // Revert on error
 setPreferences(preferences);
 setError('Đã xảy ra lỗi khi cập nhật cài đặt');
 return { success: false, message: 'Đã xảy ra lỗi khi cập nhật cài đặt' };
 }
 };

 const resetToDefaults = async () => {
 try {
 setError('');

 const response = await preferencesAPI.resetToDefaults();

 if (response && response.success) {
 setPreferences(response.data);
 return { success: true, message: 'Đã khôi phục cài đặt mặc định' };
 } else {
 setError(response.message || 'Không thể khôi phục cài đặt');
 return { success: false, message: response.message };
 }
 } catch (err) {
 console.error('Failed to reset preferences:', err);
 setError('Đã xảy ra lỗi khi khôi phục cài đặt');
 return { success: false, message: 'Đã xảy ra lỗi khi khôi phục cài đặt' };
 }
 };

 const clearError = () => {
 setError('');
 };

 // Default preferences (used when API fails or user has no preferences)
 const getDefaultPreferences = () => ({
 // Display Preferences (1 field)
 viewMode: 'usage',

 // Notification Preferences (2 fields)
 emailNotifications: true,
 budgetAlerts: true
 });

 // Display Preference Helpers
 const getViewMode = () => preferences?.viewMode || 'usage';

 // Notification Preference Helpers
 const getEmailNotifications = () => preferences?.emailNotifications ?? true;
 const getBudgetAlerts = () => preferences?.budgetAlerts ?? true;

 // Check if any notification type is enabled
 const isNotificationEnabled = (type) => {
 // Master switch - if emailNotifications is false, all notifications are disabled
 if (!getEmailNotifications()) {
 return false;
 }

 // Check specific notification type
 switch (type) {
 case 'budgetAlerts':
 return getBudgetAlerts();
 default:
 return false;
 }
 };

 const value = {
 // State
 preferences,
 loading,
 error,

 // Actions
 loadPreferences,
 updatePreferences,
 updatePreference,
 resetToDefaults,
 clearError,

 // Display Preference Getters
 getViewMode,

 // Notification Preference Getters
 getEmailNotifications,
 getBudgetAlerts,

 // Helper Functions
 isNotificationEnabled,
 getDefaultPreferences
 };

 // Show loading spinner while fetching preferences
 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-screen bg-gray-50">
 <div className="text-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
 <p className="text-gray-600">Đang tải cài đặt...</p>
 </div>
 </div>
 );
 }

 return (
 <PreferencesContext.Provider value={value}>
 {children}
 </PreferencesContext.Provider>
 );
};
