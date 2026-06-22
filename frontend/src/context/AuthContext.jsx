import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify token is still valid with backend
          const response = await API.get('/api/auth/me');
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error("Token verification failed, logging out", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/api/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed. Please check credentials.';
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData) => {
    setLoading(true);
    try {
      const response = await API.post('/api/auth/register', registerData);
      const { token, ...userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed. Please try again.';
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
