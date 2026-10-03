'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Database, Layers, UserCheck, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { AppLogo } from '@/components/common/AppLogo';

export const AdminNav: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isLight, toggleTheme } = useTheme();

  const links = [
    { label: 'Bank Soal', href: '/admin/bank-soal', icon: Database },
    { label: 'Paket Simulasi', href: '/admin/paket-simulasi', icon: Layers },
    { label: 'Profil Kurikulum', href: '/admin/profile', icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/admin/bank-soal" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 shadow-xs p-1">
              <AppLogo size={30} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                AGRA Kurikulum
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 border border-purple-200">
                  Admin Tim Kurikulum
                </span>
              </span>
              <p className="text-[11px] text-slate-500">
                Pusat Tata Kelola Bank Soal & Blueprint Asesmen
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 ml-4">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 font-semibold border border-purple-200/70'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
            title="Ganti Tema (Dark / Light)"
          >
            {isLight ? <Moon className="h-4 w-4 text-purple-600" /> : <Sun className="h-4 w-4 text-amber-500" />}
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800">{user?.name || user?.username || 'Admin'}</p>
              <p className="text-[10px] text-purple-700 font-mono">@{user?.username || 'admin'}</p>
            </div>
            <button
              onClick={() => logout()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs"
              title="Keluar Sesi"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
