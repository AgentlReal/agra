'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Lock, Check, AlertCircle, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles, Sliders } from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { Footer } from '@/components/layout/Footer';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (!token) {
      setErrorMsg('Token tautan pemulihan kata sandi tidak ditemukan atau tidak valid. Silakan ajukan permohonan baru dari halaman Lupa Kata Sandi.');
    }
  }, [token]);

  const hasLength = password.length >= 6 && password.length <= 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isValid = hasLength && hasUpper && hasLower && hasNumber && hasSpecial && passwordsMatch;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg('Token tautan pemulihan kata sandi tidak ditemukan atau tidak valid. Silakan ajukan permohonan baru dari halaman Lupa Kata Sandi.');
      return;
    }
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
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
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

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <span>Masuk</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 md:p-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>ATUR ULANG KATA SANDI</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Buat Kata Sandi Baru</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Masukkan kombinasi sandi baru yang aman untuk akun belajarmu.
              </p>
            </div>

            {success ? (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Kata Sandi Berhasil Diperbarui!</h3>
                <p className="text-xs text-slate-600">
                  Mengalihkanmu ke halaman masuk dalam beberapa detik...
                </p>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                {errorMsg && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-blue-600" />
                    <span>Kata Sandi Baru</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Buat sandi baru (6–12 karakter)"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Criteria Box */}
                <div className="bg-[#eff6ff] border border-blue-100 rounded-xl p-4 text-xs">
                  <div className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                    <Sliders className="h-3.5 w-3.5 text-blue-600" />
                    <span>Kriteria Keamanan Sandi :</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${hasLength ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                        {hasLength ? '✓' : ''}
                      </span>
                      <span>Minimal 6 karakter (maksimal 12 karakter)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${hasUpper && hasLower ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                        {hasUpper && hasLower ? '✓' : ''}
                      </span>
                      <span>Memuat huruf kapital (A–Z) dan huruf kecil (a–z)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${hasNumber ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                        {hasNumber ? '✓' : ''}
                      </span>
                      <span>Memuat minimal satu angka (0–9)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${hasSpecial ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                        {hasSpecial ? '✓' : ''}
                      </span>
                      <span>Memuat simbol atau karakter khusus (@, #, $, %, dll.)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span>Konfirmasi Kata Sandi Baru</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang kata sandi baru"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <p className={`text-[11px] mt-1 flex items-center gap-1 ${passwordsMatch ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {passwordsMatch ? '✓ Kata sandi cocok' : '⚠ Kata sandi belum cocok'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="btn-tactile-primary w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all mt-2"
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
      </main>

      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-500 text-sm">Memuat halaman...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
