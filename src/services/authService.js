import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const TOKEN_KEY = 'expense_tracker_jwt_token';
const USER_KEY = 'expense_tracker_user_profile';

const authClient = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

export const authService = {
  /**
   * Register a new user
   */
  async register(name, email, password) {
    const response = await authClient.post('/register', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    if (response.data && response.data.token) {
      this.saveSession(response.data);
    }
    return response.data;
  },

  /**
   * Login user with credentials
   */
  async login(email, password) {
    const response = await authClient.post('/login', {
      email: email.trim().toLowerCase(),
      password,
    });
    if (response.data && response.data.token) {
      this.saveSession(response.data);
    }
    return response.data;
  },

  /**
   * Fetch current authenticated user's profile
   */
  async getCurrentUser() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await authClient.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Save session to localStorage
   */
  saveSession(authResponse) {
    if (authResponse.token) {
      localStorage.setItem(TOKEN_KEY, authResponse.token);
    }
    const userProfile = {
      id: authResponse.id,
      name: authResponse.name,
      email: authResponse.email,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(userProfile));
  },

  /**
   * Get stored JWT token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored user profile
   */
  getStoredUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Clear user session from storage
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Check if token exists
   */
  hasToken() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export { extractErrorMessage } from './expenseService';
export default authService;
