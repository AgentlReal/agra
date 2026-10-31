'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api-client';

export type UserRole = 'SISWA' | 'TIM_KURIKULUM' | 'SUPERADMIN';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  avatarId?: number;
  grade?: number;
  totalXp?: number;
  needsOnboarding?: boolean;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token?: string, user?: User) => Promise<void> | void;
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
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleSessionExpired = (e: any) => {
      // Only prompt if user was currently logged in
      if (user || localStorage.getItem('agra_token')) {
        const msg =
          e?.detail?.message ||
          'Akun Anda terdeteksi aktif di perangkat atau peramban lain, atau sesi Anda telah kedaluwarsa demi alasan keamanan.';
        setSessionExpiredMessage(msg);
      }
    };

    window.addEventListener('agra:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('agra:session-expired', handleSessionExpired);
    };
  }, [user]);

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
      const rawRole = authUser.role;
      const role: UserRole =
        rawRole === 'SUPERADMIN' ? 'SUPERADMIN' : rawRole === 'TIM_KURIKULUM' ? 'TIM_KURIKULUM' : 'SISWA';

      const initialUser: User = {
        id: authUser.id,
        name: authUser.name || authUser.username || '',
        username: authUser.username || authUser.email.split('@')[0],
        email: authUser.email,
        avatarUrl: authUser.image || undefined,
        role,
      };

      if (role === 'SISWA') {
        try {
          const profileRes = await api.profile.get();
          const profileData = profileRes.data || profileRes;
          initialUser.name = profileData.name || initialUser.name;
          initialUser.avatarUrl = profileData.avatar?.imageUrl || profileData.avatarUrl || initialUser.avatarUrl;
          initialUser.avatarId = profileData.avatar?.id;
          initialUser.totalXp = profileData.totalXp ?? profileData.total_xp ?? 0;
          initialUser.grade = profileData.grade;
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

  const login = async (newToken?: string, newUser?: User) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('agra_token', newToken);
    }
    if (newUser) {
      setUser(newUser);
    }
    await fetchSessionAndProfile();
  };

  const logout = async () => {
    try {
      await api.auth.signOut().catch(() => {});
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('agra_token');
      localStorage.removeItem('agra_user');
      window.location.href = '/login';
    }
  };

  const refreshUser = useCallback(async () => {
    await fetchSessionAndProfile();
  }, [fetchSessionAndProfile]);

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const role = user?.role || 'SISWA';

  const handleConfirmSessionExpired = async () => {
    setSessionExpiredMessage(null);
    await logout();
  };

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

      {/* Session Expired / Concurrent Login Termination Modal [FE-15] */}
      {sessionExpiredMessage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-amber-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Sesi Anda Telah Berakhir</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {sessionExpiredMessage}
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmSessionExpired}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-medium rounded-xl transition shadow-sm text-sm"
              >
                Masuk Kembali
              </button>
            </div>
          </div>
        </div>
      )}
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
