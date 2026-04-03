import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn, signOut, signUp, confirmSignUp, resendSignUpCode, fetchUserAttributes } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Check current authenticated user on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const attributes = await fetchUserAttributes();
      
      // Also get profile from AsyncStorage
      const profileData = await AsyncStorage.getItem("userProfile");
      let profile = {};
      if (profileData) {
        const parsed = JSON.parse(profileData);
        profile = Array.isArray(parsed) ? parsed[0] : parsed;
      }
      
      setUser({ ...attributes, ...profile });
      setError(null);
    } catch (error) {
      // User is not signed in
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
      setIsReady(true);
    }
  };

  const signInUser = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signIn({
        username: email,
        password: password,
      });
      
      if (result.isSignedIn) {
        const attributes = await fetchUserAttributes();
        setUser(attributes);
        return { success: true, user: attributes };
      } else {
        throw new Error('Sign in failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Sign in failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUpUser = async (email, password, attributes = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            ...attributes,
          },
        },
      });
      
      if (result.isSignUpComplete) {
        const userAttributes = await fetchUserAttributes();
        setUser(userAttributes);
        return { success: true, user: userAttributes, nextStep: null };
      } else {
        return { 
          success: true, 
          user: null, 
          nextStep: result.nextStep,
          userId: result.userId
        };
      }
    } catch (error) {
      const errorMessage = error.message || 'Sign up failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const confirmSignUpUser = async (email, code) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      
      if (result.isSignUpComplete) {
        return { success: true };
      } else {
        return { success: false, error: 'Confirmation failed', nextStep: result.nextStep };
      }
    } catch (error) {
      const errorMessage = error.message || 'Confirmation failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationCode = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      await resendSignUpCode({ username: email });
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Failed to resend code';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      setLoading(true);
      await signOut();
      await AsyncStorage.removeItem('userProfile');
      setUser(null);
      setError(null);
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Sign out failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    setUser,
    loading,
    isReady,
    error,
    isAuthenticated: !!user,
    signIn: signInUser,
    signUp: signUpUser,
    confirmSignUp: confirmSignUpUser,
    resendCode: resendConfirmationCode,
    signOut: signOutUser,
    clearError,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
