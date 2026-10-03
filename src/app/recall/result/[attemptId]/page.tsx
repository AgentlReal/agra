'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function RecallResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.recall
      .getResult(attemptId)
      .then((res: any) => {
        const data = res?.data || res;
        setResult(data);
      })
      .catch((err: any) => {
        console.error('Failed to load recall result:', err);
        setErrorMsg(err.message || 'Gagal memuat hasil asesmen Recall dari server.');
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  const isPassed = Boolean(result?.isPassed ?? result?.is_passed);
  const totalQuestions = result?.totalQuestions ?? result?.total_questions ?? 30;
  const totalCorrect = result?.totalCorrect ?? result?.total_correct ?? (result?.score ? Math.round((result.score / 100) * totalQuestions) : 0);
  const formattedCorrect = Number.isInteger(Number(totalCorrect)) ? totalCorrect : Number(totalCorrect).toFixed(1);
  const wrongCount = totalQuestions - totalCorrect;
  const formattedWrong = Number.isInteger(Number(wrongCount)) ? wrongCount : Number(wrongCount).toFixed(1);
  const score = result?.score ?? (totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0);
  const earnedXp = result?.earnedXp ?? result?.xpEarned ?? result?.xp_earned ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : errorMsg || !result ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">{errorMsg || 'Data hasil tidak ditemukan.'}</p>
            <Link
              href="/recall"
              className="btn-tactile-primary inline-block px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              Kembali ke Halaman Recall
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Result Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center space-y-4">
              {/* Badge Icon */}
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border ${
                  isPassed
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                    : 'border-amber-200 bg-amber-50 text-amber-600'
                }`}
              >
                {isPassed ? <Trophy className="h-10 w-10" /> : <RotateCcw className="h-10 w-10" />}
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2 border">
                  {isPassed ? (
                    <span className="text-emerald-700 bg-emerald-50 border-emerald-200">🎉 Pretest Tuntas</span>
                  ) : (
                    <span className="text-amber-800 bg-amber-50 border-amber-200">⚡ Perlu Penguatan Konsep</span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Skor Evaluasi: {Math.round(score)}%
                </h1>

                <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {isPassed
                    ? 'Luar biasa! Kamu telah melampaui kriteria ketuntasan pretest dan siap menjelajahi kurikulum adaptif Fase D.'
                    : 'Ayo coba lagi tanpa cemas. Ulasan dan materi latihan akan membantumu memahami materi yang belum dikuasai.'}
                </p>
              </div>

              {/* XP Formative Award Chip */}
              {earnedXp > 0 && (
                <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-2 text-sm font-bold text-amber-900">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>+{earnedXp} XP Formatif Berhasil Didapatkan!</span>
                </div>
              )}

              {/* Stats Summary Grid (Safe-to-fail: Warm Amber instead of red) */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 max-w-lg mx-auto">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Soal</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{totalQuestions}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-center">
                  <p className="text-[11px] font-semibold text-emerald-700 uppercase">Jawaban Tepat</p>
                  <p className="text-lg font-bold text-emerald-800 mt-0.5">{formattedCorrect}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-center">
                  <p className="text-[11px] font-semibold text-amber-800 uppercase">Perlu Ditinjau</p>
                  <p className="text-lg font-bold text-amber-900 mt-0.5">{formattedWrong}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/recall/review/${attemptId}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <HelpCircle className="h-4 w-4 text-slate-500" />
                  <span>Lihat Pembahasan Lengkap</span>
                </Link>

                {isPassed ? (
                  <Link
                    href="/curriculum"
                    className="btn-tactile-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold text-white shadow-xs"
                  >
                    <span>Lanjut ke Kurikulum Inti</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    href="/recall"
                    className="btn-tactile-amber w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold text-white shadow-xs"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Coba Lagi (Penguatan)</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
