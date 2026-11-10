'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [learningDropdownOpen, setLearningDropdownOpen] = useState(false);
  const [assessmentDropdownOpen, setAssessmentDropdownOpen] = useState(false);

  const learningRef = useRef<HTMLDivElement>(null);
  const assessmentRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

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

  const isLearningActive =
    pathname.startsWith('/curriculum') ||
    pathname.startsWith('/recall') ||
    pathname.startsWith('/submaterials');
  const isAssessmentActive = pathname.startsWith('/simulations');
  const isDashboardActive = pathname === '/dashboard';

  return (
    <header
      style={{ fontFamily: "'Onest', sans-serif" }}
      className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md"
    >
      <div className="w-full flex h-18 items-center justify-between px-6 sm:px-12 lg:px-16">
        {/* Kiri: Logo AGRA Seamless + Menu Navigasi */}
        <div className="flex items-center gap-10">
          <Link href="/dashboard" className="min-h-[48px] inline-flex items-center gap-2.5 group">
            <img
              src="/assets/images/agra-icon.png"
              alt="Logo AGRA"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-[26px] font-semibold tracking-[-0.04em] text-[#0A0D14] flex items-center">
              AGRA
              <span className="inline-block w-2 h-2 rounded-full bg-[#1B68FF] ml-1" />
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/dashboard"
              className={`min-h-[44px] px-4 inline-flex items-center rounded-[12px] text-[15px] font-medium transition-colors ${
                isDashboardActive
                  ? 'bg-[#EEF2FA] text-[#1B68FF] font-semibold'
                  : 'text-[#334155] hover:text-[#0A0D14] hover:bg-slate-100/80'
              }`}
            >
              Dasbor
            </Link>

            {/* Dropdown Pembelajaran */}
            <div className="relative" ref={learningRef}>
              <button
                type="button"
                onClick={() => {
                  setLearningDropdownOpen(!learningDropdownOpen);
                  setAssessmentDropdownOpen(false);
                }}
                className={`min-h-[44px] px-4 inline-flex items-center gap-1.5 rounded-[12px] text-[15px] font-medium transition-colors cursor-pointer ${
                  isLearningActive
                    ? 'bg-[#EEF2FA] text-[#1B68FF] font-semibold'
                    : 'text-[#334155] hover:text-[#0A0D14] hover:bg-slate-100/80'
                }`}
              >
                <span>Pembelajaran</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    learningDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {learningDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)] z-50">
                  <Link
                    href="/curriculum"
                    onClick={() => setLearningDropdownOpen(false)}
                    className="block p-3 rounded-[14px] hover:bg-[#F4F7FC] transition-colors"
                  >
                    <p className="text-[15px] font-semibold text-[#0A0D14]">
                      Kurikulum Mata Pelajaran
                    </p>
                    <p className="text-[13px] text-[#334155] mt-0.5">
                      16 submateri Matematika &amp; B. Indonesia
                    </p>
                  </Link>

                  <Link
                    href="/recall"
                    onClick={() => setLearningDropdownOpen(false)}
                    className="block p-3 rounded-[14px] hover:bg-[#F4F7FC] transition-colors mt-1"
                  >
                    <p className="text-[15px] font-semibold text-[#0A0D14]">
                      Recall Kemampuan Awal
                    </p>
                    <p className="text-[13px] text-[#334155] mt-0.5">
                      30 soal diagnostik pemetaan konsep
                    </p>
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown Asesmen */}
            <div className="relative" ref={assessmentRef}>
              <button
                type="button"
                onClick={() => {
                  setAssessmentDropdownOpen(!assessmentDropdownOpen);
                  setLearningDropdownOpen(false);
                }}
                className={`min-h-[44px] px-4 inline-flex items-center gap-1.5 rounded-[12px] text-[15px] font-medium transition-colors cursor-pointer ${
                  isAssessmentActive
                    ? 'bg-[#EEF2FA] text-[#1B68FF] font-semibold'
                    : 'text-[#334155] hover:text-[#0A0D14] hover:bg-slate-100/80'
                }`}
              >
                <span>Simulasi CBT</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    assessmentDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {assessmentDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)] z-50">
                  <Link
                    href="/simulations/1"
                    onClick={() => setAssessmentDropdownOpen(false)}
                    className="block p-3 rounded-[14px] hover:bg-[#F4F7FC] transition-colors"
                  >
                    <p className="text-[15px] font-semibold text-[#0A0D14]">
                      Simulasi Matematika SMP
                    </p>
                    <p className="text-[13px] text-[#334155] mt-0.5">
                      Ujian mandiri 30 soal (75 menit)
                    </p>
                  </Link>
                  <Link
                    href="/simulations/2"
                    onClick={() => setAssessmentDropdownOpen(false)}
                    className="block p-3 rounded-[14px] hover:bg-[#F4F7FC] transition-colors mt-1"
                  >
                    <p className="text-[15px] font-semibold text-[#0A0D14]">
                      Simulasi B. Indonesia SMP
                    </p>
                    <p className="text-[13px] text-[#334155] mt-0.5">
                      Ujian mandiri 30 soal (75 menit)
                    </p>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Kanan: XP & Profil Siswa */}
        <div className="flex items-center gap-3.5">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-[#EEF2FA] px-4 py-1.5 text-[14px] font-semibold text-[#0A0D14] border border-slate-200/80">
                <span className="w-2 h-2 rounded-full bg-[#1B68FF]" />
                <span>{user?.totalXp ?? 0} XP</span>
              </div>

              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-2 pr-4 hover:border-slate-300 transition-all cursor-pointer"
                >
                  <UserAvatar
                    src={user?.avatarUrl}
                    name={user?.name || user?.username}
                    size="sm"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-[14px] font-semibold text-[#0A0D14] leading-none truncate max-w-[140px]">
                      {user?.name || user?.username || 'Siswa'}
                    </p>
                    <p className="text-[12px] text-[#1B68FF] font-medium mt-0.5">
                      {role === 'SUPERADMIN'
                        ? 'SuperAdmin'
                        : role === 'TIM_KURIKULUM'
                          ? 'Tim Kurikulum'
                          : 'Siswa'}
                    </p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)] z-50">
                    <div className="border-b border-slate-100 px-3 py-3 flex items-center gap-3">
                      <UserAvatar
                        src={user?.avatarUrl}
                        name={user?.name || user?.username}
                        size="md"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-[#0A0D14] truncate">
                          {user?.name || user?.username || 'Siswa'}
                        </p>
                        <p className="text-[13px] text-[#334155] truncate">
                          @{user?.username || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 mt-1 space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-[14px] font-medium text-[#0A0D14] hover:bg-[#F4F7FC] transition-colors"
                      >
                        <UserIcon className="h-4 w-4 text-[#334155]" />
                        <span>Profil Siswa</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-[14px] font-medium text-[#78350F] hover:bg-[#FFFBEB] transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-[#D97706]" />
                        <span>Keluar Sesi</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="min-h-[42px] px-4 py-2 rounded-[12px] border border-slate-200 bg-white text-[14px] font-semibold text-[#0A0D14] hover:bg-slate-50 transition-colors inline-flex items-center"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="min-h-[42px] px-5 py-2 rounded-[12px] bg-[#1B68FF] text-[14px] font-semibold text-white hover:bg-[#1454D6] transition-colors inline-flex items-center"
              >
                Daftar
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-[#0A0D14]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-6 py-4 space-y-2">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-[12px] text-[15px] font-semibold text-[#0A0D14] hover:bg-[#F4F7FC]"
          >
            Dasbor
          </Link>
          <Link
            href="/curriculum"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-[12px] text-[15px] font-medium text-[#334155] hover:bg-[#F4F7FC]"
          >
            Kurikulum Mata Pelajaran
          </Link>
          <Link
            href="/recall"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-[12px] text-[15px] font-medium text-[#334155] hover:bg-[#F4F7FC]"
          >
            Recall Kemampuan Awal
          </Link>
          <Link
            href="/simulations/1"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-[12px] text-[15px] font-medium text-[#334155] hover:bg-[#F4F7FC]"
          >
            Simulasi CBT
          </Link>
        </div>
      )}
    </header>
  );
};
