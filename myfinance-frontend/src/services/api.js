const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Get auth token from localStorage
    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    // Set auth token to localStorage
    setAuthToken(token) {
        localStorage.setItem('authToken', token);
    }

    // Remove auth token from localStorage
    removeAuthToken() {
        localStorage.removeItem('authToken');
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getAuthToken();
        if (!token) return false;

        try {
            // Decode JWT token (simple base64 decode for payload)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;

            // Check if token is expired
            return payload.exp > currentTime;
        } catch (error) {
            console.error('Error checking token validity:', error);
            return false;
        }
    }

    // Get request headers with auth token
    getHeaders(includeContentType = true) {
        const headers = {};

        if (includeContentType) {
            headers['Content-Type'] = 'application/json';
        }

        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);

            // Handle different response types
            if (response.status === 401) {
                this.removeAuthToken();
                window.location.href = '/login';
                return null;
            }

            if (response.status === 204) {
                // No content response
                return { success: true };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request error:', error);
            return {
                success: false,
                message: 'Lỗi kết nối mạng'
            };
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET',
        });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }
}

// Authentication API methods
class UserAPI extends ApiService {
    // Login
    async login(credentials) {
        try {
            const response = await this.post('/api/auth/login', credentials);
            if (response && response.success) {
                this.setAuthToken(response.data.token);
            }
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi đăng nhập'
            };
        }
    }

    // Register
    async register(userData) {
        try {
            const response = await this.post('/api/auth/register', userData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Đã xảy ra lỗi khi đăng ký'
            };
        }
    }

    // Get user profile
    async getProfile() {
        try {
            const response = await this.get('/api/auth/profile');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải thông tin hồ sơ'
            };
        }
    }

    // Update profile
    async updateProfile(userData) {
        try {
            const response = await this.put('/api/auth/profile', userData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể cập nhật hồ sơ'
            };
        }
    }

    // Change password
    async changePassword(passwordData) {
        try {
            const response = await this.post('/api/auth/change-password', passwordData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể đổi mật khẩu'
            };
        }
    }

    // Forgot password
    async forgotPassword(email) {
        try {
            const response = await this.post('/api/auth/forgot-password', { email });
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể gửi email đặt lại mật khẩu'
            };
        }
    }

    // Reset password
    async resetPassword(resetData) {
        try {
            const response = await this.post('/api/auth/reset-password', resetData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể đặt lại mật khẩu'
            };
        }
    }

    // Verify token
    async verifyToken() {
        try {
            const response = await this.post('/api/auth/verify-token');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Token không hợp lệ'
            };
        }
    }

    // Refresh token
    async refreshToken() {
        try {
            const response = await this.post('/api/auth/refresh-token');
            if (response && response.success) {
                this.setAuthToken(response.data.token);
            }
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể làm mới token'
            };
        }
    }

    // Logout
    logout() {
        this.removeAuthToken();
    }
}

// Transaction API methods
class TransactionAPI extends ApiService {
    // Add new transaction
    async addTransaction(transactionData) {
        try {
            const response = await this.post('/api/transactions/add', transactionData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể thêm giao dịch'
            };
        }
    }

    // Get transaction by ID
    async getTransaction(id) {
        try {
            const response = await this.get(`/api/transactions/${id}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải giao dịch'
            };
        }
    }

    // Get user transactions
    async getUserTransactions(type = '') {
        try {
            const typeParam = type ? `?type=${type}` : '';
            const response = await this.get(`/api/transactions${typeParam}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải danh sách giao dịch',
                data: []
            };
        }
    }

