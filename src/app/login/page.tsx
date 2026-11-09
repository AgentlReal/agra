'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { sanitizeRedirectPath } from '@/lib/auth-client';
import { api, ApiError } from '@/lib/api-client';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { GoogleAuthButton, formatOAuthErrorMessage } from '@/components/common/GoogleAuthButton';

const UI = {
  btnPrimary:
    'min-h-[48px] w-full px-7 py-3.5 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[16px] font-semibold transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] inline-flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:pointer-events-none',
  btnPrimaryStaff:
    'min-h-[48px] w-full px-7 py-3.5 rounded-[14px] bg-[#0A0D14] hover:bg-[#1E293B] active:translate-y-0.5 text-white text-[16px] font-semibold transition-all shadow-[0_10px_24px_rgba(10,13,20,0.22)] inline-flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:pointer-events-none',
  btnSecondaryOutline:
    'min-h-[48px] w-full px-6 py-3 rounded-[14px] bg-white hover:bg-[#F4F7FC] active:translate-y-0.5 text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[16px] font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer',
  input:
    'w-full min-h-[48px] bg-[#F4F7FC] focus:bg-white border-2 border-slate-200 focus:border-[#1B68FF] rounded-[14px] px-4 py-3 text-[16px] text-[#0A0D14] placeholder-slate-400 focus:outline-none transition-colors',
};

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
          'Akun ini terdaftar sebagai Siswa, bukan Tim Kurikulum atau SuperAdmin. Silakan masuk melalui mode Siswa atau hubungi SuperAdmin.'
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
          'Alamat email akunmu belum diverifikasi. Tautan verifikasi telah dikirimkan ke kotak masuk email Anda.'
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
    <div
      style={{ fontFamily: "'Onest', sans-serif" }}
      className="relative min-h-screen w-full bg-[#F4F7FC] text-[#0A0D14] text-[16px] leading-[1.55] flex flex-col justify-between overflow-x-hidden"
    >
      {/* Background Architectural 50/50 Split Stage (Desktop lg+) */}
      <div className="hidden lg:grid fixed inset-0 grid-cols-12 pointer-events-none z-0">
        <div className="col-span-6 bg-[#F4F7FC]" />
        <div
          className={`col-span-6 transition-colors duration-500 rounded-bl-[64px] ${
            isStaffMode
              ? 'bg-gradient-to-br from-[#0A0D14] via-[#111827] to-[#1E293B]'
              : 'bg-gradient-to-br from-[#2370FF] via-[#1B68FF] to-[#0D4EE0]'
          }`}
        />
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
              className="min-h-[44px] px-4 inline-flex items-center rounded-[12px] text-[16px] font-medium text-[#1E293B] hover:text-[#0A0D14] hover:bg-slate-200/60 transition-colors"
            >
              &larr; Beranda
            </Link>
          </div>

          <div className="hidden lg:flex lg:col-span-6 items-center justify-end gap-4">
            {!isStaffMode && (
              <>
                <span className="text-[16px] text-white">Belum memiliki akun siswa?</span>
                <Link
                  href="/register"
                  className="min-h-[48px] px-6 py-2.5 rounded-[14px] bg-white text-[#1B68FF] text-[16px] font-semibold hover:bg-blue-50 active:translate-y-0.5 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.16)] inline-flex items-center gap-2"
                >
                  <span>Daftar Akun Siswa</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN ARCHITECTURAL STAGE */}
      <main className="relative z-20 flex-1 flex items-center py-8 sm:py-12 px-6 sm:px-12 lg:px-16">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start lg:items-center">
          {/* LEFT 6 COLS: Editorial Typography */}
          <div className="lg:col-span-6 lg:pr-10 space-y-6">
            <h1 className="text-[40px] sm:text-[54px] lg:text-[62px] font-normal tracking-[-0.04em] leading-[1.05] text-[#0A0D14] text-balance">
              {isStaffMode ? (
                <>
                  Kendali Mutu{' '}
                  <span className="block text-[#1B68FF] mt-1">Bank Soal TKA.</span>
                </>
              ) : (
                <>
                  Lanjutkan{' '}
                  <span className="block text-[#1B68FF] mt-1">Asesmen Mandiri.</span>
                </>
              )}
            </h1>

            <p className="text-[16px] sm:text-[18px] font-normal leading-[1.55] text-[#1E293B] max-w-xl text-pretty">
              {isStaffMode
                ? 'Ruang kerja khusus Tim Kurikulum dan SuperAdmin untuk menyusun, memvalidasi, serta mengawasi paket simulasi Computer-Based Test (CBT).'
                : 'Seluruh progres ketuntasan 16 submateri Fase D, riwayat latihan level kognitif, dan simulasi CBT tersinkronisasi otomatis.'}
            </p>
          </div>

          {/* RIGHT 6 COLS: Double-Framed Form Card */}
          <div className="lg:col-span-6 w-full flex lg:justify-end">
            <div className="w-full max-w-[520px] bg-white/85 lg:bg-white/20 backdrop-blur-md rounded-[32px] p-2.5 sm:p-3.5 shadow-[0_28px_70px_rgba(15,23,42,0.14)] border border-white/60">
              <div className="bg-white rounded-[20px] p-6 sm:p-10 border border-slate-200">
                {/* Card Heading */}
                <div className="mb-7">
                  <h2 className="text-[24px] sm:text-[26px] font-medium tracking-[-0.025em] leading-[1.3] text-[#0A0D14]">
                    {isStaffMode ? 'Masuk ke Portal Staf' : 'Masuk ke Akun'}
                  </h2>
                  <p className="text-[16px] text-[#1E293B] mt-1">
                    {isStaffMode
                      ? 'Gunakan akun Google terdaftar atau kredensial staf.'
                      : 'Lanjutkan asesmen mandiri dan simulasi CBT.'}
                  </p>
                </div>

                {/* High-Contrast WCAG Alert Banner */}
                {displayError && (
                  <div className="mb-6 flex items-start gap-3 rounded-[14px] border-2 border-[#D97706] bg-[#FFFBEB] p-4 text-[15px] text-[#78350F]">
                    <AlertCircle className="h-5 w-5 text-[#D97706] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="leading-[1.5] font-medium">{displayError}</p>
                      {waitingVerification && (
                        <p className="text-[14px] font-semibold text-[#92400E] flex items-center gap-2 pt-1">
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#D97706] border-t-transparent inline-block" />
                          <span>Menunggu konfirmasi verifikasi email...</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Google Sign-In */}
                <div className="space-y-4 mb-6">
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
                      atau
                    </span>
                    <div className="flex-grow border-t border-slate-200" />
                  </div>
                </div>

                {/* Credential Form */}
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
                          ? 'superadmin atau username tim'
                          : 'nama@email.com atau username'
                      }
                      required
                      autoComplete="username"
                      className={UI.input}
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
                        className="text-[14px] text-[#1B68FF] hover:text-[#1454D6] font-medium"
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
                        className={`${UI.input} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-[#1E293B] hover:text-[#0A0D14] p-1.5 rounded-lg focus:outline-none cursor-pointer"
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

                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className={isStaffMode ? UI.btnPrimaryStaff : UI.btnPrimary}
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>Memverifikasi...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {isStaffMode ? 'Masuk ke Portal Staf' : 'Masuk ke Akun'}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {!isStaffMode && (
                      <Link href="/register" className={UI.btnSecondaryOutline}>
                        <span>Daftar Akun Baru</span>
                      </Link>
                    )}
                  </div>
                </form>

                {/* Card Bottom Switcher */}
                <div className="mt-7 pt-5 border-t border-slate-200 flex items-center justify-between text-[15px] text-[#1E293B]">
                  {isStaffMode ? (
                    <>
                      <span>Peserta didik SMP?</span>
                      <Link
                        href="/login"
                        onClick={() => {
                          setErrorMsg('');
                          setWaitingVerification(false);
                        }}
                        className="font-semibold text-[#1B68FF] hover:underline"
                      >
                        Masuk Siswa &rarr;
                      </Link>
                    </>
                  ) : (
                    <>
                      <span>Tim Kurikulum atau Admin?</span>
                      <Link
                        href="/login?as=staff"
                        onClick={() => {
                          setErrorMsg('');
                          setWaitingVerification(false);
                        }}
                        className="font-semibold text-[#0A0D14] hover:text-[#1B68FF] transition-colors"
                      >
                        Portal Staf &rarr;
                      </Link>
                    </>
                  )}
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
          <div className="flex flex-wrap items-center gap-6 text-[#1E293B] lg:text-white">
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F4F7FC] text-[#1E293B] text-[16px]">
          Memuat halaman masuk...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
