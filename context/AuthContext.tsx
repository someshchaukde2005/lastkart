
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Role } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  login: (email: string, password_unused: string) => Promise<User | null>;
  logout: () => void;
  register: (name: string, email: string, role: Role) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  const login = async (email: string, password_unused: string): Promise<User | null> => {
    // In a real app, you'd verify the password. Here we just find the user.
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      setRole(foundUser.role);
      return foundUser;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  const register = async (name: string, email: string, role: Role): Promise<User | null> => {
    if (MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return null; // User already exists
    }
    const newUser: User = {
        id: MOCK_USERS.length + 1,
        name,
        email,
        role
    };
    MOCK_USERS.push(newUser); // This is a mock, in reality this would be a DB call
    setUser(newUser);
    setRole(newUser.role);
    return newUser;
  }

  return (
    <AuthContext.Provider value={{ user, role, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
   