    // Get recent transactions
    async getRecentTransactions() {
        try {
            const response = await this.get('/api/transactions/recent');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải giao dịch gần đây',
                data: []
            };
        }
    }

    // Update transaction
    async updateTransaction(id, transactionData) {
        try {
            const response = await this.put(`/api/transactions/${id}`, transactionData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể cập nhật giao dịch'
            };
        }
    }

    // Delete transaction
    async deleteTransaction(id) {
        try {
            const response = await this.delete(`/api/transactions/${id}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể xóa giao dịch'
            };
        }
    }

    // Get categories
    async getCategories(type = '') {
        try {
            const typeParam = type ? `?type=${type}` : '';
            const response = await this.get(`/api/transactions/categories${typeParam}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải danh mục',
                data: []
            };
        }
    }

    // Search transactions
    async searchTransactions(searchTerm) {
        try {
            const response = await this.get(`/api/transactions/search?searchTerm=${encodeURIComponent(searchTerm)}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tìm kiếm giao dịch',
                data: []
            };
        }
    }

    // Get transactions with filters
    async getTransactionsWithFilters(filters = {}) {
        try {
            const params = new URLSearchParams();
            
            if (filters.type) params.append('type', filters.type);
            if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
            
            const queryString = params.toString();
            const url = queryString ? `/api/transactions/filter?${queryString}` : '/api/transactions/filter';
            
            const response = await this.get(url);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải giao dịch với bộ lọc',
                data: []
            };
        }
    }
}

// Category API methods
class CategoryAPI extends ApiService {
    // Add new category
    async addCategory(categoryData) {
        try {
            const response = await this.post('/api/categories', categoryData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể thêm danh mục'
            };
        }
    }

    // Get category by ID
    async getCategory(id) {
        try {
            const response = await this.get(`/api/categories/${id}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải danh mục'
            };
        }
    }

    // Get user categories
    async getUserCategories(type = '') {
        try {
            const typeParam = type ? `?type=${type}` : '';
            const response = await this.get(`/api/categories${typeParam}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải danh sách danh mục',
                data: []
            };
        }
    }

    // Update category
    async updateCategory(id, categoryData) {
        try {
            const response = await this.put(`/api/categories/${id}`, categoryData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể cập nhật danh mục'
            };
        }
    }

    // Delete category
    async deleteCategory(id) {
        try {
            const response = await this.delete(`/api/categories/${id}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể xóa danh mục'
            };
        }
    }
}

// Budget API methods
class BudgetAPI extends ApiService {
    // Create new budget
    async createBudget(budgetData) {
        try {
            const response = await this.post('/api/budgets', budgetData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tạo ngân sách'
            };
        }
    }

    // Get budget by ID
    async getBudget(budgetId) {
        try {
            const response = await this.get(`/api/budgets/${budgetId}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải thông tin ngân sách'
            };
        }
    }

    // Get user budgets with filters
    async getUserBudgets(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.year) params.append('year', filters.year);
            if (filters.month) params.append('month', filters.month);
            if (filters.categoryId) params.append('categoryId', filters.categoryId);

            const queryString = params.toString();
            const url = queryString ? `/api/budgets?${queryString}` : '/api/budgets';
            const response = await this.get(url);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải danh sách ngân sách',
                data: []
            };
        }
    }

    // Get current month budgets
    async getCurrentMonthBudgets() {
        try {
            const response = await this.get('/api/budgets/current');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải ngân sách tháng hiện tại',
                data: []
            };
        }
    }

    // Get budgets for specific period
    async getBudgetsForPeriod(year, month) {
        try {
            const response = await this.get(`/api/budgets/period/${year}/${month}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải ngân sách theo thời gian',
                data: []
            };
        }
    }

    // Update budget
    async updateBudget(budgetId, budgetData) {
        try {
            const response = await this.put(`/api/budgets/${budgetId}`, budgetData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể cập nhật ngân sách'
            };
        }
    }

