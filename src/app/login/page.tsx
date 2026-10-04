'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { 
  User as UserIcon, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Info,
  AlertCircle,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { Footer } from '@/components/layout/Footer';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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

      const token = res?.session?.token || res?.token;
      const authUser = res?.user;

      if (!authUser) {
        throw new Error('Gagal mendapatkan sesi pengguna.');
      }

      await login(token, {
        id: authUser.id,
        name: authUser.name || authUser.username || '',
        username: authUser.username || authUser.email?.split('@')[0] || '',
        email: authUser.email,
        role: authUser.role === 'TIM_KURIKULUM' ? 'TIM_KURIKULUM' : 'SISWA',
      });

      if (authUser.role === 'TIM_KURIKULUM') {
        router.push('/admin/bank-soal');
      } else {
        try {
          await api.profile.get();
          router.push('/dashboard');
        } catch (profErr: any) {
          if (profErr.code === 'PROFILE_INCOMPLETE' || profErr.status === 409) {
            router.push('/onboarding');
          } else {
            router.push('/dashboard');
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk. Periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Header Bar */}
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

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Belum punya akun?</span>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <span>Daftar Akun Baru</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Split Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-6 space-y-6 lg:pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide border border-blue-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Platform Asesmen Ramah Siswa (Safe-to-Fail)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.2]">
              Ruang Belajar & Simulasi TKA <span className="text-blue-600">SMP Fase D</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Persiapkan dirimu menghadapi Tes Kemampuan Akademik (TKA) jenjang SMP/MTs dengan latihan formatif bertingkat, evaluasi adaptif, dan simulasi CBT 75 menit berstandar Kemendikdasmen tanpa rasa cemas.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-800">Evaluasi Formatif 3 Level Kognitif</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pemahaman konsep, penalaran kontekstual, dan pemecahan masalah HOTS.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-800">Safe-to-Fail Learning Environment</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">Bebas dari rasa takut salah; setiap remedi dirancang untuk memperkuat pemahamanmu.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card Column */}
          <div className="lg:col-span-6 w-full">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 md:p-10 relative">
              
              {/* Form Heading Tag */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide mb-3">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>MASUK KE RUANG BELAJAR</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat datang!</h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Masuk untuk memulai latihan dan raih skor TKA impianmu hari ini.
                </p>
              </div>

              {/* Error Message (Safe-to-fail warm amber container, red banned) */}
              {errorMsg && (
                <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Identifier Field */}
                <div>
                  <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2" htmlFor="identifier">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                    <span>Email atau Username</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="misal: farhan@smp.sch.id / firman"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2" htmlFor="password">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <span>Kata Sandi</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Lupa kata sandi?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi akunmu"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                      title={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Pretest Reminder Box (Light Blue Container) */}
                <div className="bg-[#eff6ff] border border-blue-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Setelah berhasil masuk, kamu dapat langsung melanjutkan asesmen awal Recall atau materi kurikulum untuk mengukur penguasaan TKA.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-tactile-primary w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none mt-2"
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

                {/* Secondary Action */}
                <div className="pt-2 text-center">
                  <Link
                    href="/register"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <span>Daftar Akun Siswa Baru</span>
                  </Link>
                </div>
              </form>

              {/* Trust Badge Bottom */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Didukung standar Kemendikdasmen untuk asesmen ramah siswa.</span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
