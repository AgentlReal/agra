'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  BookOpen, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Layers, 
  Lock,
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function SubjectCurriculumPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const [subject, setSubject] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    setErrorMsg('');

    Promise.all([
      api.curriculum.getSubjects().catch(() => []),
      api.curriculum.getSubjectCurriculum(subjectId),
    ])
      .then(([subjectsRes, curriculumRes]: [any, any]) => {
        const subList = Array.isArray(subjectsRes) ? subjectsRes : subjectsRes.data || [];
        const currentSub = subList.find(
          (s: any) => String(s.id || s.subjectId) === String(subjectId)
        );
        if (currentSub) {
          setSubject(currentSub);
        } else {
          setSubject({
            name: subjectId === '1' ? 'Matematika SMP' : 'Bahasa Indonesia SMP',
            code: subjectId === '1' ? 'MAT' : 'BIN',
            description: 'Kurikulum Resmi Fase D (SMP/MTs)',
          });
        }

        const mats = Array.isArray(curriculumRes) ? curriculumRes : curriculumRes.data || [];
        setMaterials(mats);
      })
      .catch((err: any) => {
        console.error('Failed to load curriculum:', err);
        setErrorMsg(err.message || 'Gagal memuat kurikulum materi dari server.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [subjectId]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        <Link
          href="/curriculum"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Mata Pelajaran
        </Link>

        {errorMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 px-3.5 py-1.5 text-xs font-bold text-amber-900 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Subject Banner */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-extrabold text-sm border border-blue-100">
                  {subject?.code || 'TKA'}
                </span>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full">
                  Fase D (SMP/MTs)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {subject?.name}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                {subject?.description || 'Pelajari materi pokok dan kuasai 3 level kognitif latihan secara adaptif.'}
              </p>
            </div>

            {/* Materials List */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Daftar Materi Pokok & Submateri</h2>

              {materials.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xs">
                  <p className="text-xs text-slate-500">Materi pokok untuk mata pelajaran ini belum tersedia.</p>
                </div>
              ) : (
                materials.map((mat: any, mIdx: number) => {
                  const submaterials = mat.submaterials || mat.sub_materials || [];
                  return (
                    <div
                      key={mat.id || `mat-${mIdx}`}
                      className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-7 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 text-xs font-bold">
                            {mIdx + 1}
                          </span>
                          <h3 className="text-base font-bold text-slate-900">{mat.name || mat.title}</h3>
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {submaterials.length} Submateri
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {submaterials.map((sub: any, sIdx: number) => {
                          const isMastered = Boolean(sub.isMastered ?? sub.is_mastered);
                          const progressState = sub.progressState || (isMastered ? 'MASTERED' : 'IN_PROGRESS');

                          return (
                            <Link
                              key={sub.id || `sub-${sIdx}`}
                              href={`/submaterials/${sub.id}`}
                              className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 transition-all shadow-2xs"
                            >
                              <div className="min-w-0 pr-3">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                                  {sub.name || sub.title}
                                </h4>
                                <div className="mt-1 flex items-center gap-2">
                                  {isMastered ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                      <CheckCircle2 className="h-3 w-3" /> Tuntas
                                    </span>
                                  ) : progressState === 'IN_PROGRESS' ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                      <Clock className="h-3 w-3" /> Sedang Belajar
                                    </span>
                                  ) : (
                                    <span className="text-[11px] text-slate-400">Belum Dimulai</span>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
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

      <Footer />
    </div>
  );
}
