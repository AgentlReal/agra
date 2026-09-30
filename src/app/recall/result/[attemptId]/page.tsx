'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  GraduationCap 
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

  const isPassed = Boolean(result?.isPassed);
  const score = result?.score ?? result?.totalScore ?? 0;
  const totalCorrect = result?.totalCorrect ?? Math.round((score / 100) * 30);
  const totalQuestions = result?.totalQuestions ?? 30;
  const earnedXp = result?.earnedXp ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : errorMsg || !result ? (
          <div className="rounded-3xl border border-rose-500/30 bg-slate-900/80 p-8 text-center space-y-4">
            <p className="text-sm font-semibold text-rose-400">{errorMsg || 'Data hasil tidak ditemukan.'}</p>
            <Link
              href="/recall"
              className="inline-block rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Kembali ke Halaman Recall
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Result Header Card */}
            <div
              className={`rounded-3xl border p-8 sm:p-10 text-center backdrop-blur-xl relative overflow-hidden ${
                isPassed
                  ? 'border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 shadow-2xl shadow-emerald-950/30'
                  : 'border-amber-500/30 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 shadow-2xl shadow-amber-950/30'
              }`}
            >
              {/* Badge Icon */}
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl mb-4 border ${
                  isPassed
                    ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                    : 'border-amber-500/40 bg-amber-500/20 text-amber-400'
                }`}
              >
                {isPassed ? <Trophy className="h-10 w-10" /> : <RotateCcw className="h-10 w-10" />}
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2 border">
                {isPassed ? (
                  <span className="text-emerald-400">🎉 Tuntas (Mastery Lulus)</span>
                ) : (
                  <span className="text-amber-400">⚡ Perlu Penguatan Remedial</span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Skor Evaluasi: {Math.round(score)}%
              </h1>

              <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                {isPassed
                  ? 'Luar biasa! Anda berhasil menguasai materi prasyarat SD dan gerbang kurikulum SMP kini telah terbuka sepenuhnya.'
                  : 'Jangan berkecil hati. Anda dapat mempelajari pembahasan detail dan mengulang sesi remedial sampai mencapai ambang kelulusan 80%.'}
              </p>

              {/* XP Award Pill */}
              {isPassed && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
                  <Sparkles className="h-4 w-4" />
                  <span>+{earnedXp} XP Didapatkan!</span>
                </div>
              )}
            </div>

            {/* Score Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">Matematika SD</span>
                  <span className="text-xs font-mono font-bold text-indigo-400">15 Butir</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    {Math.round(result?.mathScore ?? score)}%
                  </span>
                  <span className="text-xs text-slate-400">Tingkat Ketuntasan</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">Bahasa Indonesia SD</span>
                  <span className="text-xs font-mono font-bold text-cyan-400">15 Butir</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    {Math.round(result?.indonesianScore ?? score)}%
                  </span>
                  <span className="text-xs text-slate-400">Tingkat Ketuntasan</span>
                </div>
              </div>
            </div>

            {/* Answer Summary Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex items-center justify-around text-center">
              <div>
                <p className="text-xs text-slate-400">Jumlah Benar</p>
                <p className="text-xl font-bold text-emerald-400 flex items-center justify-center gap-1 mt-1">
                  <CheckCircle2 className="h-5 w-5" /> {totalCorrect}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-xs text-slate-400">Jumlah Salah</p>
                <p className="text-xl font-bold text-rose-400 flex items-center justify-center gap-1 mt-1">
                  <XCircle className="h-5 w-5" /> {totalQuestions - totalCorrect}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-xs text-slate-400">Ambang Kelulusan</p>
                <p className="text-xl font-bold text-indigo-400 mt-1">80%</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/recall/review/${attemptId}`}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Lihat Pembahasan Lengkap</span>
              </Link>

              {isPassed ? (
                <Link
                  href="/dashboard"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:opacity-95 transition-opacity"
                >
                  <span>Lanjut ke Dasbor Belajar</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/recall"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-amber-600/20 hover:opacity-95 transition-opacity"
                >
                  <span>Mulai Remedial Recall</span>
                  <RotateCcw className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
