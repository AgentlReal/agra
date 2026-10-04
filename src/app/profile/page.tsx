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
  History, 
  ShieldCheck, 
  AlertCircle,
  GraduationCap,
  KeyRound,
  Edit3,
  X,
  Sliders,
  Eye,
  EyeOff,
  LogOut,
  ChevronRight,
  Award,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';

const MASTERY_TIERS = [
  { level: 1, name: 'Pemula', minXp: 0, maxXp: 200, desc: 'Memulai pengenalan format asesmen dan diagnostik awal.' },
  { level: 2, name: 'Pembelajar Tangguh', minXp: 201, maxXp: 500, desc: 'Konsisten menyelesaikan latihan drill Level 1 Pemahaman.' },
  { level: 3, name: 'Penjelajah Konsep', minXp: 501, maxXp: 1000, desc: 'Menguasai Level 2 Penerapan konsep dan variasi soal.' },
  { level: 4, name: 'Pemecah Masalah', minXp: 1001, maxXp: 2000, desc: 'Mampu memecahkan soal HOTS Level 3 Penalaran mendalam.' },
  { level: 5, name: 'Jawara TKA', minXp: 2001, maxXp: 99999, desc: 'Tuntas seluruh materi dan siap mengikuti Simulasi CBT 75 menit.' },
];

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [profile, setProfile] = useState<any>(null);
  const [savingName, setSavingName] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Avatars state
  const [avatars, setAvatars] = useState<any[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number>(1);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  // XP transactions
  const [xpTransactions, setXpTransactions] = useState<any[]>([]);
  const [loadingXp, setLoadingXp] = useState(true);

  // Sync initial name from auth context
  useEffect(() => {
    if (user?.name && !name) {
      setName(user.name);
    }
  }, [user?.name, name]);

  // Fetch initial profile data on mount
  useEffect(() => {
    // Fetch avatars
    api.profile
      .getAvatars()
      .then((res: any) => {
        const list = res?.data?.items || res?.items || (Array.isArray(res) ? res : res.data || []);
        if (Array.isArray(list)) {
          setAvatars(list);
          const active = list.find((a: any) => a.selected);
          if (active) {
            setSelectedAvatarId(active.id);
          }
        }
      })
      .catch((err) => console.error('Failed to load avatars:', err));

    // Fetch profile details
    api.profile
      .get()
      .then((res: any) => {
        const pData = res?.data || res;
        if (pData) {
          setProfile(pData);
          if (pData?.avatar?.id) {
            setSelectedAvatarId(pData.avatar.id);
          }
          if (pData.name) {
            setName(pData.name);
          }
          updateUser({
            name: pData.name,
            avatarUrl: pData.avatar?.imageUrl || pData.avatarUrl,
            avatarId: pData.avatar?.id,
            totalXp: pData.totalXp ?? pData.total_xp ?? 0,
            grade: pData.grade,
          });
        }
      })
      .catch(() => {});

    // Fetch XP transactions
    api.profile
      .getXpTransactions()
      .then((res: any) => {
        const list = res?.items || (Array.isArray(res) ? res : res.data?.items || []);
        setXpTransactions(list);
      })
      .catch((err) => console.error('Failed to load XP transactions:', err))
      .finally(() => setLoadingXp(false));
  }, []);

  // Determine current mastery tier
  const currentXp = profile?.totalXp ?? profile?.total_xp ?? user?.totalXp ?? 0;
  const currentTier = MASTERY_TIERS.find((t) => currentXp >= t.minXp && currentXp <= t.maxXp) || MASTERY_TIERS[0];
  const nextTier = MASTERY_TIERS.find((t) => t.level === currentTier.level + 1);
  const xpProgress = nextTier 
    ? Math.min(100, Math.max(0, Math.round(((currentXp - currentTier.minXp) / (nextTier.minXp - currentTier.minXp)) * 100)))
    : 100;

  // Password validation rules
  const hasLength = newPassword.length >= 6 && newPassword.length <= 12;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;
  const isPasswordValid = hasLength && hasUpper && hasLower && hasNumber && hasSpecial && passwordsMatch;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSavingName(true);
    try {
      await api.profile.update(name.trim());
      if (selectedAvatarId) {
        await api.profile.updateAvatar(selectedAvatarId);
        const chosen = avatars.find((a) => a.id === selectedAvatarId);
        const chosenUrl = chosen?.imageUrl || chosen?.image_url;
        setProfile((prev: any) => ({
          ...prev,
          name: name.trim(),
          avatar: chosen ? { ...chosen, imageUrl: chosenUrl } : prev?.avatar,
          avatarUrl: chosenUrl,
        }));
        updateUser({ 
          name: name.trim(),
          avatarId: selectedAvatarId,
          avatarUrl: chosenUrl
        });
      } else {
        setProfile((prev: any) => ({ ...prev, name: name.trim() }));
        updateUser({ name: name.trim() });
      }
      setEditModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui profil siswa.');
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!isPasswordValid) {
      setPassError('Harap lengkapi semua kriteria keamanan kata sandi baru.');
      return;
    }

    setChangingPass(true);
    try {
      await api.auth.changePassword(currentPassword, newPassword);
      setPassSuccess('Kata sandi berhasil diperbarui dengan aman!');
      setTimeout(() => {
        setPasswordModalOpen(false);
        setPassSuccess('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    } catch (err: any) {
      setPassError(err.message || 'Gagal mengubah kata sandi. Pastikan kata sandi lama Anda benar.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Page Title (Matching profile-ie reference) */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profil Saya</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola akun, pantau tingkat pencapaian fase belajar, dan simpan riwayat XP usahamu.
          </p>
        </div>

        {/* Two Column Layout (Matching profile-ie reference) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =========================================================
              LEFT COLUMN: Summary Card, Milestone Tier, Quick Actions
             ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Student Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <UserAvatar
                    src={profile?.avatar?.imageUrl || profile?.avatarUrl || user?.avatarUrl}
                    name={profile?.name || user?.name || user?.username}
                    size="xl"
                    rounded="full"
                    className="ring-4 ring-blue-50"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-slate-900 truncate">
                    {profile?.name || user?.name || user?.username || 'Siswa'}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mt-0.5">
                    <span>@{user?.username || '-'}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-sans font-medium">
                      Terverifikasi
                    </span>
                  </div>
                  {(profile?.grade || user?.grade) ? (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700">
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>Kelas {profile?.grade || user?.grade} SMP (Fase D)</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <button
                onClick={() => setEditModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Edit3 className="h-4 w-4 text-slate-500" />
                <span>Edit Profil & Avatar</span>
              </button>

              <hr className="border-slate-100" />

              {/* Milestone Tier Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Fase Belajar Aktif
                  </span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {currentTier.name}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2 font-medium">
                    <span>{currentXp} XP terkumpul</span>
                    {nextTier ? (
                      <span>Butuh {nextTier.minXp - currentXp} XP lagi ke {nextTier.name}</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">Tingkat Maksimum</span>
                    )}
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Quick Actions List */}
              <div className="space-y-2">
                <button
                  onClick={() => setPasswordModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Ubah Kata Sandi</p>
                      <p className="text-[11px] text-slate-500">Perbarui kata sandi akun belajarmu</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </button>

                <button
                  onClick={() => logout()}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-200 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-amber-900">Keluar Sesi Akun</p>
                      <p className="text-[11px] text-slate-500">Keluar dari akun di perangkat ini</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-800 transition-colors" />
                </button>
              </div>
            </div>

          </div>

          {/* =========================================================
              RIGHT COLUMN: 5-Fase Mastery Stepper & XP Transactions
             ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 5-Fase Mastery Stepper Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Tingkat Pencapaian Belajar</h3>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    5 Fase Mastery
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Tiap tingkat menandai kedalaman pemahaman konsep TKA tanpa persaingan antar siswa.
                </p>
              </div>

              {/* Stepper List */}
              <div className="space-y-4">
                {MASTERY_TIERS.map((tier) => {
                  const isCompleted = currentXp >= tier.maxXp;
                  const isCurrent = currentXp >= tier.minXp && currentXp <= tier.maxXp;
                  return (
                    <div
                      key={tier.level}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                          : isCompleted
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-slate-200 bg-slate-50/50 opacity-60'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted ? <Check className="h-4 w-4" /> : tier.level}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{tier.name}</h4>
                          <span className="text-[11px] font-semibold text-slate-500 font-mono">
                            {tier.level === 5 ? '> 2.000 XP' : `${tier.minXp} - ${tier.maxXp} XP`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{tier.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Riwayat Poin XP Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Riwayat Poin XP</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Aktivitas drill latihan dan capaian belajarmu.</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Total: {currentXp} XP</span>
                </div>
              </div>

              {loadingXp ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                </div>
              ) : xpTransactions.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl">
                  <Award className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Belum ada riwayat perolehan XP.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Selesaikan asesmen Recall atau latihan Level untuk mendapatkan XP.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {xpTransactions.map((tx: any, idx: number) => {
                    const points = tx.points ?? tx.xp_earned ?? tx.amount ?? 0;
                    const desc = tx.description || tx.source || tx.activity_name || 'Latihan Selesai';
                    const dateStr = tx.createdAt || tx.created_at;
                    const dateFormatted = dateStr ? new Date(dateStr).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-';
                    return (
                      <div key={tx.id || `tx-${idx}`} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{desc}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{dateFormatted}</p>
                        </div>
                        <span className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                          +{points} XP
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* =========================================================
          MODAL 1: Edit Profile & Avatar (from edit-profile-zi)
         ========================================================= */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 my-auto text-slate-800">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-2">
                <Edit3 className="h-3.5 w-3.5" />
                <span>Pengaturan Profil</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Edit Profil Siswa</h3>
              <p className="text-xs text-slate-500 mt-1">Perbarui nama tampilan dan avatar belajarmu.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-800 text-xs flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span>Nama Lengkap Siswa</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">Pilih Avatar Karakter Resmi</label>
                <div className="grid grid-cols-3 gap-3">
                  {avatars.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(av.id)}
                      className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all text-center cursor-pointer ${
                        selectedAvatarId === av.id
                          ? 'border-blue-600 bg-blue-50 shadow-xs ring-2 ring-blue-600/30'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {selectedAvatarId === av.id && (
                        <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white z-10 text-[10px]">
                          ✓
                        </div>
                      )}
                      <UserAvatar
                        src={av.imageUrl}
                        name={av.name}
                        size="md"
                        rounded="full"
                        className="mb-1"
                      />
                      <span className="text-[11px] font-semibold leading-tight line-clamp-1 text-slate-700">{av.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingName}
                  className="btn-tactile-primary px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {savingName ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: Change Password (Exact replica of ganti pw/code.html)
         ========================================================= */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <section
            aria-labelledby="modal-title"
            aria-modal="true"
            role="dialog"
            className="relative w-full max-w-[580px] bg-white rounded-[28px] shadow-2xl p-6 sm:p-8 md:p-10 my-auto text-slate-800 transition-all border border-slate-100"
          >
            <button
              onClick={() => setPasswordModalOpen(false)}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100 focus:outline-none"
              type="button"
              aria-label="Tutup dialog"
            >
              <X className="h-5 w-5" />
            </button>

            <header className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Keamanan Akun Siswa Mandiri</span>
              </div>
              <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 mt-3 mb-2 tracking-tight leading-snug" id="modal-title">
                Ubah Kata Sandi
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Perbarui kata sandi akun belajarmu secara mandiri. Gunakan kombinasi yang kuat dan mudah kamu ingat agar akun belajarmu tetap aman dan terlindungi.
              </p>
            </header>

            {passError && (
              <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Field 1: Kata Sandi Lama */}
              <div>
                <label className="font-semibold text-slate-800 text-sm flex items-center gap-2 mb-2" htmlFor="old-pass">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Kata Sandi Lama</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="old-pass"
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama yang saat ini aktif"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                    aria-label="Lihat kata sandi lama"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <span className="text-slate-400">ℹ</span>
                  <span>Masukkan kata sandi aktif untuk memverifikasi kepemilikan akun.</span>
                </p>
              </div>

              {/* Field 2: Kata Sandi Baru */}
              <div>
                <label className="font-semibold text-slate-800 text-sm flex items-center gap-2 mb-2" htmlFor="new-pass">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <span>Kata Sandi Baru</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="new-pass"
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Buat kata sandi baru (6–12 karakter)"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                    aria-label="Lihat kata sandi baru"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Security Criteria Box */}
              <div className="bg-[#eff6ff] border border-blue-100 rounded-xl p-4 my-3 text-xs">
                <div className="font-semibold text-slate-800 flex items-center gap-2 mb-2.5">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Kriteria Keamanan Sandi :</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 pl-0.5">
                  <li className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full border inline-flex items-center justify-center text-[10px] flex-shrink-0 ${hasLength ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'}`}>
                      {hasLength ? '✓' : ''}
                    </span>
                    <span>Minimal 6 karakter (maksimal 12 karakter)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full border inline-flex items-center justify-center text-[10px] flex-shrink-0 ${hasUpper && hasLower ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'}`}>
                      {hasUpper && hasLower ? '✓' : ''}
                    </span>
                    <span>Memuat huruf kapital (A–Z) dan huruf kecil (a–z)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full border inline-flex items-center justify-center text-[10px] flex-shrink-0 ${hasNumber ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'}`}>
                      {hasNumber ? '✓' : ''}
                    </span>
                    <span>Memuat minimal satu angka (0–9)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full border inline-flex items-center justify-center text-[10px] flex-shrink-0 ${hasSpecial ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'}`}>
                      {hasSpecial ? '✓' : ''}
                    </span>
                    <span>Memuat simbol atau karakter khusus (@, #, $, %, dll.)</span>
                  </li>
                </ul>
              </div>

              {/* Field 3: Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="font-semibold text-slate-800 text-sm flex items-center gap-2 mb-2" htmlFor="conf-pass">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Konfirmasi Kata Sandi Baru</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="conf-pass"
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru kamu"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                    aria-label="Lihat konfirmasi kata sandi"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <span className="text-slate-400">ℹ</span>
                  <span>Ketik ulang kata sandi baru persis sama.</span>
                </p>
              </div>

              {/* Modal Actions Footer */}
              <footer className="pt-6 mt-6 flex items-center justify-end gap-3 sm:gap-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-5 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={changingPass || !isPasswordValid}
                  className="btn-tactile-primary px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{changingPass ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}</span>
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}
