'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Sliders,
  RefreshCw,
} from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { GoogleAuthButton, formatOAuthErrorMessage } from '@/components/common/GoogleAuthButton';
import { Footer } from '@/components/layout/Footer';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const errorParams = searchParams.getAll('error');
  const oauthErrorParam = errorParams.length > 0 ? errorParams[errorParams.length - 1] : null;
  const { user, isLoading: authLoading, isAuthenticated, login } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verificationSentTo, setVerificationSentTo] = useState<string | null>(null);
  const [isVerifiedRedirecting, setIsVerifiedRedirecting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccessMsg, setResendSuccessMsg] = useState('');
  const autoLoginLockRef = useRef(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.cookie = 'agra_staff_login=; path=/; max-age=0; SameSite=Lax';
    }
  }, []);

  useEffect(() => {
    if (authLoading || loading || verificationSentTo || !isAuthenticated || !user || oauthErrorParam) {
      return;
    }
    if (user.role === 'SUPERADMIN' || user.role === 'TIM_KURIKULUM') {
      router.replace('/admin/dashboard');
    } else if (user.needsOnboarding) {
      router.replace('/onboarding');
    } else {
      router.replace('/dashboard');
    }
  }, [authLoading, loading, verificationSentTo, isAuthenticated, user, oauthErrorParam, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (!verificationSentTo) {
      autoLoginLockRef.current = false;
      return;
    }

    let isMounted = true;

    const performAutoSignIn = async () => {
      if (autoLoginLockRef.current || !isMounted) return;
      autoLoginLockRef.current = true;
      setIsVerifiedRedirecting(true);
      setErrorMsg('');

      try {
        const res = await api.auth.signInEmail(
          verificationSentTo,
          password,
          '/verify-email-success'
        );
        const sessionToken = res?.session?.token || res?.token;
        if (sessionToken && res?.user) {
          const rawRole = res.user.role;
          const resolvedRole: 'SUPERADMIN' | 'TIM_KURIKULUM' | 'SISWA' =
            rawRole === 'SUPERADMIN'
              ? 'SUPERADMIN'
              : rawRole === 'TIM_KURIKULUM'
                ? 'TIM_KURIKULUM'
                : 'SISWA';
          await login(sessionToken, {
            id: res.user.id,
            name: res.user.name || name.trim(),
            username: res.user.username || username.trim().toLowerCase(),
            email: res.user.email || verificationSentTo,
            role: resolvedRole,
          });
          if (resolvedRole === 'SUPERADMIN' || resolvedRole === 'TIM_KURIKULUM') {
            router.push('/admin/dashboard');
          } else {
            router.push('/onboarding');
          }
          return;
        }
        router.push('/login');
      } catch {
        if (isMounted) {
          autoLoginLockRef.current = false;
          setIsVerifiedRedirecting(false);
        }
      }
    };

    const checkAndSignIn = async () => {
      if (autoLoginLockRef.current || !isMounted) return;
      try {
        const status = await api.auth.checkVerificationStatus(verificationSentTo);
        if (status?.verified && isMounted) {
          await performAutoSignIn();
        }
      } catch {
        // Abaikan gangguan jaringan sementara saat pengecekan otomatis
      }
    };

    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('agra_email_verification');
        channel.onmessage = (event) => {
          if (event.data?.type === 'EMAIL_VERIFIED') {
            void checkAndSignIn();
          }
        };
      } catch {
        channel = null;
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'agra_email_verified_at') {
        void checkAndSignIn();
      }
    };

    const handleFocus = () => {
      void checkAndSignIn();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkAndSignIn();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const pollTimer = setInterval(() => {
      void checkAndSignIn();
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (channel) {
        channel.close();
      }
    };
  }, [verificationSentTo, password, name, username, login, router]);

  const displayError = errorMsg || formatOAuthErrorMessage(oauthErrorParam);

  // Password & username validation rules per UCS-01
  const hasLength = password.length >= 6 && password.length <= 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isUsernameValid = /^[a-z0-9_]{3,16}$/.test(username);

  const isFormValid =
    name.trim().length >= 3 &&
    name.trim().length <= 30 &&
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
    setResendSuccessMsg('');

    try {
      const res = await api.auth.signUpEmail({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        callbackURL: '/verify-email-success',
      });

      const sessionToken = res?.session?.token || res?.token;
      if (sessionToken && res?.user) {
        const rawRole = res.user.role;
        const resolvedRole: 'SUPERADMIN' | 'TIM_KURIKULUM' | 'SISWA' =
          rawRole === 'SUPERADMIN'
            ? 'SUPERADMIN'
            : rawRole === 'TIM_KURIKULUM'
              ? 'TIM_KURIKULUM'
              : 'SISWA';
        await login(sessionToken, {
          id: res.user.id,
          name: res.user.name || name.trim(),
          username: res.user.username || username.trim().toLowerCase(),
          email: res.user.email || email.trim().toLowerCase(),
          role: resolvedRole,
        });
        if (resolvedRole === 'SUPERADMIN' || resolvedRole === 'TIM_KURIKULUM') {
          router.push('/admin/dashboard');
        } else {
          router.push('/onboarding');
        }
        return;
      }

      setVerificationSentTo(email.trim().toLowerCase());
      setResendCooldown(30);
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : '';
      const lowerMsg = rawMsg.toLowerCase();
      let friendlyMsg = rawMsg || 'Gagal mendaftarkan akun. Silakan coba lagi.';
      if (lowerMsg.includes('username is already taken')) {
        friendlyMsg = 'Username ini sudah digunakan oleh pengguna lain. Silakan pilih username lain.';
      } else if (lowerMsg.includes('user already exists')) {
        friendlyMsg = 'Email ini sudah terdaftar. Silakan langsung masuk melalui halaman Login.';
      }
      setErrorMsg(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!verificationSentTo || resending || resendCooldown > 0) return;

    setResending(true);
    setErrorMsg('');
    setResendSuccessMsg('');

    try {
      await api.auth.sendVerificationEmail(verificationSentTo, '/verify-email-success');
      setResendSuccessMsg('Tautan verifikasi baru berhasil dikirim ke kotak masuk emailmu.');
      setResendCooldown(30);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Gagal mengirim ulang email verifikasi.';
      setErrorMsg(msg || 'Gagal mengirim ulang email verifikasi.');
    } finally {
      setResending(false);
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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {verificationSentTo ? 'Verifikasi Alamat Emailmu' : 'Buat Akun Belajarmu'}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
                {verificationSentTo
                  ? 'Satu langkah lagi sebelum memilih tingkat kelas dan avatar belajarmu.'
                  : 'Daftar instan menggunakan Akun Google atau lengkapi formulir pendaftaran dengan verifikasi email.'}
              </p>
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{displayError}</span>
              </div>
            )}

            {verificationSentTo ? (
              isVerifiedRedirecting ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-600 border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-base font-bold text-slate-900">
                      Email Berhasil Diverifikasi!
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Status verifikasi telah diterima. Sedang masuk secara otomatis dan menyiapkan
                      halaman pemilihan tingkat kelas &amp; avatar...
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 pt-1">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span>Mengalihkan ke penyiapan profil...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-600 border border-emerald-200 shadow-2xs">
                      <Mail className="h-7 w-7" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900">
                      Tautan Verifikasi Telah Dikirim!
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Kami telah mengirimkan email aktivasi ke{' '}
                      <span className="font-bold text-blue-600 break-all">{verificationSentTo}</span>.
                      Buka kotak masuk (atau folder <strong>Spam/Promosi</strong>) lalu klik tombol{' '}
                      <strong>Verifikasi Email &amp; Aktifkan Akun</strong>.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-slate-700">
                    <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span>
                      <strong>Jangan tutup tab ini.</strong> Begitu tombol verifikasi di email diklik,
                      halaman ini akan <strong>masuk secara otomatis</strong>.
                    </span>
                  </div>

                  {resendSuccessMsg && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{resendSuccessMsg}</span>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resending || resendCooldown > 0}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
                    >
                      <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
                      <span>
                        {resending
                          ? 'Mengirim Ulang...'
                          : resendCooldown > 0
                            ? `Kirim Ulang Email (${resendCooldown}d)`
                            : 'Kirim Ulang Email Verifikasi'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setVerificationSentTo(null);
                        setIsVerifiedRedirecting(false);
                        setErrorMsg('');
                        setResendSuccessMsg('');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Salah ketik alamat email? Kembali ke formulir
                    </button>
                  </div>
                </div>
              )
            ) : (
              <>
                {/* Quick Google OAuth Registration */}
                <div className="space-y-4 mb-5">
                  <GoogleAuthButton
                    label="Daftar Cepat dengan Akun Google"
                    redirectPath={redirectParam}
                    errorCallbackURL="/register"
                    disabled={loading}
                    onError={(msg) => setErrorMsg(msg)}
                    className="border-blue-200 hover:border-blue-300 hover:bg-blue-50/40"
                  />

                  <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-slate-200" />
                    <span className="shrink-0 mx-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      atau isi formulir pendaftaran
                    </span>
                    <div className="flex-grow border-t border-slate-200" />
                  </div>
                </div>

                {/* Manual Registration Form (Verified via Email Link) */}
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2"
                      htmlFor="name"
                    >
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Nama Lengkap Siswa</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      maxLength={30}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="misal: Rizky Ramadhan"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label
                      className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2"
                      htmlFor="username"
                    >
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Username</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400 font-mono text-sm">@</span>
                      <input
                        id="username"
                        type="text"
                        maxLength={16}
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                        placeholder="rizky_ramadhan"
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      3–16 karakter: huruf kecil, angka, atau garis bawah (_)
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2"
                      htmlFor="email"
                    >
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span>Alamat Email Aktif</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trim())}
                      placeholder="rizky@gmail.com"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Tautan verifikasi akun akan dikirimkan ke kotak masuk email ini.
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2"
                      htmlFor="password"
                    >
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
                        title={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Security Criteria Box */}
                  <div className="bg-[#eff6ff] border border-blue-100 rounded-xl p-4 text-xs">
                    <div className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                      <Sliders className="h-3.5 w-3.5 text-blue-600" />
                      <span>Kriteria Keamanan Sandi :</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-600">
                      <li className="flex items-center gap-2">
                        <span
                          className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                            hasLength ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {hasLength ? '✓' : ''}
                        </span>
                        <span>Minimal 6 karakter (maksimal 12 karakter)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span
                          className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                            hasUpper && hasLower ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {hasUpper && hasLower ? '✓' : ''}
                        </span>
                        <span>Memuat huruf kapital (A–Z) dan huruf kecil (a–z)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span
                          className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                            hasNumber ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {hasNumber ? '✓' : ''}
                        </span>
                        <span>Memuat minimal satu angka (0–9)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span
                          className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                            hasSpecial ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {hasSpecial ? '✓' : ''}
                        </span>
                        <span>Memuat simbol atau karakter khusus (@, #, $, %, dll.)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2"
                      htmlFor="confirmPassword"
                    >
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
                        title={showConfirmPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && (
                      <p
                        className={`text-[11px] mt-1 flex items-center gap-1 ${
                          passwordsMatch ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
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
                        <span>Daftarkan Akun &amp; Kirim Verifikasi</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
