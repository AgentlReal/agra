'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import {
  BookOpen,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { SpotlightTour, TourStep } from '@/components/common/SpotlightTour';

interface SubjectItem {
  id?: number | string;
  subjectId?: number | string;
  code?: string;
  name?: string;
  description?: string;
  totalMaterials?: number;
  total_materials?: number;
  totalSubmaterials?: number;
  total_submaterials?: number;
  masteredSubmaterials?: number;
  mastered_submaterials?: number;
  completedSubmaterials?: number;
}

function getSubjectDescription(
  subjectId?: number | string,
  name?: string,
  fallback?: string
): string {
  const isMath =
    String(subjectId) === '1' ||
    name?.toLowerCase().includes('matematika') ||
    name?.toLowerCase().includes('numerasi');
  const isIndo =
    String(subjectId) === '2' ||
    name?.toLowerCase().includes('bahasa') ||
    name?.toLowerCase().includes('indonesia') ||
    name?.toLowerCase().includes('literasi');

  if (isMath) {
    return 'Kuasai konsep bilangan, aljabar, geometri, hingga analisis data dan peluang lewat pemecahan masalah kontekstual.';
  }
  if (isIndo) {
    return 'Asah kemampuan literasi, analisis ide pokok, dan pemahaman mendalam melalui berbagai teks informasi serta fiksi.';
  }
  return (
    fallback ||
    'Pelajari kompetensi esensial, pahami konsep mendalam, dan kuasai 3 level kognitif latihan secara adaptif.'
  );
}

const CURRICULUM_TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-curriculum-header',
    title: 'ruang kurikulum mata pelajaran',
    description:
      'Pilih salah satu dari 2 cabang mata pelajaran resmi Fase D (Matematika atau Bahasa Indonesia) untuk mempelajari materi pokok dan latihan kompetensi.',
  },
  {
    targetId: 'tour-subject-0',
    title: 'mata pelajaran Matematika SMP',
    description:
      'Memuat 10 submateri numerasi. Kamu bisa melihat jumlah materi pokok serta bilah capaian submateri yang sudah kamu tuntaskan di kartu ini.',
  },
  {
    targetId: 'tour-subject-1',
    title: 'mata pelajaran Bahasa Indonesia SMP',
    description:
      'Memuat 6 submateri literasi membaca teks fiksi dan informasi. Selesaikan semua submateri untuk melengkapi syarat pembukaan Simulasi CBT.',
  },
];

