'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api-client';

export type UserRole = 'SISWA' | 'TIM_KURIKULUM';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  grade?: number;
  totalXp?: number;
  currentStreak?: number;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default demo user fallback for smooth demo experience
const defaultSiswa: User = {
  id: 'usr_siswa_01',
  name: 'Budi Santoso',
  username: 'user',
  email: 'user@example.com',
  role: 'SISWA',
  avatarUrl: '/assets/avatars/avatar-1.png',
  grade: 8,
  totalXp: 450,
  currentStreak: 5,
};

const defaultKurikulum: User = {
  id: 'usr_admin_01',
  name: 'Dra. Sri Wahyuni, M.Pd.',
  username: 'tim_kurikulum',
  email: 'tim@example.com',
  role: 'TIM_KURIKULUM',
  avatarUrl: '/assets/avatars/avatar-admin.png',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(defaultSiswa);
  const [token, setToken] = useState<string | null>('mock_jwt_token_siswa');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Synchronize session from localStorage asynchronously
    queueMicrotask(() => {
      try {
        const savedToken = localStorage.getItem('agra_token');
        const savedUser = localStorage.getItem('agra_user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } else {
          localStorage.setItem('agra_token', 'mock_jwt_token_siswa');
          localStorage.setItem('agra_user', JSON.stringify(defaultSiswa));
        }
      } catch {
        // ignore storage errors
      }
    });
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('agra_token', newToken);
    localStorage.setItem('agra_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await api.auth.signOut().catch(() => {});
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('agra_token');
      localStorage.removeItem('agra_user');
      router.push('/login');
    }
  };

  const switchRole = (newRole: UserRole) => {
    const targetUser = newRole === 'SISWA' ? defaultSiswa : defaultKurikulum;
    const targetToken = `mock_jwt_token_${newRole.toLowerCase()}`;
    login(targetToken, targetUser);
    if (newRole === 'TIM_KURIKULUM') {
      router.push('/admin/bank-soal');
    } else {
      router.push('/dashboard');
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('agra_user', JSON.stringify(updated));
  };

  const role = user?.role || 'SISWA';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        updateUser,
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
