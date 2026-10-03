'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen,
  AlertCircle,
  ArrowLeft,
  FileText,
  Layers,
  ShieldCheck
} from 'lucide-react';

export default function LearningResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.learning
      .getResult(attemptId)
      .then((res: any) => {
        const data = res?.data || res;
        setResult(data);
      })
      .catch((err: any) => {
        console.error('Failed to load learning result:', err);
        setErrorMsg(err.message || 'Gagal memuat hasil latihan dari server.');
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  const score = result?.score ?? 0;
  const isPassed = Boolean(result?.isPassed ?? result?.is_passed);
  const correct = result?.correctAnswers ?? result?.correct_answers ?? 0;
  const formattedCorrect = Number.isInteger(correct) ? correct : Number(correct).toFixed(1);
  const total = result?.totalQuestions ?? result?.total_questions ?? 10;
  const xp = result?.earnedXp ?? result?.xpEarned ?? result?.xp_earned ?? 0;
  const levelName = result?.level_name || result?.levelName || 'Latihan Level Kognitif';

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-800 font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
              Dasbor
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/curriculum" className="hover:text-blue-600 transition-colors">
              Kurikulum
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold">Hasil Latihan</span>
          </nav>

          <Link
            href="/curriculum"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Kurikulum</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : errorMsg || !result ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">{errorMsg || 'Data hasil latihan tidak ditemukan.'}</p>
            <Link
              href="/curriculum"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Kembali ke Kurikulum
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Status Banner */}
            {isPassed ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-6 sm:p-8 shadow-xs space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>LEVEL TUNTAS</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Hebat! Kamu Berhasil Menuntaskan {levelName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  Pemahaman kognitif Anda pada level ini telah terverifikasi. Level berikutnya atau simulasi kini telah siap dibuka! {xp > 0 ? `(Poin XP: +${xp} XP)` : ''}
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 sm:p-8 shadow-xs space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-200 px-3.5 py-1 text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-amber-600" />
                  <span>PERLU PENGUATAN REMEDIAL</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Perlu Sedikit Penguatan untuk {levelName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  Jangan berkecil hati! Pelajari butir latihan yang keliru pada halaman pembahasan, lalu ulangi latihan agar penguasaan konsep Anda semakin matang secara aman (<strong className="text-slate-800 font-semibold">Safe-to-Fail</strong>).
                </p>
              </div>
            )}

            {/* Score & Metrics Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Nilai Penguasaan Level
                  </p>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                    {Math.round(score)}%
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {formattedCorrect} dari {total} Butir Soal Latihan Dijawab Benar
                  </p>
                </div>

                {xp > 0 && (
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs font-bold text-amber-900 shadow-2xs">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>+{xp} XP Formatif</span>
                  </div>
                )}
              </div>

              {/* Metrics Columns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-center">
                  <p className="text-[11px] font-semibold text-slate-500">Total Soal</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">{total}</p>
                </div>

                <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-center">
                  <p className="text-[11px] font-semibold text-emerald-700">Tepat</p>
                  <p className="text-xl font-extrabold text-emerald-800 mt-1">{formattedCorrect}</p>
                </div>

                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 text-center">
                  <p className="text-[11px] font-semibold text-amber-700">Perlu Ditinjau</p>
                  <p className="text-xl font-extrabold text-amber-800 mt-1">{total - correct}</p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-center">
                  <p className="text-[11px] font-semibold text-slate-500">Ambang Kelulusan</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">70%</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href={`/learning/review/${attemptId}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 text-xs font-bold transition-all shadow-2xs"
                >
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>Pelajari Pembahasan Soal &amp; Kunci</span>
                </Link>

                <Link
                  href="/curriculum"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 text-xs font-bold shadow-xs transition-colors"
                >
                  <span>Lanjutkan ke Kurikulum</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
