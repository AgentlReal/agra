'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Menu, LogOut, Shield, ChevronRight } from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';

export const AdminNav: React.FC = () => {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const isSuperAdmin = role === 'SUPERADMIN' || user?.role === 'SUPERADMIN';

  const getPageTitle = () => {
    if (pathname.includes('/admin/dashboard')) return 'Dasbor Analitik';
    if (pathname.includes('/admin/bank-soal/create')) return 'Tambah Butir Soal';
    if (pathname.includes('/admin/bank-soal/import')) return 'Impor Butir Soal';
    if (pathname.includes('/admin/bank-soal')) return 'Bank Soal Asesmen';
    if (pathname.includes('/admin/validasi-soal')) return 'Antrean Validasi Soal';
    if (pathname.includes('/admin/paket-simulasi/create')) return 'Buat Paket Simulasi';
    if (pathname.includes('/admin/paket-simulasi')) return 'Paket Ujian Simulasi';
    if (pathname.includes('/admin/kurikulum')) return 'Struktur Kurikulum';
    if (pathname.includes('/admin/users')) return 'Manajemen Pengguna';
    if (pathname.includes('/admin/profile')) return 'Profil Akun';
    return 'Panel Tata Kelola Kurikulum';
  };

  const handleOpenMobileSidebar = () => {
    window.dispatchEvent(new CustomEvent('agra:toggle-admin-sidebar'));
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile hamburger & breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">{getPageTitle()}</span>
          </div>
        </div>

        {/* Right: User badge & logout */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isSuperAdmin
                ? 'bg-violet-50 text-violet-700 border border-violet-200'
                : 'bg-purple-50 text-purple-700 border border-purple-200'
            }`}
          >
            <Shield className="w-3 h-3" />
            {isSuperAdmin ? 'SuperAdmin' : 'Tim Kurikulum'}
          </span>

          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user?.name || user?.username || 'Admin'}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              @{user?.username || 'admin'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors shadow-2xs"
            title="Keluar Sesi"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
