'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  Zap,
  AlertCircle,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { SpotlightTour, TourStep } from '@/components/common/SpotlightTour';

interface CognitiveLevelItem {
  levelNumber: number;
  name: string;
  category: string;
  description: string;
  isUnlocked: boolean;
  isPassed: boolean;
  highestScore: number | null;
  xpReward: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface SubmaterialDetail {
  id?: number | string;
  title?: string;
  isMastered?: boolean;
  progressState?: string;
}

const LEVEL_CONFIGS: {
  levelNumber: number;
  name: string;
  category: string;
  description: string;
  xpReward: number;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    levelNumber: 1,
    name: 'Level 1: Pemahaman & Pengetahuan',
    category: 'Recall & Faktual',
    description: 'Mengenali konsep dasar, istilah matematis/literasi, dan prosedur operasi langsung.',
    xpReward: 50,
    icon: Brain,
  },
  {
    levelNumber: 2,
    name: 'Level 2: Aplikasi & Prosedural',
    category: 'Penerapan Konsep',
    description: 'Menerapkan prosedur multi-langkah dan pemecahan masalah kontekstual sehari-hari.',
    xpReward: 75,
    icon: Target,
  },
  {
    levelNumber: 3,
    name: 'Level 3: Penalaran & Analisis',
    category: 'HOTS & Problem Solving',
    description: 'Menganalisis skenario baru, mengevaluasi validitas strategi, dan penarikan simpulan.',
    xpReward: 100,
    icon: Zap,
  },
];

const SUBMATERIAL_TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-submaterial-hero',
    title: 'standar kelulusan mastery learning',
    description:
      'Submateri ini menerapkan pendekatan Mastery Learning. Ambang batas kelulusan setiap level adalah 90% (tepat 9 dari 10 butir soal dijawab dengan benar).',
  },
  {
    targetId: 'tour-level-1',
    title: 'Level 1: Pemahaman & Pengetahuan',
    description:
      'Latihan awal untuk mengenali konsep dasar dan rumus langsung. Selesaikan level ini dengan skor minimal 90% untuk membuka Level 2 (+50 XP).',
  },
  {
    targetId: 'tour-level-2',
    title: 'Level 2: Aplikasi & Prosedural',
    description:
      'Latihan penerapan konsep kontekstual multi-langkah (+75 XP). Terbuka otomatis setelah kamu lulus di Level 1.',
  },
  {
    targetId: 'tour-level-3',
    title: 'Level 3: Penalaran & Analisis',
    description:
      'Tantangan soal tingkat tinggi (HOTS) pemecahan masalah kompleks (+100 XP). Menuntaskan level ini menyempurnakan status Tuntas pada submateri.',
  },
];

