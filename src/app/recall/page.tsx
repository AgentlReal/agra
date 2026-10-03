'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw, 
  BookOpen, 
  AlertCircle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';

interface RecallStatus {
  isPassed: boolean;
  lastAttemptId?: string | number | null;
  activeAttemptId?: string | number | null;
  totalAttempts?: number;
}

export default function RecallIntroPage() {
  const router = useRouter();
  const [status, setStatus] = useState<RecallStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadStatus = () => {
    setLoading(true);
    setErrorMsg('');
    api.recall
      .getStatus()
      .then((res: any) => {
        const data = res?.data || res;
        setStatus(data);
      })
      .catch((err: any) => {
        console.error('Failed to load recall status:', err);
        setErrorMsg(err.message || 'Gagal memuat status Recall dari server.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleStartAttempt = async () => {
    setStarting(true);
    setErrorMsg('');
    try {
      const res = await api.recall.startAttempt();
      const attemptId =
        res?.attempt_id ||
        res?.attemptId ||
        res?.id ||
        res?.data?.attempt_id ||
        res?.data?.attemptId;
      if (!attemptId) {
        throw new Error('Gagal memulai sesi Recall.');
      }
      router.push(`/recall/exam/${attemptId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memulai sesi recall. Pastikan bank soal mencukupi di server.');
      setStarting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
              Dasbor
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold">Recall Kemampuan</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">Petunjuk Asesmen</span>
          </nav>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Dasbor</span>
          </Link>
        </div>
        {/* Error notification (Safe-to-fail warm amber container, red banned) */}
        {errorMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadStatus}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 text-xs font-bold text-amber-900 transition-colors cursor-pointer"
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
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Asesmen Diagnostik Pembuka (Gatekeeper)</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Recall Kemampuanmu
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                    Uji pemahaman dasar untuk memetakan kesiapan belajarmu sebelum memulai kurikulum adaptif Fase D SMP/MTs.
                  </p>
                </div>

                {status?.isPassed && (
                  <div className="shrink-0 flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Pretest Tuntas</p>
                      <p className="text-[11px] text-emerald-700">Kurikulum Inti Terbuka</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Safe-to-Fail Pedagogical Notice */}
              <div className="bg-[#eff6ff] border border-blue-100 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-slate-700">
                <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <p className="font-bold text-slate-900">Prinsip Asesmen Ramah Siswa (Safe-to-Fail):</p>
                  <p>
                    Tidak ada pengurangan nilai atau sistem pinalti. Kerjakan setiap soal dengan tenang dan teliti untuk membantu kami merekomendasikan materi belajar yang paling cocok bagimu.
                  </p>
                </div>
              </div>

              {/* Assessment Specification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100/70 text-blue-700">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">Jumlah Butir</p>
                    <p className="text-sm font-bold text-slate-900">30 Soal Diagnostik</p>
                  </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/70 text-amber-800">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">Batas Waktu</p>
                    <p className="text-sm font-bold text-slate-900">Tanpa Batas Ketat</p>
                  </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-800">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">Format Soal</p>
                    <p className="text-sm font-bold text-slate-900">PG & Kompleks</p>
                  </div>
                </div>
              </div>

              {/* CTA Action Area */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3 justify-end">
                {status?.lastAttemptId && (
                  <Link
                    href={`/recall/review/${status.lastAttemptId}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span>Lihat Pembahasan Sebelumnya</span>
                  </Link>
                )}

                {status?.isPassed ? (
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleStartAttempt}
                      disabled={starting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Ulangi Pretest (Latihan)</span>
                    </button>
                    <Link
                      href="/curriculum"
                      className="btn-tactile-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold text-white shadow-xs"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Masuk ke Kurikulum Inti</span>
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleStartAttempt}
                    disabled={starting}
                    className="btn-tactile-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl text-sm font-bold text-white cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {starting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <span>Mulai Asesmen Recall</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
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
