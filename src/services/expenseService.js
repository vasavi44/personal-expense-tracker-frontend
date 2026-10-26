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

/**
 * Standardize error messages from server or network errors.
 */
export const extractErrorMessage = (error) => {
  if (error.response) {
    const data = error.response.data;
    if (data) {
      if (data.validationErrors && Object.keys(data.validationErrors).length > 0) {
        return Object.values(data.validationErrors).join(', ');
      }
      if (data.message) {
        return data.message;
      }
      if (data.error) {
        return data.error;
      }
    }
    return `Server error: ${error.response.status} ${error.response.statusText}`;
  }
  if (error.request) {
    return 'Unable to connect to the backend server. Please verify the Spring Boot service is running.';
  }
  return error.message || 'An unexpected error occurred.';
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
