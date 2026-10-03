'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const isAuthorized = isAuthenticated && user && (role === 'TIM_KURIKULUM' || user.role === 'TIM_KURIKULUM');

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      const timeout = setTimeout(() => {
        router.replace('/dashboard');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, isAuthorized, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-xs font-semibold text-slate-500">Memverifikasi otoritas akses kurikulum...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-amber-200/80 p-8 shadow-xs text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Akses Ditolak
            </span>
            <h1 className="text-xl font-extrabold text-slate-900">
              Area Khusus Tim Kurikulum
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Akun Anda terdaftar sebagai siswa dan tidak memiliki otorisasi untuk mengakses modul kurikulum atau bank soal. Anda akan dialihkan secara otomatis ke dasbor siswa.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 px-4 transition-colors shadow-2xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Dasbor Siswa</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
