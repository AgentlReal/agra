'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { 
  User, 
  Mail, 
  Lock, 
  Check, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Sliders
} from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { Footer } from '@/components/layout/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password validation rules per UCS-01 & Defect Audit
  const hasLength = password.length >= 6 && password.length <= 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isUsernameValid = /^[a-z0-9_]{3,16}$/.test(username);

  const isFormValid =
    name.trim().length >= 3 &&
    isUsernameValid &&
    email.includes('@') &&
    hasLength &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    passwordsMatch;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setErrorMsg('Harap lengkapi semua kriteria data pendaftaran.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await api.auth.signUpEmail({
        name,
        username,
        email,
        password,
      });

      setSuccessMsg('Pendaftaran akun berhasil! Mengalihkan ke halaman masuk...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mendaftarkan akun. Silakan coba lagi.');
    } finally {
      setLoading(false);
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

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Sudah memiliki akun?</span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 md:p-10">
            {/* Header Tag */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>DAFTAR AKUN BARU SISWA</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Buat Akun Belajarmu</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Lengkapi formulir untuk mulai mengasah kemampuan asesmen adaptif TKA SMP.
              </p>
            </div>

            {/* Error Message (Safe-to-fail warm amber container, red banned) */}
            {errorMsg && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message (Emerald mint) */}
            {successMsg && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2" htmlFor="name">
                  <User className="h-4 w-4 text-blue-600" />
                  <span>Nama Lengkap Siswa</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="misal: Rizky Ramadhan"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                />
              </div>

              {/* Username */}
              <div>
                <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2" htmlFor="username">
                  <User className="h-4 w-4 text-blue-600" />
                  <span>Username</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 font-mono text-sm">@</span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                    placeholder="rizky_ramadhan"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">3–16 karakter: huruf kecil, angka, garis bawah (_)</p>
              </div>

              {/* Email */}
              <div>
                <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2" htmlFor="email">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>Alamat Email</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  placeholder="rizky@smp.sch.id"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2" htmlFor="password">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span>Kata Sandi Baru</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Buat kata sandi baru (6–12 karakter)"
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

              {/* Password Security Criteria Box (From DESIGN.md) */}
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

              {/* Confirm Password */}
              <div>
                <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2" htmlFor="confirmPassword">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>Konfirmasi Kata Sandi</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="confirmPassword"
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

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="btn-tactile-primary w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Daftarkan Akun Siswa</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Masuk di sini
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
