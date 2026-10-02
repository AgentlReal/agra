'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg('');

    try {
      await api.auth.requestPasswordReset(email);
      setSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengirim instruksi pemulihan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-lg shadow-indigo-500/10 p-1">
              <AppLogo size={34} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">AGRA</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white">Pemulihan Kata Sandi</h2>
          <p className="mt-1 text-xs text-slate-400">
            Masukkan email terdaftar untuk menerima instruksi reset kata sandi
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-white">Email Pemulihan Terkirim!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kami telah mengirimkan tautan reset kata sandi ke <span className="font-semibold text-indigo-400">{email}</span>. Periksa kotak masuk dan folder spam Anda.
              </p>
              <div className="pt-4 border-t border-slate-800">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" /> Kembali ke Halaman Masuk
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300">Alamat Email Terdaftar</label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Kirim Tautan Pemulihan</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Batal dan Kembali ke Masuk
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
