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
  ShieldCheck,
  Target,
  BarChart3
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
  const wrongCount = total - correct;

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-800 font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
              Dasbor
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/simulations" className="hover:text-blue-600 transition-colors">
              Simulasi TKA
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold">Hasil Capstone</span>
          </nav>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Dasbor</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-xs font-semibold text-slate-500">Mengkalkulasi hasil simulasi nalar...</p>
            </div>
          </div>
        ) : errorMsg || !result ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center space-y-4 shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Kendala Memuat Hasil</h2>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">{errorMsg || 'Data hasil simulasi tidak ditemukan.'}</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Kembali ke Dasbor
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Status Banner */}
            {isPassed ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-6 sm:p-8 shadow-xs space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>PREDIKSI LULUS SIMULASI STANDAR</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Selamat! Kamu Lulus Capstone Simulasi TKA
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  Performa penalaranmu pada asesmen capstone 30 soal telah mencapai batas standar kelulusan (&ge; 80%). Kesiapanmu menghadapi Asesmen Standar Nasional Kemendikdasmen sudah sangat matang! {earnedXp > 0 ? `(Bonus: +${earnedXp} XP)` : ''}
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 sm:p-8 shadow-xs space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-200 px-3.5 py-1 text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-amber-600" />
                  <span>REKOMENDASI PENGUATAN MATERI</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Perlu Penguatan Nalar Simulasi TKA
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  Tetap semangat! Asesmen capstone dirancang untuk menguji integrasi nalar lintas topik secara aman (<strong className="text-slate-800 font-semibold">Safe-to-Fail</strong>). Pelajari pembahasan butir yang keliru di bawah ini untuk memperdalam pemahamanmu.
                </p>
              </div>
            )}

            {/* Score & Metrics Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Skor Akhir Simulasi
                  </p>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                    {Math.round(score)}%
                  </div>
                </div>

                {earnedXp > 0 && (
                  <div className="flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200/80 px-4 py-2.5 self-start sm:self-auto">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Poin Diperoleh</p>
                      <p className="text-xs font-extrabold text-slate-800">+{earnedXp} XP Belajar</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 4 Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                    <Target className="h-3.5 w-3.5" />
                    <span>Total Soal</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900">{total} Butir</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Durasi 75 Menit</p>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Jawaban Tepat</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-700">{correct} Butir</div>
                  <p className="text-[11px] text-emerald-600 mt-0.5">{Math.round((correct / total) * 100)}% Akurasi</p>
                </div>

                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold mb-1">
                    <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                    <span>Perlu Penguatan</span>
                  </div>
                  <div className="text-xl font-bold text-amber-800">{wrongCount} Butir</div>
                  <p className="text-[11px] text-amber-700 mt-0.5">Dapat ditinjau ulang</p>
                </div>

                <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold mb-1">
                    <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
                    <span>Standar TKA</span>
                  </div>
                  <div className="text-xl font-bold text-blue-700">80%</div>
                  <p className="text-[11px] text-blue-600 mt-0.5">Batas Minimal Lulus</p>
                </div>
              </div>

              {/* Feedback Note */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs leading-relaxed text-slate-600">
                <span className="font-bold text-slate-800">Catatan Evaluasi: </span>
                {result?.feedback || 'Anda telah menyelesaikan seluruh 30 butir soal simulasi dengan baik. Pelajari langkah pembahasan butir soal untuk memperdalam penalaran kritis.'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/simulations/review/${attemptId}`}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span>Lihat Pembahasan Lengkap (30 Soal)</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex-1 flex items-center justify-center gap-2 btn-tactile-primary rounded-2xl px-5 py-3.5 text-xs font-bold text-white shadow-xs cursor-pointer"
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
