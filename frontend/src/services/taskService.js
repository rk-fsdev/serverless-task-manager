import axios from 'axios';
import { Auth } from 'aws-amplify';

// Set up axios to talk to our API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Automatically add the auth token to every request
api.interceptors.request.use(
  async config => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Handle errors that come back from the API
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // User's session expired or they're not logged in
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export const taskService = {
  // Fetch all tasks for the current user
  async getTasks(limit = 20, lastEvaluatedKey = null) {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit);
      if (lastEvaluatedKey) {
        params.append(
          'lastEvaluatedKey',
          encodeURIComponent(JSON.stringify(lastEvaluatedKey))
        );
      }

      const response = await api.get(`/tasks?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to fetch tasks'
      );
    }
  },

  // Get one specific task
  async getTask(id) {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data.data.task;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error(
        error.response?.data?.error?.message || 'Failed to fetch task'
      );
    }
  },

  // Create a brand new task
  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data.data.task;
    } catch (error) {
      if (error.response?.status === 400) {
        const validationErrors = error.response.data.error.details;
        throw new Error(
          `Validation failed: ${validationErrors.map(e => e.message).join(', ')}`
        );
      }
      throw new Error(
        error.response?.data?.error?.message || 'Failed to create task'
      );
    }
  },

  // Update a task that already exists
  async updateTask(id, updateData) {
    try {
      const response = await api.put(`/tasks/${id}`, updateData);
      return response.data.data.task;
    } catch (error) {
      if (error.response?.status === 400) {
        const validationErrors = error.response.data.error.details;
        throw new Error(
          `Validation failed: ${validationErrors.map(e => e.message).join(', ')}`
        );
      }
      if (error.response?.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error(
        error.response?.data?.error?.message || 'Failed to update task'
      );
    }
  },

  // Remove a task completely
  async deleteTask(id) {
    try {
      await api.delete(`/tasks/${id}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error(
        error.response?.data?.error?.message || 'Failed to delete task'
      );
    }
  },

  // Calculate some basic stats about the user's tasks
  async getTaskStats() {
    try {
      // We could have a separate API endpoint for this, but for now let's just calculate it here
      const tasks = await this.getTasks(1000); // Get a bunch of tasks to work with
      return this.calculateStats(tasks.tasks);
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message ||
          'Failed to fetch task statistics'
      );
    }
  },

  // Calculate task statistics
  calculateStats(tasks) {
    return {
      total: tasks.length,
      pending: tasks.filter(task => task.status === 'pending').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      completed: tasks.filter(task => task.status === 'completed').length,
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length,
    };
  },

  // Search tasks
  async searchTasks(query) {
    try {
      const tasks = await this.getTasks(1000); // Get all tasks
      const lowercaseQuery = query.toLowerCase();
      const filteredTasks = tasks.tasks.filter(
        task =>
          task.title.toLowerCase().includes(lowercaseQuery) ||
          task.description.toLowerCase().includes(lowercaseQuery) ||
          task.category.toLowerCase().includes(lowercaseQuery)
      );
      return filteredTasks;
    } catch (error) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to search tasks'
      );
    }
  },
};
