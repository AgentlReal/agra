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
  EyeOff
} from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';

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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-lg shadow-indigo-500/10 p-1">
              <AppLogo size={34} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">AGRA</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white">Daftar Akun Siswa Baru</h2>
          <p className="mt-1 text-xs text-slate-400">
            Mulai eksplorasi materi dan uji kemampuan adaptif TKA SMP Anda
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300">Nama Lengkap</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">Username</label>
                <span className="text-[10px] text-slate-500">3-16 karakter huruf kecil/angka/_</span>
              </div>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                  placeholder="contoh_siswa12"
                  required
                  className={`w-full rounded-xl border bg-slate-950/80 px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none ${
                    username.length > 0 && !isUsernameValid ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                <span className="absolute left-3.5 top-3 text-sm font-mono text-slate-500">@</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">Alamat Email</label>
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

            <div>
              <label className="block text-xs font-semibold text-slate-300">Kata Sandi</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Requirements Checklist */}
              <div className="mt-2.5 rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5 text-[11px] space-y-1">
                <div className={`flex items-center gap-1.5 ${hasLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Check className="h-3 w-3" />
                  <span>Panjang 6 - 12 karakter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper && hasLower ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Check className="h-3 w-3" />
                  <span>Kombinasi huruf kapital dan huruf kecil</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Check className="h-3 w-3" />
                  <span>Memuat minimal 1 angka (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Check className="h-3 w-3" />
                  <span>Memuat minimal 1 karakter simbol khusus</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">Konfirmasi Kata Sandi</label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full rounded-xl border bg-slate-950/80 px-4 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none ${
                    confirmPassword && !passwordsMatch ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed mt-2"
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

          <p className="mt-6 text-center text-xs text-slate-400">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
