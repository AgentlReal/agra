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
  RefreshCw
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
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        <Link
          href="/curriculum"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Mata Pelajaran
        </Link>

        {errorMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Subject Banner */}
            <div className="rounded-3xl border border-indigo-900/50 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2">
                <span className="rounded-lg bg-indigo-600/30 px-2.5 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/30">
                  {subject?.code || 'TKA'}
                </span>
                <span className="text-xs text-slate-400">Kurikulum Fase D SMP/MTs</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {subject?.name || 'Mata Pelajaran'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {subject?.description || 'Pelajari materi pokok dan drill 3 level kognitif secara terstruktur.'}
              </p>
            </div>

            {/* Materials & Submaterials Tree */}
            {materials.length === 0 && !errorMsg ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">
                <BookOpen className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">Belum Ada Materi Pokok</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Materi pokok untuk mata pelajaran ini belum terdaftar di kurikulum.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {materials.map((mat: any, mIdx: number) => (
                  <div key={mat.materialId || mat.id || mIdx} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600/20 text-xs font-bold text-indigo-400">
                        {mIdx + 1}
                      </span>
                      {mat.title}
                    </h3>

                    <div className="space-y-3">
                      {(mat.submaterials || []).map((subm: any) => {
                        const subId = subm.submaterialId || subm.id;
                        const isMastered = subm.status === 'MASTERED' || subm.status === 'COMPLETED';
                        const isInProgress = subm.status === 'IN_PROGRESS';
                        const isLocked = subm.status === 'LOCKED';

                        return (
                          <Link
                            key={subId}
                            href={`/submaterials/${subId}`}
                            className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-slate-400 group-hover:text-indigo-400 transition-colors">
                                <Layers className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                  {subm.title}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  3 Level Kognitif (Pemahaman • Penerapan • Penalaran)
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {isMastered && (
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Tuntas
                                </span>
                              )}
                              {isInProgress && (
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2.5 py-0.5">
                                  <Clock className="h-3.5 w-3.5" /> Berjalan
                                </span>
                              )}
                              {isLocked && (
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-800/40 rounded-full px-2.5 py-0.5">
                                  <Lock className="h-3 w-3" /> Terkunci
                                </span>
                              )}
                              {!isMastered && !isInProgress && !isLocked && (
                                <span className="text-[11px] font-semibold text-slate-500 bg-slate-800/40 rounded-full px-2.5 py-0.5">
                                  Tersedia
                                </span>
                              )}
                              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