    // Delete budget
    async deleteBudget(budgetId) {
        try {
            const response = await this.delete(`/api/budgets/${budgetId}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể xóa ngân sách'
            };
        }
    }

    // ===== BUDGET ANALYTICS METHODS =====

    // Get budget usage analytics
    async getBudgetUsageAnalytics() {
        try {
            const response = await this.get('/api/budgets/analytics/usage');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải thống kê sử dụng ngân sách',
                data: []
            };
        }
    }

    // Get current month budget usage
    async getCurrentMonthBudgetUsage() {
        try {
            const response = await this.get('/api/budgets/analytics/usage/current');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải thống kê sử dụng ngân sách tháng hiện tại',
                data: []
            };
        }
    }

    // Get budget warnings
    async getBudgetWarnings() {
        try {
            const response = await this.get('/api/budgets/analytics/warnings');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải cảnh báo ngân sách',
                data: null
            };
        }
    }

    // Get budget performance
    async getBudgetPerformance() {
        try {
            const response = await this.get('/api/budgets/analytics/performance');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải hiệu suất ngân sách',
                data: null
            };
        }
    }

    // Get budget dashboard
    async getBudgetDashboard() {
        try {
            const response = await this.get('/api/budgets/analytics/dashboard');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải tổng quan ngân sách',
                data: null
            };
        }
    }
}

// Admin API methods
class AdminAPI extends ApiService {
    // Admin Dashboard
    async getDashboard() {
        try {
            const response = await this.get('/api/admin/dashboard');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải dashboard admin'
            };
        }
    }

    // User Management
    async getUsers(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.page !== undefined) queryParams.append('page', params.page);
            if (params.size !== undefined) queryParams.append('size', params.size);
            if (params.sortBy) queryParams.append('sortBy', params.sortBy);
            if (params.sortDir) queryParams.append('sortDir', params.sortDir);
            if (params.search) queryParams.append('search', params.search);
            if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);

            const queryString = queryParams.toString();
            const url = queryString ? `/api/admin/users?${queryString}` : '/api/admin/users';

            const response = await this.get(url);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải danh sách người dùng'
            };
        }
    }

    async updateUserStatus(userId, statusData) {
        try {
            const response = await this.put(`/api/admin/users/${userId}/status`, statusData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể cập nhật trạng thái người dùng'
            };
        }
    }

    // System Configuration
    async getConfigs(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.page !== undefined) queryParams.append('page', params.page);
            if (params.size !== undefined) queryParams.append('size', params.size);
            if (params.type) queryParams.append('type', params.type);
            if (params.isPublic !== undefined) queryParams.append('isPublic', params.isPublic);

            const queryString = queryParams.toString();
            const url = queryString ? `/api/admin/config?${queryString}` : '/api/admin/config';

            const response = await this.get(url);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải cấu hình hệ thống'
            };
        }
    }

    // Audit Logs
    async getAuditLogs(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.page !== undefined) queryParams.append('page', params.page);
            if (params.size !== undefined) queryParams.append('size', params.size);
            if (params.sortBy) queryParams.append('sortBy', params.sortBy);
            if (params.sortDir) queryParams.append('sortDir', params.sortDir);
            if (params.userId) queryParams.append('userId', params.userId);
            if (params.adminUserId) queryParams.append('adminUserId', params.adminUserId);
            if (params.action) queryParams.append('action', params.action);
            if (params.entityType) queryParams.append('entityType', params.entityType);
            if (params.startDate) queryParams.append('startDate', params.startDate);
            if (params.endDate) queryParams.append('endDate', params.endDate);

            const queryString = queryParams.toString();
            const url = queryString ? `/api/admin/audit?${queryString}` : '/api/admin/audit';

            const response = await this.get(url);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải nhật ký audit'
            };
        }
    }

    // System Configuration CRUD
    async createConfig(configData) {
        try {
            const response = await this.post('/api/admin/config', configData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tạo cấu hình mới'
            };
        }
    }

    async updateConfig(configId, configData) {
        try {
            const response = await this.put(`/api/admin/config/${configId}`, configData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể cập nhật cấu hình'
            };
        }
    }

    async deleteConfig(configId) {
        try {
            const response = await this.delete(`/api/admin/config/${configId}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể xóa cấu hình'
            };
        }
    }

