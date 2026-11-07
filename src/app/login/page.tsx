'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { sanitizeRedirectPath } from '@/lib/auth-client';
import { api, ApiError } from '@/lib/api-client';
import {
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Info,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { GoogleAuthButton, formatOAuthErrorMessage } from '@/components/common/GoogleAuthButton';
import { Footer } from '@/components/layout/Footer';

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
          'Akun ini terdaftar sebagai Siswa, bukan Tim Kurikulum atau SuperAdmin. Silakan masuk melalui halaman Masuk Siswa atau hubungi SuperAdmin.'
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
          'Alamat email akunmu belum diverifikasi. Kami baru saja mengirimkan tautan verifikasi baru ke kotak masuk emailmu—klik tombol verifikasi di email, lalu halaman ini akan masuk secara otomatis.'
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
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Header Bar */}
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
            {isStaffMode ? (
              <Link
                href="/login"
                onClick={() => {
                  setErrorMsg('');
                  setWaitingVerification(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 transition-colors"
              >
                <span>&larr; Halaman Masuk Siswa</span>
              </Link>
            ) : (
              <>
                <span className="text-xs text-slate-500 hidden sm:inline">Belum punya akun?</span>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <span>Daftar Akun Baru</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Split Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 space-y-6 lg:pr-6">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.2]">
              Ruang Belajar & Simulasi TKA <span className="text-blue-600">SMP</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Persiapkan dirimu menghadapi Tes Kemampuan Akademik (TKA) jenjang SMP/MTs dengan latihan formatif bertingkat, evaluasi adaptif, dan simulasi CBT 75 menit berstandar Kemendikdasmen.
            </p>
          </div>

          {/* Right Form Card Column */}
          <div className="lg:col-span-6 w-full">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 md:p-10 relative">
              {/* Form Heading Tag */}
              <div className="mb-6">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-3 ${
                    isStaffMode
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {isStaffMode ? (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>PORTAL TIM KURIKULUM &amp; ADMINISTRATOR</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>MASUK KE RUANG BELAJAR</span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {isStaffMode ? 'Portal Tim & Administrator' : 'Selamat datang!'}
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  {isStaffMode
                    ? 'Masuk dengan Akun Google yang telah diundang oleh SuperAdmin atau gunakan kredensial akun tim Anda.'
                    : 'Masuk untuk memulai latihan dan raih skor TKA impianmu hari ini.'}
                </p>
              </div>

              {/* Error Message */}
              {displayError && (
                <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}

              {/* Primary Sign-In with Google */}
              <div className="space-y-4 mb-5">
                <GoogleAuthButton
                  label={
                    isStaffMode
                      ? 'Masuk Tim / Admin dengan Akun Google'
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
                  errorCallbackURL={
                    isStaffMode ? '/login?as=staff' : '/login'
                  }
                  staffMode={isStaffMode}
                  disabled={loading}
                  onError={(msg) => setErrorMsg(msg)}
                  className={
                    isStaffMode
                      ? 'border-purple-200 hover:border-purple-300 hover:bg-purple-50/40'
                      : 'border-blue-200 hover:border-blue-300 hover:bg-blue-50/40'
                  }
                />

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="shrink-0 mx-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    atau masuk dengan email / username
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>
              </div>

              {/* Credential Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2 mb-2" htmlFor="identifier">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                    <span>Email atau Username</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        isStaffMode
                          ? 'misal: superadmin / kurikulum_pusat'
                          : 'misal: farhan@smp.sch.id / firman'
                      }
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-2" htmlFor="password">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <span>Kata Sandi</span>
                    </label>
                    <Link
                      href={isStaffMode ? '/forgot-password?as=staff' : '/forgot-password'}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
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
                      placeholder="Masukkan kata sandi akunmu"
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

                <div className="bg-[#eff6ff] border border-blue-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {isStaffMode
                      ? 'Hanya alamat email yang telah diundang oleh SuperAdmin yang dapat masuk ke Portal Tim Kurikulum & Administrator.'
                      : 'Setelah berhasil masuk, kamu dapat langsung melanjutkan asesmen awal Recall atau materi kurikulum untuk mengukur penguasaan TKA.'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-tactile-primary w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none mt-2"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>{isStaffMode ? 'Masuk ke Portal Admin' : 'Masuk ke Ruang Belajar'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {!isStaffMode && (
                  <div className="pt-2 text-center">
                    <Link
                      href="/register"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <span>Daftar Akun Siswa Baru</span>
                    </Link>
                  </div>
                )}
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-center text-xs text-slate-500">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Didukung standar Kemendikdasmen untuk asesmen ramah siswa.</span>
                </div>
                <div>
                  {isStaffMode ? (
                    <Link
                      href="/login"
                      onClick={() => {
                        setErrorMsg('');
                        setWaitingVerification(false);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      &larr; Kembali ke Halaman Masuk Siswa
                    </Link>
                  ) : (
                    <Link
                      href="/login?as=staff"
                      onClick={() => {
                        setErrorMsg('');
                        setWaitingVerification(false);
                      }}
                      className="text-slate-500 hover:text-purple-700 font-semibold transition-colors"
                    >
                      Masuk sebagai Tim Kurikulum / SuperAdmin &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-500 text-sm">
          Memuat halaman masuk...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
