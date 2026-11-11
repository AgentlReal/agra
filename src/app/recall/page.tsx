'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  CheckSquare,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { SpotlightTour, TourStep } from '@/components/common/SpotlightTour';

interface RecallStatus {
  isPassed: boolean;
  lastAttemptId?: string | number | null;
  activeAttemptId?: string | number | null;
  totalAttempts?: number;
}

const RECALL_TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-recall-hero',
    title: 'Tes Kemampuan Awal',
    description:
      'Tes santai untuk mengukur kesiapan belajarmu sebelum mulai mempelajari materi.',
  },
  {
    targetId: 'tour-recall-specs',
    title: 'Aturan Pengerjaan',
    description:
      'Terdiri atas 30 butir soal (15 Matematika & 15 Bahasa Indonesia) tanpa batas waktu dan target kelulusan 90%.',
  },
  {
    targetId: 'tour-recall-safe',
    title: 'Belajar Tanpa Rasa Takut',
    description:
      'Tidak ada pengurangan nilai atau penalti. Kerjakan setiap soal dengan santai dan teliti.',
  },
  {
    targetId: 'tour-recall-action',
    title: 'Mulai Sekarang',
    description:
      'Klik di sini untuk mulai tes, atau langsung belajar materi jika kamu sudah lulus.',
  },
];

