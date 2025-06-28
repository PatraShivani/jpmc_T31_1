import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers = [
  {
    id: 1,
    email: 'admin@todayskalam.org',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: 2,
    email: 'tutor@todayskalam.org',
    password: 'tutor123',
    name: 'Tutor User',
    role: 'tutor'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('kalam_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage (in real app, use secure token)
      localStorage.setItem('kalam_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('kalam_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
