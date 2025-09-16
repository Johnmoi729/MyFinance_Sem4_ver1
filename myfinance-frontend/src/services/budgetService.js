// Create a simple API client similar to the existing API structure
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = {
  get: async (url, config) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      console.error(`API Error (${response.status}):`, errorMessage);
      throw new Error(errorMessage);
    }
    return { data: await response.json() };
  },
  post: async (url, data, config) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      console.error(`API Error (${response.status}):`, errorMessage);
      throw new Error(errorMessage);
    }
    return { data: await response.json() };
  },
  put: async (url, data, config) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      console.error(`API Error (${response.status}):`, errorMessage);
      throw new Error(errorMessage);
    }
    return { data: await response.json() };
  },
  delete: async (url, config) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      console.error(`API Error (${response.status}):`, errorMessage);
      throw new Error(errorMessage);
    }
    return { data: await response.json() };
  },
};

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const budgetService = {
  createBudget: (budgetData) => {
    const token = getAuthToken();
    return apiClient.post('/api/budgets', budgetData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getBudget: (budgetId) => {
    const token = getAuthToken();
    return apiClient.get(`/api/budgets/${budgetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getUserBudgets: (filters = {}) => {
    const { type, year, month, categoryId } = filters;
    const params = new URLSearchParams();
    
    if (type) params.append('type', type);
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    if (categoryId) params.append('categoryId', categoryId);

    const queryString = params.toString();
    const url = queryString ? `/api/budgets?${queryString}` : '/api/budgets';
    const token = getAuthToken();

    return apiClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getCurrentMonthBudgets: () => {
    const token = getAuthToken();
    return apiClient.get('/api/budgets/current', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getBudgetsForPeriod: (year, month) => {
    const token = getAuthToken();
    return apiClient.get(`/api/budgets/period/${year}/${month}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateBudget: (budgetId, budgetData) => {
    const token = getAuthToken();
    return apiClient.put(`/api/budgets/${budgetId}`, budgetData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  deleteBudget: (budgetId) => {
    const token = getAuthToken();
    return apiClient.delete(`/api/budgets/${budgetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default budgetService;