import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import Card from '../UI/Card';
import Modal from '../UI/Modal';
import LoadingSpinner from '../UI/LoadingSpinner';
import {
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTask, deleteTask, loading } = useTask();
  const [task, setTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadTask();
    }
  }, [id]);

  const loadTask = async () => {
    try {
      const taskData = await getTask(id);
      setTask(taskData);
    } catch (error) {
      console.error('Error loading task:', error);
      navigate('/tasks');
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteTask(id);
      navigate('/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'pending':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-6 w-6 text-success-600" />;
      case 'in-progress':
        return <ClockIcon className="h-6 w-6 text-warning-600" />;
      case 'pending':
        return <ExclamationTriangleIcon className="h-6 w-6 text-gray-400" />;
      default:
        return <ClockIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && !task) {
    return <LoadingSpinner size="lg" className="min-h-64" />;
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Task not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The task you're looking for doesn't exist or has been deleted.
        </p>
        <div className="mt-6">
          <Link to="/tasks">
            <Button variant="primary">Back to Tasks</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/tasks">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Tasks
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link to={`/tasks/${id}/edit`}>
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                <PencilIcon className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="error"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Task Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Body>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {task.title}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant={getPriorityColor(task.priority)} size="md">
                      {task.priority} Priority
                    </Badge>
                    <Badge variant={getStatusColor(task.status)} size="md">
                      {task.status}
                    </Badge>
                  </div>
                </div>
                <div className="ml-4">
                  {getStatusIcon(task.status)}
                </div>
              </div>

              {task.description && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Info */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Task Information</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(task.createdAt)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(task.updatedAt)}
                  </dd>
                </div>

                {task.dueDate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDateOnly(task.dueDate)}
                    </dd>
                  </div>
                )}

                {task.category && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      <TagIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {task.category}
                    </dd>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <Link to={`/tasks/${id}/edit`} className="block">
                  <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                    <PencilIcon className="h-4 w-4" />
                    Edit Task
                  </Button>
                </Link>
                <Button
                  variant="error"
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete Task
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="error"
              onClick={handleDelete}
              loading={deleting}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetail;
