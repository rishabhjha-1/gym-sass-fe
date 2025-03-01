import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('gym_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, we'll just check if email contains "admin"
    if (email.includes('admin')) {
      setUser(MOCK_USER);
      localStorage.setItem('gym_user', JSON.stringify(MOCK_USER));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would be an API call
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      ...MOCK_USER,
      name,
      email,
    };
    
    setUser(newUser);
    localStorage.setItem('gym_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('gym_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};