    // Financial Analytics
    async getFinancialAnalytics(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.timeFrame) queryParams.append('timeFrame', params.timeFrame);
            if (params.year) queryParams.append('year', params.year);
            if (params.month) queryParams.append('month', params.month);
            if (params.quarter) queryParams.append('quarter', params.quarter);

            const queryString = queryParams.toString();
            const url = queryString ? `/api/admin/analytics?${queryString}` : '/api/admin/analytics';

            const response = await this.get(url);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải dữ liệu phân tích tài chính'
            };
        }
    }

    // Migration methods
    async migrateSystemConfigEnum() {
        try {
            const response = await this.post('/api/admin/migration/system-config-enum', {});
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể thực hiện migration enum values'
            };
        }
    }

    async checkSystemConfigEnumMigration() {
        try {
            const response = await this.get('/api/admin/migration/system-config-enum/check');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể kiểm tra trạng thái migration'
            };
        }
    }
}

// Budget Settings API methods
class BudgetSettingsAPI extends ApiService {
    // Get budget settings
    async getBudgetSettings() {
        try {
            const response = await this.get('/api/budget-settings');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải cài đặt ngân sách'
            };
        }
    }

    // Update budget settings
    async updateBudgetSettings(settingsData) {
        try {
            const response = await this.put('/api/budget-settings', settingsData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể cập nhật cài đặt ngân sách'
            };
        }
    }

    // Reset budget settings
    async resetBudgetSettings() {
        try {
            const response = await this.post('/api/budget-settings/reset', {});
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể đặt lại cài đặt ngân sách'
            };
        }
    }
}

// Report API methods
class ReportAPI extends ApiService {
    // Get monthly report
    async getMonthlyReport(year, month) {
        try {
            const response = await this.get(`/api/reports/monthly?year=${year}&month=${month}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải báo cáo tháng'
            };
        }
    }

    // Get yearly report
    async getYearlyReport(year) {
        try {
            const response = await this.get(`/api/reports/yearly?year=${year}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải báo cáo năm'
            };
        }
    }

    // Get category report
    async getCategoryReport(categoryId, startDate, endDate) {
        try {
            const response = await this.get(`/api/reports/category/${categoryId}?startDate=${startDate}&endDate=${endDate}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải báo cáo danh mục'
            };
        }
    }

    // Get current month report
    async getCurrentMonthReport() {
        try {
            const response = await this.get('/api/reports/current-month');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải báo cáo tháng hiện tại'
            };
        }
    }

    // Get current year report
    async getCurrentYearReport() {
        try {
            const response = await this.get('/api/reports/current-year');
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải báo cáo năm hiện tại'
            };
        }
    }

    // Get summary report by period
    async getSummaryReport(period) {
        try {
            const response = await this.get(`/api/reports/summary/${period}`);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Không thể tải báo cáo tóm tắt'
            };
        }
    }
}

// Create instances
const userAPI = new UserAPI();
const transactionAPI = new TransactionAPI();
const categoryAPI = new CategoryAPI();
const budgetAPI = new BudgetAPI();
const adminAPI = new AdminAPI();
const budgetSettingsAPI = new BudgetSettingsAPI();
const reportAPI = new ReportAPI();

// Export APIs
export { userAPI, transactionAPI, categoryAPI, budgetAPI, adminAPI, budgetSettingsAPI, reportAPI };

// Utility functions
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
};

export const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString('vi-VN');
};

export const getTransactionTypeLabel = (type) => {
    return type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu';
};

export const getTransactionTypeColor = (type) => {
    return type === 'INCOME' ? 'text-green-600' : 'text-red-600';
};

export const getTransactionTypeBgColor = (type) => {
    return type === 'INCOME' ? 'bg-green-100' : 'bg-red-100';
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

// Error handler for API responses
export const handleApiError = (response) => {
    if (!response) {
        return 'Lỗi kết nối mạng';
    }

    if (response.message) {
        return response.message;
    }

    return 'Đã xảy ra lỗi không xác định';
};