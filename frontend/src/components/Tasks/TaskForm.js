import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Textarea from '../UI/Textarea';
import Select from '../UI/Select';
import Card from '../UI/Card';
import LoadingSpinner from '../UI/LoadingSpinner';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createTask, updateTask, getTask, loading } = useTask();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    category: '',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadTask();
    }
  }, [id, isEditing]);

  const loadTask = async () => {
    try {
      const task = await getTask(id);
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        category: task.category || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    } catch (error) {
      console.error('Error loading task:', error);
      navigate('/tasks');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (formData.category && formData.category.length > 50) {
      newErrors.category = 'Category must be less than 50 characters';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        dueDate: formData.dueDate || null,
      };

      if (isEditing) {
        await updateTask(id, taskData);
      } else {
        await createTask(taskData);
      }
      
      navigate('/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
      // Error is handled by TaskContext and shown via toast
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  if (loading && isEditing) {
    return <LoadingSpinner size="lg" className="min-h-64" />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditing ? 'Update your task details' : 'Fill in the details to create a new task'}
        </p>
      </div>

      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Enter task title"
            />

            <Textarea
              label="Description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              placeholder="Enter task description (optional)"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                options={priorityOptions}
                required
              />

              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                placeholder="Enter category (optional)"
              />

              <Input
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                error={errors.dueDate}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                disabled={submitting}
              >
                {submitting
                  ? isEditing
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditing
                  ? 'Update Task'
                  : 'Create Task'
                }
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskForm;
