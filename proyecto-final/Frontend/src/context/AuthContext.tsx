import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario } from '../types';

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  dueñoId: string | null;
  login: (user: Usuario, token: string) => void;
  logout: () => void;
  setDueñoId: (id: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [dueñoId, setDueñoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        // Verificar que storedUser sea un JSON válido
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setToken(storedToken);
          setUser(parsedUser);
        } else {
          // Datos corruptos, limpiar
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      // Error al parsear JSON, limpiar localStorage
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: Usuario, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setDueñoId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('dueñoId');
  };

  return (
    <AuthContext.Provider value={{ user, token, dueñoId, login, logout, setDueñoId, isLoading }}>
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