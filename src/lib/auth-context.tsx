'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  needsOnboarding?: boolean;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token?: string, user?: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSessionAndProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const sessionRes = await api.auth.getSession().catch(() => null);

      if (!sessionRes || !sessionRes.user) {
        setUser(null);
        setToken(null);
        return;
      }

      const authUser = sessionRes.user;
      const role: UserRole = authUser.role === 'TIM_KURIKULUM' ? 'TIM_KURIKULUM' : 'SISWA';

      const initialUser: User = {
        id: authUser.id,
        name: authUser.name || authUser.username || '',
        username: authUser.username || authUser.email.split('@')[0],
        email: authUser.email,
        role,
      };

      if (role === 'SISWA') {
        try {
          const profileRes = await api.profile.get();
          const profileData = profileRes.data || profileRes;
          initialUser.name = profileData.name || initialUser.name;
          initialUser.avatarUrl = profileData.avatar?.imageUrl || profileData.avatarUrl;
          initialUser.grade = profileData.grade;
          initialUser.totalXp = profileData.totalXp ?? profileData.total_xp ?? 0;
          initialUser.currentStreak = profileData.currentStreak ?? profileData.current_streak ?? 0;
        } catch (profileErr: any) {
          if (profileErr.code === 'PROFILE_INCOMPLETE' || profileErr.status === 409) {
            initialUser.needsOnboarding = true;
          }
        }
      } else {
        try {
          const adminRes = await api.admin.getProfile();
          const adminData = adminRes.data || adminRes;
          initialUser.name = adminData.name || initialUser.name;
          initialUser.avatarUrl = adminData.avatarUrl || '/assets/avatars/avatar-admin.png';
        } catch {
          // ignore admin profile err
        }
      }

      setUser(initialUser);
      if (sessionRes.session?.token) {
        setToken(sessionRes.session.token);
      }
    } catch (err) {
      console.error('Failed to load session:', err);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessionAndProfile();
  }, [fetchSessionAndProfile]);

  const login = (newToken?: string, newUser?: User) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('agra_token', newToken);
    }
    if (newUser) {
      setUser(newUser);
    } else {
      fetchSessionAndProfile();
    }
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

  const refreshUser = async () => {
    await fetchSessionAndProfile();
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
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
        refreshUser,
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
