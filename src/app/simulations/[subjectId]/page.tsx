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
  Sparkles 
} from 'lucide-react';

export default function SimulationEligibilityPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const router = useRouter();
  const { subjectId } = use(params);

  const [eligibility, setEligibility] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.simulation
      .getEligibility(subjectId)
      .then((res: any) => {
        setEligibility(res);
      })
      .catch(() => {
        // Fallback demo: subject 2 (Bahasa Indonesia) is eligible, subject 1 (Matematika) has 2 remaining
        const isEligible = subjectId === '2';
        setEligibility({
          subjectId,
          subjectName: subjectId === '2' ? 'Bahasa Indonesia SMP' : 'Matematika SMP',
          isEligible,
          completedSubmaterials: isEligible ? 12 : 8,
          totalSubmaterials: 12,
          remainingSubmaterials: isEligible
            ? []
            : [
                { id: 9, title: 'Bangun Datar Segiempat & Lingkaran' },
                { id: 10, title: 'Bangun Ruang Sisi Datar & Lengkung' },
              ],
        });
      })
      .finally(() => setLoading(false));
  }, [subjectId]);

  const handleStartSimulation = async () => {
    setStarting(true);
    setErrorMsg('');

    try {
      const res = await api.simulation.startAttempt(subjectId);
      const attemptId = res?.attemptId || res?.id || `att_sim_${subjectId}_${Date.now()}`;
      router.push(`/simulations/exam/${attemptId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Mengalihkan ke ruang simulasi...');
      setTimeout(() => {
        router.push(`/simulations/exam/demo_sim_${subjectId}`);
      }, 1000);
    } finally {
      setStarting(false);
    }
  };

  const isEligible = eligibility?.isEligible ?? true;

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

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Hero */}
            <div className="rounded-3xl border border-purple-900/50 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300 mb-3">
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                Asesmen Puncak (Capstone Assessment)
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Simulasi TKA: {eligibility?.subjectName || 'Mata Pelajaran'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Ujian simulasi komprehensif 30 butir soal standar Kemendikdasmen dengan sistem hitung mundur 75 menit (4.500 detik) untuk mengukur kesiapan puncak Anda.
              </p>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                {errorMsg}
              </div>
            )}

            {/* Eligibility Status Section */}
            {isEligible ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Status: Memenuhi Syarat Kelayakan Ujian! 🎉
                    </h3>
                    <p className="text-xs text-emerald-200">
                      Seluruh materi prasyarat telah Anda kuasai dengan predikat tuntas (*Mastery Achieved*).
                    </p>
                  </div>
                </div>

                {/* Exam Rules Breakdown */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-3 text-xs text-slate-300">
                  <h4 className="font-bold text-white text-sm">Tata Tertib & Aturan Simulasi TKA:</h4>
                  <ul className="space-y-2 list-disc list-inside text-slate-400">
                    <li>
                      <strong className="text-slate-200">Durasi 75 Menit (4.500 detik)</strong>: Timer hitung mundur berjalan otomatis sejak ujian dimulai.
                    </li>
                    <li>
                      <strong className="text-slate-200">30 Butir Soal Terstandar</strong>: Soal dipilih otomatis oleh sistem berbasis paket aktif (*LRU Selection*).
                    </li>
                    <li>
                      <strong className="text-slate-200">Fitur Ragu-ragu</strong>: Anda dapat menandai butir soal untuk ditinjau kembali sebelum waktu habis.
                    </li>
                    <li>
                      <strong className="text-slate-200">Auto-Submit Otomatis</strong>: Jika waktu habis, jawaban tersimpan Anda otomatis dikumpulkan oleh sistem.
                    </li>
                  </ul>
                </div>

                {/* Action Start */}
                <div className="flex justify-end">
                  <button
                    onClick={handleStartSimulation}
                    disabled={starting}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-600/30 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {starting ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <span>Mulai Simulasi Ujian Sekarang (75 Menit)</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Modul Simulasi TKA Masih Terkunci
                    </h3>
                    <p className="text-xs text-amber-200">
                      Anda wajib menuntaskan seluruh submateri pada mata pelajaran ini sebelum mengikuti ujian puncak.
                    </p>
                  </div>
                </div>

                {/* Remaining Prerequisites */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300">
                    Submateri yang Masih Perlu Dituntaskan:
                  </h4>
                  <div className="space-y-2">
                    {(eligibility?.remainingSubmaterials || []).map((sub: any) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900 text-xs"
                      >
                        <span className="text-slate-300">{sub.title}</span>
                        <Link
                          href={`/submaterials/${sub.id}`}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          Kerjakan Sekarang →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/curriculum/${subjectId}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold text-white hover:bg-indigo-500"
                  >
                    <span>Buka Kurikulum Mata Pelajaran</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
