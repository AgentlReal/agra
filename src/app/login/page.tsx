'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { sanitizeRedirectPath, signInWithGoogle } from '@/lib/auth-client';
import { api, ApiError } from '@/lib/api-client';
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
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

        <div className="inline-flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-sm p-1 border border-slate-200/80 text-[13px] font-medium">
          <Link
            href="/login"
            onClick={() => {
              setErrorMsg('');
              setWaitingVerification(false);
            }}
            className={`px-3.5 py-1 rounded-full transition-all ${
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
            className={`px-3.5 py-1 rounded-full transition-all ${
              isStaffMode
                ? 'bg-[#0A0D14] text-white shadow-2xs'
                : 'text-[#334155] hover:text-[#0A0D14]'
            }`}
          >
            Portal Staf
          </Link>
        </div>
      </div>

      {/* MAIN FLOATING CARD (Persis Referensi Gambar + Gaya AGRA) */}
      <div className="relative z-10 w-full max-w-[1000px] bg-white rounded-[32px] p-3.5 sm:p-5 shadow-[0_25px_80px_-12px_rgba(27,104,255,0.16)] border border-white grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* PANEL KIRI: Inset Rounded Aurora Mesh Card */}
        <div className="lg:col-span-5 relative rounded-[24px] overflow-hidden min-h-[300px] lg:min-h-[560px] p-7 sm:p-9 flex flex-col justify-between text-white select-none">
          {/* Multi-layered Silk Mesh Gradient */}
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{
              backgroundColor: isStaffMode ? '#070B14' : '#0B258A',
              backgroundImage: isStaffMode
                ? `
                  radial-gradient(at 15% 15%, #1B68FF 0px, transparent 58%),
                  radial-gradient(at 88% 20%, #38BDF8 0px, transparent 52%),
                  radial-gradient(at 75% 82%, #1E293B 0px, transparent 58%),
                  radial-gradient(at 15% 88%, #0F172A 0px, transparent 55%)
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
          {/* Subtle contrast vignette at bottom so white text is 100% readable */}
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
              {isStaffMode ? 'RBAC STAF' : 'FASE D SMP'}
            </span>
          </div>

          {/* Bottom Editorial Statement inside Mesh Panel */}
          <div className="relative z-10 space-y-5 mt-16">
            <div className="space-y-2">
              <p className="text-[15px] font-normal text-white/90">
                {isStaffMode ? 'Panel Kurikulum & Admin' : 'Ruang Belajar Mandiri'}
              </p>
              <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.03em] leading-[1.2] text-white text-balance">
                {isStaffMode
                  ? 'Kelola bank soal, struktur materi, dan paket simulasi TKA dalam satu tempat'
                  : 'Persiapan terukur dari diagnostik awal hingga simulasi ujian CBT 75 menit'}
              </h1>
            </div>

            {/* Minimalist Glass Pill Row */}
            <div
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              className="pt-4 border-t border-white/20 flex flex-wrap items-center gap-2 text-[11px] text-white/90"
            >
              <span className="px-2.5 py-1 rounded-[8px] bg-white/15 backdrop-blur-xs">
                01 Recall 90%
              </span>
              <span className="px-2.5 py-1 rounded-[8px] bg-white/15 backdrop-blur-xs">
                02 16 Submateri
              </span>
              <span className="px-2.5 py-1 rounded-[8px] bg-white/15 backdrop-blur-xs">
                03 CBT 75:00
              </span>
            </div>
          </div>
        </div>

        {/* PANEL KANAN: Clean Airy Form Area */}
        <div className="lg:col-span-7 flex flex-col justify-center px-5 py-8 sm:px-12 lg:px-14">
          <div className="w-full max-w-[390px] mx-auto">
            {/* Iconic Asterisk Mark + Heading */}
            <div className="mb-7">
              <BrandAsterisk
                className={`w-7 h-7 mb-4 ${
                  isStaffMode ? 'text-[#0A0D14]' : 'text-[#1B68FF]'
                }`}
              />
              <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.035em] leading-[1.15] text-[#0A0D14]">
                {isStaffMode ? 'Masuk portal staf' : 'Masuk ke akun'}
              </h2>
              <p className="text-[14px] leading-[1.55] text-[#64748B] mt-2">
                {isStaffMode
                  ? 'Gunakan kredensial Tim Kurikulum atau SuperAdmin untuk mengelola ruang asesmen.'
                  : 'Akses kembali progres latihan level kognitif, capaian submateri, dan simulasi ujianmu.'}
              </p>
            </div>

            {/* Alert Error / Verification Box */}
            {displayError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-[12px] border border-[#D97706] bg-[#FFFBEB] p-3.5 text-[13px] text-[#78350F]">
                <AlertCircle className="h-4 w-4 text-[#D97706] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="leading-[1.45] font-medium">{displayError}</p>
                  {waitingVerification && (
                    <p className="text-[12px] font-semibold text-[#92400E] flex items-center gap-2 pt-0.5">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#D97706] border-t-transparent inline-block" />
                      <span>Menunggu verifikasi dari email...</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Form Input */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  className="block text-[14px] font-medium text-[#0A0D14] mb-1.5"
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
                      : 'farazhaidet786@gmail.com'
                  }
                  required
                  autoComplete="username"
                  className="w-full h-[46px] bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[11px] px-4 text-[14px] text-[#0A0D14] placeholder-slate-400 transition-all"
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
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full h-[46px] bg-white border border-slate-300 focus:border-[#1B68FF] rounded-[11px] px-4 pr-11 text-[14px] text-[#0A0D14] placeholder-slate-400 transition-all"
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

              {/* Primary Glowing Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`h-[48px] w-full rounded-[11px] text-white text-[14px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:translate-y-0.5 ${
                    isStaffMode
                      ? 'bg-[#0A0D14] hover:bg-[#1E293B] shadow-[0_10px_25px_rgba(10,13,20,0.25)]'
                      : 'bg-[#1B68FF] hover:bg-[#1454D6] shadow-[0_10px_25px_rgba(27,104,255,0.38)]'
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

            {/* Divider "or continue with" */}
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-slate-200" />
              <span className="shrink-0 mx-3 text-[12px] text-slate-400">
                atau lanjutkan dengan
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            {/* Social Pill Row (Persis Gaya Tombol Abu-abu di Referensi) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="h-[42px] rounded-[10px] bg-[#EEF2F8] hover:bg-[#E2E8F0] text-[#0A0D14] text-[13px] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {googleLoading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-[#1B68FF] border-t-transparent animate-spin" />
                ) : (
                  <>
                    <GoogleColorIcon />
                    <span>Google</span>
                  </>
                )}
              </button>

              <Link
                href={isStaffMode ? '/login' : '/login?as=staff'}
                onClick={() => {
                  setErrorMsg('');
                  setWaitingVerification(false);
                }}
                className="h-[42px] rounded-[10px] bg-[#EEF2F8] hover:bg-[#E2E8F0] text-[#0A0D14] text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{isStaffMode ? 'Mode Siswa' : 'Portal Staf'}</span>
              </Link>
            </div>

            {/* Bottom Sign-Up Link */}
            <p className="mt-7 text-center text-[13px] text-[#64748B]">
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
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#EEF2FA] text-[#334155] text-[14px]">
          Memuat halaman masuk...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
