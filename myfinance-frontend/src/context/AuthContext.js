import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is logged in on app start
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setLoading(false);
                return;
            }

            // Verify token with backend
            const response = await userAPI.verifyToken();
            if (response && response.success && response.data) {
                // Get user profile
                const profileResponse = await userAPI.getProfile();
                if (profileResponse && profileResponse.success) {
                    setUser(profileResponse.data);
                    setIsAuthenticated(true);
                } else {
                    logout();
                }
            } else {
                logout();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await userAPI.login(credentials);

            if (response && response.success) {
                const { token, ...userData } = response.data;

                // Store token
                localStorage.setItem('authToken', token);

                // Set user data
                setUser(userData);
                setIsAuthenticated(true);

                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, message: 'Đã xảy ra lỗi khi đăng nhập' };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await userAPI.register(userData);

            if (response && response.success) {
                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Registration failed:', error);
            return { success: false, message: 'Đã xảy ra lỗi khi đăng ký' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await userAPI.updateProfile(profileData);

            if (response && response.success) {
                setUser(response.data);
                return { success: true, data: response.data };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Profile update failed:', error);
            return { success: false, message: 'Đã xảy ra lỗi khi cập nhật hồ sơ' };
        }
    };

    const changePassword = async (passwordData) => {
        try {
            const response = await userAPI.changePassword(passwordData);

            if (response && response.success) {
                return { success: true };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Password change failed:', error);
            return { success: false, message: 'Đã xảy ra lỗi khi đổi mật khẩu' };
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};