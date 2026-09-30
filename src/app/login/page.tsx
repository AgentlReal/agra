'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { 
  GraduationCap, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg('Harap isi email/username dan kata sandi Anda.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const isEmail = identifier.includes('@');
      let res;
      if (isEmail) {
        res = await api.auth.signInEmail(identifier, password);
      } else {
        res = await api.auth.signInUsername(identifier, password);
      }

      const token = res.token || 'mock_session_token_' + Date.now();
      const user = res.user || {
        id: 'usr_' + Date.now(),
        name: identifier === 'tim_kurikulum' ? 'Dra. Sri Wahyuni, M.Pd.' : 'Budi Santoso',
        username: identifier,
        email: isEmail ? identifier : `${identifier}@example.com`,
        role: identifier === 'tim_kurikulum' ? 'TIM_KURIKULUM' : 'SISWA',
        grade: 8,
        totalXp: 450,
        currentStreak: 5,
      };

      login(token, user);

      if (user.role === 'TIM_KURIKULUM') {
        router.push('/admin/bank-soal');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk. Periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoUser: 'siswa' | 'kurikulum') => {
    if (demoUser === 'siswa') {
      setIdentifier('user');
      setPassword('Belajar1!');
    } else {
      setIdentifier('tim_kurikulum');
      setPassword('Belajar1!');
    }
    setErrorMsg('');
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Column: Brand Showcase Hero */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 lg:w-1/2 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-800">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 shadow-xl shadow-indigo-500/20">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                AGRA
                <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/30">
                  TKA SMP
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Ruang Belajar Mandiri & Asesmen Adaptif</p>
            </div>
          </Link>

          <div className="mt-16 max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Platform Asesmen Ramah Siswa Kemendikdasmen
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Kuasai Potensi Akademik SMP Tanpa Rasa Cemas.
            </h2>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Persiapkan Asesmen Tes Kemampuan Akademik (TKA) Fase D dengan latihan terstruktur 3 level kognitif, evaluasi formatif ramah nalar (*Safe-to-Fail*), dan simulasi berstandar nasional.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Safe-to-Fail Drill</h4>
                    <p className="text-[11px] text-slate-400">Latihan santai tanpa timer</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Mastery Learning</h4>
                    <p className="text-[11px] text-slate-400">Tuntas 80% per level materi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 text-xs text-slate-500">
          Terhubung ke Mock API Server di <span className="font-mono text-indigo-400">localhost:4010</span>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-slate-950">
        <div className="mx-auto w-full max-w-md">
          {/* Quick Demo Selector */}
          <div className="mb-6 rounded-2xl border border-indigo-900/40 bg-indigo-950/20 p-4">
            <p className="text-xs font-semibold text-indigo-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Pintas Akun Demo (Uji Cepat):
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('siswa')}
                className="flex-1 rounded-lg border border-indigo-700/40 bg-indigo-600/20 px-3 py-2 text-xs font-medium text-indigo-200 hover:bg-indigo-600/30 transition-colors text-center"
              >
                Siswa: <span className="font-mono font-bold">user</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('kurikulum')}
                className="flex-1 rounded-lg border border-purple-700/40 bg-purple-600/20 px-3 py-2 text-xs font-medium text-purple-200 hover:bg-purple-600/30 transition-colors text-center"
              >
                Admin: <span className="font-mono font-bold">tim_kurikulum</span>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Selamat datang kembali!
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Masuk untuk melanjutkan proses belajar mandiri Anda.
            </p>
          </div>

          {errorMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Email atau Username
              </label>
              <div className="relative mt-1.5">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: user atau user@example.com"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Kata Sandi
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400">
                Ingat saya di perangkat ini
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Masuk ke Ruang Belajar</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Belum memiliki akun?{' '}
            <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Daftar Akun Siswa Baru
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
