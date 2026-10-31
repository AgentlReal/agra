'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { UserAvatar } from '@/components/common/UserAvatar';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, role, logout, refreshUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [learningDropdownOpen, setLearningDropdownOpen] = useState(false);
  const [assessmentDropdownOpen, setAssessmentDropdownOpen] = useState(false);

  const learningRef = useRef<HTMLDivElement>(null);
  const assessmentRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && role === 'SISWA') {
      refreshUser();
    }
  }, [pathname, refreshUser]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (learningRef.current && !learningRef.current.contains(event.target as Node)) {
        setLearningDropdownOpen(false);
      }
      if (assessmentRef.current && !assessmentRef.current.contains(event.target as Node)) {
        setAssessmentDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLearningActive = pathname.startsWith('/curriculum') || pathname.startsWith('/recall') || pathname.startsWith('/submaterials');
  const isAssessmentActive = pathname.startsWith('/simulations');
  const isDashboardActive = pathname === '/dashboard';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 shadow-2xs group-hover:scale-105 transition-transform p-1">
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

          {/* Desktop Nav Group [FE-09] */}
          <nav className="hidden md:flex items-center gap-1.5 ml-2">
            {/* Dasbor Direct Link */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isDashboardActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Dasbor</span>
            </Link>

            {/* Pembelajaran Dropdown */}
            <div className="relative" ref={learningRef}>
              <button
                type="button"
                onClick={() => {
                  setLearningDropdownOpen(!learningDropdownOpen);
                  setAssessmentDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isLearningActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Pembelajaran</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${learningDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {learningDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <Link
                    href="/curriculum"
                    onClick={() => setLearningDropdownOpen(false)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-blue-50/70 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Kurikulum Mata Pelajaran</p>
                      <p className="text-[11px] text-slate-500">Materi & soal formatif bertingkat</p>
                    </div>
                  </Link>

                  <Link
                    href="/recall"
                    onClick={() => setLearningDropdownOpen(false)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-amber-50/70 transition-colors group mt-1"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Recall Kemampuanmu</p>
                      <p className="text-[11px] text-slate-500">Latihan pengingatan konsep awal</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Asesmen Dropdown */}
            <div className="relative" ref={assessmentRef}>
              <button
                type="button"
                onClick={() => {
                  setAssessmentDropdownOpen(!assessmentDropdownOpen);
                  setLearningDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isAssessmentActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Asesmen</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${assessmentDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {assessmentDropdownOpen && (
                <div className="absolute left-0 mt-2 w-60 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <Link
                    href="/simulations/1"
                    onClick={() => setAssessmentDropdownOpen(false)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-purple-50/70 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Simulasi Asesmen TKA</p>
                      <p className="text-[11px] text-slate-500">Paket capstone ujian komprehensif</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Section: XP & User Menu */}
        <div className="flex items-center gap-3">
          {/* XP Badge */}
          <div
            title="Total Poin XP Belajar Anda"
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200/80 shadow-2xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>{user?.totalXp ?? 0} XP</span>
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1.5 pl-2 pr-3.5 text-sm hover:border-slate-300 hover:shadow-2xs transition-all focus:outline-none"
            >
              <UserAvatar
                src={user?.avatarUrl}
                name={user?.name || user?.username}
                size="sm"
              />
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[120px]">
                  {user?.name || user?.username || 'Siswa'}
                </p>
                <p className="text-[10px] text-blue-600 font-medium capitalize mt-0.5">
                  {role === 'SUPERADMIN' ? 'SuperAdmin' : role === 'TIM_KURIKULUM' ? 'Tim Kurikulum' : 'Siswa'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="border-b border-slate-100 px-3 py-2.5 flex items-center gap-3">
                  <UserAvatar
                    src={user?.avatarUrl}
                    name={user?.name || user?.username}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-400">Masuk sebagai</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user?.name || user?.username || 'Siswa'}
                    </p>
                    <p className="text-xs text-blue-600 font-mono truncate">
                      @{user?.username || '-'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-slate-500" />
                    Profil Siswa
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
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
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-3">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${
              isDashboardActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Dasbor</span>
          </Link>

          <div className="pt-2 border-t border-slate-100">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Pembelajaran
            </p>
            <Link
              href="/curriculum"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>Kurikulum Mata Pelajaran</span>
            </Link>
            <Link
              href="/recall"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <GraduationCap className="h-4 w-4 text-amber-500" />
              <span>Recall Kemampuanmu</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Asesmen
            </p>
            <Link
              href="/simulations/1"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Layers className="h-4 w-4 text-purple-500" />
              <span>Simulasi Asesmen TKA</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <UserIcon className="h-4 w-4 text-slate-500" />
              <span>Profil Saya</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
