'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { sanitizeRedirectPath, signInWithGoogle } from '@/lib/auth-client';
import { api, ApiError } from '@/lib/api-client';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
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
  const [googleLoading, setGoogleLoading] = useState(false);
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
          'Akun ini terdaftar sebagai Siswa, bukan Tim Kurikulum atau SuperAdmin.'
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
          'Email belum diverifikasi. Tautan verifikasi baru telah dikirim ke kotak masuk emailmu.'
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

  const handleGoogleSignIn = async () => {
    if (googleLoading || loading) return;
    setGoogleLoading(true);
    setErrorMsg('');
    try {
      await signInWithGoogle({
        redirectPath: isStaffMode
          ? redirectParam && redirectParam.startsWith('/admin')
            ? redirectParam
            : '/admin/dashboard'
          : redirectParam && !redirectParam.startsWith('/admin')
            ? redirectParam
            : null,
        errorCallbackURL: isStaffMode ? '/login?as=staff' : '/login',
        staffMode: isStaffMode,
      });
    } catch (err: unknown) {
      setGoogleLoading(false);
      setErrorMsg(
        (err instanceof Error && err.message) ||
          'Gagal menghubungkan ke layanan Google OAuth.'
      );
    }
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
      className="relative min-h-screen w-full bg-[#EEF2FA] text-[#0A0D14] flex flex-col justify-between overflow-x-hidden"
    >
      {/* Latar Belakang Satu Tema dengan Landing Page (Architectural Grid + Soft Ambient Stage) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15,23,42,0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-180px] right-[-120px] w-[620px] h-[620px] rounded-full bg-[#1B68FF]/14 blur-[130px] z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-200px] left-[-120px] w-[580px] h-[580px] rounded-full bg-[#38BDF8]/15 blur-[130px] z-0"
      />

      {/* 1. HEADER — Rata Kanan-Kiri Penuh & Logo AGRA Seamless Bisa Dinavigasi */}
      <header className="relative z-20 w-full px-6 sm:px-12 lg:px-16 pt-6 pb-4">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="min-h-[48px] inline-flex items-center gap-2.5 group"
            >
              <img
                src="/assets/images/agra-icon.png"
                alt="Logo AGRA"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="text-[26px] font-semibold tracking-[-0.04em] text-[#0A0D14] flex items-center">
                AGRA
                <span className="inline-block w-2 h-2 rounded-full bg-[#1B68FF] ml-1" />
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className="min-h-[44px] px-4 inline-flex items-center rounded-[12px] text-[15px] font-medium text-[#334155] hover:text-[#0A0D14] hover:bg-white/60 transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/#alur"
                className="min-h-[44px] px-4 inline-flex items-center rounded-[12px] text-[15px] font-medium text-[#334155] hover:text-[#0A0D14] hover:bg-white/60 transition-colors"
              >
                Alur Belajar
              </Link>
              <Link
                href="/#simulasi"
                className="min-h-[44px] px-4 inline-flex items-center rounded-[12px] text-[15px] font-medium text-[#334155] hover:text-[#0A0D14] hover:bg-white/60 transition-colors"
              >
                Simulasi CBT
              </Link>
              <Link
                href="/#submateri"
                className="min-h-[44px] px-4 inline-flex items-center rounded-[12px] text-[15px] font-medium text-[#334155] hover:text-[#0A0D14] hover:bg-white/60 transition-colors"
              >
                Kurikulum
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-[14px] bg-white/90 p-1 border border-slate-200/90 shadow-2xs text-[14px] font-medium">
              <Link
                href="/login"
                onClick={() => {
                  setErrorMsg('');
                  setWaitingVerification(false);
                }}
                className={`px-4 py-1.5 rounded-[10px] transition-all ${
                  !isStaffMode
                    ? 'bg-[#1B68FF] text-white shadow-2xs'
                    : 'text-[#334155] hover:text-[#0A0D14]'
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
                className={`px-4 py-1.5 rounded-[10px] transition-all ${
                  isStaffMode
                    ? 'bg-[#0A0D14] text-white shadow-2xs'
                    : 'text-[#334155] hover:text-[#0A0D14]'
                }`}
              >
                Portal Staf
              </Link>
            </div>

            {!isStaffMode && (
              <Link
                href="/register"
                className="hidden sm:inline-flex min-h-[44px] px-5 py-2 rounded-[14px] bg-white hover:bg-[#F4F7FC] text-[#0A0D14] border border-slate-200/90 text-[14px] font-semibold transition-all items-center shadow-2xs"
              >
                Daftar Akun
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN FLOATING CARD — Melayang Tegas di Tengah Layar */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-6">
        <div className="w-full max-w-[1020px] bg-white rounded-[36px] p-3.5 sm:p-5 border border-white ring-1 ring-slate-200/70 shadow-[0_40px_100px_-15px_rgba(10,22,70,0.18),0_16px_40px_-10px_rgba(27,104,255,0.12)] grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* PANEL KIRI: Inset Rounded Aurora Mesh Card */}
          <div className="lg:col-span-5 relative rounded-[26px] overflow-hidden min-h-[280px] lg:min-h-[560px] p-8 sm:p-10 flex flex-col justify-between text-white select-none">
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                backgroundColor: isStaffMode ? '#060E24' : '#0B258A',
                backgroundImage: isStaffMode
                  ? `
                    radial-gradient(at 15% 15%, #1B68FF 0px, transparent 58%),
                    radial-gradient(at 88% 20%, #38BDF8 0px, transparent 52%),
                    radial-gradient(at 75% 82%, #1E293B 0px, transparent 58%),
                    radial-gradient(at 15% 88%, #060E24 0px, transparent 55%)
                  `
                  : `
                    radial-gradient(at 12% 10%, #7DD3FC 0px, transparent 52%),
                    radial-gradient(at 88% 15%, #C4B5FD 0px, transparent 55%),
                    radial-gradient(at 78% 68%, #EFF6FF 0px, transparent 58%),
                    radial-gradient(at 18% 72%, #1B68FF 0px, transparent 62%),
                    radial-gradient(at 10% 95%, #071961 0px, transparent 65%)
                  `,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#06154D]/90 via-[#0B258A]/40 to-transparent pointer-events-none" />

            {/* Top Brand Inside Gradient Panel — Seamless AGRA Logo */}
            <div className="relative z-10 flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <img
                  src="/assets/images/agra-icon.png"
                  alt="Logo AGRA"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="w-8 h-8 object-contain"
                />
                <span className="text-[22px] font-semibold tracking-[-0.04em] text-white">
                  AGRA.
                </span>
              </Link>
            </div>

            {/* Bottom Statement — Bersih, Bold, Tanpa Micro-Badges */}
            <div className="relative z-10 space-y-3 mt-16">
              <p className="text-[15px] font-medium text-white/90 text-left">
                {isStaffMode ? 'Portal Tim Kurikulum & Admin' : 'Ruang Belajar Mandiri'}
              </p>
              <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.03em] leading-[1.2] text-white text-left">
                {isStaffMode
                  ? 'Kelola bank soal, struktur materi, dan paket simulasi TKA dalam satu tempat'
                  : 'Persiapan terukur dari diagnostik awal hingga simulasi ujian CBT 75 menit'}
              </h1>
            </div>
          </div>

          {/* PANEL KANAN: Form Login di Tengah Area Kanan */}
          <div className="lg:col-span-7 flex flex-col justify-center px-5 py-8 sm:px-12 lg:px-14">
            <div className="w-full max-w-[400px] mx-auto">
              <div className="mb-7">
                <img
                  src="/assets/images/agra-icon.png"
                  alt="Ikon AGRA"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="w-8 h-8 object-contain mb-4"
                />
                <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.035em] leading-[1.15] text-[#0A0D14] text-left">
                  {isStaffMode ? 'Masuk ke Portal Staf' : 'Masuk ke Akun'}
                </h2>
                <p className="text-[15px] leading-[1.6] text-[#334155] text-justify mt-2">
                  {isStaffMode
                    ? 'Gunakan akun Tim Kurikulum atau SuperAdmin untuk mengelola bank soal dan paket ujian.'
                    : 'Akses kembali progres latihan level kognitif, capaian submateri, dan simulasi ujianmu.'}
                </p>
              </div>

              {displayError && (
                <div className="mb-5 flex items-start gap-2.5 rounded-[12px] border border-[#D97706] bg-[#FFFBEB] p-3.5 text-[14px] text-[#78350F]">
                  <AlertCircle className="h-4 w-4 text-[#D97706] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="leading-[1.5] font-medium text-justify">{displayError}</p>
                    {waitingVerification && (
                      <p className="text-[13px] font-semibold text-[#92400E] flex items-center gap-2 pt-0.5">
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#D97706] border-t-transparent inline-block" />
                        <span>Menunggu verifikasi dari email...</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    className="block text-[14px] font-medium text-[#0A0D14] mb-1.5 text-left"
                    htmlFor="identifier"
                  >
                    {isStaffMode ? 'Email atau username staf' : 'Email atau username'}
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
                    className="w-full min-h-[48px] bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[12px] px-4 text-[15px] text-[#0A0D14] placeholder-slate-400 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className="text-[14px] font-medium text-[#0A0D14]"
                      htmlFor="password"
                    >
                      Kata sandi
                    </label>
                    <Link
                      href={isStaffMode ? '/forgot-password?as=staff' : '/forgot-password'}
                      className="text-[13px] text-[#1B68FF] hover:underline font-medium"
                    >
                      Lupa sandi?
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
                      className="w-full min-h-[48px] bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[12px] px-4 pr-11 text-[15px] text-[#0A0D14] placeholder-slate-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-[#0A0D14] p-1.5 rounded-lg cursor-pointer"
                      title={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`min-h-[48px] w-full rounded-[12px] text-white text-[15px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:translate-y-0.5 ${
                      isStaffMode
                        ? 'bg-[#0A0D14] hover:bg-[#1E293B] shadow-[0_10px_25px_rgba(10,13,20,0.25)]'
                        : 'bg-[#1B68FF] hover:bg-[#1454D6] shadow-[0_10px_25px_rgba(27,104,255,0.35)]'
                    }`}
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Memverifikasi...</span>
                      </>
                    ) : (
                      <span>{isStaffMode ? 'Masuk ke Portal Staf' : 'Masuk Sekarang'}</span>
                    )}
                  </button>
                </div>
              </form>

              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-slate-200" />
                <span className="shrink-0 mx-3 text-[13px] text-slate-400">
                  atau lanjutkan dengan
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="min-h-[48px] w-full rounded-[12px] bg-[#EEF2F8] hover:bg-[#E2E8F0] text-[#0A0D14] text-[14px] font-medium transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
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

              <p className="mt-7 text-center text-[14px] text-[#334155]">
                {isStaffMode ? (
                  <>
                    Peserta didik SMP?{' '}
                    <Link href="/login" className="font-semibold text-[#1B68FF] hover:underline">
                      Masuk sebagai Siswa
                    </Link>
                  </>
                ) : (
                  <>
                    Belum memiliki akun?{' '}
                    <Link href="/register" className="font-semibold text-[#1B68FF] hover:underline">
                      Daftar akun
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 3. FOOTER — Rata Kanan-Kiri Penuh Sejajar dengan Header */}
      <footer className="relative z-20 w-full px-6 sm:px-12 lg:px-16 pb-6 pt-4">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[14px] text-[#334155]">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/images/agra-icon.png"
              alt="Logo AGRA"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-6 h-6 object-contain"
            />
            <span className="font-semibold text-[#0A0D14]">AGRA.</span>
            <span>— Ruang Belajar &amp; Simulasi Mandiri Tes Kemampuan Akademik SMP</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-[#0A0D14] transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms-of-service" className="hover:text-[#0A0D14] transition-colors">
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
        <div className="flex min-h-screen items-center justify-center bg-[#EEF2FA] text-[#334155] text-[15px]">
          Memuat halaman masuk...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
