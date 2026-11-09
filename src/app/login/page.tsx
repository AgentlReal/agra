'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { sanitizeRedirectPath } from '@/lib/auth-client';
import { api, ApiError } from '@/lib/api-client';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { GoogleAuthButton, formatOAuthErrorMessage } from '@/components/common/GoogleAuthButton';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const errorParams = searchParams.getAll('error');
  const oauthErrorParam = errorParams.length > 0 ? errorParams[errorParams.length - 1] : null;
  const isStaffMode = searchParams.get('as') === 'staff';

  const { user, isLoading: authLoading, isAuthenticated, login, refreshUser } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [waitingVerification, setWaitingVerification] = useState(false);
  const autoLoginLockRef = useRef(false);

  const displayError = errorMsg || formatOAuthErrorMessage(oauthErrorParam);

  useEffect(() => {
    if (!isStaffMode && typeof document !== 'undefined') {
      document.cookie = 'agra_staff_login=; path=/; max-age=0; SameSite=Lax';
    }
  }, [isStaffMode]);

  useEffect(() => {
    if (authLoading || loading || !isAuthenticated || !user || oauthErrorParam) return;
    if (user.role === 'SUPERADMIN' || user.role === 'TIM_KURIKULUM') {
      const targetAdminPath =
        redirectParam && redirectParam.startsWith('/admin')
          ? sanitizeRedirectPath(redirectParam, '/admin/dashboard')
          : '/admin/dashboard';
      router.replace(targetAdminPath);
    } else if (!isStaffMode) {
      if (user.needsOnboarding) {
        router.replace('/onboarding');
      } else {
        const safeStudentRedirect =
          redirectParam && !redirectParam.startsWith('/admin')
            ? sanitizeRedirectPath(redirectParam, '/dashboard')
            : '/dashboard';
        router.replace(safeStudentRedirect);
      }
    }
  }, [authLoading, loading, isAuthenticated, user, isStaffMode, redirectParam, oauthErrorParam, router]);

  const executeSignIn = async (currentIdentifier: string, currentPassword: string) => {
    if (!currentIdentifier || !currentPassword) {
      setErrorMsg('Harap isi email/username dan kata sandi Anda.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (!isStaffMode && typeof document !== 'undefined') {
        document.cookie = 'agra_staff_login=; path=/; max-age=0; SameSite=Lax';
      }
      const isEmail = currentIdentifier.includes('@');
      const res = isEmail
        ? await api.auth.signInEmail(currentIdentifier, currentPassword)
        : await api.auth.signInUsername(currentIdentifier, currentPassword);

      const token = res?.session?.token || res?.token;
      const authUser = res?.user;

      if (!authUser) {
        throw new Error('Gagal mendapatkan sesi pengguna.');
      }

      const wasWaitingVerification = waitingVerification;
      setWaitingVerification(false);

      const rawRole = authUser.role;
      const role: 'SUPERADMIN' | 'TIM_KURIKULUM' | 'SISWA' =
        rawRole === 'SUPERADMIN'
          ? 'SUPERADMIN'
          : rawRole === 'TIM_KURIKULUM'
            ? 'TIM_KURIKULUM'
            : 'SISWA';

      if (isStaffMode && role === 'SISWA') {
        await api.auth.signOut().catch(() => {});
        await refreshUser().catch(() => {});
        throw new Error(
          'Akun ini terdaftar sebagai Siswa, bukan Tim Kurikulum atau SuperAdmin. Silakan masuk melalui mode Siswa.'
        );
      }

      const hydratedUser = await login(token, {
        id: authUser.id,
        name: authUser.name || authUser.username || '',
        username: authUser.username || authUser.email?.split('@')[0] || '',
        email: authUser.email,
        role,
      });

      if (role === 'SUPERADMIN' || role === 'TIM_KURIKULUM') {
        const targetAdminPath =
          redirectParam && redirectParam.startsWith('/admin')
            ? sanitizeRedirectPath(redirectParam, '/admin/dashboard')
            : '/admin/dashboard';
        router.push(targetAdminPath);
      } else if (wasWaitingVerification || (hydratedUser && hydratedUser.needsOnboarding)) {
        router.push('/onboarding');
      } else {
        const safeStudentRedirect =
          redirectParam && !redirectParam.startsWith('/admin')
            ? sanitizeRedirectPath(redirectParam, '/dashboard')
            : '/dashboard';
        router.push(safeStudentRedirect);
      }
    } catch (err: unknown) {
      const rawMessage = err instanceof Error ? err.message : '';
      const isUnverifiedEmailError =
        err instanceof ApiError &&
        (err.code === 'EMAIL_NOT_VERIFIED' ||
          rawMessage.toLowerCase().includes('email not verified') ||
          rawMessage.toLowerCase().includes('belum diverifikasi'));

      if (isUnverifiedEmailError) {
        setWaitingVerification(true);
        autoLoginLockRef.current = false;
        setErrorMsg(
          'Email akun belum diverifikasi. Kami telah mengirimkan tautan verifikasi baru ke kotak masuk emailmu.'
        );
      } else {
        setWaitingVerification(false);
        const lowerMsg = rawMessage.toLowerCase();
        let friendlyMsg = rawMessage || 'Gagal masuk. Periksa kembali kredensial Anda.';
        if (
          lowerMsg.includes('invalid email or password') ||
          lowerMsg.includes('invalid username or password') ||
          lowerMsg.includes('invalid password')
        ) {
          friendlyMsg = 'Email/username atau kata sandi yang Anda masukkan salah.';
        } else if (lowerMsg.includes('user not found')) {
          friendlyMsg = 'Akun dengan email atau username tersebut tidak ditemukan.';
        }
        setErrorMsg(friendlyMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await executeSignIn(identifier, password);
  };

  const executeSignInRef = useRef(executeSignIn);
  useEffect(() => {
    executeSignInRef.current = executeSignIn;
  });

  useEffect(() => {
    if (!waitingVerification || !identifier || !password) return;

    let isMounted = true;

    const checkAndAutoSignIn = async () => {
      if (autoLoginLockRef.current || !isMounted) return;
      try {
        const status = await api.auth.checkVerificationStatus(identifier);
        if (status?.verified && isMounted && !autoLoginLockRef.current) {
          autoLoginLockRef.current = true;
          await executeSignInRef.current(identifier, password);
        }
      } catch {
        // Abaikan error sementara saat polling
      }
    };

    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('agra_email_verification');
        channel.onmessage = (event) => {
          if (event.data?.type === 'EMAIL_VERIFIED') {
            void checkAndAutoSignIn();
          }
        };
      } catch {
        channel = null;
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'agra_email_verified_at') {
        void checkAndAutoSignIn();
      }
    };

    const handleFocus = () => {
      void checkAndAutoSignIn();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkAndAutoSignIn();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const pollTimer = setInterval(() => {
      void checkAndAutoSignIn();
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
  }, [waitingVerification, identifier, password]);

  return (
    <div className="min-h-screen w-full bg-[#EEF2FA] text-[#0A0D14] flex flex-col justify-between px-4 sm:px-8 py-6">
      {/* 1. TOP BAR — Sejajar dengan Lebar Card Utama (max-w-[980px]) */}
      <header className="w-full max-w-[980px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="min-h-[48px] inline-flex items-center gap-2.5 group">
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
            className="min-h-[44px] inline-flex items-center text-[15px] font-medium text-[#1E293B] hover:text-[#0A0D14] transition-colors"
          >
            &larr; Kembali ke Beranda
          </Link>
        </div>

        {!isStaffMode ? (
          <div className="flex items-center gap-3">
            <span className="text-[15px] text-[#1E293B] hidden sm:inline">
              Belum punya akun?
            </span>
            <Link
              href="/register"
              className="min-h-[48px] px-5 py-2.5 rounded-[12px] bg-white hover:bg-[#F4F7FC] text-[#0A0D14] border border-slate-300 hover:border-[#1B68FF] text-[15px] font-semibold transition-all inline-flex items-center gap-1.5 shadow-2xs"
            >
              <span>Daftar Akun</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={() => {
              setErrorMsg('');
              setWaitingVerification(false);
            }}
            className="min-h-[48px] px-5 py-2.5 rounded-[12px] bg-white hover:bg-[#F4F7FC] text-[#0A0D14] border border-slate-300 hover:border-[#1B68FF] text-[15px] font-semibold transition-all inline-flex items-center shadow-2xs"
          >
            Mode Siswa
          </Link>
        )}
      </header>

      {/* 2. CENTER UNIFIED BENTO CONTAINER */}
      <main className="w-full max-w-[980px] mx-auto my-6">
        <div className="bg-white/80 rounded-[32px] p-2.5 sm:p-3.5 shadow-[0_24px_60px_rgba(15,23,42,0.06)] border border-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[24px] overflow-hidden bg-white border border-slate-200/80">
            {/* PANEL KIRI (5 KOLOM): Brand & Struktur Alur */}
            <div
              className={`lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between text-white ${
                isStaffMode
                  ? 'bg-[#0A0D14]'
                  : 'bg-gradient-to-br from-[#2370FF] via-[#1B68FF] to-[#0D4EE0]'
              }`}
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-white/15 text-[13px] font-semibold tracking-normal text-white">
                  <span>{isStaffMode ? 'Portal Staf & Admin' : 'Fase D • SMP / MTs'}</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-[30px] sm:text-[34px] font-normal tracking-[-0.035em] leading-[1.15] text-white text-balance">
                    {isStaffMode
                      ? 'Pengelolaan Bank Soal & Kurikulum'
                      : 'Ruang Belajar & Simulasi Mandiri'}
                  </h1>
                  <p className="text-[15px] sm:text-[16px] leading-[1.55] text-white/90 font-normal text-pretty">
                    {isStaffMode
                      ? 'Masuk menggunakan akun staf yang terdaftar untuk mengelola soal diagnostik, latihan level, dan paket simulasi.'
                      : 'Persiapan Tes Kemampuan Akademik terstruktur dari pemetaan awal hingga simulasi ujian 75 menit.'}
                  </p>
                </div>
              </div>

              {/* Ringkasan Tahapan yang Rapat & Bersih */}
              <div className="mt-10 pt-6 border-t border-white/20 space-y-3 tabular-nums">
                {isStaffMode ? (
                  <>
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-white/85">Bank Soal Terpisah</span>
                      <span className="font-semibold text-white">Recall • Level • CBT</span>
                    </div>
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-white/85">Keamanan Sesi</span>
                      <span className="font-semibold text-[#10B981]">1 Perangkat Aktif</span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2.5 text-[14px]">
                    <div className="flex items-center justify-between py-2 px-3.5 rounded-[12px] bg-white/10">
                      <span className="text-[13px] font-semibold text-white/90">01</span>
                      <span className="font-medium text-white">Diagnostik Prasyarat</span>
                      <span className="text-[13px] font-semibold text-white">30 Soal</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3.5 rounded-[12px] bg-white/10">
                      <span className="text-[13px] font-semibold text-white/90">02</span>
                      <span className="font-medium text-white">Latihan 3 Level Kognitif</span>
                      <span className="text-[13px] font-semibold text-white">16 Topik</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3.5 rounded-[12px] bg-white/10">
                      <span className="text-[13px] font-semibold text-white/90">03</span>
                      <span className="font-medium text-white">Simulasi Ujian CBT</span>
                      <span className="text-[13px] font-semibold text-white">75 Menit</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PANEL KANAN (7 KOLOM): Form Login */}
            <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center">
              <div className="max-w-[420px] w-full mx-auto">
                {/* Header Form + Switcher Peran */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-[24px] sm:text-[26px] font-medium tracking-[-0.025em] text-[#0A0D14]">
                      {isStaffMode ? 'Masuk Portal Staf' : 'Masuk ke Akun'}
                    </h2>
                    <p className="text-[15px] text-[#1E293B] mt-1">
                      {isStaffMode
                        ? 'Khusus Tim Kurikulum dan SuperAdmin.'
                        : 'Masuk untuk melanjutkan progres belajarmu.'}
                    </p>
                  </div>

                  <div className="inline-flex rounded-[10px] p-1 bg-[#EEF2FA] border border-slate-200/80 shrink-0 text-[13px] font-medium">
                    <Link
                      href="/login"
                      onClick={() => {
                        setErrorMsg('');
                        setWaitingVerification(false);
                      }}
                      className={`px-3 py-1 rounded-[7px] transition-colors ${
                        !isStaffMode
                          ? 'bg-white text-[#0A0D14] font-semibold shadow-2xs'
                          : 'text-[#1E293B] hover:text-[#0A0D14]'
                      }`}
                    >
                      Siswa
                    </Link>
                    <Link
                      href="/login?as=staff"
                      onClick={() => {
                        setErrorMsg('');
                        setWaitingVerification(false);
                      }}
                      className={`px-3 py-1 rounded-[7px] transition-colors ${
                        isStaffMode
                          ? 'bg-[#0A0D14] text-white font-semibold shadow-2xs'
                          : 'text-[#1E293B] hover:text-[#0A0D14]'
                      }`}
                    >
                      Staf
                    </Link>
                  </div>
                </div>

                {/* Error Alert */}
                {displayError && (
                  <div className="mb-5 flex items-start gap-3 rounded-[14px] border-2 border-[#D97706] bg-[#FFFBEB] p-4 text-[14px] text-[#78350F]">
                    <AlertCircle className="h-5 w-5 text-[#D97706] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="leading-[1.5] font-medium">{displayError}</p>
                      {waitingVerification && (
                        <p className="text-[13px] font-semibold text-[#92400E] flex items-center gap-2 pt-0.5">
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#D97706] border-t-transparent inline-block" />
                          <span>Menunggu konfirmasi verifikasi dari email...</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Google Sign-In */}
                <div className="space-y-4 mb-5">
                  <GoogleAuthButton
                    label={
                      isStaffMode
                        ? 'Masuk Staf dengan Akun Google'
                        : 'Masuk dengan Akun Google'
                    }
                    redirectPath={
                      isStaffMode
                        ? redirectParam && redirectParam.startsWith('/admin')
                          ? redirectParam
                          : '/admin/dashboard'
                        : redirectParam && !redirectParam.startsWith('/admin')
                          ? redirectParam
                          : null
                    }
                    errorCallbackURL={isStaffMode ? '/login?as=staff' : '/login'}
                    staffMode={isStaffMode}
                    disabled={loading}
                    onError={(msg) => setErrorMsg(msg)}
                  />

                  <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-slate-200" />
                    <span className="shrink-0 mx-3 text-[14px] font-normal text-[#1E293B]">
                      atau dengan email / username
                    </span>
                    <div className="flex-grow border-t border-slate-200" />
                  </div>
                </div>

                {/* Form Input */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label
                      className="block text-[15px] font-medium text-[#0A0D14] mb-2"
                      htmlFor="identifier"
                    >
                      Email atau Username
                    </label>
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        isStaffMode
                          ? 'superadmin / tim_kurikulum'
                          : 'Masukkan email atau username'
                      }
                      required
                      autoComplete="username"
                      className="w-full min-h-[48px] bg-[#F8FAFC] focus:bg-white border-2 border-slate-200/90 focus:border-[#1B68FF] rounded-[14px] px-4 py-2.5 text-[16px] text-[#0A0D14] placeholder-slate-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className="text-[15px] font-medium text-[#0A0D14]"
                        htmlFor="password"
                      >
                        Kata Sandi
                      </label>
                      <Link
                        href={isStaffMode ? '/forgot-password?as=staff' : '/forgot-password'}
                        className="text-[14px] text-[#1B68FF] hover:underline font-medium"
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
                        placeholder="Masukkan kata sandi"
                        required
                        autoComplete="current-password"
                        className="w-full min-h-[48px] bg-[#F8FAFC] focus:bg-white border-2 border-slate-200/90 focus:border-[#1B68FF] rounded-[14px] px-4 py-2.5 pr-12 text-[16px] text-[#0A0D14] placeholder-slate-400 focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-slate-400 hover:text-[#0A0D14] p-1.5 rounded-lg cursor-pointer"
                        title={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`min-h-[48px] w-full px-6 py-3 rounded-[14px] text-white text-[16px] font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none active:translate-y-0.5 ${
                        isStaffMode
                          ? 'bg-[#0A0D14] hover:bg-[#1E293B] shadow-[0_10px_24px_rgba(10,13,20,0.22)]'
                          : 'bg-[#1B68FF] hover:bg-[#1454D6] shadow-[0_10px_24px_rgba(27,104,255,0.28)]'
                      }`}
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <span>{isStaffMode ? 'Masuk ke Portal Staf' : 'Masuk ke Akun'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {!isStaffMode && (
                  <p className="mt-6 pt-5 border-t border-slate-200/80 text-center text-[15px] text-[#1E293B]">
                    Belum punya akun siswa?{' '}
                    <Link href="/register" className="font-semibold text-[#1B68FF] hover:underline">
                      Daftar sekarang
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. FOOTER — Sejajar dengan Lebar Card Utama (max-w-[980px]) */}
      <footer className="w-full max-w-[980px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px] text-[#1E293B]">
        <div>
          <span className="font-semibold text-[#0A0D14]">AGRA</span> — Ruang Belajar &amp; Simulasi Mandiri TKA SMP
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy-policy" className="hover:text-[#0A0D14] hover:underline transition-colors">
            Kebijakan Privasi
          </Link>
          <Link href="/terms-of-service" className="hover:text-[#0A0D14] hover:underline transition-colors">
            Ketentuan Layanan
          </Link>
          <span>© 2026 AGRA</span>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#EEF2FA] text-[#1E293B] text-[15px]">
          Memuat halaman masuk...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
