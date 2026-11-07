'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { Footer } from '@/components/layout/Footer';

function VerifyEmailSuccessContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const [closeBlocked, setCloseBlocked] = useState(false);

  const isError = Boolean(errorParam);

  useEffect(() => {
    if (isError) return;

    const timestamp = String(Date.now());
    try {
      localStorage.setItem('agra_email_verified_at', timestamp);
    } catch {
      // Abaikan jika penyimpanan lokal dibatasi
    }

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('agra_email_verification');
        channel.postMessage({ type: 'EMAIL_VERIFIED', timestamp });
        channel.close();
      } catch {
        // Abaikan jika BroadcastChannel tidak didukung
      }
    }
  }, [isError]);

  const handleCloseTab = () => {
    if (typeof window !== 'undefined') {
      window.close();
      setTimeout(() => {
        setCloseBlocked(true);
      }, 250);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 p-1">
              <AppLogo size={26} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-blue-600">AGRA</span>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-500 border-l border-slate-200 pl-2">
                TKA Pintar SMP
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 md:p-10 text-center">
            {isError ? (
              <div className="space-y-5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs">
                  <AlertCircle className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold tracking-wide">
                    <span>TAUTAN TIDAK VALID ATAU KEDALUWARSA</span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Verifikasi Belum Berhasil
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Tautan verifikasi email ini sudah melewati batas waktu 1 jam atau sudah pernah
                    digunakan sebelumnya. Silakan minta tautan verifikasi baru dari halaman
                    pendaftaran atau halaman masuk.
                  </p>
                </div>

                <div className="pt-2 space-y-2.5">
                  <Link
                    href="/register"
                    className="btn-tactile-primary w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <span>Kembali ke Pendaftaran</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span>Ke Halaman Masuk</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-2xs">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>VERIFIKASI EMAIL BERHASIL</span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Email Berhasil Diverifikasi!
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Akun belajar AGRA kamu kini telah aktif. Silakan{' '}
                    <strong className="text-slate-900">kembali ke tab awal</strong> tempat kamu
                    mendaftar—halaman tersebut akan mendeteksi verifikasi ini dan{' '}
                    <strong className="text-blue-600">masuk secara otomatis</strong>.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-left space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-800">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
                    </span>
                    <span>Status Sinkronisasi Otomatis Aktif</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tab pendaftaran/login awalmu sedang menyiapkan sesi belajar secara otomatis.
                    Kamu sudah dapat menutup tab verifikasi ini.
                  </p>
                </div>

                {closeBlocked && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                    Browser mencegah penutupan tab otomatis. Silakan tutup tab ini secara manual dan
                    beralih kembali ke tab awal Anda.
                  </div>
                )}

                <div className="pt-1 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleCloseTab}
                    className="btn-tactile-primary w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Saya Mengerti, Kembali ke Tab Awal</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                  Tab awal tidak sengaja tertutup?{' '}
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    <span>Masuk dari tab ini</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyEmailSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <VerifyEmailSuccessContent />
    </Suspense>
  );
}

