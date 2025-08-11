import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAuthToken, removeAuthToken } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'owner' | 'admin';
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in and validate token
    const initializeAuth = async () => {
      const token = localStorage.getItem('quickcourt_token');
      if (token) {
        try {
          setAuthToken(token);
          const response = await authAPI.getCurrentUser();
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid or expired
          removeAuthToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        setAuthToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('quickcourt_user', JSON.stringify(response.user));
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.success) {
        setAuthToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('quickcourt_user', JSON.stringify(response.user));
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    removeAuthToken();
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('quickcourt_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      updateUser,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
