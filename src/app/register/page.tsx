'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { signInWithGoogle } from '@/lib/auth-client';
import { api } from '@/lib/api-client';
import {
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { formatOAuthErrorMessage } from '@/components/common/GoogleAuthButton';

function GoogleColorIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function BrandAsterisk({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 3V29M4.74 9.5L27.26 22.5M27.26 9.5L4.74 22.5"
        stroke="currentColor"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const passwordRules = [
    { label: '6–12 karakter', valid: hasLength },
    { label: 'Huruf A–Z & a–z', valid: hasUpper && hasLower },
    { label: 'Angka 0–9', valid: hasNumber },
    { label: 'Simbol (@#$%)', valid: hasSpecial },
  ];

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

  const handleGoogleSignUp = async () => {
    if (googleLoading || loading) return;
    setGoogleLoading(true);
    setErrorMsg('');
    try {
      await signInWithGoogle({
        redirectPath: redirectParam,
        errorCallbackURL: '/register',
        staffMode: false,
      });
    } catch (err: unknown) {
      setGoogleLoading(false);
      setErrorMsg(
        (err instanceof Error && err.message) ||
          'Gagal menghubungkan ke layanan Google OAuth.'
      );
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
    <div
      style={{ fontFamily: "'Onest', sans-serif" }}
      className="min-h-screen w-full bg-[#EEF2FA] text-[#0A0D14] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden"
    >
      {/* Ambient Background Glow di Belakang Card */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed w-[680px] h-[680px] rounded-full bg-[#1B68FF]/12 blur-[130px] -z-0"
      />

      {/* Navigasi Atas Minimalis Sejajar dengan Card */}
      <div className="relative z-10 w-full max-w-[1000px] flex items-center justify-between mb-4 px-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[#334155] hover:text-[#0A0D14] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Beranda AGRA</span>
        </Link>

        <Link
          href="/login"
          className="text-[14px] font-medium text-[#334155] hover:text-[#1B68FF] transition-colors"
        >
          Sudah punya akun? <span className="font-semibold text-[#1B68FF]">Masuk</span>
        </Link>
      </div>

      {/* MAIN FLOATING CARD (Persis Referensi Gambar + Gaya AGRA) */}
      <div className="relative z-10 w-full max-w-[1000px] bg-white rounded-[32px] p-3.5 sm:p-5 shadow-[0_25px_80px_-12px_rgba(27,104,255,0.16)] border border-white grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* PANEL KIRI: Inset Rounded Aurora Mesh Card */}
        <div className="lg:col-span-5 relative rounded-[24px] overflow-hidden min-h-[280px] lg:min-h-[600px] p-7 sm:p-9 flex flex-col justify-between text-white select-none">
          {/* Multi-layered Silk Mesh Gradient */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: '#0B258A',
              backgroundImage: `
                radial-gradient(at 12% 10%, #7DD3FC 0px, transparent 52%),
                radial-gradient(at 88% 15%, #C4B5FD 0px, transparent 55%),
                radial-gradient(at 78% 68%, #EFF6FF 0px, transparent 58%),
                radial-gradient(at 18% 72%, #1B68FF 0px, transparent 62%),
                radial-gradient(at 10% 95%, #071961 0px, transparent 65%)
              `,
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#06154D]/85 via-[#0B258A]/35 to-transparent pointer-events-none" />

          {/* Top Row inside Mesh Panel */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BrandAsterisk className="w-8 h-8 text-white drop-shadow-xs" />
              <span className="text-[20px] font-semibold tracking-[-0.04em] text-white">
                AGRA.
              </span>
            </div>
            <span
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium tracking-wider uppercase text-white border border-white/25"
            >
              FASE D SMP
            </span>
          </div>

          {/* Bottom Editorial Statement inside Mesh Panel */}
          <div className="relative z-10 space-y-5 mt-16">
            <div className="space-y-2">
              <p className="text-[15px] font-normal text-white/90">
                Mulai dengan mudah
              </p>
              <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.03em] leading-[1.2] text-white text-balance">
                Akses ruang belajar pribadi untuk ketuntasan materi dan simulasi TKA
              </h1>
            </div>

            {/* Live Student Badge Pill */}
            <div className="pt-4 border-t border-white/20 flex items-center justify-between gap-3 text-[12px] text-white/90">
              <div className="truncate">
                <span className="text-white/70">Peserta: </span>
                <span className="font-medium text-white">
                  {name.trim() || 'Siswa Baru'}
                </span>
              </div>
              <span
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                className="px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] shrink-0"
              >
                @{username || 'username'}
              </span>
            </div>
          </div>
        </div>

        {/* PANEL KANAN: Clean Airy Form Area */}
        <div className="lg:col-span-7 flex flex-col justify-center px-5 py-7 sm:px-12 lg:px-14">
          <div className="w-full max-w-[410px] mx-auto">
            {/* Iconic Asterisk Mark + Heading */}
            <div className="mb-6">
              <BrandAsterisk className="w-7 h-7 text-[#1B68FF] mb-3.5" />
              <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.035em] leading-[1.15] text-[#0A0D14]">
                {verificationSentTo ? 'Verifikasi email' : 'Buat akun baru'}
              </h2>
              <p className="text-[14px] leading-[1.55] text-[#64748B] mt-1.5">
                {verificationSentTo
                  ? 'Satu langkah lagi untuk mengaktifkan ruang belajar pribadimu.'
                  : 'Akses 30 soal diagnostik awal, 16 submateri Fase D, dan simulasi CBT 75 menit.'}
              </p>
            </div>

            {displayError && (
              <div className="mb-4 flex items-start gap-2.5 rounded-[12px] border border-[#D97706] bg-[#FFFBEB] p-3.5 text-[13px] text-[#78350F]">
                <AlertCircle className="h-4 w-4 text-[#D97706] shrink-0 mt-0.5" />
                <span className="leading-[1.45] font-medium">{displayError}</span>
              </div>
            )}

            {verificationSentTo ? (
              isVerifiedRedirecting ? (
                <div className="rounded-[16px] border border-[#059669] bg-[#ECFDF5] p-6 text-center space-y-3">
                  <CheckCircle2 className="h-8 w-8 text-[#059669] mx-auto" />
                  <h3 className="text-[18px] font-semibold text-[#064E3B]">
                    Email Terverifikasi!
                  </h3>
                  <p className="text-[14px] text-[#065F46]">
                    Sedang masuk otomatis dan menyiapkan halaman pemilihan kelas...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-[16px] border border-slate-200 bg-[#F8FAFC] p-5 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#1B68FF] text-white shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] text-[#64748B]">Tautan dikirim ke:</p>
                        <p className="text-[15px] font-semibold text-[#0A0D14] truncate">
                          {verificationSentTo}
                        </p>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#334155] leading-[1.5]">
                      Klik tombol verifikasi di kotak masuk emailmu. Halaman ini akan otomatis masuk begitu email terverifikasi.
                    </p>
                  </div>

                  {resendSuccessMsg && (
                    <div className="flex items-center gap-2 rounded-[12px] border border-[#059669] bg-[#ECFDF5] p-3 text-[13px] font-medium text-[#064E3B]">
                      <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
                      <span>{resendSuccessMsg}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending || resendCooldown > 0}
                    className="h-[46px] w-full px-5 rounded-[11px] bg-[#EEF2F8] hover:bg-[#E2E8F0] text-[#0A0D14] text-[14px] font-medium transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
                    <span>
                      {resending
                        ? 'Mengirim Ulang...'
                        : resendCooldown > 0
                          ? `Kirim Ulang (${resendCooldown}d)`
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
                    className="w-full py-2 text-[13px] font-medium text-[#64748B] hover:text-[#0A0D14] cursor-pointer"
                  >
                    &larr; Ganti alamat email
                  </button>
                </div>
              )
            ) : (
              <>
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        className="block text-[13px] font-medium text-[#0A0D14] mb-1"
                        htmlFor="name"
                      >
                        Nama lengkap
                      </label>
                      <input
                        id="name"
                        type="text"
                        maxLength={30}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Rizky Ramadhan"
                        required
                        className="w-full h-[44px] bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[11px] px-3.5 text-[14px] text-[#0A0D14] placeholder-slate-400 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[13px] font-medium text-[#0A0D14] mb-1"
                        htmlFor="username"
                      >
                        Username
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-slate-400 text-[14px] font-mono">
                          @
                        </span>
                        <input
                          id="username"
                          type="text"
                          maxLength={16}
                          value={username}
                          onChange={(e) =>
                            setUsername(
                              e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                            )
                          }
                          placeholder="rizky_smp"
                          required
                          className="w-full h-[44px] bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[11px] pl-8 pr-3.5 text-[14px] text-[#0A0D14] placeholder-slate-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-[13px] font-medium text-[#0A0D14] mb-1"
                      htmlFor="email"
                    >
                      Alamat email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trim())}
                      placeholder="farazhaidet786@gmail.com"
                      required
                      className="w-full h-[44px] bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[11px] px-3.5 text-[14px] text-[#0A0D14] placeholder-slate-400 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        className="block text-[13px] font-medium text-[#0A0D14] mb-1"
                        htmlFor="password"
                      >
                        Kata sandi
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••"
                          required
                          className="w-full h-[44px] bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[11px] px-3.5 pr-10 text-[14px] text-[#0A0D14] placeholder-slate-400 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-slate-400 hover:text-[#0A0D14] p-1 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-[13px] font-medium text-[#0A0D14] mb-1"
                        htmlFor="confirmPassword"
                      >
                        Konfirmasi sandi
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••••"
                          required
                          className="w-full h-[44px] bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[11px] px-3.5 pr-10 text-[14px] text-[#0A0D14] placeholder-slate-400 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 text-slate-400 hover:text-[#0A0D14] p-1 cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Minimalist Password Criteria Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {passwordRules.map((rule) => (
                      <span
                        key={rule.label}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium inline-flex items-center gap-1 border transition-colors ${
                          rule.valid
                            ? 'bg-[#ECFDF5] border-[#059669]/40 text-[#065F46]'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <span>{rule.valid ? '✓' : '•'}</span>
                        <span>{rule.label}</span>
                      </span>
                    ))}
                  </div>

                  {/* Primary Glowing Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || !isFormValid}
                      className="h-[48px] w-full rounded-[11px] bg-[#1B68FF] hover:bg-[#1454D6] text-white text-[14px] font-semibold shadow-[0_10px_25px_rgba(27,104,255,0.38)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:translate-y-0.5"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <span>Mulai Sekarang</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider "or continue with" */}
                <div className="relative flex items-center my-5">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="shrink-0 mx-3 text-[12px] text-slate-400">
                    atau daftar dengan
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                {/* Social Pill Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={googleLoading || loading}
                  className="h-[42px] w-full rounded-[10px] bg-[#EEF2F8] hover:bg-[#E2E8F0] text-[#0A0D14] text-[13px] font-medium transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                >
                  {googleLoading ? (
                    <span className="w-4 h-4 rounded-full border-2 border-[#1B68FF] border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <GoogleColorIcon />
                      <span>Lanjutkan dengan Google</span>
                    </>
                  )}
                </button>
              </>
            )}

            {/* Bottom Login Link */}
            <p className="mt-6 text-center text-[13px] text-[#64748B]">
              Sudah memiliki akun?{' '}
              <Link href="/login" className="font-semibold text-[#1B68FF] hover:underline">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#EEF2FA] text-[#334155] text-[14px]">
          Memuat halaman pendaftaran...
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
