'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { SpotlightTour, TourStep } from '@/components/common/SpotlightTour';

interface SubmaterialItem {
  id?: number | string;
  submaterialId?: number | string;
  sub_material_id?: number | string;
  title?: string;
  name?: string;
  status?: string;
  progressState?: string;
  isMastered?: boolean;
  is_mastered?: boolean;
}

interface MaterialItem {
  id?: number | string;
  materialId?: number | string;
  title?: string;
  name?: string;
  submaterials?: SubmaterialItem[];
  sub_materials?: SubmaterialItem[];
}

interface SubjectDetail {
  id?: number | string;
  subjectId?: number | string;
  name?: string;
  code?: string;
  description?: string;
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
    'Pelajari setiap materi pokok secara runtut dan tuntaskan seluruh latihan level kognitif untuk membuka asesmen simulasi.'
  );
}

const SUBJECT_TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-subject-hero',
    title: 'ringkasan mata pelajaran & progres',
    description:
      'Pantau total submateri yang sudah kamu tuntaskan pada mata pelajaran ini. Menuntaskan seluruh submateri akan otomatis membuka akses Simulasi Ujian CBT.',
  },
  {
    targetId: 'tour-material-card-0',
    title: 'kelompok materi pokok',
    description:
      'Kurikulum diorganisasikan ke dalam beberapa materi pokok. Setiap kartu materi memuat submateri-submateri esensial yang saling berkesinambungan.',
  },
  {
    targetId: 'tour-submaterial-item-0',
    title: 'kartu submateri & status belajar',
    description:
      'Klik pada submateri untuk melihat pohon 3 level kognitif latihan. Perhatikan status (Belum Dimulai, Sedang Belajar, atau Tuntas) untuk memantau ritme belajarmu.',
  },
];

