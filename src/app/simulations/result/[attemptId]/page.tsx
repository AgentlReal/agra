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
  XCircle, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck 
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

  const score = result?.totalScore ?? result?.score ?? 0;
  const isPassed = Boolean(result?.isPassed);
  const correct = result?.correctAnswers ?? 0;
  const total = result?.totalQuestions ?? 30;
  const earnedXp = result?.earnedXp ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : errorMsg || !result ? (
          <div className="rounded-3xl border border-rose-500/30 bg-slate-900/80 p-8 text-center space-y-4">
            <p className="text-sm font-semibold text-rose-400">{errorMsg || 'Data hasil simulasi tidak ditemukan.'}</p>
            <Link
              href="/dashboard"
              className="inline-block rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
            >
              Kembali ke Dasbor
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Result Card */}
            <div
              className={`rounded-3xl border p-8 text-center backdrop-blur-xl ${
                isPassed
                  ? 'border-purple-500/40 bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-950 shadow-2xl'
                  : 'border-amber-500/40 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 shadow-2xl'
              }`}
            >
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl mb-4 border ${
                  isPassed
                    ? 'border-purple-500/40 bg-purple-500/20 text-purple-400'
                    : 'border-amber-500/40 bg-amber-500/20 text-amber-400'
                }`}
              >
                {isPassed ? <Trophy className="h-8 w-8" /> : <RotateCcw className="h-8 w-8" />}
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Kartu Hasil Capstone Simulasi TKA
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Skor Akhir: {Math.round(score)}%
              </h1>

              <div className="mt-3">
                {isPassed ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> LULUS SIMULASI STANDAR
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-bold text-amber-400">
                    <RotateCcw className="h-3.5 w-3.5" /> REKOMENDASI PENGUATAN MATERI
                  </span>
                )}
              </div>

              <p className="mt-4 text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {result?.feedback || 'Anda telah menyelesaikan seluruh 30 butir soal simulasi dengan baik.'}
              </p>

              {isPassed && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
                  <Sparkles className="h-4 w-4" />
                  <span>+{earnedXp} XP Didapatkan!</span>
                </div>
              )}
            </div>

            {/* Answer Summary Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex items-center justify-around text-center text-xs">
              <div>
                <p className="text-slate-400">Jawaban Benar</p>
                <p className="text-xl font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> {correct} / {total}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-slate-400">Jawaban Salah</p>
                <p className="text-xl font-bold text-rose-400 mt-1 flex items-center justify-center gap-1">
                  <XCircle className="h-4 w-4" /> {total - correct}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-slate-400">Target Kelulusan</p>
                <p className="text-xl font-bold text-purple-400 mt-1">80%</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/simulations/review/${attemptId}`}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800"
              >
                <BookOpen className="h-4 w-4" />
                <span>Lihat Pembahasan 30 Soal</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-xs font-semibold text-white shadow-lg hover:opacity-95"
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
