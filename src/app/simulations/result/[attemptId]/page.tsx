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

export default function SimulationResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.simulation
      .getResult(attemptId)
      .then((res: any) => {
        const data = res?.data || res;
        setResult(data);
      })
      .catch((err: any) => {
        console.error('Failed to load simulation result:', err);
        setErrorMsg(err.message || 'Gagal memuat hasil ujian simulasi dari server.');
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  const score = result?.score ?? result?.totalScore ?? 0;
  const isPassed = Boolean(result?.isPassed ?? result?.is_passed);
  const correct = result?.correctAnswers ?? result?.correct_answers ?? 0;
  const total = result?.totalQuestions ?? result?.total_questions ?? 30;
  const earnedXp = result?.earnedXp ?? result?.xpEarned ?? result?.xp_earned ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          </div>
        ) : errorMsg || !result ? (
          <div className="rounded-3xl border border-amber-200 bg-white p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">{errorMsg || 'Data hasil simulasi tidak ditemukan.'}</p>
            <Link
              href="/dashboard"
              className="inline-block btn-tactile-primary rounded-xl px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              Kembali ke Dasbor
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Result Card */}
            <div
              className={`rounded-3xl border p-8 text-center bg-white shadow-sm ${
                isPassed
                  ? 'border-purple-200 bg-gradient-to-b from-purple-50/50 to-white'
                  : 'border-amber-200 bg-gradient-to-b from-amber-50/50 to-white'
              }`}
            >
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl mb-4 border ${
                  isPassed
                    ? 'border-purple-200 bg-purple-100 text-purple-700'
                    : 'border-amber-200 bg-amber-100 text-amber-700'
                }`}
              >
                {isPassed ? <Trophy className="h-8 w-8" /> : <RotateCcw className="h-8 w-8" />}
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kartu Hasil Capstone Simulasi TKA
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
                Skor Akhir: {Math.round(score)}%
              </h1>

              <div className="mt-3">
                {isPassed ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> LULUS SIMULASI STANDAR
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-bold text-amber-700">
                    <RotateCcw className="h-3.5 w-3.5" /> REKOMENDASI PENGUATAN MATERI
                  </span>
                )}
              </div>

              <p className="mt-4 text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
                {result?.feedback || 'Anda telah menyelesaikan seluruh 30 butir soal simulasi dengan baik.'}
              </p>

              {isPassed && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-700">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>+{earnedXp} XP Didapatkan!</span>
                </div>
              )}
            </div>

            {/* Answer Summary Card (Zero Red: Warm amber for review/retry) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-around text-center text-xs">
              <div>
                <p className="text-slate-500 font-medium">Jawaban Tepat</p>
                <p className="text-xl font-bold text-emerald-700 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> {correct} / {total}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-slate-500 font-medium">Perlu Penguatan</p>
                <p className="text-xl font-bold text-amber-700 mt-1 flex items-center justify-center gap-1">
                  <RotateCcw className="h-4 w-4" /> {total - correct}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-slate-500 font-medium">Target Kelulusan</p>
                <p className="text-xl font-bold text-purple-700 mt-1">80%</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/simulations/review/${attemptId}`}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span>Lihat Pembahasan 30 Soal</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex-1 flex items-center justify-center gap-2 btn-tactile-primary rounded-xl px-5 py-3 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                <span>Kembali ke Dasbor Belajar</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
