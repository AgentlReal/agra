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

  // Nav items for student
  const navLinks = [
    { label: 'Dasbor', href: '/dashboard', icon: Sparkles },
    { label: 'Recall', href: '/recall', icon: GraduationCap },
    { label: 'Kurikulum', href: '/curriculum', icon: BookOpen },
    { label: 'Simulasi TKA', href: '/simulations/1', icon: ShieldCheck },
    { label: 'Profil Saya', href: '/profile', icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-700/60 shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform p-1">
              <AppLogo size={30} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                AGRA
                <span className="rounded-md bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/30">
                  TKA SMP
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
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
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
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
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 border border-amber-500/20 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{user?.totalXp ?? 0} XP</span>
          </div>

          {/* Streak Badge */}
          <div 
            title="Runtutan Hari Aktif Belajar (Streak)"
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 border border-amber-500/20 shadow-xs"
          >
            <Flame className="h-3.5 w-3.5" />
            <span>{user?.currentStreak ?? 0} Hari</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-xs"
            title="Ganti Tema (Dark / Light)"
          >
            {isLight ? <Moon className="h-4 w-4 text-indigo-600" /> : <Sun className="h-4 w-4 text-amber-400" />}
          </button>

          {/* Role Switcher Pill / User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/90 py-1.5 pl-2 pr-3 text-sm hover:border-slate-700 transition-all focus:outline-none"
            >
              <UserAvatar
                src={user?.avatarUrl}
                name={user?.name || user?.username}
                size="sm"
              />
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-slate-200 leading-none">{user?.name || user?.username || 'Siswa'}</p>
                <p className="text-[10px] text-indigo-400 font-medium capitalize mt-0.5">{role.toLowerCase().replace('_', ' ')}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl backdrop-blur-xl z-50">
                <div className="border-b border-slate-800 px-3 py-2.5 flex items-center gap-3">
                  <UserAvatar
                    src={user?.avatarUrl}
                    name={user?.name || user?.username}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400">Masuk sebagai</p>
                    <p className="text-sm font-semibold text-white truncate">{user?.name || user?.username || 'Siswa'}</p>
                    <p className="text-xs text-indigo-400 font-mono truncate">@{user?.username || '-'}</p>
                  </div>
                </div>

                {role === 'TIM_KURIKULUM' && (
                  <div className="py-1">
                    <Link
                      href="/admin/bank-soal"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 transition-colors"
                    >
                      <span>Panel Admin Tim Kurikulum</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}

                <div className="border-t border-slate-800 pt-1 mt-1">
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <UserIcon className="h-4 w-4" />
                    Pengaturan Profil
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar Sesi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900 transition-colors"
            >
              <span className="flex items-center gap-3">
                {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
                <span>Tema: {isLight ? 'Terang (Light)' : 'Gelap (Dark)'}</span>
              </span>
              <span className="text-[11px] text-slate-500">Ubah</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
