import React from 'react';
import { Sun, Moon } from '../../components/icons';
import { usePreferences } from '../../context/PreferencesContext';

const ThemeToggle = () => {
    const { preferences, updatePreference, loading } = usePreferences();

    const handleToggle = async () => {
        const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
        await updatePreference('theme', newTheme);
    };

    if (loading) {
        return (
            <div className="w-10 h-10 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <button
            onClick={handleToggle}
            className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            title={preferences.theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
            aria-label={preferences.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
            {preferences.theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
            )}
        </button>
    );
};

export default ThemeToggle;
