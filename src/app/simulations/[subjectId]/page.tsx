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
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  RefreshCw,
  HelpCircle,
  Award
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

  const isEligible = Boolean(eligibility?.isEligible ?? eligibility?.is_eligible);
  const subjectName =
    eligibility?.subjectName ??
    eligibility?.subject_name ??
    (subjectId === '2' ? 'Bahasa Indonesia SMP' : 'Matematika SMP');
  const totalSub = eligibility?.totalSubMaterials ?? eligibility?.total_sub_materials ?? 0;
  const masteredSub = eligibility?.masteredSubMaterials ?? eligibility?.mastered_sub_materials ?? 0;
  const completionPercentage =
    eligibility?.completionPercentage ??
    eligibility?.completion_percentage ??
    (totalSub > 0 ? Math.round((masteredSub / totalSub) * 100) : 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dasbor
        </Link>

        {errorMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadEligibility}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 px-3.5 py-1.5 text-xs font-bold text-amber-900 transition-colors cursor-pointer"
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
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-semibold text-purple-700">
                    <Award className="h-3.5 w-3.5" />
                    <span>Simulasi Ujian CBT Standar Nasional</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Simulasi TKA: {subjectName}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                    Evaluasi kesiapan akhir berstandar Kemendikdasmen dengan sistem CAT 75 menit dan format 30 butir soal lengkap.
                  </p>
                </div>

                {isEligible ? (
                  <div className="shrink-0 flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Eligibel Ikut Ujian</p>
                      <p className="text-[11px] text-emerald-700">Prasyarat Terpenuhi</p>
                    </div>
                  </div>
                ) : (
                  <div className="shrink-0 flex items-center gap-2 rounded-2xl bg-slate-100 border border-slate-200 px-4 py-3">
                    <Lock className="h-6 w-6 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Simulasi Terkunci</p>
                      <p className="text-[11px] text-slate-500">Tuntaskan Submateri</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100/70 text-purple-700">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">Durasi Ujian</p>
                    <p className="text-sm font-bold text-slate-900">75 Menit Ketat</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100/70 text-blue-700">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">Jumlah Butir</p>
                    <p className="text-sm font-bold text-slate-900">30 Soal Capstone</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-800">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">Standar Asesmen</p>
                    <p className="text-sm font-bold text-slate-900">Kemendikdasmen</p>
                  </div>
                </div>
              </div>

              {/* Readiness requirement box */}
              {!isEligible && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-amber-900">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 leading-relaxed">
                    <p className="font-bold text-amber-900">Syarat Pembukaan Akses Simulasi Capstone:</p>
                    <p>
                      Anda harus menuntaskan seluruh 3 level kognitif di setiap submateri mata pelajaran ini terlebih dahulu agar simulasi CBT dapat dibuka secara resmi.
                    </p>
                    {totalSub > 0 && (
                      <p className="font-medium text-amber-800">
                        Progres saat ini: <span className="font-bold">{masteredSub} dari {totalSub} submateri tuntas</span> ({completionPercentage}%).
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Area */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3 justify-end">
                <Link
                  href={`/curriculum/${subjectId}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span>Cek Progres Submateri</span>
                </Link>

                {isEligible ? (
                  <button
                    onClick={handleStartSimulation}
                    disabled={starting}
                    className="btn-tactile-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl text-sm font-bold text-white shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {starting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <span>Mulai Simulasi Sekarang</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl text-sm font-bold text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Simulasi Belum Terbuka</span>
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
