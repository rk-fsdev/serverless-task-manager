import React, { createContext, useContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // See if user is already logged in when the app starts
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
    } catch (error) {
      console.log('No one is logged in:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);

      const result = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name,
        },
      });

      toast.success(
        'Account created successfully! Please check your email for verification.'
      );
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await Auth.signIn(email, password);
      setUser(result);
      toast.success('Welcome back!');
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await Auth.signOut();
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    } finally {
      setLoading(false);
    }
  };

  const confirmSignUp = async (email, code) => {
    try {
      setLoading(true);
      setError(null);

      await Auth.confirmSignUp(email, code);
      toast.success('Email verified successfully! You can now sign in.');
    } catch (error) {
      console.error('Confirm sign up error:', error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationCode = async email => {
    try {
      setLoading(true);
      setError(null);

      await Auth.resendSignUp(email);
      toast.success('Confirmation code sent to your email');
    } catch (error) {
      console.error('Resend confirmation code error:', error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async email => {
    try {
      setLoading(true);
      setError(null);

      await Auth.forgotPassword(email);
      toast.success('Password reset code sent to your email');
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPasswordSubmit = async (email, code, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      await Auth.forgotPasswordSubmit(email, code, newPassword);
      toast.success(
        'Password reset successfully! You can now sign in with your new password.'
      );
    } catch (error) {
      console.error('Forgot password submit error:', error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = error => {
    switch (error.code) {
      case 'UserNotFoundException':
        return 'User not found. Please check your email.';
      case 'NotAuthorizedException':
        return 'Incorrect email or password.';
      case 'UserNotConfirmedException':
        return 'Please verify your email before signing in.';
      case 'UsernameExistsException':
        return 'An account with this email already exists.';
      case 'InvalidPasswordException':
        return 'Password does not meet requirements.';
      case 'CodeMismatchException':
        return 'Invalid verification code.';
      case 'ExpiredCodeException':
        return 'Verification code has expired.';
      case 'LimitExceededException':
        return 'Too many attempts. Please try again later.';
      case 'InvalidParameterException':
        return 'Invalid input parameters.';
      case 'NetworkError':
        return 'Network error. Please check your connection.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  };

  const getCurrentUser = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      return currentUser;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  };

  const getCurrentSession = async () => {
    try {
      const session = await Auth.currentSession();
      return session;
    } catch (error) {
      console.error('Get current session error:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    confirmSignUp,
    resendConfirmationCode,
    forgotPassword,
    forgotPasswordSubmit,
    getCurrentUser,
    getCurrentSession,
    checkAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
