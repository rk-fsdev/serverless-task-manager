import axios from 'axios';

// Create axios instance for auth endpoints
const authApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

export const authService = {
  // Register a new user
  async register(email, password, name) {
    try {
      const response = await authApi.post('/auth', {
        action: 'register',
        email,
        password,
        name,
      });
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 400) {
        const validationErrors = error.response.data.error.details;
        throw new Error(`Validation failed: ${validationErrors.map(e => e.message).join(', ')}`);
      }
      if (error.response?.status === 409) {
        throw new Error('User with this email already exists');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to register user');
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await authApi.post('/auth', {
        action: 'login',
        email,
        password,
      });
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      if (error.response?.status === 403) {
        throw new Error('User account not confirmed');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to login');
    }
  },

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      const response = await authApi.post('/auth', {
        action: 'refresh',
        refreshToken,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to refresh token');
    }
  },

  // Sign out user
  async signOut(accessToken) {
    try {
      await authApi.post('/auth', {
        action: 'signout',
        accessToken,
      });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to sign out');
    }
  },
};
