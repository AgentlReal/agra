'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import {
  User,
  Lock,
  Sparkles,
  Check,
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
  ChevronDown,
  ChevronUp,
  Award,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';

// Master data 5 Tingkatan Capaian Prestasi Formatif (SRS DOC-06 / milestone_tiers)
const MASTERY_TIERS = [
  {
    level: 1,
    name: 'Perintis Belajar',
    minXp: 0,
    maxXp: 499,
    desc: 'Langkah awal memulai penjelajahan kompetensi dan menuntaskan asesmen pembuka.',
  },
  {
    level: 2,
    name: 'Penjelajah Konsep',
    minXp: 500,
    maxXp: 1499,
    desc: 'Telah menguasai beberapa submateri awal dan menunjukkan konsistensi belajar.',
  },
  {
    level: 3,
    name: 'Pejuang Penalaran',
    minXp: 1500,
    maxXp: 2999,
    desc: 'Telah menuntaskan sebagian besar submateri pokok dan terbiasa dengan tantangan level 3.',
  },
  {
    level: 4,
    name: 'Pakar Fase D',
    minXp: 3000,
    maxXp: 4999,
    desc: 'Mendekati penguasaan penuh seluruh materi kurikulum dan siap menghadapi simulasi ujian.',
  },
  {
    level: 5,
    name: 'Jawara TKA',
    minXp: 5000,
    maxXp: 99999,
    desc: 'Telah menuntaskan seluruh submateri dan meraih skor prima pada simulasi ujian TKA.',
  },
];

interface AvatarItem {
  id: number;
  name: string;
  imageUrl?: string;
  image_url?: string;
  selected?: boolean;
}

interface XpTransactionItem {
  id?: number | string;
  points?: number;
  xp_earned?: number;
  amount?: number;
  description?: string;
  source?: string;
  activity_name?: string;
  createdAt?: string;
  created_at?: string;
}

