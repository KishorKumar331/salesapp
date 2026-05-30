import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn, signOut, signUp, confirmSignUp, resendSignUpCode, fetchUserAttributes } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
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

  // Check current authenticated user on mount and listen to auth events
  useEffect(() => {
    checkAuthStatus();

    const cancelListener = Hub.listen('auth', async (data) => {
      const { payload } = data;
      console.log('Hub Auth Event received:', payload.event);
      
      if (payload.event === 'signedOut' || payload.event === 'tokenRefresh_failure') {
        console.log('Cognito token expired or user signed out. Triggering local signout.');
        await AsyncStorage.removeItem('userProfile');
        await AsyncStorage.removeItem('createAccount');
        setUser(null);
      }
    });

    return () => {
      cancelListener();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      const profileData = await AsyncStorage.getItem("userProfile");
      const createAccount = await AsyncStorage.getItem("createAccount");
      
      let profile = {};
      if (profileData) {
        const parsed = JSON.parse(profileData);
        profile = Array.isArray(parsed) ? parsed[0] : parsed;
      }
      
      let attributes = {};
      let isAuthError = false;
      try {
        attributes = await fetchUserAttributes();
      } catch (cognitoError) {
        console.log("Cognito session check failed on mount:", cognitoError.name, cognitoError.message);
        
        // If Cognito explicitly says user is not authenticated or not authorized,
        // it means the session is invalid or revoked on the server.
        if (
          cognitoError.name === 'UserUnAuthenticatedException' || 
          cognitoError.name === 'NotAuthorizedException' ||
          cognitoError.name === 'UserNotFoundException' ||
          cognitoError.message?.includes('UserUnAuthenticated') ||
          cognitoError.message?.includes('NotAuthorizedException') ||
          cognitoError.message?.includes('requires a signed-in state')
        ) {
          isAuthError = true;
        }
      }
      
      if (isAuthError) {
        console.log("Session revoked/expired. Automatically signing out...");
        try {
          await signOut();
        } catch (e) {}
        await AsyncStorage.removeItem('userProfile');
        await AsyncStorage.removeItem('createAccount');
        setUser(null);
        setError("Session expired. Please log in again.");
      } else if (profileData || createAccount === "true" || Object.keys(attributes).length > 0) {
        setUser({ ...attributes, ...profile, isGuest: createAccount === "true" });
      } else {
        setUser(null);
      }
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
      try {
        await signOut();
      } catch (e) {
        console.log("Amplify signOut failed:", e.message);
      }
      await AsyncStorage.removeItem('userProfile');
      await AsyncStorage.removeItem('createAccount');
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