/**
 * Kartu 3D Interaktif (Gaya Dashboard & Kurikulum):
 * Memberikan efek kemiringan (tilt) 3D interaktif yang halus saat disentuh kursor.
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
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      data-tour-id={tourId}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1100px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-4px)`
          : 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered
          ? 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 150ms ease'
          : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 500ms ease',
        willChange: 'transform',
      }}
      className={`active:scale-[0.99] ${className}`}
    >
      {children}
    </div>
  );
}

export default function RecallIntroPage() {
  const router = useRouter();
  const { user, role, isLoading: authLoading } = useAuth();
  const [status, setStatus] = useState<RecallStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

    api.recall
      .getStatus()
      .then((res: unknown) => {
        if (!active) return;
        const resAny = res as { data?: RecallStatus } | RecallStatus;
        const data = (resAny as { data?: RecallStatus })?.data || (resAny as RecallStatus);
        setStatus(data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        console.error('Failed to load recall status:', err);
        const error = err as { status?: number; message?: string };
        if (error.status === 401) {
          router.replace('/login');
          return;
        }
        if (error.status === 403) {
          router.replace('/admin/dashboard');
          return;
        }
        setErrorMsg(error.message || 'Gagal memuat status Recall dari server.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, user, role, router]);

  const handleRetry = () => {
    setLoading(true);
    setErrorMsg('');
    api.recall
      .getStatus()
      .then((res: unknown) => {
        const resAny = res as { data?: RecallStatus } | RecallStatus;
        const data = (resAny as { data?: RecallStatus })?.data || (resAny as RecallStatus);
        setStatus(data);
      })
      .catch((err: unknown) => {
        console.error('Failed to load recall status:', err);
        const error = err as { status?: number; message?: string };
        setErrorMsg(error.message || 'Gagal memuat status Recall dari server.');
      })
      .finally(() => setLoading(false));
  };

  const userId = user?.id;

  // Otomatis tampilkan Spotlight Tour untuk kunjungan pertama (Opsi A)
  useEffect(() => {
    if (loading || !userId || role !== 'SISWA') return;
    const storageKey = `agra_recall_tour_done_${userId}`;
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
      localStorage.setItem(`agra_recall_tour_done_${userId}`, '1');
    }
    setTourOpen(false);
  }, [userId]);

  const handleNextTourStep = useCallback(() => {
    if (tourStep < RECALL_TOUR_STEPS.length - 1) {
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

  const handleStartAttempt = async () => {
    setStarting(true);
    setErrorMsg('');
    try {
      const res = await api.recall.startAttempt();
      const resAny = res as {
        attempt_id?: string | number;
        attemptId?: string | number;
        id?: string | number;
        data?: { attempt_id?: string | number; attemptId?: string | number };
      };
      const attemptId =
        resAny?.attempt_id ||
        resAny?.attemptId ||
        resAny?.id ||
        resAny?.data?.attempt_id ||
        resAny?.data?.attemptId;

      if (!attemptId) {
        throw new Error('Gagal memulai sesi Recall.');
      }
      router.push(`/recall/exam/${attemptId}`);
    } catch (err: unknown) {
      const error = err as { code?: string; status?: number; message?: string };
      if (
        error?.code === 'RECALL_ALREADY_PASSED' ||
        error?.status === 409 ||
        error?.message?.toLowerCase().includes('sudah lulus')
      ) {
        setStatus((prev) => (prev ? { ...prev, isPassed: true } : { isPassed: true }));
        setErrorMsg('Kamu sudah lulus tes kemampuan awal sebelumnya. Mengalihkan ke halaman materi...');
        setTimeout(() => router.push('/curriculum'), 1800);
      } else {
        setErrorMsg(error.message || 'Gagal memulai sesi recall. Pastikan bank soal mencukupi di server.');
      }
      setStarting(false);
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
        {/* Top Action Bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="min-h-[48px] px-5 py-2.5 rounded-[14px] bg-white hover:bg-[#F4F7FC] text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[16px] font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali ke Dasbor</span>
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
          <div className="space-y-6">
            {/* ═══════════════════════════════════════════════════════════════
                BARIS 1: BENTO HERO STAGE (7 KOLOM) + ACTION LAUNCHPAD (5 KOLOM)
               ═══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* KIRI (7 KOLOM): PANGGUNG HERO KHAS AGRA (DEEP NAVY GRADIENT) */}
              <Interactive3DCard
                tourId="tour-recall-hero"
                intensity={3.0}
                className="lg:col-span-7 rounded-[32px] bg-gradient-to-br from-[#060E24] via-[#0B1D48] to-[#1B68FF] text-white p-8 sm:p-10 shadow-[0_28px_65px_-15px_rgba(6,14,36,0.28)] flex flex-col justify-between relative overflow-hidden"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -bottom-16 w-[320px] h-[320px] rounded-full bg-[#38BDF8]/20 blur-3xl"
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-[10px] bg-white/15 text-[#38BDF8] border border-white/20 text-[14px] font-semibold backdrop-blur-md">
                      Langkah Awal
                    </span>
                    <span className="text-[14px] font-medium text-blue-200">
                      Jenjang SMP/MTs
                    </span>
                  </div>

                  <h1 className="text-[32px] sm:text-[42px] font-semibold tracking-[-0.035em] text-white leading-[1.1]">
                    Recall Kemampuan Awal
                  </h1>

                  <p className="text-[16px] sm:text-[17px] text-blue-100 leading-[1.55] max-w-xl">
                    Uji pemahaman dasar untuk mengukur kesiapan belajarmu sebelum mulai mempelajari materi pembelajaran secara mandiri.
                  </p>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-white/15 flex items-center justify-between gap-4">
                  {status?.isPassed ? (
                    <div className="inline-flex items-center gap-2.5 rounded-[16px] bg-emerald-500/20 border border-emerald-400/30 px-4 py-2 text-emerald-200 text-[14px] font-semibold backdrop-blur-md">
                      <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                      <span>Tes Awal Selesai &amp; Lulus</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-blue-100 text-[14px] font-medium">
                      <Sparkles className="w-4 h-4 text-[#38BDF8] shrink-0" />
                      <span>Capai nilai minimal 90% untuk membuka materi</span>
                    </div>
                  )}

                  <span className="text-[13px] text-blue-200 font-medium hidden sm:inline-block">
                    Matematika &amp; Bahasa Indonesia
                  </span>
                </div>
              </Interactive3DCard>

              {/* KANAN (5 KOLOM): KARTU AKSI MULAI (LAUNCHPAD) */}
              <Interactive3DCard
                tourId="tour-recall-action"
                intensity={3.0}
                className="lg:col-span-5 rounded-[32px] bg-white border border-slate-200/90 p-8 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-[16px] bg-[#EEF2FA] text-[#1B68FF] border border-[#1B68FF]/20 flex items-center justify-center">
                    <BookOpen className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-[22px] font-semibold text-[#0A0D14] tracking-[-0.02em]">
                      {status?.isPassed ? 'Lanjut ke Materi Belajar' : 'Mulai Latihan Awal'}
                    </h3>
                    <p className="mt-1.5 text-[15px] text-[#334155] leading-[1.55]">
                      {status?.isPassed
                        ? 'Seluruh modul pembelajaran Matematika dan Bahasa Indonesia kini sudah terbuka.'
                        : 'Kerjakan 30 soal santai ini untuk melihat peta kesiapan belajarmu.'}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-3">
                  {status?.isPassed ? (
                    <Link
                      href="/curriculum"
                      className="w-full min-h-[48px] px-7 py-3.5 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[16px] font-semibold transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] inline-flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <span>Mulai Belajar Materi</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartAttempt}
                      disabled={starting}
                      className="w-full min-h-[48px] px-7 py-3.5 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[16px] font-semibold transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] inline-flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                    >
                      {starting ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <span>Mulai Tes Awal</span>
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  )}

                  {status?.lastAttemptId && (
                    <Link
                      href={`/recall/review/${status.lastAttemptId}`}
                      className="w-full min-h-[44px] px-5 py-2.5 rounded-[12px] bg-slate-50 hover:bg-slate-100 text-[#0A0D14] border border-slate-200 text-[14px] font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Lihat Pembahasan Sebelumnya</span>
                    </Link>
                  )}
                </div>
              </Interactive3DCard>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                BARIS 2: 3 BENTO SPECIFICATION TILES
               ═══════════════════════════════════════════════════════════════ */}
            <div
              data-tour-id="tour-recall-specs"
              className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            >
              <Interactive3DCard
                intensity={2.5}
                className="rounded-[28px] bg-white border border-slate-200/90 p-6 shadow-[0_18px_40px_-15px_rgba(15,23,42,0.06)] flex items-start gap-4 hover:border-[#1B68FF]/50 transition-all"
              >
                <div className="w-12 h-12 rounded-[16px] bg-[#EEF2FA] text-[#1B68FF] border border-[#1B68FF]/20 flex items-center justify-center shrink-0">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[14px] font-medium text-[#334155]">Jumlah Soal</span>
                  <p className="text-[20px] font-semibold text-[#0A0D14] tabular-nums">30 Soal Latihan</p>
                  <p className="text-[13px] text-[#1E293B]">15 Matematika &amp; 15 Bahasa Indonesia</p>
                </div>
              </Interactive3DCard>

              <Interactive3DCard
                intensity={2.5}
                className="rounded-[28px] bg-white border border-slate-200/90 p-6 shadow-[0_18px_40px_-15px_rgba(15,23,42,0.06)] flex items-start gap-4 hover:border-[#1B68FF]/50 transition-all"
              >
                <div className="w-12 h-12 rounded-[16px] bg-[#FFFBEB] text-[#D97706] border border-[#D97706]/20 flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[14px] font-medium text-[#334155]">Waktu Pengerjaan</span>
                  <p className="text-[20px] font-semibold text-[#0A0D14]">Bebas Waktu</p>
                  <p className="text-[13px] text-[#1E293B]">Kerjakan santai tanpa terburu-buru</p>
                </div>
              </Interactive3DCard>

              <Interactive3DCard
                intensity={2.5}
                className="rounded-[28px] bg-white border border-slate-200/90 p-6 shadow-[0_18px_40px_-15px_rgba(15,23,42,0.06)] flex items-start gap-4 hover:border-[#1B68FF]/50 transition-all"
              >
                <div className="w-12 h-12 rounded-[16px] bg-[#ECFDF5] text-[#059669] border border-[#059669]/20 flex items-center justify-center shrink-0">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[14px] font-medium text-[#334155]">Target Kelulusan</span>
                  <p className="text-[20px] font-semibold text-[#0A0D14] tabular-nums">Nilai Minimal 90%</p>
                  <p className="text-[13px] text-[#1E293B]">Cukup 27 soal benar untuk lulus</p>
                </div>
              </Interactive3DCard>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                BARIS 3: SAFE-TO-FAIL FEATURE BENTO CARD
               ═══════════════════════════════════════════════════════════════ */}
            <Interactive3DCard
              tourId="tour-recall-safe"
              intensity={2.0}
              className="rounded-[32px] bg-white border border-slate-200/90 p-7 sm:p-9 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-[16px] bg-[#EEF2FA] text-[#1B68FF] border border-[#1B68FF]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1.5 leading-[1.55] max-w-3xl">
                  <h3 className="text-[19px] font-semibold text-[#0A0D14]">
                    Belajar Nyaman Tanpa Rasa Takut Salah
                  </h3>
                  <p className="text-[15px] sm:text-[16px] text-[#1E293B]">
                    Tidak ada pengurangan nilai atau penalti. Kerjakan setiap soal dengan santai dan teliti. Kalau nilaimu belum mencapai 90%, kamu bisa langsung mempelajari pembahasannya dan mencoba lagi kapan saja.
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-center px-4 py-2.5 rounded-full bg-[#ECFDF5] border border-[#059669]/30 text-[#065F46] text-[14px] font-semibold inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Bebas Penalti Nilai</span>
              </div>
            </Interactive3DCard>
          </div>
        )}
      </main>

      {/* Spotlight Tour Walkthrough */}
      <SpotlightTour
        isOpen={tourOpen}
        steps={RECALL_TOUR_STEPS}
        currentStep={tourStep}
        onNext={handleNextTourStep}
        onPrev={handlePrevTourStep}
        onSkip={handleFinishTour}
      />

      <Footer />
    </div>
  );
}
