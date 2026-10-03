'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  GraduationCap, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ArrowRight 
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { AppLogo } from '@/components/common/AppLogo';
import { UserAvatar } from '@/components/common/UserAvatar';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const { isLight, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Dasbor', href: '/dashboard', icon: Sparkles },
    { label: 'Recall', href: '/recall', icon: GraduationCap },
    { label: 'Kurikulum', href: '/curriculum', icon: BookOpen },
    { label: 'Simulasi TKA', href: '/simulations/1', icon: ShieldCheck },
    { label: 'Profil Saya', href: '/profile', icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 shadow-xs group-hover:scale-105 transition-transform p-1">
              <AppLogo size={30} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-blue-600 flex items-center gap-1.5">
                AGRA
                <span className="rounded-md bg-blue-100/70 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                  TKA SMP
                </span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Ruang Belajar & Simulasi Potensi Akademik
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Formative Badges & User Menu */}
        <div className="flex items-center gap-3">
          {/* XP Badge */}
          <div 
            title="Total Poin XP Formatif Belajar Anda"
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200/80 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>{user?.totalXp ?? 0} XP</span>
          </div>

          {/* Streak Badge */}
          <div 
            title="Runtutan Hari Aktif Belajar (Streak)"
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200/80 shadow-xs"
          >
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span>{user?.currentStreak ?? 0} Hari</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
            title="Ganti Tema (Dark / Light)"
          >
            {isLight ? <Moon className="h-4 w-4 text-blue-600" /> : <Sun className="h-4 w-4 text-amber-500" />}
          </button>

          {/* Role Switcher Pill / User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1.5 pl-2 pr-3.5 text-sm hover:border-slate-300 hover:shadow-xs transition-all focus:outline-none"
            >
              <UserAvatar
                src={user?.avatarUrl}
                name={user?.name || user?.username}
                size="sm"
              />
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name || user?.username || 'Siswa'}</p>
                <p className="text-[10px] text-blue-600 font-medium capitalize mt-0.5">{role.toLowerCase().replace('_', ' ')}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                <div className="border-b border-slate-100 px-3 py-2.5 flex items-center gap-3">
                  <UserAvatar
                    src={user?.avatarUrl}
                    name={user?.name || user?.username}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-400">Masuk sebagai</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || user?.username || 'Siswa'}</p>
                    <p className="text-xs text-blue-600 font-mono truncate">@{user?.username || '-'}</p>
                  </div>
                </div>

                {role === 'TIM_KURIKULUM' && (
                  <div className="py-1">
                    <Link
                      href="/admin/bank-soal"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
                    >
                      <span>Panel Admin Tim Kurikulum</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-slate-500" />
                    Pengaturan Profil
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-slate-500" />
                    Keluar Sesi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-3">
                {isLight ? <Moon className="h-4 w-4 text-blue-600" /> : <Sun className="h-4 w-4 text-amber-500" />}
                <span>Tema: {isLight ? 'Terang (Light)' : 'Gelap (Dark)'}</span>
              </span>
              <span className="text-[11px] text-slate-400">Ubah</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
