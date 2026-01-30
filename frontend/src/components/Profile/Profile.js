import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../UI/Card';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import { UserIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setSigningOut(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-64" />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Not authenticated</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
          </Card.Header>
          <Card.Body>
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {(user.attributes?.name || user.username || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {user.attributes?.name || user.username}
                </h3>
                <p className="text-sm text-gray-500">
                  {user.attributes?.email || user.username}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Account Details */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium text-gray-900">Account Details</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Username</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.username}</dd>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.attributes?.email || user.username}
                  </dd>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">
                    {user.attributes?.email_verified ? 'Verified' : 'Unverified'}
                  </dd>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Account Actions */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium text-gray-900">Account Actions</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Sign Out</h3>
                <p className="text-sm text-gray-500">
                  Sign out of your account on this device
                </p>
                <div className="mt-3">
                  <Button
                    variant="error"
                    onClick={handleSignOut}
                    loading={signingOut}
                    disabled={signingOut}
                  >
                    {signingOut ? 'Signing out...' : 'Sign Out'}
                  </Button>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* App Information */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium text-gray-900">Application Information</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Version</dt>
                <dd className="mt-1 text-sm text-gray-900">1.0.0</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Framework</dt>
                <dd className="mt-1 text-sm text-gray-900">React 18</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Backend</dt>
                <dd className="mt-1 text-sm text-gray-900">AWS Serverless</dd>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
