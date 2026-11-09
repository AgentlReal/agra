'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import {
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';

function normalizeNextActionRoute(
  rawRoute?: string,
  type?: string,
  submaterialId?: number
): string {
  if (!rawRoute) {
    return type === 'RECALL' ? '/recall' : `/submaterials/${submaterialId || 1}`;
  }
  if (rawRoute === '/recall.html' || rawRoute === 'recall.html') {
    return '/recall';
  }
  if (rawRoute.startsWith('/submateri.html') || rawRoute.startsWith('submateri.html')) {
    const idMatch = rawRoute.match(/id=(\d+)/);
    const id = idMatch ? idMatch[1] : submaterialId || 1;
    return `/submaterials/${id}`;
  }
  return rawRoute.replace(/\.html$/, '');
}

interface DashboardSubjectItem {
  subjectId?: number;
  id?: number;
  subjectCode?: string;
  subjectName?: string;
  masteryPercent?: number;
  masteryPercentage?: number;
  masteredSubmaterials?: number;
  completedSubmaterials?: number;
  totalSubmaterials?: number;
  simulationUnlocked?: boolean;
  simulation_unlocked?: boolean;
}

interface DashboardStudentData {
  name?: string;
  avatar?: {
    id?: number;
    name?: string;
    imageUrl?: string;
  };
  avatarUrl?: string;
  totalXp?: number;
  total_xp?: number;
  isRecallPassed?: boolean;
  milestone?: {
    title?: string;
    tierName?: string;
    tierNumber?: number;
  };
  milestoneProgress?: {
    currentXp?: number;
    nextMilestoneXp?: number | null;
    xpRemaining?: number;
    progressPercent?: number;
  };
}

interface DashboardNextAction {
  type?: string;
  title?: string;
  route?: string;
  submaterialId?: number;
}

interface DashboardPayload {
  student?: DashboardStudentData;
  subjects?: DashboardSubjectItem[];
  nextAction?: DashboardNextAction;
}

interface TourStep {
  targetId: string;
  title: string;
  description: string;
}

const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-profile-card',
    title: 'profil dan progres fase belajarmu',
    description:
      'Pantau perolehan poin XP, fase belajar aktif, serta jumlah submateri yang sudah kamu tuntaskan di kartu utama ini.',
  },
  {
    targetId: 'tour-mission-card',
    title: 'langkah belajar utamamu saat ini',
    description:
      'Mulai dari sini! Kerjakan 30 soal diagnostik Recall Kemampuan Awal hingga mencapai ketuntasan minimal 90% untuk membuka seluruh materi kurikulum.',
  },
  {
    targetId: 'tour-subject-0',
    title: 'kurikulum Matematika SMP',
    description:
      'Setelah lulus Recall, kamu bisa mempelajari 10 submateri Matematika melalui latihan berjenjang dari Level 1, Level 2, hingga Level 3.',
  },
  {
    targetId: 'tour-subject-1',
    title: 'kurikulum Bahasa Indonesia SMP',
    description:
      'Tuntaskan 6 submateri literasi teks informasi dan fiksi di kartu ini untuk melengkapi syarat pembukaan ujian simulasi.',
  },
  {
    targetId: 'tour-cbt-card',
    title: 'peta ketuntasan menuju Simulasi CBT',
    description:
      'Pantau tiga syarat kelulusanmu di sini. Jika seluruh submateri telah tuntas, ruang Simulasi Ujian CBT 75 menit akan terbuka otomatis!',
  },
];

/**
 * Komponen Spotlight Tour Overlay (Gaya Edvora):
 * Menyorot elemen target dengan efek cutout gelap di sekelilingnya dan menampilkan
 * kartu panduan langkah demi langkah lengkap dengan panah penunjuk.
 */
