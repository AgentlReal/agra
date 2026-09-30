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
  GraduationCap 
} from 'lucide-react';

export default function SubjectCurriculumPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.curriculum
      .getSubjectCurriculum(subjectId)
      .then((res: any) => {
        setData(res);
      })
      .catch(() => {
        setData(getFallbackCurriculum(subjectId));
      })
      .finally(() => setLoading(false));
  }, [subjectId]);

  const getFallbackCurriculum = (id: string) => {
    const isMath = id === '1';
    return {
      subject: {
        id,
        name: isMath ? 'Matematika SMP' : 'Bahasa Indonesia SMP',
        code: isMath ? 'MAT' : 'BIN',
        description: isMath
          ? 'Kurikulum Fase D mencakup Bilangan, Aljabar, Geometri & Pengukuran, serta Analisis Data.'
          : 'Kurikulum Fase D mencakup Literasi Teks Informasi, Teks Fiksi, Pemahaman Inferensial, dan Evaluasi.',
      },
      materials: isMath
        ? [
            {
              id: 101,
              title: 'Materi Pokok 1: Bilangan',
              submaterials: [
                { id: 1, title: 'Operasi Bilangan Bulat & Pecahan', status: 'COMPLETED', progress: 100 },
                { id: 2, title: 'Bilangan Berpangkat & Bentuk Akar', status: 'COMPLETED', progress: 100 },
                { id: 3, title: 'Aritmetika Sosial & Perbandingan', status: 'IN_PROGRESS', progress: 66 },
              ],
            },
            {
              id: 102,
              title: 'Materi Pokok 2: Aljabar',
              submaterials: [
                { id: 4, title: 'Bentuk Aljabar & Operasinya', status: 'IN_PROGRESS', progress: 33 },
                { id: 5, title: 'Persamaan & Pertidaksamaan Linier Satu Variabel (PLSV)', status: 'NOT_STARTED', progress: 0 },
                { id: 6, title: 'Relasi dan Fungsi', status: 'NOT_STARTED', progress: 0 },
                { id: 7, title: 'Barisan dan Deret Bilangan', status: 'NOT_STARTED', progress: 0 },
              ],
            },
            {
              id: 103,
              title: 'Materi Pokok 3: Geometri dan Pengukuran',
              submaterials: [
                { id: 8, title: 'Teorema Pythagoras & Segitiga', status: 'NOT_STARTED', progress: 0 },
                { id: 9, title: 'Bangun Datar Segiempat & Lingkaran', status: 'NOT_STARTED', progress: 0 },
                { id: 10, title: 'Bangun Ruang Sisi Datar & Lengkung', status: 'NOT_STARTED', progress: 0 },
              ],
            },
            {
              id: 104,
              title: 'Materi Pokok 4: Analisis Data dan Peluang',
              submaterials: [
                { id: 11, title: 'Penyajian & Ukuran Pemusatan Data (Mean, Median, Modus)', status: 'NOT_STARTED', progress: 0 },
                { id: 12, title: 'Peluang Teoretik & Empirik', status: 'NOT_STARTED', progress: 0 },
              ],
            },
          ]
        : [
            {
              id: 201,
              title: 'Materi Pokok 1: Pemahaman Tekstual',
              submaterials: [
                { id: 13, title: 'Identifikasi Fakta dan Informasi Tersurat', status: 'COMPLETED', progress: 100 },
                { id: 14, title: 'Struktur Teks Deskripsi & Laporan Observasi', status: 'COMPLETED', progress: 100 },
              ],
            },
            {
              id: 202,
              title: 'Materi Pokok 2: Pemahaman Inferensial',
              submaterials: [
                { id: 15, title: 'Menyimpulkan Gagasan Utama dan Amanat Teks', status: 'COMPLETED', progress: 100 },
                { id: 16, title: 'Menyimpulkan Hubungan Sebab-Akibat', status: 'IN_PROGRESS', progress: 66 },
              ],
            },
            {
              id: 203,
              title: 'Materi Pokok 3: Evaluasi dan Apresiasi Teks',
              submaterials: [
                { id: 17, title: 'Menilai Akurasi Fakta & Opini', status: 'NOT_STARTED', progress: 0 },
                { id: 18, title: 'Merefleksi Isi Teks Fiksi & Nonfiksi', status: 'NOT_STARTED', progress: 0 },
              ],
            },
          ],
    };
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        <Link
          href="/curriculum"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Mata Pelajaran
        </Link>

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
                  {data?.subject?.code || 'TKA'}
                </span>
                <span className="text-xs text-slate-400">Kurikulum Fase D SMP/MTs</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {data?.subject?.name || 'Mata Pelajaran'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {data?.subject?.description}
              </p>
            </div>

            {/* Materials & Submaterials Tree */}
            <div className="space-y-6">
              {(data?.materials || []).map((mat: any, mIdx: number) => (
                <div key={mat.id || mIdx} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600/20 text-xs font-bold text-indigo-400">
                      {mIdx + 1}
                    </span>
                    {mat.title}
                  </h3>

                  <div className="space-y-3">
                    {(mat.submaterials || []).map((subm: any) => {
                      const isComplete = subm.status === 'COMPLETED' || subm.progress === 100;
                      const isInProgress = subm.status === 'IN_PROGRESS' || (subm.progress > 0 && subm.progress < 100);

                      return (
                        <Link
                          key={subm.id}
                          href={`/submaterials/${subm.id}`}
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
                            {isComplete && (
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Tuntas
                              </span>
                            )}
                            {isInProgress && (
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2.5 py-0.5">
                                <Clock className="h-3.5 w-3.5" /> {subm.progress}% Berjalan
                              </span>
                            )}
                            {!isComplete && !isInProgress && (
                              <span className="text-[11px] font-semibold text-slate-500 bg-slate-800/40 rounded-full px-2.5 py-0.5">
                                Belum Dimulai
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