interface UserProfileData {
  name?: string;
  username?: string;
  hasPassword?: boolean;
  avatarUrl?: string;
  totalXp?: number;
  total_xp?: number;
  grade?: number | string;
  avatar?: { id?: number; imageUrl?: string; image_url?: string; name?: string };
  milestone?: { tierNumber?: number; id?: number; title?: string; minXp?: number; maxXp?: number };
  milestoneProgress?: { progressPercent?: number; xpRemaining?: number };
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, role, isLoading: authLoading, updateUser, logout } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login');
      } else if (role !== 'SISWA') {
        router.replace('/admin/dashboard');
      }
    }
  }, [authLoading, user, role, router]);

  const [name, setName] = useState(user?.name || '');
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [savingName, setSavingName] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Toggle expand untuk 3 terbaru
  const [showAllTiers, setShowAllTiers] = useState(false);
  const [showAllXp, setShowAllXp] = useState(false);

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
  const [avatars, setAvatars] = useState<AvatarItem[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number>(1);

  // XP transactions
  const [xpTransactions, setXpTransactions] = useState<XpTransactionItem[]>([]);
  const [loadingXp, setLoadingXp] = useState(true);

  // Fetch initial profile data on mount
  useEffect(() => {
    if (authLoading || !user || role !== 'SISWA') return;

    // Fetch avatars
    api.profile
      .getAvatars()
      .then((res: unknown) => {
        const resAny = res as { data?: { items?: AvatarItem[] }; items?: AvatarItem[] } | AvatarItem[];
        const list =
          (resAny as { data?: { items?: AvatarItem[] } })?.data?.items ||
          (resAny as { items?: AvatarItem[] })?.items ||
          (Array.isArray(resAny) ? resAny : []);
        if (Array.isArray(list)) {
          setAvatars(list);
          const active = list.find((a: AvatarItem) => a.selected);
          if (active) {
            setSelectedAvatarId(active.id);
          }
        }
      })
      .catch((err: unknown) => console.error('Failed to load avatars:', err));

    // Fetch profile details
    api.profile
      .get()
      .then((res: unknown) => {
        const resAny = res as { data?: UserProfileData } | UserProfileData;
        const pData = (resAny as { data?: UserProfileData })?.data || (resAny as UserProfileData);
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
            username: pData.username || user?.username,
            hasPassword: pData.hasPassword ?? true,
            avatarUrl: pData.avatar?.imageUrl || pData.avatarUrl,
            avatarId: pData.avatar?.id,
            totalXp: pData.totalXp ?? pData.total_xp ?? 0,
            grade: pData.grade,
          });
        }
      })
      .catch(() => {});

    // Fetch XP transactions (loadingXp starts true, no synchronous setState in effect)
    api.profile
      .getXpTransactions()
      .then((res: unknown) => {
        const resAny = res as { data?: { items?: XpTransactionItem[] }; items?: XpTransactionItem[] } | XpTransactionItem[];
        const list =
          (resAny as { data?: { items?: XpTransactionItem[] } })?.data?.items ||
          (resAny as { items?: XpTransactionItem[] })?.items ||
          (Array.isArray(resAny) ? resAny : []);
        setXpTransactions(Array.isArray(list) ? list : []);
      })
      .catch((err: unknown) => console.error('Failed to load XP transactions:', err))
      .finally(() => setLoadingXp(false));
  }, [authLoading, user, role, updateUser]);

  // Determine current mastery tier using official API profile.milestone / milestoneProgress or fallback
  const currentXp = profile?.totalXp ?? profile?.total_xp ?? user?.totalXp ?? 0;
  const milestone = profile?.milestone;
  const milestoneProgress = profile?.milestoneProgress;

  const currentTier = milestone
    ? {
        level: milestone.tierNumber ?? milestone.id ?? 1,
        name: milestone.title || 'Perintis Belajar',
        minXp: milestone.minXp ?? 0,
        maxXp: milestone.maxXp ?? 499,
        desc: MASTERY_TIERS.find((t) => t.level === (milestone.tierNumber ?? milestone.id))?.desc || '',
      }
    : MASTERY_TIERS.find((t) => currentXp >= t.minXp && (currentXp <= t.maxXp || t.maxXp === 99999)) ||
      MASTERY_TIERS[0];

  const nextTier = MASTERY_TIERS.find((t) => t.level === currentTier.level + 1);
  const xpProgress =
    milestoneProgress?.progressPercent ??
    (nextTier
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(((currentXp - currentTier.minXp) / (nextTier.minXp - currentTier.minXp)) * 100)
          )
        )
      : 100);
  const xpRemaining =
    milestoneProgress?.xpRemaining ?? (nextTier ? Math.max(0, nextTier.minXp - currentXp) : 0);

  // Filter 3 tiers saat collapsed: Berpusat pada current tier agar tier aktif siswa selalu terlihat
  const displayedTiers = showAllTiers
    ? MASTERY_TIERS
    : (() => {
        const currentIdx = MASTERY_TIERS.findIndex((t) => t.level === currentTier.level);
        if (currentIdx === -1 || currentIdx < 2) {
          return MASTERY_TIERS.slice(0, 3);
        }
        if (currentIdx >= MASTERY_TIERS.length - 2) {
          return MASTERY_TIERS.slice(-3);
        }
        return MASTERY_TIERS.slice(currentIdx - 1, currentIdx + 2);
      })();

  // Filter 3 transaksi XP terbaru saat collapsed
  const displayedTransactions = showAllXp ? xpTransactions : xpTransactions.slice(0, 3);

  // Password validation rules
  const hasLength = newPassword.length >= 6 && newPassword.length <= 12;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;
  const isPasswordValid =
    hasLength && hasUpper && hasLower && hasNumber && hasSpecial && passwordsMatch;

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
        setProfile((prev) => ({
          ...prev,
          name: name.trim(),
          avatar: chosen ? { ...chosen, imageUrl: chosenUrl } : prev?.avatar,
          avatarUrl: chosenUrl,
        }));
        updateUser({
          name: name.trim(),
          avatarId: selectedAvatarId,
          avatarUrl: chosenUrl,
        });
      } else {
        setProfile((prev) => ({ ...prev, name: name.trim() }));
        updateUser({ name: name.trim() });
      }
      setEditModalOpen(false);
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert(error.message || 'Gagal memperbarui profil siswa.');
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
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : '';
      if (rawMsg.toLowerCase().includes('invalid password')) {
        setPassError('Kata sandi saat ini yang Anda masukkan salah.');
      } else {
        setPassError(rawMsg || 'Gagal mengubah kata sandi. Pastikan kata sandi lama Anda benar.');
      }
    } finally {
      setChangingPass(false);
    }
  };

  if (authLoading || !user || role !== 'SISWA') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF2FA]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#1B68FF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      style={{ fontFamily: "'Onest', sans-serif" }}
      className="relative flex min-h-screen flex-col bg-[#EEF2FA] text-[#0A0D14] overflow-x-hidden"
    >
      {/* Tekstur Architectural Grid 56x56 & Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15,23,42,0.032) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,0.032) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-160px] right-[-100px] w-[560px] h-[560px] rounded-full bg-[#1B68FF]/10 blur-[130px] z-0"
      />

      <Navbar />

      <main className="relative z-10 flex-1 w-full px-6 sm:px-12 lg:px-16 py-8 sm:py-12 space-y-8">
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.035em] text-[#0A0D14] leading-[1.1]">
              Profil Saya
            </h1>
            <p className="mt-2 text-[16px] sm:text-[17px] text-[#1E293B] leading-[1.55] max-w-2xl">
              Kelola data akun, pantau tingkat capaian fase belajar, dan simpan riwayat XP usahamu.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="min-h-[48px] px-5 py-2.5 rounded-[14px] bg-white hover:bg-[#F4F7FC] text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[16px] font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali ke Dasbor</span>
          </Link>
        </div>

        {/* Two Column Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ═══════════════════════════════════════════════════════════════
              KOLOM KIRI (5 KOLOM): RINGKASAN SISWA & PENGATURAN AKUN
             ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-6">
            {/* Student Summary Bento Card */}
            <div className="rounded-[32px] bg-white border border-slate-200/90 p-7 sm:p-8 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-1 rounded-full bg-slate-100 border border-slate-200 shrink-0">
                  <UserAvatar
                    src={profile?.avatar?.imageUrl || profile?.avatarUrl || user?.avatarUrl}
                    name={profile?.name || user?.name || user?.username}
                    size="xl"
                    rounded="full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[22px] font-semibold text-[#0A0D14] truncate">
                    {profile?.name || user?.name || user?.username || 'Siswa'}
                  </h2>
                  <div className="flex items-center gap-2 text-[14px] text-[#334155] mt-1">
                    <span className="tabular-nums">@{user?.username || '-'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] text-[12px] font-semibold border border-[#059669]/20">
                      Terverifikasi
                    </span>
                  </div>
                  {(profile?.grade || user?.grade) && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FA] border border-[#1B68FF]/20 px-3 py-1 text-[13px] font-semibold text-[#1454D6]">
                      <GraduationCap className="h-4 w-4" />
                      <span>Kelas {profile?.grade || user?.grade} SMP</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setName(profile?.name || user?.name || '');
                  setEditModalOpen(true);
                }}
                className="w-full min-h-[48px] px-6 py-3 rounded-[14px] bg-white hover:bg-[#F4F7FC] active:translate-y-0.5 text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[15px] font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 className="h-4 w-4 text-[#1B68FF]" />
                <span>Edit Profil &amp; Avatar</span>
              </button>

              <hr className="border-slate-100" />

              {/* Milestone Progress Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[#334155]">
                    Fase Belajar Aktif
                  </span>
                  <span className="text-[13px] font-semibold text-[#1454D6] bg-[#EEF2FA] px-3 py-1 rounded-full border border-[#1B68FF]/20">
                    {currentTier.name}
                  </span>
                </div>

                <div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#1B68FF] to-[#059669] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(6, xpProgress)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[13px] text-[#334155] mt-2 font-medium">
                    <span className="font-semibold text-[#0A0D14] tabular-nums">
                      {currentXp} XP terkumpul
                    </span>
                    {nextTier ? (
                      <span className="tabular-nums">
                        Kurang {xpRemaining} XP ke {nextTier.name}
                      </span>
                    ) : (
                      <span className="text-[#059669] font-semibold">Tingkat Maksimum</span>
                    )}
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Quick Actions List */}
              <div className="space-y-3">
                {(profile?.hasPassword ?? user?.hasPassword) !== false ? (
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(true)}
                    className="w-full min-h-[48px] p-4 rounded-[16px] border border-slate-200 bg-white hover:bg-[#F4F7FC] hover:border-[#1B68FF]/40 transition-all text-left cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EEF2FA] text-[#1B68FF] group-hover:bg-[#1B68FF] group-hover:text-white transition-colors shrink-0">
                        <KeyRound className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-[#0A0D14]">Ubah Kata Sandi</p>
                        <p className="text-[13px] text-[#334155]">Perbarui kata sandi akun belajarmu</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#334155] group-hover:text-[#1B68FF] transition-colors" />
                  </button>
                ) : (
                  <div className="w-full p-4 rounded-[16px] border border-[#059669]/30 bg-[#ECFDF5] text-left flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-[#059669] border border-[#059669]/20 shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#065F46]">Terhubung Akun Google</p>
                      <p className="text-[13px] text-[#047857] leading-relaxed">
                        Masuk aman via Google.{' '}
                        <Link href="/forgot-password" className="font-semibold underline">
                          Atur Kata Sandi Lokal
                        </Link>
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full min-h-[48px] p-4 rounded-[16px] border border-slate-200 bg-white hover:bg-[#FFFBEB] hover:border-[#D97706]/40 transition-all text-left cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-slate-100 text-[#334155] group-hover:bg-[#FFFBEB] group-hover:text-[#D97706] transition-colors shrink-0">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#0A0D14] group-hover:text-[#78350F]">
                        Keluar Sesi Akun
                      </p>
                      <p className="text-[13px] text-[#334155]">Keluar dari akun di perangkat ini</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#334155] group-hover:text-[#D97706] transition-colors" />
                </button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              KOLOM KANAN (7 KOLOM): PENCAPAIAN BELAJAR & RIWAYAT POIN XP
             ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Tingkat Pencapaian Belajar Bento Card */}
            <div className="rounded-[32px] bg-white border border-slate-200/90 p-7 sm:p-8 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#0A0D14]">
                    Tingkat Pencapaian Belajar
                  </h3>
                  <p className="text-[14px] text-[#334155] mt-1 leading-[1.5]">
                    Tiap tingkat menandai kedalaman pemahaman konsep tanpa persaingan antar siswa.
                  </p>
                </div>
                <span className="shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold text-[#065F46] bg-[#ECFDF5] border border-[#059669]/30">
                  5 Fase Mastery
                </span>
              </div>

              {/* Stepper List (Tampil 3 relevan saat tertutup, 5 penuh saat terbuka) */}
              <div className="space-y-3.5">
                {displayedTiers.map((tier) => {
                  const isCompleted = currentXp >= (tier.maxXp === 99999 ? 5000 : tier.maxXp + 1);
                  const isCurrent = currentTier.level === tier.level;

                  return (
                    <div
                      key={tier.level}
                      className={`flex items-start gap-4 p-4 rounded-[20px] border transition-all ${
                        isCurrent
                          ? 'border-2 border-[#1B68FF] bg-[#EEF2FA]/70 shadow-[0_10px_24px_-10px_rgba(27,104,255,0.18)]'
                          : isCompleted
                          ? 'border-2 border-[#059669]/40 bg-[#ECFDF5]/60'
                          : 'border-2 border-slate-200/80 bg-[#F8FAFC] opacity-75'
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-[14px] font-bold ${
                          isCompleted
                            ? 'bg-[#059669] text-white'
                            : isCurrent
                            ? 'bg-[#1B68FF] text-white shadow-[0_4px_12px_rgba(27,104,255,0.3)]'
                            : 'bg-slate-200 text-[#334155]'
                        }`}
                      >
                        {isCompleted ? <Check className="h-5 w-5" /> : tier.level}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-[16px] font-semibold text-[#0A0D14]">
                            {tier.name}
                            {isCurrent && (
                              <span className="ml-2 text-[12px] font-bold text-[#1454D6] bg-white px-2 py-0.5 rounded-full border border-[#1B68FF]/30">
                                Fase Aktif
                              </span>
                            )}
                          </h4>
                          <span className="text-[13px] font-semibold text-[#334155] tabular-nums">
                            {tier.level === 5 ? '≥ 5.000 XP' : `${tier.minXp} - ${tier.maxXp} XP`}
                          </span>
                        </div>
                        <p className="text-[14px] text-[#1E293B] mt-1 leading-[1.55]">{tier.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tombol Lihat Selengkapnya (5 Tingkat) */}
              <button
                type="button"
                onClick={() => setShowAllTiers(!showAllTiers)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-[14px] bg-slate-50 hover:bg-[#EEF2FA] text-[#1454D6] border border-[#1B68FF]/20 text-[14px] font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>
                  {showAllTiers
                    ? 'Tampilkan Lebih Sedikit'
                    : `Lihat Semua Fase (${MASTERY_TIERS.length} Tingkat)`}
                </span>
                {showAllTiers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SEKSI RIWAYAT POIN XP (FULL WIDTH MEMANJANG DARI KIRI KE KANAN)
           ═══════════════════════════════════════════════════════════════ */}
        <div className="w-full rounded-[32px] bg-white border border-slate-200/90 p-7 sm:p-8 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FA] text-[#1454D6] text-[13px] font-semibold mb-2 border border-[#1B68FF]/20">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Buku Capaian XP</span>
              </div>
              <h3 className="text-[22px] sm:text-[24px] font-semibold text-[#0A0D14]">
                Riwayat Poin XP
              </h3>
              <p className="text-[14px] text-[#334155] mt-0.5">
                Catatan aktivitas drill latihan dan pertambahan poin belajar siswa secara transparan.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFBEB] text-[#78350F] border border-[#D97706]/30 text-[14px] font-semibold shrink-0">
                <Sparkles className="h-4 w-4 text-[#D97706]" />
                <span className="tabular-nums">Total: {currentXp} XP</span>
              </div>
            </div>
          </div>

          {loadingXp ? (
            <div className="flex h-36 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#1B68FF] border-t-transparent" />
            </div>
          ) : xpTransactions.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-[24px] bg-[#F8FAFC]">
              <Award className="h-12 w-12 text-[#334155] mx-auto mb-3 opacity-60" />
              <p className="text-[16px] font-semibold text-[#0A0D14]">
                Belum ada riwayat perolehan XP.
              </p>
              <p className="text-[14px] text-[#334155] mt-1 max-w-md mx-auto">
                Selesaikan asesmen Recall kemampuan atau latihan Level untuk mendapatkan akumulasi XP pertamamu.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Daftar Transaksi (Default 3 Terbaru) */}
              <div className="divide-y divide-slate-100">
                {displayedTransactions.map((tx: XpTransactionItem, idx: number) => {
                  const points = tx.points ?? tx.xp_earned ?? tx.amount ?? 0;
                  const desc =
                    tx.description || tx.source || tx.activity_name || 'Latihan Selesai';
                  const dateStr = tx.createdAt || tx.created_at;
                  const dateFormatted = dateStr
                    ? new Date(dateStr).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-';

                  return (
                    <div
                      key={tx.id || `tx-${idx}`}
                      className="py-4 px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-[18px] hover:bg-[#F8FAFC] flex items-center justify-between gap-4 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#ECFDF5] text-[#059669] border border-[#059669]/20">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[15px] sm:text-[16px] font-semibold text-[#0A0D14] truncate">
                            {desc}
                          </p>
                          <p className="text-[13px] text-[#334155] mt-0.5 tabular-nums">
                            {dateFormatted}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-[14px] font-bold text-[#065F46] bg-[#ECFDF5] border border-[#059669]/30 px-4 py-1.5 rounded-full tabular-nums shadow-2xs">
                        +{points} XP
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Tombol Lihat Selengkapnya (Hanya jika > 3 item) */}
              {xpTransactions.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllXp(!showAllXp)}
                  className="w-full min-h-[48px] px-6 py-3 rounded-[16px] bg-slate-50 hover:bg-[#EEF2FA] text-[#1454D6] border-2 border-[#1B68FF]/20 hover:border-[#1B68FF] text-[15px] font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span>
                    {showAllXp
                      ? 'Tampilkan Lebih Sedikit'
                      : `Lihat Selengkapnya (${xpTransactions.length} Riwayat Tercatat)`}
                  </span>
                  {showAllXp ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL 1: EDIT PROFIL & AVATAR SISWA
         ═══════════════════════════════════════════════════════════════ */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D14]/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl p-7 sm:p-9 border border-slate-200/90 my-auto text-[#0A0D14] space-y-6">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-7 right-7 text-[#334155] hover:text-[#0A0D14] p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FA] text-[#1454D6] text-[13px] font-semibold mb-2 border border-[#1B68FF]/20">
                <Edit3 className="h-3.5 w-3.5" />
                <span>Pengaturan Profil</span>
              </div>
              <h3 className="text-[24px] font-semibold text-[#0A0D14] tracking-[-0.02em]">
                Edit Profil Siswa
              </h3>
              <p className="text-[14px] text-[#334155] mt-1">
                Perbarui nama tampilan dan avatar belajarmu.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="font-semibold text-[#0A0D14] text-[14px] flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-[#1B68FF]" />
                  <span>Nama Lengkap Siswa</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                  required
                  className="w-full min-h-[48px] bg-white border-2 border-slate-200 rounded-[14px] px-4 py-2.5 text-[15px] text-[#0A0D14] placeholder:text-slate-400 focus:outline-none focus:border-[#1B68FF] transition-all"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#0A0D14] mb-2.5">
                  Pilih Avatar Karakter Resmi
                </label>
                <div className="grid grid-cols-3 gap-3 max-h-[220px] overflow-y-auto p-1">
                  {avatars.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(av.id)}
                      className={`relative flex flex-col items-center p-3 rounded-[18px] border-2 transition-all text-center cursor-pointer ${
                        selectedAvatarId === av.id
                          ? 'border-[#1B68FF] bg-[#EEF2FA] shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {selectedAvatarId === av.id && (
                        <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1B68FF] text-white z-10 text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                      <UserAvatar
                        src={av.imageUrl || av.image_url}
                        name={av.name}
                        size="md"
                        rounded="full"
                        className="mb-1.5"
                      />
                      <span className="text-[12px] font-semibold leading-tight line-clamp-1 text-[#0A0D14]">
                        {av.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="min-h-[48px] px-6 py-2.5 rounded-[14px] bg-white hover:bg-[#F4F7FC] text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[15px] font-semibold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingName}
                  className="min-h-[48px] px-7 py-3 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[15px] font-semibold transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] cursor-pointer disabled:opacity-50"
                >
                  {savingName ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL 2: UBAH KATA SANDI SISWA
         ═══════════════════════════════════════════════════════════════ */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D14]/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <section
            aria-labelledby="modal-title"
            aria-modal="true"
            role="dialog"
            className="relative w-full max-w-[580px] bg-white rounded-[32px] shadow-2xl p-7 sm:p-9 my-auto text-[#0A0D14] border border-slate-200/90 space-y-6"
          >
            <button
              onClick={() => setPasswordModalOpen(false)}
              className="absolute top-7 right-7 text-[#334155] hover:text-[#0A0D14] transition-colors p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
              type="button"
              aria-label="Tutup dialog"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FA] text-[#1454D6] text-[13px] font-semibold mb-2 border border-[#1B68FF]/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Keamanan Akun Siswa Mandiri</span>
              </div>
              <h2
                className="text-[24px] font-semibold text-[#0A0D14] tracking-[-0.02em]"
                id="modal-title"
              >
                Ubah Kata Sandi
              </h2>
              <p className="text-[14px] text-[#1E293B] mt-1 leading-[1.55]">
                Perbarui kata sandi akun belajarmu secara mandiri. Gunakan kombinasi yang kuat dan mudah kamu ingat agar akun belajarmu tetap aman.
              </p>
            </div>

            {passError && (
              <div className="flex items-center gap-2.5 rounded-[16px] border border-[#D97706] bg-[#FFFBEB] p-3.5 text-[14px] text-[#78350F]">
                <AlertCircle className="h-4 w-4 text-[#D97706] shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="flex items-center gap-2.5 rounded-[16px] border border-[#059669] bg-[#ECFDF5] p-3.5 text-[14px] text-[#065F46]">
                <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Field 1: Kata Sandi Lama */}
              <div>
                <label
                  className="font-semibold text-[#0A0D14] text-[14px] flex items-center gap-2 mb-2"
                  htmlFor="old-pass"
                >
                  <Lock className="w-4 h-4 text-[#1B68FF]" />
                  <span>Kata Sandi Lama</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="old-pass"
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama"
                    required
                    className="w-full min-h-[48px] bg-white border-2 border-slate-200 rounded-[14px] px-4 py-2.5 pr-11 text-[15px] text-[#0A0D14] placeholder:text-slate-400 focus:outline-none focus:border-[#1B68FF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3.5 text-[#334155] hover:text-[#0A0D14] p-1 cursor-pointer"
                    aria-label="Lihat kata sandi lama"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 2: Kata Sandi Baru */}
              <div>
                <label
                  className="font-semibold text-[#0A0D14] text-[14px] flex items-center gap-2 mb-2"
                  htmlFor="new-pass"
                >
                  <KeyRound className="w-4 h-4 text-[#1B68FF]" />
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
                    className="w-full min-h-[48px] bg-white border-2 border-slate-200 rounded-[14px] px-4 py-2.5 pr-11 text-[15px] text-[#0A0D14] placeholder:text-slate-400 focus:outline-none focus:border-[#1B68FF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 text-[#334155] hover:text-[#0A0D14] p-1 cursor-pointer"
                    aria-label="Lihat kata sandi baru"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Security Criteria Box */}
              <div className="bg-[#EEF2FA] border border-[#1B68FF]/20 rounded-[16px] p-4 text-[13px] space-y-2">
                <div className="font-semibold text-[#0A0D14] flex items-center gap-2 mb-1">
                  <Sliders className="w-4 h-4 text-[#1B68FF]" />
                  <span>Kriteria Keamanan Sandi :</span>
                </div>
                <ul className="space-y-1.5 text-[#1E293B]">
                  <li className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full border inline-flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        hasLength
                          ? 'bg-[#059669] border-[#059669] text-white'
                          : 'border-slate-300 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span>Minimal 6 karakter (maksimal 12 karakter)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full border inline-flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        hasUpper && hasLower
                          ? 'bg-[#059669] border-[#059669] text-white'
                          : 'border-slate-300 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span>Memuat huruf kapital (A–Z) dan huruf kecil (a–z)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full border inline-flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        hasNumber
                          ? 'bg-[#059669] border-[#059669] text-white'
                          : 'border-slate-300 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span>Memuat minimal satu angka (0–9)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full border inline-flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        hasSpecial
                          ? 'bg-[#059669] border-[#059669] text-white'
                          : 'border-slate-300 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span>Memuat simbol atau karakter khusus (@, #, $, %, dll.)</span>
                  </li>
                </ul>
              </div>

              {/* Field 3: Konfirmasi Kata Sandi Baru */}
              <div>
                <label
                  className="font-semibold text-[#0A0D14] text-[14px] flex items-center gap-2 mb-2"
                  htmlFor="conf-pass"
                >
                  <ShieldCheck className="w-4 h-4 text-[#1B68FF]" />
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
                    className="w-full min-h-[48px] bg-white border-2 border-slate-200 rounded-[14px] px-4 py-2.5 pr-11 text-[15px] text-[#0A0D14] placeholder:text-slate-400 focus:outline-none focus:border-[#1B68FF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3.5 text-[#334155] hover:text-[#0A0D14] p-1 cursor-pointer"
                    aria-label="Lihat konfirmasi kata sandi"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="min-h-[48px] px-6 py-2.5 rounded-[14px] bg-white hover:bg-[#F4F7FC] text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[15px] font-semibold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={changingPass || !isPasswordValid}
                  className="min-h-[48px] px-7 py-3 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[15px] font-semibold transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{changingPass ? 'Menyimpan...' : 'Simpan Kata Sandi'}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}
