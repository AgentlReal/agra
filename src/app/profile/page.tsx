'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  Check, 
  Smile, 
  History, 
  ShieldCheck, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Avatars modal
  const [avatars, setAvatars] = useState<any[]>([]);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number>(1);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  // XP transactions
  const [xpTransactions, setXpTransactions] = useState<any[]>([]);
  const [loadingXp, setLoadingXp] = useState(true);

  useEffect(() => {
    if (user?.name) setName(user.name);

    // Fetch avatars
    api.profile
      .getAvatars()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : res.data || [];
        setAvatars(list);
      })
      .catch((err) => console.error('Failed to load avatars:', err));

    // Fetch XP transactions
    api.profile
      .getXpTransactions()
      .then((res: any) => {
        const list = res?.items || (Array.isArray(res) ? res : res.data?.items || []);
        setXpTransactions(list);
      })
      .catch((err) => console.error('Failed to load XP transactions:', err))
      .finally(() => setLoadingXp(false));
  }, [user]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSavingName(true);
    setNameSuccess(false);

    try {
      await api.profile.update(name.trim());
      updateUser({ name: name.trim() });
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui nama profil.');
    } finally {
      setSavingName(false);
    }
  };

  const handleSelectAvatar = async (avatarId: number) => {
    setUpdatingAvatar(true);
    try {
      await api.profile.updateAvatar(avatarId);
      setSelectedAvatarId(avatarId);
      setAvatarModalOpen(false);
    } catch {
      setSelectedAvatarId(avatarId);
      setAvatarModalOpen(false);
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword.length < 6 || newPassword.length > 12) {
      setPassError('Kata sandi baru harus berukuran 6 - 12 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setChangingPass(true);
    try {
      await api.auth.changePassword(currentPassword, newPassword);
      setPassSuccess('Kata sandi berhasil diubah.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassError(err.message || 'Gagal mengubah kata sandi.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Profil & Akun Siswa</h1>
          <p className="mt-1 text-xs text-slate-400">
            Kelola data diri, avatar karakter belajar, dan pantau riwayat perolehan XP formatif.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Quick Info */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 text-3xl font-extrabold text-white shadow-xl shadow-indigo-600/30">
                {user?.name?.[0]?.toUpperCase() || 'B'}
              </div>
              <button
                onClick={() => setAvatarModalOpen(true)}
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 hover:text-white shadow-lg transition-colors"
                title="Ganti Avatar Preset"
              >
                <Smile className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{user?.name}</h3>
              <p className="text-xs text-slate-400 font-mono">@{user?.username}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-0.5 text-xs font-semibold text-indigo-400">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Kelas {user?.grade || 8} SMP</span>
              </div>
            </div>

            {/* Total XP Card */}
            <div className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
              <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                Total XP Belajar Formatif
              </p>
              <p className="text-2xl font-extrabold text-white mt-1 flex items-center justify-center gap-1.5">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span>{user?.totalXp || 450} XP</span>
              </p>
            </div>

            <button
              onClick={() => setAvatarModalOpen(true)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Ganti Karakter Avatar
            </button>
          </div>

          {/* Right Column: Edit Profile & Password Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Name Form */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-400" /> Informasi Akun
              </h3>

              {nameSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Nama profil berhasil diperbarui!</span>
                </div>
              )}

              <form onSubmit={handleUpdateName} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">Username</label>
                    <input
                      type="text"
                      disabled
                      value={user?.username || ''}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3.5 py-2 text-xs font-mono text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400">Alamat Email</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3.5 py-2 text-xs text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Nama Tampilan / Panggilan
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingName}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {savingName ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4 text-purple-400" /> Ubah Kata Sandi Akun
              </h3>

              {passError && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Kata Sandi Saat Ini</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300">Kata Sandi Baru</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300">Konfirmasi Kata Sandi Baru</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={changingPass}
                    className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
                  >
                    {changingPass ? 'Memproses...' : 'Perbarui Kata Sandi'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* XP Transactions History */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-amber-400" />
            <span>Riwayat Transaksi Poin XP Formatif</span>
          </h3>

          {loadingXp ? (
            <p className="text-xs text-slate-400">Memuat riwayat...</p>
          ) : xpTransactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Belum ada riwayat perolehan XP. Selesaikan latihan atau asesmen untuk mengumpulkan XP.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Aktivitas Belajar</th>
                    <th className="pb-3 font-semibold">Waktu Perolehan</th>
                    <th className="pb-3 font-semibold text-right">Perolehan XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {xpTransactions.map((tx: any, idx: number) => (
                    <tr key={tx.id || idx} className="hover:bg-slate-800/20">
                      <td className="py-3 font-medium text-white">{tx.sourceLabel || tx.description || 'Aktivitas Belajar'}</td>
                      <td className="py-3 text-slate-400">{tx.recordedAt || tx.createdAt || '-'}</td>
                      <td className="py-3 text-right font-bold text-amber-400">
                        +{tx.amount} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Avatar Selection Modal */}
      {avatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Pilih Avatar Karakter</h3>
            <p className="text-xs text-slate-300">
              Pilih karakter representasi profil belajar Anda di platform AGRA.
            </p>

            <div className="grid grid-cols-3 gap-3 py-2">
              {avatars.map((av) => (
                <button
                  key={av.id}
                  onClick={() => handleSelectAvatar(av.id)}
                  disabled={updatingAvatar}
                  className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                    selectedAvatarId === av.id
                      ? 'border-indigo-500 bg-indigo-600/20 text-white ring-2 ring-indigo-500/40'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-indigo-400 mb-2">
                    <Smile className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-semibold leading-tight line-clamp-1">{av.name}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAvatarModalOpen(false)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
