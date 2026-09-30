'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Database, Layers, UserCheck, ArrowLeftRight, LogOut, ShieldAlert } from 'lucide-react';

export const AdminNav: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { label: 'Bank Soal', href: '/admin/bank-soal', icon: Database },
    { label: 'Paket Simulasi', href: '/admin/paket-simulasi', icon: Layers },
    { label: 'Profil Kurikulum', href: '/admin/profile', icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-950/60 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/admin/bank-soal" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 shadow-lg shadow-purple-500/20">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                AGRA Kurikulum
                <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-500/30">
                  Admin Tim Kurikulum
                </span>
              </span>
              <p className="text-[11px] text-slate-400">
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
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

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Ke Portal Siswa"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-indigo-400" />
            <span>Lihat Mode Siswa</span>
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{user?.name || 'Tim Kurikulum'}</p>
              <p className="text-[10px] text-purple-400 font-mono">@{user?.username || 'tim_kurikulum'}</p>
            </div>
            <button
              onClick={() => logout()}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
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
