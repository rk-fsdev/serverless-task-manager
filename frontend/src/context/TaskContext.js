import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { taskService } from '../services/taskService';
import { toast } from 'react-toastify';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    hasMore: false,
    lastEvaluatedKey: null,
    count: 0,
  });
  const { user } = useAuth();

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setTasks([]);
      setPagination({
        hasMore: false,
        lastEvaluatedKey: null,
        count: 0,
      });
    }
  }, [user]);

  const loadTasks = async (refresh = false) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const lastEvaluatedKey = refresh ? null : pagination.lastEvaluatedKey;
      const result = await taskService.getTasks(20, lastEvaluatedKey);

      if (refresh) {
        setTasks(result.tasks);
      } else {
        setTasks(prevTasks => [...prevTasks, ...result.tasks]);
      }

      setPagination({
        hasMore: result.pagination.hasMore,
        lastEvaluatedKey: result.pagination.lastEvaluatedKey,
        count: result.pagination.count,
      });
    } catch (error) {
      console.error('Load tasks error:', error);
      setError(error.message);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);

      const newTask = await taskService.createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      
      setPagination(prev => ({
        ...prev,
        count: prev.count + 1,
      }));

      toast.success('Task created successfully');
      return newTask;
    } catch (error) {
      console.error('Create task error:', error);
      setError(error.message);
      toast.error('Failed to create task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);

      const updatedTask = await taskService.updateTask(id, updateData);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? updatedTask : task
        )
      );

      toast.success('Task updated successfully');
      return updatedTask;
    } catch (error) {
      console.error('Update task error:', error);
      setError(error.message);
      toast.error('Failed to update task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      
      setPagination(prev => ({
        ...prev,
        count: prev.count - 1,
      }));

      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Delete task error:', error);
      setError(error.message);
      toast.error('Failed to delete task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTask = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const task = await taskService.getTask(id);
      return task;
    } catch (error) {
      console.error('Get task error:', error);
      setError(error.message);
      toast.error('Failed to get task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshTasks = () => {
    loadTasks(true);
  };

  const loadMoreTasks = () => {
    if (pagination.hasMore && !loading) {
      loadTasks(false);
    }
  };

  const getTaskStats = () => {
    const stats = {
      total: tasks.length,
      pending: tasks.filter(task => task.status === 'pending').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      completed: tasks.filter(task => task.status === 'completed').length,
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length,
    };

    return stats;
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  const getTasksByCategory = (category) => {
    return tasks.filter(task => task.category === category);
  };

  const searchTasks = (query) => {
    if (!query) return tasks;
    
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery) ||
      task.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const value = {
    tasks,
    loading,
    error,
    pagination,
    createTask,
    updateTask,
    deleteTask,
    getTask,
    loadTasks,
    refreshTasks,
    loadMoreTasks,
    getTaskStats,
    getTasksByStatus,
    getTasksByPriority,
    getTasksByCategory,
    searchTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