/**
 * Kartu 3D Interaktif (Gaya Dashboard):
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

export default function CurriculumIndexPage() {
  const router = useRouter();
  const { user, role, isLoading: authLoading } = useAuth();
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
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
    if (!authLoading && user && role === 'SISWA') {
      fetchSubjects();
    }
  }, [authLoading, user?.id, role]);

  const fetchSubjects = () => {
    setLoading(true);
    setErrorMsg('');
    api.curriculum
      .getSubjects()
      .then((res: unknown) => {
        const resAny = res as { data?: SubjectItem[] } | SubjectItem[];
        const list = Array.isArray(resAny) ? resAny : resAny?.data || [];
        setSubjects(list);
      })
      .catch((err: unknown) => {
        console.error('Failed to load subjects:', err);
        const error = err as { message?: string };
        setErrorMsg(error.message || 'Gagal memuat mata pelajaran dari server.');
      })
      .finally(() => setLoading(false));
  };

  const userId = user?.id;

  // Otomatis tampilkan Spotlight Tour untuk kunjungan pertama (Opsi A)
  useEffect(() => {
    if (loading || !userId || role !== 'SISWA') return;
    const storageKey = `agra_curriculum_tour_done_${userId}`;
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
      localStorage.setItem(`agra_curriculum_tour_done_${userId}`, '1');
    }
    setTourOpen(false);
  }, [userId]);

  const handleNextTourStep = useCallback(() => {
    if (tourStep < CURRICULUM_TOUR_STEPS.length - 1) {
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
        {/* Header Section */}
        <section
          data-tour-id="tour-curriculum-header"
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.035em] text-[#0A0D14] leading-[1.1]">
              Kurikulum &amp; Materi Belajar
            </h1>
            <p className="mt-2 text-[16px] sm:text-[17px] text-[#1E293B] leading-[1.55] max-w-2xl">
              Pilih mata pelajaran untuk mempelajari materi dan menuntaskan latihan 3 level kognitif
            </p>
          </div>

          <button
            type="button"
            onClick={handleRestartTour}
            className="min-h-[44px] px-5 py-2.5 rounded-[14px] bg-white hover:bg-[#F4F7FC] border border-slate-200/90 text-[14px] font-semibold text-[#0A0D14] transition-all inline-flex items-center gap-2 cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
          >
            <HelpCircle className="w-4 h-4 text-[#1B68FF]" />
            <span>Panduan</span>
          </button>
        </section>

        {/* Error Notification */}
        {errorMsg && (
          <div className="flex items-center justify-between rounded-[20px] border border-[#D97706] bg-[#FFFBEB] p-4 text-[15px] text-[#78350F]">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[#D97706] shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
            <button
              onClick={fetchSubjects}
              className="min-h-[44px] px-5 py-2 inline-flex items-center gap-2 rounded-[12px] bg-[#FDE68A] hover:bg-amber-300 text-[14px] font-semibold text-[#78350F] transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#1B68FF] border-t-transparent" />
          </div>
        ) : subjects.length === 0 && !errorMsg ? (
          <div className="bg-white rounded-[32px] border border-slate-200/90 p-12 text-center shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] max-w-xl mx-auto space-y-4">
            <BookOpen className="h-12 w-12 text-[#1B68FF] mx-auto" />
            <h2 className="text-[22px] font-semibold text-[#0A0D14]">Mata Pelajaran Belum Tersedia</h2>
            <p className="text-[16px] text-[#1E293B] leading-[1.55]">
              Data kurikulum belum dimuat dari server. Silakan hubungi tim pengajar atau muat ulang halaman.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {subjects.map((sub, idx) => {
              const subjectId = sub.id || sub.subjectId || idx + 1;
              const totalMaterials = sub.totalMaterials ?? sub.total_materials ?? 0;
              const totalSub = sub.totalSubmaterials ?? sub.total_submaterials ?? 0;
              const masteredSub = sub.masteredSubmaterials ?? sub.mastered_submaterials ?? sub.completedSubmaterials ?? 0;
              const defaultCode = idx === 0 ? '01' : '02';
              const subjectCode = sub.code || defaultCode;

              return (
                <Interactive3DCard
                  key={String(subjectId)}
                  tourId={`tour-subject-${idx}`}
                  intensity={4}
                  className="rounded-[32px] bg-white border border-slate-200/90 p-8 sm:p-10 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] flex flex-col justify-between hover:border-[#1B68FF]/50 transition-all group"
                >
                  <div className="space-y-6">
                    {/* Top Meta Row */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[44px] sm:text-[52px] font-light tracking-[-0.05em] leading-none text-[#1B68FF] tabular-nums">
                        {subjectCode}
                      </span>
                      <span className="px-4 py-2 rounded-full text-[14px] font-semibold bg-[#EEF2FA] text-[#1454D6] border border-[#1B68FF]/20">
                        {totalMaterials > 0 ? `${totalMaterials} Materi Pokok` : 'Kurikulum Resmi'}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h2 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.03em] leading-[1.2] text-[#0A0D14] group-hover:text-[#1B68FF] transition-colors">
                        {sub.name}
                      </h2>
                      <p className="mt-3 text-[16px] sm:text-[17px] text-[#1E293B] leading-[1.55]">
                        {getSubjectDescription(subjectId, sub.name, sub.description)}
                      </p>
                    </div>

                    {/* Progress Indicator if totalSub > 0 */}
                    {totalSub > 0 && (
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center justify-between text-[15px]">
                          <span className="text-[#334155] font-medium">Ketuntasan Submateri</span>
                          <span className="font-semibold text-[#0A0D14] tabular-nums">
                            {masteredSub} dari {totalSub} Tuntas
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#1B68FF] transition-all duration-500"
                            style={{
                              width: `${Math.max(6, Math.round((masteredSub / totalSub) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Area */}
                  <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-[15px] font-medium text-[#334155]">
                      Standar Fase D (SMP/MTs)
                    </span>
                    <Link
                      href={`/curriculum/${subjectId}`}
                      className="min-h-[48px] px-7 py-3 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[16px] font-semibold transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] inline-flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <span>Masuk ke Materi</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </Interactive3DCard>
              );
            })}
          </div>
        )}
      </main>

      {/* Spotlight Tour Walkthrough */}
      <SpotlightTour
        isOpen={tourOpen}
        steps={CURRICULUM_TOUR_STEPS}
        currentStep={tourStep}
        onNext={handleNextTourStep}
        onPrev={handlePrevTourStep}
        onSkip={handleFinishTour}
      />

      <Footer />
    </div>
  );
}
