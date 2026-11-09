'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import {
  Mail,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { GoogleAuthButton, formatOAuthErrorMessage } from '@/components/common/GoogleAuthButton';

const UI = {
  btnPrimary:
    'min-h-[48px] w-full px-7 py-3.5 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[16px] font-semibold transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] inline-flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
  btnSecondaryOutline:
    'min-h-[48px] w-full px-6 py-3 rounded-[14px] bg-white hover:bg-[#F4F7FC] active:translate-y-0.5 text-[#0A0D14] border-2 border-slate-300 hover:border-[#1B68FF] text-[16px] font-medium transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
  input:
    'w-full min-h-[48px] bg-[#F4F7FC] focus:bg-white border-2 border-slate-200/90 focus:border-[#1B68FF] rounded-[14px] px-4 py-2.5 text-[16px] text-[#0A0D14] placeholder-slate-400 focus:outline-none transition-colors',
};

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

  const passwordRules = [
    { code: 'LEN', label: '6–12 Karakter', valid: hasLength },
    { code: 'CASE', label: 'Huruf A–Z & a–z', valid: hasUpper && hasLower },
    { code: 'NUM', label: 'Angka 0–9', valid: hasNumber },
    { code: 'SYM', label: 'Simbol (@#$%)', valid: hasSpecial },
  ];
  const passedRulesCount = passwordRules.filter((r) => r.valid).length;

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
    <div
      style={{ fontFamily: "'Onest', sans-serif" }}
      className="relative min-h-screen w-full bg-[#F4F7FC] text-[#0A0D14] text-[16px] leading-[1.55] flex flex-col justify-between overflow-x-hidden"
    >
      {/* Background Architectural 50/50 Split Stage (Desktop lg+) */}
      <div className="hidden lg:grid fixed inset-0 grid-cols-12 pointer-events-none z-0">
        <div className="col-span-6 bg-[#F4F7FC]" />
        <div className="col-span-6 bg-gradient-to-br from-[#2370FF] via-[#1B68FF] to-[#0D4EE0] rounded-bl-[64px]" />
      </div>

      {/* 1. HEADER */}
      <header className="relative z-30 w-full px-6 sm:px-12 lg:px-16 pt-6 pb-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 flex items-center justify-between lg:justify-start gap-8">
            <Link href="/" className="min-h-[48px] inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-[16px] p-1.5 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)] border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src="/assets/images/agra-icon.png"
                  alt="Logo AGRA"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[26px] font-semibold tracking-[-0.04em] text-[#0A0D14] flex items-center">
                AGRA
                <span className="inline-block w-2 h-2 rounded-full bg-[#1B68FF] ml-1" />
              </span>
            </Link>

            <Link
              href="/"
              className="min-h-[44px] px-4 inline-flex items-center rounded-[12px] text-[15px] font-medium text-[#1E293B] hover:text-[#0A0D14] hover:bg-slate-200/60 transition-colors"
            >
              &larr; Beranda
            </Link>
          </div>

          <div className="hidden lg:flex lg:col-span-6 items-center justify-end gap-4">
            <span className="text-[15px] text-blue-100">Sudah memiliki akun siswa?</span>
            <Link
              href="/login"
              className="min-h-[48px] px-6 py-2.5 rounded-[14px] bg-white text-[#1B68FF] text-[15px] font-semibold hover:bg-blue-50 active:translate-y-0.5 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.16)] inline-flex items-center gap-2"
            >
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN ARCHITECTURAL STAGE */}
      <main className="relative z-20 flex-1 flex items-center py-6 sm:py-10 px-6 sm:px-12 lg:px-16">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start lg:items-center">
          {/* LEFT 6 COLS: Editorial Headline + Clear Value Proposition */}
          <div className="lg:col-span-6 lg:pr-10 space-y-6">
            <h1 className="text-[40px] sm:text-[54px] lg:text-[62px] font-normal tracking-[-0.045em] leading-[0.98] text-[#0A0D14] text-balance">
              Mulai Persiapan
              <span className="block text-[#1B68FF] mt-1">TKA Mandiri.</span>
            </h1>

            <p className="text-[16px] sm:text-[18px] font-normal leading-[1.55] text-[#1E293B] max-w-xl text-pretty">
              Satu akun membuka akses penuh ke{' '}
              <strong className="font-semibold text-[#0A0D14]">
                30 butir diagnostik prasyarat
              </strong>
              , 16 submateri Numerasi &amp; Literasi, hingga simulasi ujian CBT 75 menit.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
              <div className="rounded-[16px] bg-white p-4 border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.03)]">
                <span className="text-[13px] font-semibold text-[#1B68FF] block mb-1">
                  Tahap 01
                </span>
                <p className="text-[15px] font-medium text-[#0A0D14] leading-[1.3]">
                  Recall 30 Butir
                </p>
              </div>
              <div className="rounded-[16px] bg-white p-4 border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.03)]">
                <span className="text-[13px] font-semibold text-[#1B68FF] block mb-1">
                  Tahap 02
                </span>
                <p className="text-[15px] font-medium text-[#0A0D14] leading-[1.3]">
                  16 Submateri
                </p>
              </div>
              <div className="rounded-[16px] bg-white p-4 border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.03)]">
                <span className="text-[13px] font-semibold text-[#059669] block mb-1">
                  Tahap 03
                </span>
                <p className="text-[15px] font-medium text-[#0A0D14] leading-[1.3]">
                  CBT 75 Menit
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT 6 COLS: Double-Framed Registration Card */}
          <div className="lg:col-span-6 w-full flex lg:justify-end">
            <div className="w-full max-w-[560px] bg-white/85 lg:bg-white/20 backdrop-blur-md rounded-[32px] p-2.5 sm:p-3.5 shadow-[0_28px_70px_rgba(15,23,42,0.14)] border border-white/60">
              <div className="bg-white rounded-[22px] p-6 sm:p-9 border border-slate-200/90">
                {/* Card Header */}
                <div className="mb-7">
                  <h2 className="text-[24px] sm:text-[26px] font-medium tracking-[-0.025em] leading-[1.3] text-[#0A0D14]">
                    {verificationSentTo
                      ? 'Cek Kotak Masuk Emailmu'
                      : 'Buat Akun Belajar'}
                  </h2>
                  <p className="text-[16px] text-[#1E293B] mt-1">
                    {verificationSentTo
                      ? 'Kami telah mengirimkan tautan verifikasi ke email Anda.'
                      : 'Daftar gratis untuk mulai asesmen mandiri dan simulasi CBT.'}
                  </p>
                </div>

                {/* Error Alert */}
                {displayError && (
                  <div className="mb-5 flex items-start gap-3 rounded-[14px] border-2 border-[#D97706] bg-[#FFFBEB] p-4 text-[14px] text-[#78350F]">
                    <AlertCircle className="h-5 w-5 text-[#D97706] shrink-0 mt-0.5" />
                    <span className="leading-[1.5] font-medium">{displayError}</span>
                  </div>
                )}

                {verificationSentTo ? (
                  isVerifiedRedirecting ? (
                    <div className="rounded-[20px] border-2 border-[#059669] bg-[#ECFDF5] p-6 text-center space-y-4">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#059669] text-white">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-[20px] font-semibold text-[#064E3B]">
                          Email Berhasil Diverifikasi!
                        </h3>
                        <p className="text-[14px] text-[#065F46] leading-[1.55]">
                          Status verifikasi diterima. Sedang masuk otomatis dan menyiapkan
                          halaman pemilihan kelas &amp; avatar...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="rounded-[20px] border border-slate-200 bg-[#F4F7FC] p-6 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#1B68FF] text-white shrink-0">
                            <Mail className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-[12px] font-semibold text-[#1B68FF] tracking-wide">
                              TAUTAN AKTIVASI TERKIRIM
                            </span>
                            <p className="text-[16px] font-semibold text-[#0A0D14] break-all">
                              {verificationSentTo}
                            </p>
                          </div>
                        </div>

                        <p className="text-[15px] text-[#1E293B] leading-[1.55]">
                          Buka kotak masuk (atau folder <strong>Spam/Promosi</strong>) lalu klik
                          tombol <strong>Verifikasi Email &amp; Aktifkan Akun</strong>.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 rounded-[14px] bg-[#0A0D14] text-white p-4 text-[13px]">
                        <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent" />
                        <span>
                          <strong>Jangan tutup tab ini.</strong> Begitu tombol verifikasi di
                          email diklik, halaman ini akan <strong>masuk secara otomatis</strong>.
                        </span>
                      </div>

                      {resendSuccessMsg && (
                        <div className="flex items-center gap-2.5 rounded-[14px] border-2 border-[#059669] bg-[#ECFDF5] p-3.5 text-[13px] font-medium text-[#064E3B]">
                          <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
                          <span>{resendSuccessMsg}</span>
                        </div>
                      )}

                      <div className="space-y-2.5">
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={resending || resendCooldown > 0}
                          className={UI.btnSecondaryOutline}
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
                          className="w-full py-2.5 px-4 rounded-[12px] text-[14px] font-medium text-[#1E293B] hover:text-[#0A0D14] hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          &larr; Ubah alamat email pendaftaran
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <>
                    {/* Google OAuth */}
                    <div className="space-y-4 mb-5">
                      <GoogleAuthButton
                        label="Daftar Cepat dengan Akun Google"
                        redirectPath={redirectParam}
                        errorCallbackURL="/register"
                        disabled={loading}
                        onError={(msg) => setErrorMsg(msg)}
                      />

                      <div className="relative flex items-center py-1">
                        <div className="flex-grow border-t border-slate-200" />
                        <span className="shrink-0 mx-3 text-[14px] font-normal text-[#1E293B]">
                          atau
                        </span>
                        <div className="flex-grow border-t border-slate-200" />
                      </div>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleRegister} className="space-y-4">
                      {/* Row 1: Name & Username */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label
                            className="block text-[15px] font-medium text-[#0A0D14] mb-2"
                            htmlFor="name"
                          >
                            Nama Lengkap Siswa
                          </label>
                          <input
                            id="name"
                            type="text"
                            maxLength={30}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Rizky Ramadhan"
                            required
                            className={UI.input}
                          />
                        </div>

                        <div>
                          <label
                            className="block text-[15px] font-medium text-[#0A0D14] mb-2"
                            htmlFor="username"
                          >
                            Username
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3.5 text-slate-400 text-[15px] font-normal">
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
                              className={`${UI.input} pl-8`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Email */}
                      <div>
                        <label
                          className="block text-[15px] font-medium text-[#0A0D14] mb-2"
                          htmlFor="email"
                        >
                          Alamat Email Aktif
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value.trim())}
                          placeholder="rizky@gmail.com"
                          required
                          className={UI.input}
                        />
                      </div>

                      {/* Row 3: Password & Confirm Password */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label
                            className="block text-[15px] font-medium text-[#0A0D14] mb-2"
                            htmlFor="password"
                          >
                            Kata Sandi (6–12 Karakter)
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Buat sandi"
                              required
                              className={`${UI.input} pr-10`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 text-slate-400 hover:text-[#0A0D14] p-1 focus:outline-none cursor-pointer"
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
                            className="block text-[15px] font-medium text-[#0A0D14] mb-2"
                            htmlFor="confirmPassword"
                          >
                            Ulangi Kata Sandi
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Konfirmasi sandi"
                              required
                              className={`${UI.input} pr-10`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 text-slate-400 hover:text-[#0A0D14] p-1 focus:outline-none cursor-pointer"
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

                      {/* 4-Segment Live Password Status */}
                      <div className="rounded-[16px] bg-[#F4F7FC] border border-slate-200/90 p-4 space-y-3">
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="font-semibold text-[#0A0D14]">
                            Kriteria Keamanan Kata Sandi ({passedRulesCount}/4)
                          </span>
                          {confirmPassword.length > 0 && (
                            <span
                              className={`font-semibold ${
                                passwordsMatch ? 'text-[#059669]' : 'text-[#D97706]'
                              }`}
                            >
                              {passwordsMatch ? 'Kata Sandi Cocok' : 'Belum Cocok'}
                            </span>
                          )}
                        </div>

                        {/* 4 Progress Bars */}
                        <div className="grid grid-cols-4 gap-1.5">
                          {[0, 1, 2, 3].map((idx) => (
                            <div
                              key={idx}
                              className={`h-1.5 rounded-full transition-colors duration-200 ${
                                idx < passedRulesCount ? 'bg-[#059669]' : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Spec Chips */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
                          {passwordRules.map((rule) => (
                            <div
                              key={rule.code}
                              className={`px-2.5 py-1.5 rounded-[8px] text-[12px] font-medium flex items-center justify-between border transition-colors ${
                                rule.valid
                                  ? 'bg-[#ECFDF5] border-[#059669] text-[#064E3B]'
                                  : 'bg-white border-slate-200 text-[#1E293B]'
                              }`}
                            >
                              <span>{rule.label}</span>
                              <span>{rule.valid ? '✓' : '·'}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-1">
                        <button
                          type="submit"
                          disabled={loading || !isFormValid}
                          className={UI.btnPrimary}
                        >
                          {loading ? (
                            <>
                              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                              <span>Memproses Pendaftaran...</span>
                            </>
                          ) : (
                            <>
                              <span>Daftarkan Akun &amp; Kirim Verifikasi</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-center text-[13px] text-[#1E293B]">
                        Dengan mendaftar, Anda menyetujui{' '}
                        <Link
                          href="/terms-of-service"
                          className="text-[#1B68FF] hover:underline font-medium"
                        >
                          Ketentuan Layanan
                        </Link>{' '}
                        &amp;{' '}
                        <Link
                          href="/privacy-policy"
                          className="text-[#1B68FF] hover:underline font-medium"
                        >
                          Kebijakan Privasi
                        </Link>
                        .
                      </p>
                    </form>
                  </>
                )}

                {/* Bottom Login Link */}
                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-[15px] text-[#1E293B]">
                  <span>Sudah memiliki akun belajar?</span>
                  <Link href="/login" className="font-semibold text-[#1B68FF] hover:underline">
                    Masuk ke Akun &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. ARCHITECTURAL FOOTER */}
      <footer className="relative z-20 px-6 sm:px-12 lg:px-16 pb-8">
        <div className="w-full pt-6 border-t border-slate-300/70 lg:border-slate-300/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[14px]">
          <div className="flex items-center gap-2.5 text-[#1E293B]">
            <span className="text-[18px] font-semibold tracking-[-0.04em] text-[#0A0D14]">
              AGRA.
            </span>
            <span>— Ruang Belajar &amp; Simulasi Mandiri TKA SMP</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-[#1E293B] lg:text-white/90">
            <Link href="/privacy-policy" className="hover:underline">
              Kebijakan Privasi
            </Link>
            <Link href="/terms-of-service" className="hover:underline">
              Ketentuan Layanan
            </Link>
            <span>© 2026 AGRA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F4F7FC] text-[#1E293B] text-[15px]">
          Memuat halaman pendaftaran...
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
