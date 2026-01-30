import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { Auth } from 'aws-amplify';

// Mock AWS Amplify
jest.mock('aws-amplify', () => ({
  Auth: {
    currentAuthenticatedUser: jest.fn(),
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    confirmSignUp: jest.fn(),
    resendSignUp: jest.fn(),
    forgotPassword: jest.fn(),
    forgotPasswordSubmit: jest.fn(),
  },
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const TestComponent = () => {
  const { user, loading, error } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (user) return <div>User: {user.username}</div>;
  return <div>No user</div>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles authenticated user', async () => {
    const mockUser = { username: 'test@example.com' };
    Auth.currentAuthenticatedUser.mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('User: test@example.com')).toBeInTheDocument();
    });
  });

  it('handles unauthenticated user', async () => {
    Auth.currentAuthenticatedUser.mockRejectedValue(new Error('Not authenticated'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument();
    });
  });

  it('provides signUp function', async () => {
    const mockResult = { user: { username: 'test@example.com' } };
    Auth.signUp.mockResolvedValue(mockResult);

    const TestSignUp = () => {
      const { signUp } = useAuth();
      
      const handleSignUp = async () => {
        await signUp('test@example.com', 'password', 'Test User');
      };

      return <button onClick={handleSignUp}>Sign Up</button>;
    };

    render(
      <AuthProvider>
        <TestSignUp />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });
  });

  it('provides signIn function', async () => {
    const mockResult = { username: 'test@example.com' };
    Auth.signIn.mockResolvedValue(mockResult);

    const TestSignIn = () => {
      const { signIn } = useAuth();
      
      const handleSignIn = async () => {
        await signIn('test@example.com', 'password');
      };

      return <button onClick={handleSignIn}>Sign In</button>;
    };

    render(
      <AuthProvider>
        <TestSignIn />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });

  it('provides signOut function', async () => {
    Auth.signOut.mockResolvedValue();

    const TestSignOut = () => {
      const { signOut } = useAuth();
      
      const handleSignOut = async () => {
        await signOut();
      };

      return <button onClick={handleSignOut}>Sign Out</button>;
    };

    render(
      <AuthProvider>
        <TestSignOut />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });
});
