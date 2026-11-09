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
    { label: '6–12 karakter', valid: hasLength },
    { label: 'Huruf besar & kecil', valid: hasUpper && hasLower },
    { label: 'Angka (0–9)', valid: hasNumber },
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
    <div className="min-h-screen w-full bg-[#EEF2FA] text-[#0A0D14] flex flex-col justify-between px-4 sm:px-8 py-6">
      {/* 1. TOP BAR — Sejajar dengan Lebar Card Utama (max-w-[980px]) */}
      <header className="w-full max-w-[980px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-[14px] p-1.5 bg-white shadow-xs border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/assets/images/agra-icon.png"
                alt="Logo AGRA"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[22px] font-semibold tracking-[-0.04em] text-[#0A0D14] flex items-center">
              AGRA
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1B68FF] ml-1" />
            </span>
          </Link>

          <Link
            href="/"
            className="text-[14px] font-medium text-[#334155] hover:text-[#0A0D14] transition-colors"
          >
            &larr; Kembali ke Beranda
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[14px] text-[#334155] hidden sm:inline">
            Sudah punya akun?
          </span>
          <Link
            href="/login"
            className="min-h-[40px] px-4 py-2 rounded-[12px] bg-white hover:bg-[#F4F7FC] text-[#0A0D14] border border-slate-300 text-[14px] font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <span>Masuk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 2. CENTER UNIFIED BENTO CONTAINER */}
      <main className="w-full max-w-[980px] mx-auto my-6">
        <div className="bg-white/80 rounded-[32px] p-2.5 sm:p-3.5 shadow-[0_24px_60px_rgba(15,23,42,0.06)] border border-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[24px] overflow-hidden bg-white border border-slate-200/80">
            {/* PANEL KIRI (5 KOLOM): Brand & Preview Kartu Siswa */}
            <div className="lg:col-span-5 p-7 sm:p-10 bg-gradient-to-br from-[#2370FF] via-[#1B68FF] to-[#0D4EE0] text-white flex flex-col justify-between">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] bg-white/15 text-[12px] font-mono font-medium tracking-wide">
                  <span>PENDAFTARAN SISWA SMP</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-[30px] sm:text-[34px] font-normal tracking-[-0.035em] leading-[1.12] text-white">
                    Mulai Persiapan TKA Mandiri
                  </h1>
                  <p className="text-[15px] leading-[1.55] text-white/85 font-normal">
                    Buat akun siswa untuk mengakses 30 soal diagnostik awal, 16 submateri Numerasi &amp; Literasi Fase D, serta paket simulasi CBT.
                  </p>
                </div>
              </div>

              {/* Live Preview Kartu Identitas Siswa */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="rounded-[16px] bg-[#0A0D14]/25 border border-white/15 p-4 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/75">
                    <span>IDENTITAS PESERTA</span>
                    <span>{isFormValid ? 'LENGKAP ✓' : 'DRAFT'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-white text-[#1B68FF] font-semibold text-[16px] flex items-center justify-center shrink-0">
                      {(name.trim()[0] || 'S').toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium text-white truncate">
                        {name.trim() || 'Nama Lengkap Siswa'}
                      </p>
                      <p className="text-[12px] font-mono text-white/80 truncate">
                        @{username || 'username'} • {email || 'email@sekolah.id'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL KANAN (7 KOLOM): Form Pendaftaran */}
            <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center">
              <div className="max-w-[440px] w-full mx-auto">
                <div className="mb-5">
                  <h2 className="text-[24px] sm:text-[26px] font-medium tracking-[-0.025em] text-[#0A0D14]">
                    {verificationSentTo ? 'Verifikasi Email' : 'Buat Akun Siswa'}
                  </h2>
                  <p className="text-[14px] text-[#334155] mt-1">
                    {verificationSentTo
                      ? 'Aktifkan akunmu melalui tautan yang dikirim ke email.'
                      : 'Daftar menggunakan akun Google atau lengkapi data di bawah.'}
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
                            <p className="text-[12px] text-[#334155]">Tautan dikirim ke:</p>
                            <p className="text-[15px] font-semibold text-[#0A0D14] truncate">
                              {verificationSentTo}
                            </p>
                          </div>
                        </div>
                        <p className="text-[13px] text-[#334155] leading-[1.5]">
                          Klik tombol verifikasi di kotak masuk emailmu. Halaman ini akan otomatis masuk setelah email terverifikasi.
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
                        className="min-h-[46px] w-full px-5 py-2.5 rounded-[12px] bg-white hover:bg-[#F4F7FC] text-[#0A0D14] border border-slate-300 text-[14px] font-medium transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                        className="w-full py-2 text-[13px] font-medium text-[#334155] hover:text-[#0A0D14] cursor-pointer"
                      >
                        &larr; Ganti alamat email
                      </button>
                    </div>
                  )
                ) : (
                  <>
                    <div className="space-y-4 mb-4">
                      <GoogleAuthButton
                        label="Daftar dengan Akun Google"
                        redirectPath={redirectParam}
                        errorCallbackURL="/register"
                        disabled={loading}
                        onError={(msg) => setErrorMsg(msg)}
                      />

                      <div className="relative flex items-center">
                        <div className="flex-grow border-t border-slate-200" />
                        <span className="shrink-0 mx-3 text-[12px] text-slate-400">
                          atau isi data akun
                        </span>
                        <div className="flex-grow border-t border-slate-200" />
                      </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            className="block text-[13px] font-medium text-[#0A0D14] mb-1"
                            htmlFor="name"
                          >
                            Nama Lengkap
                          </label>
                          <input
                            id="name"
                            type="text"
                            maxLength={30}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Rizky Ramadhan"
                            required
                            className="w-full min-h-[44px] bg-[#F8FAFC] focus:bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[12px] px-3.5 py-2 text-[14px] text-[#0A0D14] placeholder-slate-400 transition-colors"
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
                              className="w-full min-h-[44px] bg-[#F8FAFC] focus:bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[12px] pl-8 pr-3.5 py-2 text-[14px] text-[#0A0D14] placeholder-slate-400 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-[13px] font-medium text-[#0A0D14] mb-1"
                          htmlFor="email"
                        >
                          Alamat Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value.trim())}
                          placeholder="nama@email.com"
                          required
                          className="w-full min-h-[44px] bg-[#F8FAFC] focus:bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[12px] px-3.5 py-2 text-[14px] text-[#0A0D14] placeholder-slate-400 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            className="block text-[13px] font-medium text-[#0A0D14] mb-1"
                            htmlFor="password"
                          >
                            Kata Sandi
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="6–12 karakter"
                              required
                              className="w-full min-h-[44px] bg-[#F8FAFC] focus:bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[12px] px-3.5 py-2 pr-10 text-[14px] text-[#0A0D14] placeholder-slate-400 transition-colors"
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
                            Konfirmasi Sandi
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Ulangi sandi"
                              required
                              className="w-full min-h-[44px] bg-[#F8FAFC] focus:bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[12px] px-3.5 py-2 pr-10 text-[14px] text-[#0A0D14] placeholder-slate-400 transition-colors"
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

                      {/* Ringkasan Kriteria Sandi Inline & Ringkas */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {passwordRules.map((rule) => (
                          <span
                            key={rule.label}
                            className={`px-2.5 py-1 rounded-[8px] text-[12px] font-medium inline-flex items-center gap-1.5 border transition-colors ${
                              rule.valid
                                ? 'bg-[#ECFDF5] border-[#059669]/40 text-[#065F46]'
                                : 'bg-[#F8FAFC] border-slate-200 text-slate-500'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                rule.valid ? 'bg-[#059669]' : 'bg-slate-300'
                              }`}
                            />
                            <span>{rule.label}</span>
                          </span>
                        ))}
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading || !isFormValid}
                          className="min-h-[48px] w-full px-6 py-3 rounded-[12px] bg-[#1B68FF] hover:bg-[#1454D6] text-white text-[15px] font-medium transition-all shadow-[0_8px_20px_rgba(27,104,255,0.24)] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                        >
                          {loading ? (
                            <>
                              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                              <span>Memproses...</span>
                            </>
                          ) : (
                            <>
                              <span>Buat Akun Siswa</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}

                <p className="mt-5 pt-4 border-t border-slate-200/80 text-center text-[13px] text-[#334155]">
                  Sudah punya akun?{' '}
                  <Link href="/login" className="font-semibold text-[#1B68FF] hover:underline">
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. FOOTER — Sejajar dengan Lebar Card Utama (max-w-[980px]) */}
      <footer className="w-full max-w-[980px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#334155]">
        <div>
          <span className="font-semibold text-[#0A0D14]">AGRA</span> — Ruang Belajar &amp; Simulasi Mandiri TKA SMP
        </div>
        <div className="flex items-center gap-5">
          <Link href="/privacy-policy" className="hover:text-[#0A0D14] transition-colors">
            Kebijakan Privasi
          </Link>
          <Link href="/terms-of-service" className="hover:text-[#0A0D14] transition-colors">
            Ketentuan Layanan
          </Link>
          <span>© 2026 AGRA</span>
        </div>
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#EEF2FA] text-[#334155] text-[15px]">
          Memuat halaman pendaftaran...
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