function DashboardSpotlightTour({
  isOpen,
  steps,
  currentStep,
  onNext,
  onPrev,
  onSkip,
}: {
  isOpen: boolean;
  steps: TourStep[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}) {
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [viewport, setViewport] = useState({ vw: 1280, vh: 800 });

  const activeStep = steps[currentStep];

  const updatePosition = useCallback(() => {
    if (!isOpen || !activeStep) return;
    const el = document.querySelector(
      `[data-tour-id="${activeStep.targetId}"]`
    ) as HTMLElement | null;
    if (!el) return;

    const r = el.getBoundingClientRect();
    setRect({
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
    });
    setViewport({
      vw: window.innerWidth,
      vh: window.innerHeight,
    });
  }, [isOpen, activeStep]);

  // Auto-scroll ke elemen yang sedang disorot saat berpindah step
  useEffect(() => {
    if (!isOpen || !activeStep) return;
    const el = document.querySelector(
      `[data-tour-id="${activeStep.targetId}"]`
    ) as HTMLElement | null;

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const timer1 = setTimeout(updatePosition, 120);
    const timer2 = setTimeout(updatePosition, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, currentStep, activeStep, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    let rafId = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft' && currentStep > 0) onPrev();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(rafId);
    };
  }, [isOpen, currentStep, onNext, onPrev, onSkip, updatePosition]);

  if (!isOpen || !activeStep || !rect) return null;

  const pad = 10;
  const spotTop = rect.top - pad;
  const spotLeft = rect.left - pad;
  const spotWidth = rect.width + pad * 2;
  const spotHeight = rect.height + pad * 2;

  const popoverWidth = Math.min(340, viewport.vw - 32);
  const spaceBelow = viewport.vh - (spotTop + spotHeight);
  const placeAbove = spaceBelow < 210 && spotTop > 210;

  const popoverTop = placeAbove
    ? Math.max(16, spotTop - 196)
    : Math.min(viewport.vh - 196, spotTop + spotHeight + 18);

  const targetCenterX = spotLeft + spotWidth / 2;
  const popoverLeft = Math.max(
    16,
    Math.min(viewport.vw - popoverWidth - 16, targetCenterX - popoverWidth / 2)
  );
  const arrowLeft = Math.max(
    28,
    Math.min(popoverWidth - 28, targetCenterX - popoverLeft)
  );

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <div
      style={{ fontFamily: "'Onest', sans-serif" }}
      className="fixed inset-0 z-[100] pointer-events-auto"
    >
      {/* Klik area gelap di luar untuk melewati atau lanjut */}
      <div
        onClick={onSkip}
        className="fixed inset-0 bg-transparent cursor-pointer"
        aria-label="Tutup panduan"
      />

      {/* Lubang Sorotan (Spotlight Cutout) yang Meluncur Halus */}
      <div
        style={{
          top: `${spotTop}px`,
          left: `${spotLeft}px`,
          width: `${spotWidth}px`,
          height: `${spotHeight}px`,
          boxShadow: '0 0 0 9999px rgba(6, 14, 36, 0.72)',
          transition: 'all 380ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="fixed rounded-[34px] pointer-events-none ring-4 ring-white shadow-[0_0_50px_rgba(27,104,255,0.45)]"
      />

      {/* Kotak Popover Panduan (Persis Referensi Edvora) */}
      <div
        style={{
          top: `${popoverTop}px`,
          left: `${popoverLeft}px`,
          width: `${popoverWidth}px`,
          transition: 'all 380ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="fixed z-[101] rounded-[22px] bg-white p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] border border-slate-100 text-[#0A0D14]"
      >
        {/* Segitiga Penunjuk (Arrow) */}
        <div
          style={{ left: `${arrowLeft}px` }}
          className={`absolute -translate-x-1/2 w-4 h-4 bg-white rotate-45 ${
            placeAbove
              ? '-bottom-2 border-r border-b border-slate-100'
              : '-top-2 border-l border-t border-slate-100'
          }`}
        />

        {/* Isi Penjelasan */}
        <p className="text-[14px] sm:text-[15px] leading-[1.6] text-[#334155] text-justify">
          Ini adalah <strong className="font-semibold text-[#0A0D14]">{activeStep.title}</strong>.{' '}
          {activeStep.description}
        </p>

        {/* Baris Tombol Navigasi Bawah */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#334155] hover:text-[#0A0D14] text-[13px] font-medium transition-colors cursor-pointer"
          >
            Lewati
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onPrev}
              disabled={isFirst}
              aria-label="Langkah sebelumnya"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-[#334155] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-[13px] font-medium text-[#64748B] tabular-nums min-w-[34px] text-center">
              {currentStep + 1} / {steps.length}
            </span>

            <button
              type="button"
              onClick={onNext}
              aria-label={isLast ? 'Selesai panduan' : 'Langkah selanjutnya'}
              className="h-8 px-2.5 min-w-[32px] rounded-full bg-[#1B68FF] hover:bg-[#1454D6] text-white text-[13px] font-semibold flex items-center justify-center transition-colors shadow-[0_6px_16px_rgba(27,104,255,0.35)] cursor-pointer"
            >
              {isLast ? (
                <span className="px-1.5">Selesai</span>
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Kartu 3D Interaktif:
 * Memberikan kedalaman perspektif 3D saat diarahkan kursor dan efek tekan taktil saat diklik.
 */
function Interactive3DCard({
  children,
  className = '',
  intensity = 4,
  tourId,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  tourId?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1100px) rotateX(${(-y * intensity).toFixed(
      2
    )}deg) rotateY(${(x * intensity).toFixed(2)}deg) translateZ(4px)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform =
      'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  return (
    <div
      ref={cardRef}
      data-tour-id={tourId}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms ease',
        willChange: 'transform',
      }}
      className={`active:scale-[0.99] ${className}`}
    >
      {children}
    </div>
  );
}

const DEFAULT_SUBJECTS: DashboardSubjectItem[] = [
  {
    subjectId: 1,
    subjectCode: '01',
    subjectName: 'Matematika SMP',
    masteredSubmaterials: 0,
    totalSubmaterials: 10,
    masteryPercent: 0,
    simulationUnlocked: false,
  },
  {
    subjectId: 2,
    subjectCode: '02',
    subjectName: 'Bahasa Indonesia SMP',
    masteredSubmaterials: 0,
    totalSubmaterials: 6,
    masteryPercent: 0,
    simulationUnlocked: false,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, role, isLoading: authLoading, updateUser } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // State Spotlight Onboarding Tour
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const applyDashboardPayload = useCallback(
    (res: { data?: DashboardPayload } & DashboardPayload) => {
      const data = res?.data || res;
      setDashboardData(data);
      if (data?.student) {
        const nextAvatarUrl = data.student.avatar?.imageUrl || data.student.avatarUrl;
        const nextTotalXp = data.student.totalXp ?? data.student.total_xp;
        updateUser({
          ...(data.student.name ? { name: data.student.name } : {}),
          ...(nextAvatarUrl ? { avatarUrl: nextAvatarUrl } : {}),
          ...(data.student.avatar?.id ? { avatarId: data.student.avatar.id } : {}),
          ...(nextTotalXp !== undefined ? { totalXp: nextTotalXp } : {}),
        });
      }
    },
    [updateUser]
  );

  const handleDashboardError = useCallback(
    (err: unknown) => {
      console.error('Failed to load dashboard:', err);
      const apiErr = err as { code?: string; status?: number; message?: string };
      if (apiErr?.code === 'PROFILE_INCOMPLETE' || apiErr?.status === 409) {
        router.push('/onboarding');
        return;
      }
      if (apiErr?.status === 401) {
        router.push('/login');
        return;
      }
      if (apiErr?.status === 403) {
        router.replace('/admin/dashboard');
        return;
      }
      setErrorMsg(apiErr?.message || 'Gagal memuat ringkasan belajar dari server.');
    },
    [router]
  );

  const loadDashboard = useCallback(() => {
    setLoading(true);
    setErrorMsg('');
    api.dashboard
      .get()
      .then(applyDashboardPayload)
      .catch(handleDashboardError)
      .finally(() => setLoading(false));
  }, [applyDashboardPayload, handleDashboardError]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login');
      } else if (role !== 'SISWA') {
        router.replace('/admin/dashboard');
      } else if (user.needsOnboarding) {
        router.replace('/onboarding');
      }
    }
  }, [authLoading, user, role, router]);

  const userId = user?.id;
  const needsOnboarding = Boolean(user?.needsOnboarding);
  useEffect(() => {
    if (authLoading || !userId || role !== 'SISWA' || needsOnboarding) return;
    let active = true;
    api.dashboard
      .get()
      .then((res: { data?: DashboardPayload } & DashboardPayload) => {
        if (!active) return;
        applyDashboardPayload(res);
      })
      .catch((err: unknown) => {
        if (!active) return;
        handleDashboardError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [authLoading, userId, needsOnboarding, role, applyDashboardPayload, handleDashboardError]);

  // Otomatis tampilkan Spotlight Tour untuk siswa yang baru login & belum pernah menyelesaikan tutorial
  useEffect(() => {
    if (loading || !userId || role !== 'SISWA') return;
    const storageKey = `agra_dashboard_tour_done_${userId}`;
    const hasSeenTour = localStorage.getItem(storageKey);

    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setTourStep(0);
        setTourOpen(true);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [loading, userId, role]);

  const handleFinishTour = useCallback(() => {
    if (userId) {
      localStorage.setItem(`agra_dashboard_tour_done_${userId}`, '1');
    }
    setTourOpen(false);
  }, [userId]);

  const handleNextTourStep = useCallback(() => {
    if (tourStep < DASHBOARD_TOUR_STEPS.length - 1) {
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

  if (authLoading || !user || role !== 'SISWA') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF2FA]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1B68FF] border-t-transparent" />
      </div>
    );
  }

  const student: DashboardStudentData | undefined = dashboardData?.student || user;
  const rawSubjects = dashboardData?.subjects || [];
  const subjects = rawSubjects.length > 0 ? rawSubjects : DEFAULT_SUBJECTS;
  const nextAction = dashboardData?.nextAction;
  const isRecallPassed =
    dashboardData?.student?.isRecallPassed ?? dashboardData?.nextAction?.type !== 'RECALL';
  const nextActionHref = normalizeNextActionRoute(
    nextAction?.route,
    nextAction?.type,
    nextAction?.submaterialId
  );

  const totalXp = student?.totalXp ?? user?.totalXp ?? 0;
  const phaseTitle =
    student?.milestone?.title || student?.milestone?.tierName || 'Perintis Belajar';
  const milestonePercent = student?.milestoneProgress?.progressPercent ?? (totalXp > 0 ? 35 : 8);

  const totalMasteredAll = subjects.reduce(
    (acc, s) => acc + (s.masteredSubmaterials ?? s.completedSubmaterials ?? 0),
    0
  );
  const totalSubmaterialsAll = subjects.reduce(
    (acc, s) => acc + (s.totalSubmaterials ?? 0),
    0
  );

  return (
    <div
      style={{ fontFamily: "'Onest', sans-serif" }}
      className="relative flex min-h-screen flex-col bg-[#EEF2FA] text-[#0A0D14] overflow-x-hidden"
    >
      {/* Tekstur Architectural Grid 56x56 Satu Tema dengan Landing Page */}
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

      {/* MAIN CONTAINER — Rata Kanan-Kiri Penuh (w-full px-6 sm:px-12 lg:px-16) */}
      <main className="relative z-10 flex-1 w-full px-6 sm:px-12 lg:px-16 py-8 sm:py-12 space-y-10">
        {errorMsg && (
          <div className="flex items-center justify-between rounded-[20px] border border-[#D97706] bg-[#FFFBEB] p-4 text-[15px] text-[#78350F]">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[#D97706] shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
            <button
              onClick={loadDashboard}
              className="min-h-[42px] inline-flex items-center gap-2 rounded-[12px] bg-[#FDE68A] hover:bg-amber-300 px-4 py-2 text-[14px] font-semibold text-[#78350F] transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Muat Ulang</span>
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#1B68FF] border-t-transparent" />
          </div>
        ) : (
          <>
            {/* ═══════════════════════════════════════════════════════════════
                BARIS 1: BENTO PROFIL SISWA (7 KOLOM) + MISI AKTIF (5 KOLOM)
               ═══════════════════════════════════════════════════════════════ */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* KIRI (7 KOLOM): Panggung Identitas Siswa & Progres Fase */}
              <Interactive3DCard
                tourId="tour-profile-card"
                intensity={3.5}
                className="lg:col-span-7 rounded-[32px] bg-gradient-to-br from-[#060E24] via-[#0B1D48] to-[#1B68FF] text-white p-7 sm:p-10 shadow-[0_28px_65px_-15px_rgba(6,14,36,0.28)] flex flex-col justify-between relative overflow-hidden"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -bottom-16 w-[320px] h-[320px] rounded-full bg-[#38BDF8]/20 blur-3xl"
                />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="p-1.5 rounded-full bg-white/15 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.25)] shrink-0">
                      <UserAvatar
                        src={student?.avatar?.imageUrl || user?.avatarUrl}
                        name={student?.name || user?.name || user?.username}
                        size="xl"
                        rounded="full"
                      />
                    </div>

                    <div>
                      <p className="text-[15px] font-medium text-[#38BDF8] text-left">
                        Ruang Belajar Siswa{user?.grade ? ` • Kelas ${user.grade} SMP` : ''}
                      </p>
                      <h1 className="text-[26px] sm:text-[34px] font-semibold tracking-[-0.035em] leading-[1.15] text-white text-left mt-1">
                        {student?.name || user?.name || user?.username || 'Siswa'}
                      </h1>
                      <p className="text-[15px] text-blue-100 mt-1 text-left">
                        Fase Aktif: <span className="font-semibold text-white">{phaseTitle}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={handleRestartTour}
                      className="min-h-[44px] px-4 py-2.5 rounded-[14px] bg-white/10 hover:bg-white/20 border border-white/20 text-[14px] font-medium text-white transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
                      <span>Panduan</span>
                    </button>
                    <Link
                      href="/profile"
                      className="min-h-[44px] px-5 py-2.5 rounded-[14px] bg-white/15 hover:bg-white/25 border border-white/25 text-[14px] font-semibold text-white transition-all inline-flex items-center justify-center"
                    >
                      Profil &amp; Avatar
                    </Link>
                  </div>
                </div>

                {/* Bar Progres XP & Capaian Submateri di Bawah Kartu */}
                <div className="relative z-10 mt-10 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-12 items-end gap-6">
                  <div className="sm:col-span-7 space-y-2.5">
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-blue-100 font-medium">Progres Fase Belajar</span>
                      <span className="font-semibold text-white">{totalXp} XP</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-white/15 overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-white transition-all duration-500"
                        style={{ width: `${Math.max(8, milestonePercent)}%` }}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-5 flex sm:justify-end gap-6">
                    <div className="text-left sm:text-right">
                      <span className="block text-[28px] sm:text-[32px] font-semibold tracking-[-0.04em] leading-none text-white">
                        {totalMasteredAll}/{totalSubmaterialsAll || 16}
                      </span>
                      <span className="block text-[13px] text-blue-100 mt-1">
                        Submateri Tuntas
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="block text-[28px] sm:text-[32px] font-semibold tracking-[-0.04em] leading-none text-[#38BDF8]">
                        {isRecallPassed ? 'Aktif' : 'Tahap 01'}
                      </span>
                      <span className="block text-[13px] text-blue-100 mt-1">
                        Status Kurikulum
                      </span>
                    </div>
                  </div>
                </div>
              </Interactive3DCard>

              {/* KANAN (5 KOLOM): Kartu Misi Utama */}
              <Interactive3DCard
                tourId="tour-mission-card"
                intensity={4}
                className="lg:col-span-5 rounded-[32px] bg-white border border-slate-200/90 p-7 sm:p-10 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="text-[44px] sm:text-[52px] font-light tracking-[-0.05em] leading-none text-[#1B68FF]">
                      {!isRecallPassed ? '01' : '02'}
                    </span>
                    <span
                      className={`px-4 py-1.5 rounded-full text-[14px] font-semibold ${
                        !isRecallPassed
                          ? 'bg-[#FFFBEB] border border-[#D97706]/40 text-[#78350F]'
                          : 'bg-[#ECFDF5] border border-[#059669]/30 text-[#065F46]'
                      }`}
                    >
                      {!isRecallPassed ? 'Tahap Pembuka Wajib' : 'Kurikulum Terbuka'}
                    </span>
                  </div>

                  <h2 className="text-[24px] sm:text-[28px] font-semibold tracking-[-0.03em] leading-[1.2] text-[#0A0D14] text-left">
                    {!isRecallPassed
                      ? 'Selesaikan Recall Kemampuan Awal'
                      : nextAction?.title || 'Lanjutkan Latihan Submateri'}
                  </h2>

                  <p className="text-[15px] sm:text-[16px] font-normal leading-[1.65] text-[#334155] text-justify mt-3">
                    {!isRecallPassed
                      ? 'Kerjakan 30 soal diagnostik lintas Matematika dan Bahasa Indonesia tanpa batas waktu ketat. Capai ketuntasan minimal 90% untuk membuka seluruh 16 submateri kurikulum.'
                      : 'Pilih submateri yang sedang berjalan dan tuntaskan latihan bertahap dari Level 1 (Pemahaman), Level 2 (Aplikasi), hingga Level 3 (Penalaran) untuk membuka simulasi ujian CBT.'}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href={!isRecallPassed ? '/recall' : nextActionHref}
                    className="min-h-[48px] flex-1 px-6 py-3 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[15px] font-semibold shadow-[0_12px_28px_rgba(27,104,255,0.28)] transition-all inline-flex items-center justify-center gap-2"
                  >
                    <span>
                      {!isRecallPassed ? 'Mulai Recall 30 Soal' : 'Mulai Latihan Sekarang'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {isRecallPassed && (
                    <Link
                      href="/curriculum"
                      className="min-h-[48px] px-5 py-3 rounded-[14px] bg-[#F4F7FC] hover:bg-slate-200/70 text-[#0A0D14] border border-slate-300 text-[15px] font-semibold transition-all inline-flex items-center justify-center"
                    >
                      Semua Materi
                    </Link>
                  )}
                </div>
              </Interactive3DCard>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                BARIS 2: KURIKULUM MATA PELAJARAN & TAHAPAN EVALUASI (3 KARTU)
               ═══════════════════════════════════════════════════════════════ */}
            <section className="space-y-8 pt-2">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200/90 pb-6">
                <div>
                  <h2 className="text-[30px] sm:text-[40px] font-normal tracking-[-0.035em] leading-[1.1] text-[#0A0D14] text-left">
                    Capaian Kurikulum &amp; Simulasi Ujian
                  </h2>
                </div>
                <p className="text-[15px] sm:text-[16px] font-normal leading-[1.65] text-[#334155] max-w-xl text-justify">
                  Setiap mata pelajaran terdiri atas submateri berjenjang.
                  Simulasi ujian CBT 75 menit otomatis terbuka setelah seluruh
                  submateri pada mata pelajaran tersebut tuntas.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {subjects.map((sub: DashboardSubjectItem, idx: number) => {
                  const subjectId =
                    sub.subjectId ?? sub.id ?? (sub.subjectCode === 'MAT' || idx === 0 ? 1 : 2);
                  const masteryPercent = sub.masteryPercent ?? sub.masteryPercentage ?? 0;
                  const masteredCount =
                    sub.masteredSubmaterials ?? sub.completedSubmaterials ?? 0;
                  const totalCount = sub.totalSubmaterials ?? (subjectId === 1 ? 10 : 6);
                  const isSimulationUnlocked = Boolean(
                    sub.simulationUnlocked ??
                      sub.simulation_unlocked ??
                      (totalCount > 0 && masteredCount >= totalCount)
                  );
                  const displayNum = String(idx + 1).padStart(2, '0');

                  return (
                    <Interactive3DCard
                      key={sub.subjectCode || idx}
                      tourId={`tour-subject-${idx}`}
                      intensity={4}
                      className="rounded-[30px] bg-white border border-slate-200/90 p-7 sm:p-9 shadow-[0_18px_45px_-12px_rgba(15,23,42,0.06)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-6">
                          <span className="text-[44px] font-light tracking-[-0.04em] leading-none text-[#1B68FF]">
                            {displayNum}
                          </span>

                          <span
                            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold ${
                              !isRecallPassed
                                ? 'bg-slate-100 text-[#334155]'
                                : isSimulationUnlocked
                                  ? 'bg-[#ECFDF5] text-[#065F46]'
                                  : 'bg-[#EEF2FA] text-[#1B68FF]'
                            }`}
                          >
                            {masteredCount} dari {totalCount} Submateri Tuntas
                          </span>
                        </div>

                        <h3 className="text-[24px] sm:text-[26px] font-semibold tracking-[-0.025em] leading-[1.25] text-[#0A0D14] text-left">
                          {sub.subjectName}
                        </h3>

                        <p className="text-[15px] font-normal leading-[1.65] text-[#334155] text-justify mt-2.5">
                          {subjectId === 1
                            ? 'Meliputi bilangan real, aljabar, persamaan linear, geometri bangun datar dan ruang, serta statistika dan peluang.'
                            : 'Meliputi pemahaman tekstual, simpulan tersirat, struktur dan kohesi wacana, serta evaluasi teks informasi dan fiksi.'}
                        </p>

                        <div className="mt-6 pt-5 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[14px] mb-2">
                            <span className="font-medium text-[#334155]">
                              Penguasaan Materi
                            </span>
                            <span className="font-semibold text-[#1B68FF]">
                              {masteryPercent}%
                            </span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-[#EEF2FA] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#1B68FF] to-[#10B981] transition-all duration-500"
                              style={{ width: `${masteryPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-7 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
                        {!isRecallPassed ? (
                          <Link
                            href="/recall"
                            className="col-span-2 min-h-[46px] px-5 py-2.5 rounded-[14px] bg-[#F4F7FC] hover:bg-[#EEF2FA] text-[#0A0D14] border border-slate-300 text-[14px] font-semibold transition-all inline-flex items-center justify-center gap-2"
                          >
                            <Lock className="w-4 h-4 text-[#334155]" />
                            <span>Selesaikan Recall untuk Membuka</span>
                          </Link>
                        ) : (
                          <>
                            <Link
                              href={`/curriculum/${subjectId}`}
                              className="min-h-[46px] px-4 py-2.5 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] text-white text-[14px] font-semibold transition-all inline-flex items-center justify-center"
                            >
                              Buka Materi
                            </Link>
                            <Link
                              href={`/simulations/${subjectId}`}
                              className={`min-h-[46px] px-4 py-2.5 rounded-[14px] text-[14px] font-semibold transition-all inline-flex items-center justify-center gap-1.5 ${
                                isSimulationUnlocked
                                  ? 'bg-[#10B981] hover:bg-[#059669] text-white'
                                  : 'bg-[#F4F7FC] hover:bg-slate-200/70 text-[#334155] border border-slate-200'
                              }`}
                            >
                              {!isSimulationUnlocked && <Lock className="w-3.5 h-3.5" />}
                              <span>Simulasi CBT</span>
                            </Link>
                          </>
                        )}
                      </div>
                    </Interactive3DCard>
                  );
                })}

                {/* KARTU KE-3: Peta Status Tahapan Belajar */}
                <Interactive3DCard
                  tourId="tour-cbt-card"
                  intensity={4}
                  className="rounded-[30px] bg-[#060E24] text-white p-7 sm:p-9 shadow-[0_22px_50px_-12px_rgba(6,14,36,0.25)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <span className="text-[44px] font-light tracking-[-0.04em] leading-none text-[#38BDF8]">
                        03
                      </span>
                      <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-[13px] font-semibold text-white">
                        75 Menit • 30 Soal
                      </span>
                    </div>

                    <h3 className="text-[24px] sm:text-[26px] font-semibold tracking-[-0.025em] leading-[1.25] text-white text-left">
                      Alur Ketuntasan Ujian
                    </h3>

                    <p className="text-[15px] font-normal leading-[1.65] text-slate-300 text-justify mt-2.5">
                      Pantau tiga syarat utama menuju simulasi ujian berbasis
                      komputer berdurasi 75 menit.
                    </p>

                    <div className="space-y-3 mt-6 pt-5 border-t border-white/10">
                      <div className="p-3.5 rounded-[16px] bg-white/8 flex items-center justify-between text-[15px]">
                        <span className="font-medium text-white">
                          1. Lulus Recall (≥ 90%)
                        </span>
                        {isRecallPassed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                        ) : (
                          <span className="text-[13px] font-semibold text-[#38BDF8]">
                            Aktif
                          </span>
                        )}
                      </div>

                      <div className="p-3.5 rounded-[16px] bg-white/8 flex items-center justify-between text-[15px]">
                        <span className="font-medium text-white">
                          2. Tuntas 3 Level Submateri
                        </span>
                        <span className="text-[14px] font-semibold text-slate-300">
                          {totalMasteredAll}/{totalSubmaterialsAll || 16}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-[16px] bg-white/8 flex items-center justify-between text-[15px]">
                        <span className="font-medium text-white">
                          3. Simulasi CBT 75 Menit
                        </span>
                        <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 pt-5 border-t border-white/10">
                    <Link
                      href="/simulations/1"
                      className="min-h-[46px] w-full px-5 py-2.5 rounded-[14px] bg-white hover:bg-blue-50 text-[#0A0D14] text-[14px] font-semibold transition-all inline-flex items-center justify-center gap-2"
                    >
                      <span>Lihat Ruang Simulasi CBT</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Interactive3DCard>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Spotlight Onboarding Tour Overlay */}
      <DashboardSpotlightTour
        isOpen={tourOpen}
        steps={DASHBOARD_TOUR_STEPS}
        currentStep={tourStep}
        onNext={handleNextTourStep}
        onPrev={handlePrevTourStep}
        onSkip={handleFinishTour}
      />

      <Footer />
    </div>
  );
}