export default function SubmaterialDetailPage({
  params,
}: {
  params: Promise<{ submaterialId: string }>;
}) {
  const router = useRouter();
  const { user, role, isLoading: authLoading } = useAuth();
  const { submaterialId } = use(params);

  const [submaterial, setSubmaterial] = useState<SubmaterialDetail | null>(null);
  const [levels, setLevels] = useState<CognitiveLevelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingLevel, setStartingLevel] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [prerequisiteModal, setPrerequisiteModal] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: '',
  });

  // State Spotlight Onboarding Tour
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Route Guard: Siswa Only
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login');
      } else if (role !== 'SISWA') {
        router.replace('/admin/dashboard');
      }
    }
  }, [authLoading, user, role, router]);

  // Data Loader
  useEffect(() => {
    if (authLoading || !user || role !== 'SISWA') return;
    let active = true;

    api.curriculum
      .getSubmaterialProgress(submaterialId)
      .then((res: unknown) => {
        if (!active) return;
        const resAny = res as {
          data?: {
            title?: string;
            name?: string;
            isMastered?: boolean;
            progressState?: string;
            levels?: { level?: number; name?: string; status?: string; score?: number }[];
          };
        };
        const data =
          resAny?.data ||
          (res as {
            title?: string;
            name?: string;
            isMastered?: boolean;
            progressState?: string;
            levels?: { level?: number; name?: string; status?: string; score?: number }[];
          });

        setSubmaterial({
          id: submaterialId,
          title: data?.title || data?.name || `Submateri #${submaterialId}`,
          isMastered: Boolean(data?.isMastered),
          progressState: data?.progressState || 'IN_PROGRESS',
        });

        const apiLevels = data?.levels || [];
        const mappedLevels: CognitiveLevelItem[] = LEVEL_CONFIGS.map((cfg) => {
          const found = apiLevels.find((l) => Number(l.level) === cfg.levelNumber);
          const isUnlocked = found ? found.status !== 'LOCKED' : cfg.levelNumber === 1;
          const isPassed = found ? found.status === 'COMPLETED' : false;
          return {
            ...cfg,
            name: found?.name || cfg.name,
            isUnlocked,
            isPassed,
            highestScore: found?.score ?? null,
          };
        });

        setLevels(mappedLevels);
      })
      .catch((err: unknown) => {
        if (!active) return;
        console.error('Failed to load submaterial progress:', err);
        const error = err as { code?: string; status?: number; message?: string };
        if (error.status === 401) {
          router.replace('/login');
          return;
        }
        const isPrereq =
          error.code === 'PREREQUISITE_LOCKED' ||
          error.status === 403 ||
          error.message?.toLowerCase().includes('prasyarat') ||
          error.message?.toLowerCase().includes('prerequisite');

        if (isPrereq) {
          setPrerequisiteModal({
            open: true,
            message:
              error.message ||
              'Submateri ini belum dapat diakses karena terdapat submateri prasyarat yang harus Anda selesaikan terlebih dahulu.',
          });
        } else {
          setErrorMsg(error.message || 'Gagal memuat status level latihan dari server.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, user, role, submaterialId, router]);

  const handleRetry = () => {
    setLoading(true);
    setErrorMsg('');

    api.curriculum
      .getSubmaterialProgress(submaterialId)
      .then((res: unknown) => {
        const resAny = res as {
          data?: {
            title?: string;
            name?: string;
            isMastered?: boolean;
            progressState?: string;
            levels?: { level?: number; name?: string; status?: string; score?: number }[];
          };
        };
        const data =
          resAny?.data ||
          (res as {
            title?: string;
            name?: string;
            isMastered?: boolean;
            progressState?: string;
            levels?: { level?: number; name?: string; status?: string; score?: number }[];
          });

        setSubmaterial({
          id: submaterialId,
          title: data?.title || data?.name || `Submateri #${submaterialId}`,
          isMastered: Boolean(data?.isMastered),
          progressState: data?.progressState || 'IN_PROGRESS',
        });

        const apiLevels = data?.levels || [];
        const mappedLevels: CognitiveLevelItem[] = LEVEL_CONFIGS.map((cfg) => {
          const found = apiLevels.find((l) => Number(l.level) === cfg.levelNumber);
          const isUnlocked = found ? found.status !== 'LOCKED' : cfg.levelNumber === 1;
          const isPassed = found ? found.status === 'COMPLETED' : false;
          return {
            ...cfg,
            name: found?.name || cfg.name,
            isUnlocked,
            isPassed,
            highestScore: found?.score ?? null,
          };
        });

        setLevels(mappedLevels);
      })
      .catch((err: unknown) => {
        console.error('Failed to load submaterial progress:', err);
        const error = err as { code?: string; status?: number; message?: string };
        if (error.status === 401) {
          router.replace('/login');
          return;
        }
        const isPrereq =
          error.code === 'PREREQUISITE_LOCKED' ||
          error.status === 403 ||
          error.message?.toLowerCase().includes('prasyarat') ||
          error.message?.toLowerCase().includes('prerequisite');

        if (isPrereq) {
          setPrerequisiteModal({
            open: true,
            message:
              error.message ||
              'Submateri ini belum dapat diakses karena terdapat submateri prasyarat yang harus Anda selesaikan terlebih dahulu.',
          });
        } else {
          setErrorMsg(error.message || 'Gagal memuat status level latihan dari server.');
        }
      })
      .finally(() => setLoading(false));
  };

  const userId = user?.id;

  // Otomatis tampilkan Spotlight Tour untuk kunjungan pertama (Opsi A)
  useEffect(() => {
    if (loading || !userId || role !== 'SISWA' || levels.length === 0) return;
    const storageKey = `agra_submaterial_tour_done_${userId}`;
    const hasSeenTour = localStorage.getItem(storageKey);

    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setTourStep(0);
        setTourOpen(true);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [loading, userId, role, levels.length]);

  const handleFinishTour = useCallback(() => {
    if (userId) {
      localStorage.setItem(`agra_submaterial_tour_done_${userId}`, '1');
    }
    setTourOpen(false);
  }, [userId]);

  const handleNextTourStep = useCallback(() => {
    if (tourStep < SUBMATERIAL_TOUR_STEPS.length - 1) {
      setTourStep((prev) => prev + 1);
    } else {
      handleFinishTour();
    }
  }, [tourStep, handleFinishTour]);

  const handlePrevTourStep = useCallback(() => {
    setTourStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleRestartTour = () => {
    setTourStep(0);
    setTourOpen(true);
  };

  const handleStartLevel = async (levelNumber: number) => {
    setStartingLevel(levelNumber);
    setErrorMsg('');

    try {
      const res = await api.learning.startAttempt(levelNumber, submaterialId);
      const resAny = res as {
        id?: string | number;
        session_id?: string | number;
        attempt_id?: string | number;
        attemptId?: string | number;
        data?: {
          id?: string | number;
          session_id?: string | number;
          attempt_id?: string | number;
          attemptId?: string | number;
        };
      };
      const attemptId =
        resAny?.id ||
        resAny?.session_id ||
        resAny?.attempt_id ||
        resAny?.attemptId ||
        resAny?.data?.id ||
        resAny?.data?.session_id ||
        resAny?.data?.attempt_id ||
        resAny?.data?.attemptId;

      if (!attemptId) {
        throw new Error('Sesi latihan tidak dapat dibuat.');
      }
      router.push(`/learning/exam/${attemptId}`);
    } catch (err: unknown) {
      const error = err as { code?: string; status?: number; message?: string };
      const isPrereq =
        error.code === 'PREREQUISITE_LOCKED' ||
        error.status === 403 ||
        error.message?.toLowerCase().includes('prasyarat') ||
        error.message?.toLowerCase().includes('prerequisite');

      if (isPrereq) {
        setPrerequisiteModal({
          open: true,
          message:
            error.message ||
            'Terdapat level atau submateri prasyarat yang harus Anda selesaikan terlebih dahulu sebelum memulai level ini.',
        });
      } else {
        setErrorMsg(
          error.message ||
            'Gagal memulai sesi latihan level. Pastikan Anda telah lulus Recall Kemampuanmu dan level prasyarat telah tuntas.'
        );
      }
    } finally {
      setStartingLevel(null);
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

      <main className="relative z-10 flex-1 w-full px-6 sm:px-12 lg:px-16 py-8 sm:py-12 space-y-10">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/curriculum"
            className="min-h-[48px] px-5 py-2.5 rounded-[14px] bg-white hover:bg-[#F4F7FC] text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[16px] font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali ke Kurikulum</span>
          </Link>

          <button
            type="button"
            onClick={handleRestartTour}
            className="min-h-[44px] px-5 py-2.5 rounded-[14px] bg-white hover:bg-[#F4F7FC] border border-slate-200/90 text-[14px] font-semibold text-[#0A0D14] transition-all inline-flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <HelpCircle className="w-4 h-4 text-[#1B68FF]" />
            <span>Panduan</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="flex items-center justify-between rounded-[20px] border border-[#D97706] bg-[#FFFBEB] p-4 text-[15px] text-[#78350F]">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[#D97706] shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
            <button
              onClick={handleRetry}
              className="min-h-[44px] px-5 py-2 inline-flex items-center gap-2 rounded-[12px] bg-[#FDE68A] hover:bg-amber-300 text-[14px] font-semibold text-[#78350F] transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#1B68FF] border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Submaterial Hero Card */}
            <div
              data-tour-id="tour-submaterial-hero"
              className="rounded-[32px] bg-white border border-slate-200/90 p-8 sm:p-10 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-[10px] bg-[#EEF2FA] text-[#1454D6] text-[14px] font-semibold border border-[#1B68FF]/20">
                    Jenjang Pembelajaran Adaptif
                  </span>
                  {submaterial?.isMastered && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[14px] font-semibold bg-[#ECFDF5] text-[#065F46] border border-[#059669]/30">
                      <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                      <span>Submateri Tuntas</span>
                    </span>
                  )}
                </div>
                <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.035em] text-[#0A0D14] leading-[1.1]">
                  {submaterial?.title || 'Submateri Pembelajaran'}
                </h1>
                <p className="text-[16px] sm:text-[17px] text-[#1E293B] leading-[1.55] max-w-2xl">
                  Selesaikan 3 level secara bertahap dengan ambang kelulusan 90% untuk menguasai submateri ini secara tuntas.
                </p>
              </div>
            </div>

            {/* Cognitive Levels List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.03em] text-[#0A0D14]">
                  Tingkatan Level Kognitif
                </h2>
              </div>

              <div className="space-y-5">
                {levels.map((lvl) => {
                  const IconComponent = lvl.icon;

                  return (
                    <div
                      key={lvl.levelNumber}
                      data-tour-id={`tour-level-${lvl.levelNumber}`}
                      className={`rounded-[32px] bg-white p-7 sm:p-9 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                        lvl.isPassed
                          ? 'border-2 border-[#059669]/40 shadow-[0_20px_50px_-15px_rgba(5,150,105,0.08)]'
                          : lvl.isUnlocked
                          ? 'border-2 border-[#1B68FF]/50 shadow-[0_20px_50px_-15px_rgba(27,104,255,0.08)]'
                          : 'border-2 border-slate-200/90 opacity-75 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)]'
                      }`}
                    >
                      {/* Left: Info */}
                      <div className="flex items-start gap-5 min-w-0">
                        <div
                          className={`w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0 border ${
                            lvl.isPassed
                              ? 'border-[#059669]/30 bg-[#ECFDF5] text-[#059669]'
                              : lvl.isUnlocked
                              ? 'border-[#1B68FF]/30 bg-[#EEF2FA] text-[#1B68FF]'
                              : 'border-slate-200 bg-slate-100 text-[#334155]'
                          }`}
                        >
                          <IconComponent className="h-7 w-7" />
                        </div>

                        <div className="space-y-2 min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-[22px] sm:text-[24px] font-semibold text-[#0A0D14] tracking-[-0.025em]">
                              {lvl.name}
                            </h3>
                            <span className="px-3 py-1 rounded-full text-[13px] font-semibold bg-[#EEF2FA] text-[#1454D6]">
                              {lvl.category}
                            </span>
                          </div>

                          <p className="text-[16px] text-[#1E293B] leading-[1.55] max-w-2xl">
                            {lvl.description}
                          </p>

                          <div className="pt-1 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold bg-[#FFFBEB] text-[#78350F] border border-[#D97706]/30">
                              <Sparkles className="h-4 w-4 text-[#D97706]" />
                              <span>+{lvl.xpReward} XP Reward</span>
                            </span>

                            {lvl.highestScore !== null && (
                              <span className="text-[15px] font-medium text-[#334155]">
                                Skor Tertinggi:{' '}
                                <strong
                                  className={`tabular-nums ${
                                    lvl.isPassed ? 'text-[#059669]' : 'text-[#0A0D14]'
                                  }`}
                                >
                                  {lvl.highestScore}%
                                </strong>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Action Area */}
                      <div className="shrink-0 flex items-center gap-3 self-start lg:self-center">
                        {lvl.isPassed ? (
                          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-semibold bg-[#ECFDF5] text-[#065F46] border border-[#059669]/30">
                              <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                              <span>Tuntas</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartLevel(lvl.levelNumber)}
                              disabled={startingLevel === lvl.levelNumber}
                              className="min-h-[48px] px-6 py-2.5 rounded-[14px] bg-white hover:bg-[#F4F7FC] active:translate-y-0.5 text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[16px] font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                              {startingLevel === lvl.levelNumber ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0A0D14] border-t-transparent" />
                              ) : (
                                <span>Latihan Ulang</span>
                              )}
                            </button>
                          </div>
                        ) : lvl.isUnlocked ? (
                          <button
                            type="button"
                            onClick={() => handleStartLevel(lvl.levelNumber)}
                            disabled={startingLevel === lvl.levelNumber}
                            className="min-h-[48px] px-7 py-3 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[16px] font-semibold transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] inline-flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                          >
                            {startingLevel === lvl.levelNumber ? (
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <>
                                <span>Mulai Latihan Level</span>
                                <ArrowRight className="h-5 w-5" />
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] bg-slate-100 text-[#334155] border border-slate-200 text-[15px] font-semibold">
                            <Lock className="h-4 w-4" />
                            <span>Terkunci</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Prerequisite Locked Modal Dialog */}
      {prerequisiteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0D14]/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-[32px] border border-slate-200/90 p-8 sm:p-10 shadow-[0_32px_80px_-20px_rgba(10,22,70,0.3)] space-y-6 text-center">
            <div className="w-16 h-16 rounded-[20px] bg-[#FFFBEB] border border-[#D97706]/30 flex items-center justify-center text-[#D97706] mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-[24px] font-semibold text-[#0A0D14]">
                Materi Prasyarat Belum Dituntaskan
              </h3>
              <p className="text-[16px] text-[#1E293B] leading-[1.55]">
                {prerequisiteModal.message}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPrerequisiteModal({ open: false, message: '' })}
                className="flex-1 min-h-[48px] px-6 py-3 rounded-[14px] bg-white hover:bg-[#F4F7FC] text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[16px] font-semibold transition-all cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => router.push('/curriculum')}
                className="flex-1 min-h-[48px] px-7 py-3 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] text-white text-[16px] font-semibold transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] cursor-pointer"
              >
                Pohon Kurikulum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spotlight Tour Walkthrough */}
      <SpotlightTour
        isOpen={tourOpen}
        steps={SUBMATERIAL_TOUR_STEPS}
        currentStep={tourStep}
        onNext={handleNextTourStep}
        onPrev={handlePrevTourStep}
        onSkip={handleFinishTour}
      />

      <Footer />
    </div>
  );
}
