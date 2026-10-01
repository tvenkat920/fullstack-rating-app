import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth state by verifying token with backend
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with server in background
          const res = await authAPI.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen to expiration events from axios interceptor
    const handleExpired = () => {
      logout();
    };
    window.addEventListener('auth-expired', handleExpired);
    return () => window.removeEventListener('auth-expired', handleExpired);
  }, []);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    if (res.success && res.data) {
      const { user: userData, token: userToken } = res.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const signup = async (userData) => {
    const res = await authAPI.signup(userData);
    if (res.success && res.data) {
      const { user: newUser, token: userToken } = res.data;
      setUser(newUser);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.message || 'Signup failed');
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const changePassword = async (passwords) => {
    const res = await authAPI.changePassword(passwords);
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        role: user ? user.role : null,
        isAdmin: user?.role === 'ADMIN',
        isOwner: user?.role === 'STORE_OWNER',
        isNormalUser: user?.role === 'USER',
        login,
        signup,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
