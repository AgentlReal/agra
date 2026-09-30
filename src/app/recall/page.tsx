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
  AlertCircle,
  RefreshCw 
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
      const attemptId = res?.attemptId || res?.id || res?.data?.attemptId;
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
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {errorMsg && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadStatus}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

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
                  <div className="flex items-center gap-3">
                    {status.lastAttemptId && (
                      <Link
                        href={`/recall/review/${status.lastAttemptId}`}
                        className="rounded-xl border border-emerald-500/30 bg-emerald-500/20 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-all text-center"
                      >
                        Lihat Pembahasan
                      </Link>
                    )}
                    <Link
                      href="/curriculum"
                      className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-all text-center"
                    >
                      Buka Kurikulum
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-indigo-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Status: Belum Lulus Prasyarat</h4>
                      <p className="text-xs text-indigo-300">
                        Kerjakan 30 soal diagnostik dengan ambang ketuntasan 80% untuk membuka materi pembelajaran Fase D.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartAttempt}
                    disabled={starting}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all shrink-0"
                  >
                    {starting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <span>Mulai Recall Sekarang</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Assessment Rules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 mb-4 font-bold text-sm">
                  30
                </div>
                <h3 className="text-sm font-bold text-white">30 Butir Soal Terstandar</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Terbagi rata: 15 soal Numerasi/Matematika SD dan 15 soal Literasi/Bahasa Indonesia SD.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 mb-4 font-bold text-sm">
                  80%
                </div>
                <h3 className="text-sm font-bold text-white">Ambang Kelulusan 80%</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Cukup capai skor minimal 80 untuk membuka akses penuh ke seluruh pohon kurikulum Fase D SMP.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 mb-4 font-bold text-sm">
                  ∞
                </div>
                <h3 className="text-sm font-bold text-white">Percobaan Tanpa Batas</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Tidak ada penalti jika belum mencapai target. Anda dapat mengulang sesi dengan bank soal teracak baru.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
