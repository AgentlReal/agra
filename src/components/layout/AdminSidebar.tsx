'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AppLogo } from '@/components/common/AppLogo';
import {
  LayoutDashboard,
  Database,
  PlusCircle,
  ClipboardCheck,
  UploadCloud,
  Layers,
  Plus,
  Network,
  Users,
  UserCheck,
  LogOut,
  X,
  ChevronRight,
  Shield,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isSuperAdmin = role === 'SUPERADMIN' || user?.role === 'SUPERADMIN';

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev);
    const handleClose = () => setIsMobileOpen(false);

    window.addEventListener('agra:toggle-admin-sidebar', handleToggle);
    window.addEventListener('agra:close-admin-sidebar', handleClose);
    return () => {
      window.removeEventListener('agra:toggle-admin-sidebar', handleToggle);
      window.removeEventListener('agra:close-admin-sidebar', handleClose);
    };
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const navGroups = [
    {
      group: 'Ringkasan',
      items: [
        { label: 'Dasbor Analitik', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Bank Soal',
      items: [
        { label: 'Semua Soal', href: '/admin/bank-soal', icon: Database },
        { label: 'Tambah Soal Baru', href: '/admin/bank-soal/create', icon: PlusCircle },
        { label: 'Antrean Validasi', href: '/admin/validasi-soal', icon: ClipboardCheck },
        { label: 'Impor Massal', href: '/admin/bank-soal/import', icon: UploadCloud },
      ],
    },
    {
      group: 'Simulasi Ujian',
      items: [
        { label: 'Paket Simulasi', href: '/admin/paket-simulasi', icon: Layers },
        { label: 'Buat Paket Baru', href: '/admin/paket-simulasi/create', icon: Plus },
      ],
    },
    {
      group: 'Tata Kelola Kurikulum',
      items: [
        { label: 'Struktur Kurikulum', href: '/admin/kurikulum', icon: Network },
        ...(isSuperAdmin
          ? [{ label: 'Manajemen Pengguna', href: '/admin/users', icon: Users }]
          : []),
      ],
    },
    {
      group: 'Akun',
      items: [
        { label: 'Profil Saya', href: '/admin/profile', icon: UserCheck },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 w-64 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 p-1 shadow-xs">
            <AppLogo size={28} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900 tracking-tight">AGRA Kurikulum</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  isSuperAdmin
                    ? 'bg-violet-100 text-violet-800 border border-violet-200'
                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                }`}
              >
                <Shield className="w-2.5 h-2.5" />
                {isSuperAdmin ? 'SuperAdmin' : 'Tim Kurikulum'}
              </span>
            </div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          aria-label="Tutup menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {group.group}
            </p>
            <div className="space-y-0.5 mt-1.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/admin/dashboard'
                    ? pathname === '/admin/dashboard' || pathname === '/admin'
                    : pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin/bank-soal' && item.href !== '/admin/paket-simulasi');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-purple-50 text-purple-700 font-semibold border border-purple-200/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-purple-400" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate">
              {user?.name || user?.username || 'Admin'}
            </p>
            <p className="text-[10px] text-slate-500 font-mono truncate">
              @{user?.username || 'admin'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
            title="Keluar dari Sesi"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Backdrop + Slide Over) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

