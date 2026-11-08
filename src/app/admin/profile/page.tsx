'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import {
  UserCheck,
  Lock,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Mail,
} from 'lucide-react';

export default function AdminProfilePage() {
  const router = useRouter();
  const { user, role, isLoading, isAuthenticated, updateUser } = useAuth();

  const isSuperAdmin = role === 'SUPERADMIN' || user?.role === 'SUPERADMIN';
  const isAuthorized =
    isAuthenticated &&
    (role === 'TIM_KURIKULUM' ||
      user?.role === 'TIM_KURIKULUM' ||
      role === 'SUPERADMIN' ||
      user?.role === 'SUPERADMIN');

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.replace('/login?as=staff');
      } else if (!isAuthorized) {
        router.replace('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, isAuthorized, router]);

  const [nameInput, setNameInput] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const currentName = nameInput !== null ? nameInput : user?.name || '';
  const currentEmail = emailInput !== null ? emailInput : user?.email || '';

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = currentName.trim();
    const trimmedEmail = currentEmail.trim().toLowerCase();
    if (!trimmedName || !trimmedEmail) return;

    setSavingProfile(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      await api.admin.updateProfile(trimmedName, trimmedEmail);
      updateUser({ name: trimmedName, email: trimmedEmail });
      setNameInput(trimmedName);
      setEmailInput(trimmedEmail);
      setProfileSuccess('Profil dan alamat email berhasil diperbarui!');
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui profil admin.';
      setProfileError(msg || 'Gagal memperbarui profil admin.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword.length < 6 || newPassword.length > 12) {
      setPassError('Kata sandi harus berukuran 6 - 12 karakter.');
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setPassError('Kata sandi baru wajib memuat huruf kapital, huruf kecil, angka, dan karakter simbol khusus.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setChangingPass(true);
    try {
      await api.auth.changePassword(currentPassword, newPassword);
      setPassSuccess('Kata sandi berhasil diubah.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : '';
      const lowerMsg = rawMsg.toLowerCase();
      if (lowerMsg.includes('invalid password')) {
        setPassError('Kata sandi saat ini yang Anda masukkan salah.');
      } else {
        setPassError(rawMsg || 'Gagal mengubah kata sandi.');
      }
    } finally {
      setChangingPass(false);
    }
  };

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <AdminNav />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-bold mb-1">
            <UserCheck className="h-4 w-4" />
            <span>Manajemen Akun {isSuperAdmin ? 'SuperAdmin' : 'Kurikulum'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isSuperAdmin ? 'Profil SuperAdmin' : 'Profil Tim Kurikulum'}
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Kelola nama penanggung jawab, alamat email Google OAuth, dan kredensial keamanan akun administratif platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Edit Profile & Email Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldAlert className="h-4 w-4 text-purple-600" />
              <span>Informasi Personal &amp; Email Google</span>
            </h3>

            {profileError && (
              <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>{profileError}</span>
              </div>
            )}

            {profileSuccess && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600">Username</label>
                <input
                  type="text"
                  disabled
                  value={user?.username || ''}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-purple-600" />
                  <span>Alamat Email Akun (Untuk Login &amp; Google OAuth)</span>
                </label>
                <input
                  type="email"
                  value={currentEmail}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  placeholder="nama@gmail.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-xs"
                />
                <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                  Gunakan alamat email Google aktif Anda agar dapat masuk langsung dengan tombol Google.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Nama Lengkap Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={currentName}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                  minLength={3}
                  maxLength={30}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-xs"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-tactile-primary rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>

          {user?.hasPassword === false ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-7 space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Terhubung dengan Akun Google</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Akun ini masuk melalui Google dan belum memiliki kata sandi lokal. Jika ingin
                masuk juga dengan email/username, buat kata sandi lewat halaman{' '}
                <Link href="/forgot-password?as=staff" className="font-semibold text-purple-700 hover:underline">
                  Lupa Kata Sandi
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Lock className="h-4 w-4 text-purple-600" />
                <span>Ganti Kata Sandi</span>
              </h3>

              {passError && (
                <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{passSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Kata Sandi Saat Ini</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={changingPass}
                    className="btn-tactile-primary rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {changingPass ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