export default function SubjectCurriculumPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const router = useRouter();
  const { user, role, isLoading: authLoading } = useAuth();
  const { subjectId } = use(params);
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
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
      loadData();
    }
  }, [authLoading, user?.id, role, subjectId]);

  const loadData = () => {
    setLoading(true);
    setErrorMsg('');

    Promise.all([
      api.curriculum.getSubjects().catch(() => []),
      api.curriculum.getSubjectCurriculum(subjectId),
    ])
      .then(([subjectsRes, curriculumRes]: [unknown, unknown]) => {
        const subListRes = subjectsRes as { data?: SubjectDetail[] } | SubjectDetail[];
        const subList = Array.isArray(subListRes) ? subListRes : subListRes?.data || [];
        const currentSub = subList.find(
          (s: SubjectDetail) => String(s.id || s.subjectId) === String(subjectId)
        );

        if (currentSub) {
          setSubject(currentSub);
        } else {
          setSubject({
            name: subjectId === '1' ? 'Matematika SMP' : 'Bahasa Indonesia SMP',
            code: subjectId === '1' ? '01' : '02',
            description: 'Kurikulum Resmi Fase D (SMP/MTs)',
          });
        }

        const matsRes = curriculumRes as { data?: MaterialItem[] } | MaterialItem[];
        const mats = Array.isArray(matsRes) ? matsRes : matsRes?.data || [];
        setMaterials(mats);
      })
      .catch((err: unknown) => {
        console.error('Failed to load curriculum:', err);
        const error = err as { status?: number; message?: string };
        if (error.status === 401) {
          router.replace('/login');
          return;
        }
        if (error.status === 403) {
          router.replace('/admin/dashboard');
          return;
        }
        setErrorMsg(error.message || 'Gagal memuat kurikulum materi dari server.');
      })
      .finally(() => setLoading(false));
  };

  const userId = user?.id;

  // Otomatis tampilkan Spotlight Tour untuk kunjungan pertama (Opsi A)
  useEffect(() => {
    if (loading || !userId || role !== 'SISWA' || materials.length === 0) return;
    const storageKey = `agra_subject_tour_done_${userId}`;
    const hasSeenTour = localStorage.getItem(storageKey);

    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setTourStep(0);
        setTourOpen(true);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [loading, userId, role, materials.length]);

  const handleFinishTour = useCallback(() => {
    if (userId) {
      localStorage.setItem(`agra_subject_tour_done_${userId}`, '1');
    }
    setTourOpen(false);
  }, [userId]);

  const handleNextTourStep = useCallback(() => {
    if (tourStep < SUBJECT_TOUR_STEPS.length - 1) {
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

  const allSubmaterials = materials.flatMap(
    (m) => m.submaterials || m.sub_materials || []
  );
  const totalSub = allSubmaterials.length;
  const masteredSub = allSubmaterials.filter(
    (s) => s.status === 'MASTERED' || Boolean(s.isMastered ?? s.is_mastered)
  ).length;

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
            <span>Kembali ke Daftar Mapel</span>
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
              onClick={loadData}
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
            {/* Subject Hero Card */}
            <div
              data-tour-id="tour-subject-hero"
              className="rounded-[32px] bg-white border border-slate-200/90 p-8 sm:p-10 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-[10px] bg-[#EEF2FA] text-[#1454D6] text-[14px] font-semibold border border-[#1B68FF]/20">
                    Fase D (SMP/MTs)
                  </span>
                  <span className="text-[15px] text-[#334155] font-medium">
                    {materials.length} Materi Pokok
                  </span>
                </div>
                <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.035em] text-[#0A0D14] leading-[1.1]">
                  {subject?.name}
                </h1>
                <p className="text-[16px] sm:text-[17px] text-[#1E293B] leading-[1.55] max-w-2xl">
                  {getSubjectDescription(subjectId, subject?.name, subject?.description)}
                </p>
              </div>

              {totalSub > 0 && (
                <div className="sm:text-right shrink-0 p-5 rounded-[20px] bg-[#EEF2FA] border border-[#1B68FF]/20 space-y-1">
                  <span className="block text-[32px] sm:text-[38px] font-semibold tracking-[-0.04em] leading-none text-[#1B68FF] tabular-nums">
                    {masteredSub}/{totalSub}
                  </span>
                  <span className="block text-[14px] font-medium text-[#1E293B]">
                    Submateri Tuntas
                  </span>
                </div>
              )}
            </div>

            {/* Materials & Submaterials List */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.03em] text-[#0A0D14]">
                  Daftar Materi Pokok &amp; Submateri
                </h2>
              </div>

              {materials.length === 0 ? (
                <div className="bg-white rounded-[32px] border border-slate-200/90 p-12 text-center shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] max-w-xl mx-auto space-y-4">
                  <BookOpen className="h-12 w-12 text-[#1B68FF] mx-auto" />
                  <h3 className="text-[22px] font-semibold text-[#0A0D14]">Belum Ada Materi Pokok</h3>
                  <p className="text-[16px] text-[#1E293B] leading-[1.55]">
                    Materi pokok untuk mata pelajaran ini belum tersedia di server.
                  </p>
                </div>
              ) : (
                materials.map((mat, mIdx) => {
                  const matId = mat.materialId || mat.id || `mat-${mIdx}`;
                  const matTitle = mat.title || mat.name || `Materi Pokok ${mIdx + 1}`;
                  const submaterials = mat.submaterials || mat.sub_materials || [];

                  return (
                    <div
                      key={String(matId)}
                      data-tour-id={mIdx === 0 ? 'tour-material-card-0' : undefined}
                      className="rounded-[32px] bg-white border border-slate-200/90 p-7 sm:p-9 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] space-y-6"
                    >
                      {/* Material Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-[10px] bg-[#EEF2FA] text-[#1454D6] font-semibold text-[16px] flex items-center justify-center shrink-0 tabular-nums">
                            {mIdx + 1}
                          </span>
                          <h3 className="text-[22px] sm:text-[24px] font-semibold text-[#0A0D14] tracking-[-0.025em]">
                            {matTitle}
                          </h3>
                        </div>
                        <span className="px-3.5 py-1 rounded-full bg-slate-100 text-[14px] font-medium text-[#334155]">
                          {submaterials.length} Submateri
                        </span>
                      </div>

                      {/* Submaterials Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        {submaterials.map((sub, sIdx) => {
                          const subId = sub.submaterialId || sub.id || sub.sub_material_id;
                          const subTitle = sub.title || sub.name || `Submateri ${sIdx + 1}`;
                          const isMastered =
                            sub.status === 'MASTERED' || Boolean(sub.isMastered ?? sub.is_mastered);
                          const progressState =
                            sub.status ||
                            sub.progressState ||
                            (isMastered ? 'MASTERED' : 'IN_PROGRESS');

                          return (
                            <Link
                              key={String(subId || `sub-${sIdx}`)}
                              data-tour-id={
                                mIdx === 0 && sIdx === 0
                                  ? 'tour-submaterial-item-0'
                                  : undefined
                              }
                              href={`/submaterials/${subId}`}
                              className="group p-5 sm:p-6 rounded-[20px] bg-[#F8FAFC] border-2 border-slate-200 hover:border-[#1B68FF] hover:bg-white transition-all shadow-[0_4px_12px_rgba(15,23,42,0.03)] flex items-center justify-between gap-4 cursor-pointer"
                            >
                              <div className="min-w-0 flex-1 space-y-2">
                                <h4 className="text-[17px] sm:text-[18px] font-semibold text-[#0A0D14] group-hover:text-[#1B68FF] transition-colors leading-[1.3]">
                                  {subTitle}
                                </h4>
                                <div className="flex items-center gap-2">
                                  {isMastered ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold bg-[#ECFDF5] text-[#065F46] border border-[#059669]/30">
                                      <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                                      <span>Tuntas</span>
                                    </span>
                                  ) : progressState === 'IN_PROGRESS' ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold bg-[#EEF2FA] text-[#1454D6] border border-[#1B68FF]/30">
                                      <Clock className="h-4 w-4 text-[#1B68FF]" />
                                      <span>Sedang Belajar</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[13px] font-semibold bg-slate-100 text-[#334155]">
                                      <span>Belum Dimulai</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="w-10 h-10 rounded-[12px] bg-white border border-slate-200 group-hover:border-[#1B68FF] group-hover:bg-[#1B68FF] group-hover:text-white text-[#0A0D14] flex items-center justify-center shrink-0 transition-all">
                                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </main>

      {/* Spotlight Tour Walkthrough */}
      <SpotlightTour
        isOpen={tourOpen}
        steps={SUBJECT_TOUR_STEPS}
        currentStep={tourStep}
        onNext={handleNextTourStep}
        onPrev={handlePrevTourStep}
        onSkip={handleFinishTour}
      />

      <Footer />
    </div>
  );
}
