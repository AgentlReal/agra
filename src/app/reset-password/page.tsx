'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import { GraduationCap, Lock, Check, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'mock_token';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const hasLength = password.length >= 6 && password.length <= 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isValid = hasLength && hasUpper && hasLower && hasNumber && hasSpecial && passwordsMatch;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setErrorMsg('');

    try {
      await api.auth.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengatur ulang kata sandi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-lg shadow-indigo-500/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">AGRA</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white">Atur Ulang Kata Sandi</h2>
          <p className="mt-1 text-xs text-slate-400">Buat kata sandi baru untuk akun Anda</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {success ? (
            <div className="text-center py-4 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-white">Kata Sandi Berhasil Diperbarui!</h3>
              <p className="text-xs text-slate-300">
                Mengalihkan Anda ke halaman masuk...
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300">Kata Sandi Baru</label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                </div>

                <div className="mt-2.5 rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5 text-[11px] space-y-1">
                  <div className={`flex items-center gap-1.5 ${hasLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check className="h-3 w-3" />
                    <span>Panjang 6 - 12 karakter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpper && hasLower ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check className="h-3 w-3" />
                    <span>Kombinasi huruf besar & kecil</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber && hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check className="h-3 w-3" />
                    <span>Memuat angka & simbol</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">Konfirmasi Kata Sandi Baru</label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isValid}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Simpan Kata Sandi Baru</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Memuat...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
