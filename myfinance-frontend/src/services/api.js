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

// Create instances
const userAPI = new UserAPI();
const transactionAPI = new TransactionAPI();
const categoryAPI = new CategoryAPI();

// Export APIs
export { userAPI, transactionAPI, categoryAPI };

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