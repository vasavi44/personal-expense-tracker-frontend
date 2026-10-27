import axios from 'axios';

// Vite environment variable configuration
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
// Normalize trailing slash if user enters with or without trailing slash
const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Attach JWT Bearer Token to outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('expense_tracker_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Standardize error messages from server or network errors.
 * Safely presents server validation and business logic messages (4xx)
 * without exposing internal server errors or stack traces (5xx).
 */
export const extractErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.';

  if (error.response) {
    const { status, data } = error.response;

    // For server-side errors (5xx), do not expose internal server messages
    if (status >= 500) {
      return 'The server encountered an error. Please try again later.';
    }

    // For client / validation / business logic errors (4xx)
    if (data) {
      if (data.validationErrors && typeof data.validationErrors === 'object' && Object.keys(data.validationErrors).length > 0) {
        return Object.values(data.validationErrors).filter(Boolean).join(', ');
      }
      if (data.message && typeof data.message === 'string') {
        return data.message;
      }
      if (data.error && typeof data.error === 'string') {
        return data.error;
      }
    }

    if (status === 401) {
      return 'Invalid email or password. Please try again.';
    }
    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (status === 404) {
      return 'The requested resource was not found.';
    }

    return `Request failed with status code ${status}.`;
  }

  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Connection timed out. Please check your network and try again.';
  }

  if (error.request) {
    return 'Unable to connect to the backend server. Please verify the Spring Boot service is running.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
};

export const expenseService = {
  /**
   * Retrieve all expenses sorted newest first
   */
  async getExpenses() {
    const response = await apiClient.get('/expenses');
    return response.data;
  },

  /**
   * Retrieve a specific expense by ID
   */
  async getExpenseById(id) {
    const response = await apiClient.get(`/expenses/${id}`);
    return response.data;
  },

  /**
   * Create a new expense
   */
  async createExpense(expenseData) {
    const response = await apiClient.post('/expenses', expenseData);
    return response.data;
  },

  /**
   * Update an existing expense
   */
  async updateExpense(id, expenseData) {
    const response = await apiClient.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  /**
   * Delete an expense
   */
  async deleteExpense(id) {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  },

  /**
   * Retrieve total expense amount and count across entire dataset
   */
  async getTotalExpenses() {
    const response = await apiClient.get('/expenses/total');
    return response.data;
  },

  /**
   * Filter expenses by category
   */
  async getExpensesByCategory(category) {
    const response = await apiClient.get(`/expenses/category/${encodeURIComponent(category)}`);
    return response.data;
  },

  /**
   * Backend health check verification
   */
  async checkHealth() {
    const response = await apiClient.get('/health');
    return response.data;
  },

  getBaseUrl() {
    return API_BASE_URL;
  },
};

export default expenseService;
