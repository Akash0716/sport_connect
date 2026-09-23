import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing auth session on app mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('sportconnect_token');
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.data.data);
        } catch (err) {
          console.error('Session restoration failed:', err);
          localStorage.removeItem('sportconnect_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { token, user: userData } = res.data.data;
    localStorage.setItem('sportconnect_token', token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, confirmPassword) => {
    const res = await authService.register({ name, email, password, confirmPassword });
    const { token, user: userData } = res.data.data;
    localStorage.setItem('sportconnect_token', token);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('sportconnect_token');
      setUser(null);
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        setUser,
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
