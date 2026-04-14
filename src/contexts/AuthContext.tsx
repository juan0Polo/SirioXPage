import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Usuario, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      const token = api.auth.getToken();
      if (!token) return;
      const userData = await api.auth.me();
      setUser(userData as unknown as Usuario);
    } catch {
      api.auth.clearToken();
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const { token, user: userData } = await api.auth.login(email, password);
    api.auth.setToken(token);
    setUser(userData as unknown as Usuario);
  }

  async function logout() {
    api.auth.clearToken();
    setUser(null);
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
