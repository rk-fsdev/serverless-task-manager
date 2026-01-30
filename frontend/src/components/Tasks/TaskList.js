import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import Input from '../UI/Input';
import Select from '../UI/Select';
import LoadingSpinner from '../UI/LoadingSpinner';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const TaskList = () => {
  const { tasks, loading, pagination, loadMoreTasks, searchTasks } = useTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery) {
      filtered = searchTasks(searchQuery);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, statusFilter, priorityFilter, searchTasks]);

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
        return <CheckCircleIcon className="h-5 w-5 text-success-600" />;
      case 'in-progress':
        return <ClockIcon className="h-5 w-5 text-warning-600" />;
      case 'pending':
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your tasks
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/tasks/new">
            <Button variant="primary" className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              New Task
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              placeholder="Filter by status"
            />

            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={priorityOptions}
              placeholder="Filter by priority"
            />

            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
                setPriorityFilter('');
              }}
              className="flex items-center gap-2"
            >
              <FunnelIcon className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Tasks List */}
      <Card>
        <Card.Body>
          {loading && tasks.length === 0 ? (
            <LoadingSpinner size="lg" className="min-h-64" />
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchQuery || statusFilter || priorityFilter
                  ? 'No tasks match your filters'
                  : 'No tasks yet'
                }
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter || priorityFilter
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by creating your first task.'
                }
              </p>
              {!searchQuery && !statusFilter && !priorityFilter && (
                <div className="mt-6">
                  <Link to="/tasks/new">
                    <Button variant="primary" className="flex items-center gap-2">
                      <PlusIcon className="h-4 w-4" />
                      Create Task
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {getStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate block"
                      >
                        {task.title}
                      </Link>
                      {task.description && (
                        <p className="text-sm text-gray-500 truncate">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-400">
                          Created {formatDate(task.createdAt)}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-gray-400">
                            Due {formatDate(task.dueDate)}
                          </span>
                        )}
                        {task.category && (
                          <span className="text-xs text-gray-400">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge variant={getPriorityColor(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                    <Badge variant={getStatusColor(task.status)} size="sm">
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {pagination.hasMore && (
            <div className="mt-6 text-center">
              <Button
                variant="secondary"
                onClick={loadMoreTasks}
                loading={loading}
                disabled={loading}
              >
                Load More Tasks
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskList;
