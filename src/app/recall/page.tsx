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
  RotateCcw, 
  BookOpen, 
  AlertCircle 
} from 'lucide-react';

interface RecallStatus {
  isPassed: boolean;
  activeAttemptId?: string | number | null;
  latestScore?: number | null;
  totalAttempts?: number;
  message?: string;
}

export default function RecallIntroPage() {
  const router = useRouter();
  const [status, setStatus] = useState<RecallStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.recall
      .getStatus()
      .then((res: any) => {
        setStatus(res || { isPassed: false });
      })
      .catch(() => {
        // Fallback demo status
        setStatus({
          isPassed: false,
          activeAttemptId: null,
          latestScore: null,
          totalAttempts: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStartAttempt = async () => {
    setStarting(true);
    setErrorMsg('');
    try {
      const res = await api.recall.startAttempt();
      const attemptId = res?.attemptId || res?.id || 'att_recall_01';
      router.push(`/recall/exam/${attemptId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memulai sesi recall. Coba lagi.');
      setStarting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-indigo-900/50 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-8 sm:p-10 shadow-2xl">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 mb-4">
                  <GraduationCap className="h-4 w-4 text-indigo-400" />
                  Gerbang Diagnostik Mandiri (One-time Gatekeeper)
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Recall Kemampuanmu
                </h1>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Asesmen pembuka prasyarat untuk mengukur penguasaan dasar materi Matematika & Bahasa Indonesia SD sebelum memulai latihan kurikulum SMP/MTs (Fase D).
                </p>
              </div>

              {/* Status Banner */}
              {status?.isPassed ? (
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Status: Lulus Asesmen Recall 🎉</h4>
                      <p className="text-xs text-emerald-300">
                        Anda telah memenuhi prasyarat gerbang dan modul kurikulum telah dibuka penuh.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                    >
                      <BookOpen className="h-4 w-4" /> Masuk ke Dasbor
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Belum Menyelesaikan Gerbang Recall</h4>
                    <p className="text-xs text-amber-200">
                      Selesaikan 30 soal diagnostik ini untuk membuka kurikulum materi dan latihan level kognitif.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Assessment Specifications (3 Pillars) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 mb-3">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">30 Butir Soal Gabungan</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  15 Butir Matematika SD (Bilangan, Geometri, Statistika) & 15 Butir Literasi Bahasa Indonesia SD.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-3">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Bebas Waktu (Untimed)</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Tidak ada hitung mundur waktu yang membuat cemas. Kerjakan dengan tenang dan teliti (*Safe-to-Fail*).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 mb-3">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Dapat Diulang (Remedial)</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Ambang kelulusan 80% (24 benar dari 30). Jika belum lulus, tersedia pembahasan edukatif dan sesi remedial.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-400">
                {errorMsg}
              </div>
            )}

            {/* Action Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Siap untuk Mengukur Kemampuan Awal?</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Jawaban Anda otomatis tersimpan di setiap butir soal. Anda dapat berhenti dan melanjutkan kapan saja.
                </p>
              </div>

              <button
                onClick={handleStartAttempt}
                disabled={starting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/30 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
              >
                {starting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>
                      {status?.activeAttemptId ? 'Lanjutkan Pengerjaan Recall' : 'Mulai Recall Kemampuanmu'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
