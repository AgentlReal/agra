'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  AlertCircle,
  RefreshCw 
} from 'lucide-react';

export default function SimulationEligibilityPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const router = useRouter();
  const { subjectId } = use(params);

  const [eligibility, setEligibility] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadEligibility = () => {
    setLoading(true);
    setErrorMsg('');

    api.simulation
      .getEligibility(subjectId)
      .then((res: any) => {
        const data = res?.data || res;
        setEligibility(data);
      })
      .catch((err: any) => {
        console.error('Failed to load simulation eligibility:', err);
        setErrorMsg(err.message || 'Gagal memuat status eligibilitas simulasi dari server.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEligibility();
  }, [subjectId]);

  const handleStartSimulation = async () => {
    setStarting(true);
    setErrorMsg('');

    try {
      const res = await api.simulation.startAttempt(subjectId);
      const attemptId =
        res?.attempt_id ||
        res?.attemptId ||
        res?.id ||
        res?.data?.attempt_id ||
        res?.data?.attemptId;
      if (!attemptId) {
        throw new Error('Gagal memulai sesi simulasi.');
      }
      router.push(`/simulations/exam/${attemptId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memulai simulasi. Pastikan paket simulasi aktif tersedia di server.');
      setStarting(false);
    }
  };

  const isEligible = Boolean(eligibility?.isEligible);
  const subjectName = eligibility?.subjectName || (subjectId === '2' ? 'Bahasa Indonesia SMP' : 'Matematika SMP');

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dasbor
        </Link>

        {errorMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadEligibility}
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
          <>
            {/* Header Hero */}
            <div className="rounded-3xl border border-purple-900/50 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 p-8 sm:p-10 backdrop-blur-md shadow-2xl">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300 mb-3">
                  <ShieldCheck className="h-4 w-4 text-purple-400" />
                  Ujian Capstone Berstandar Asesmen Nasional
                </div>
                <h1 className="text-3xl font-extrabold text-white">
                  Simulasi TKA {subjectName}
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Uji kesiapan akhir Anda dalam simulasi 30 butir soal komprehensif berstandar TKA Fase D dengan batas waktu 75 menit.
                </p>
              </div>

              {/* Eligibility Status Banner */}
              <div className="mt-8">
                {isEligible ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Memenuhi Syarat Simulasi 🎉</h4>
                        <p className="text-xs text-emerald-300">
                          Anda telah menuntaskan seluruh submateri kurikulum {subjectName}.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleStartSimulation}
                      disabled={starting}
                      className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 disabled:opacity-50 transition-all shrink-0"
                    >
                      {starting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <span>Mulai Simulasi (75 Menit)</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                    <div className="flex items-start gap-3">
                      <Lock className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Belum Memenuhi Syarat Akses Simulasi</h4>
                        <p className="text-xs text-amber-300 mt-1">
                          {eligibility?.reason || 'Untuk membuka simulasi, Anda harus menuntaskan seluruh 3 level kognitif pada setiap submateri terlebih dahulu.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assessment Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 mb-4 font-bold text-sm">
                  30
                </div>
                <h3 className="text-sm font-bold text-white">30 Soal Capstone</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Kombinasi komprehensif tingkat C1 hingga C6 mencakup seluruh materi Fase D.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 mb-4">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Batas Waktu 75 Menit</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Dilengkapi hitung mundur otomatis dan penyerahan lembar jawaban otomatis saat waktu habis.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 mb-4 font-bold text-sm">
                  +150
                </div>
                <h3 className="text-sm font-bold text-white">Reward +150 XP</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Kumpulkan XP berlimpah dan tingkatkan lencana capaian akademik profil Anda.
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
