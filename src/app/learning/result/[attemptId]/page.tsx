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
  AlertCircle
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
  const levelName = result?.level_name || result?.levelName;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : errorMsg || !result ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">{errorMsg || 'Data hasil latihan tidak ditemukan.'}</p>
            <Link
              href="/curriculum"
              className="btn-tactile-primary inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white"
            >
              Kembali ke Kurikulum
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Result Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center space-y-4">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border ${
                  isPassed
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                    : 'border-amber-200 bg-amber-50 text-amber-600'
                }`}
              >
                {isPassed ? <Trophy className="h-8 w-8" /> : <RotateCcw className="h-8 w-8" />}
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {levelName || 'Hasil Evaluasi Formatif Latihan'}
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
                  Skor Anda: {score}%
                </h1>

                <div className="mt-2.5">
                  {isPassed ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> TUNTAS (LULUS LEVEL)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-bold text-amber-800">
                      <RotateCcw className="h-3.5 w-3.5" /> PERLU PENGUATAN REMEDIAL
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  {isPassed
                    ? 'Pemahaman Anda pada level kognitif ini sangat solid. Level berikutnya siap untuk dieksplorasi.'
                    : 'Ambang kelulusan KKM adalah 90% (minimal 9 benar). Silakan pelajari pembahasan dan ikuti sesi remedial penguatan.'}
                </p>

                {isPassed && xp > 0 && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-900">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>+{xp} XP Ditambahkan ke Akun!</span>
                  </div>
                )}
              </div>

              {/* Answer Breakdown (Safe-to-fail: Warm Amber instead of red) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-around text-center text-xs">
                <div>
                  <p className="text-slate-500 font-medium">Benar</p>
                  <p className="text-lg font-bold text-emerald-700 mt-0.5 flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> {formattedCorrect} / {total}
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="text-slate-500 font-medium">Perlu Penguatan</p>
                  <p className="text-lg font-bold text-amber-800 mt-0.5 flex items-center justify-center gap-1">
                    <RotateCcw className="h-4 w-4" /> {total - Number(formattedCorrect)}
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="text-slate-500 font-medium">Target KKM</p>
                  <p className="text-lg font-bold text-blue-600 mt-0.5">90%</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
                <Link
                  href={`/learning/review/${attemptId}`}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-slate-500" />
                  <span>Lihat Pembahasan 10 Soal</span>
                </Link>

                <Link
                  href="/curriculum/1"
                  className="btn-tactile-primary flex-1 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white shadow-xs"
                >
                  <span>Lanjut ke Kurikulum</span>
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
