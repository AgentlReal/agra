'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  Award, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  FileText,
  Check,
  ChevronRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function SimulationIntroPage({ params }: { params: Promise<{ subjectId: string }> }) {
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
    (subjectId === '2' ? 'Bahasa Indonesia' : 'Matematika');
  const subjectSymbol = subjectId === '2' ? '📖' : '∑';
  const totalSub = eligibility?.totalSubMaterials ?? eligibility?.total_sub_materials ?? 0;
  const masteredSub = eligibility?.masteredSubMaterials ?? eligibility?.mastered_sub_materials ?? 0;
  const completionPercentage =
    eligibility?.completionPercentage ??
    eligibility?.completion_percentage ??
    (totalSub > 0 ? Math.round((masteredSub / totalSub) * 100) : 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-800 font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Breadcrumb Navigation (Exact style of reference-design/petunjuk-pengerjaan-fq) */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
              Simulasi TKA
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold">{subjectName}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">Petunjuk Pengerjaan</span>
          </nav>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Dasbor</span>
          </Link>
        </div>

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
            
            {/* Header Section */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1 text-xs font-bold text-blue-700">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>{subjectName} SMP</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Petunjuk Pengerjaan Simulasi TKA
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                Baca petunjuk dan spesifikasi teknis berikut sebelum memulai simulasi berbasis komputer.
              </p>
            </div>

            {/* Package Overview Card (Inspired by reference-design/petunjuk-pengerjaan-fq) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              
              {/* Card Title Row */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xl shadow-2xs">
                  {subjectSymbol}
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Simulasi TKA {subjectName} Paket 01
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Standar Asesmen Formatif Fase D (Kelas 7–9 SMP/MTs)
                  </p>
                </div>
              </div>

              {/* 3-Column Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* 30 Soal */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📄</span>
                    <span className="text-base font-extrabold text-slate-900">30 Soal</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Pilihan Ganda Tunggal &amp; Kompleks
                  </p>
                </div>

                {/* 75 Menit */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏱</span>
                    <span className="text-base font-extrabold text-slate-900">75 Menit</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Durasi Waktu Pengerjaan Ketat
                  </p>
                </div>

                {/* Kemendikdasmen Standard */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <span className="text-base font-extrabold text-slate-900">Kemendikdasmen</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Standar Blueprint Asesmen Nasional
                  </p>
                </div>

              </div>

              {/* Petunjuk Pengerjaan Rules List */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Ketentuan &amp; Tata Tertib Pengerjaan:
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 leading-relaxed list-disc list-inside">
                  <li>Soal terdiri dari 30 butir yang menguji seluruh capaian kompetensi kurikulum Fase D.</li>
                  <li>Waktu pengerjaan adalah 75 menit. Countdown timer akan langsung berjalan begitu sesi dimulai.</li>
                  <li>Gunakan fitur <strong>Peta Soal</strong> untuk navigasi butir soal dan tombol <strong>Ragu-ragu</strong> untuk menandai soal yang ingin ditinjau kembali.</li>
                  <li>Jawaban akan tersimpan secara otomatis. Saat waktu berakhir, sistem akan mengumpulkan jawaban Anda secara otomatis.</li>
                </ul>
              </div>

              {/* Eligibility & Action Status Box */}
              {isEligible ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900">
                        Prasyarat Tuntas (Eligibel)
                      </h4>
                      <p className="text-xs text-emerald-700">
                        Seluruh {totalSub} submateri telah Anda kuasai. Anda siap mengikuti ujian simulasi capstone.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartSimulation}
                    disabled={starting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-6 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
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
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-amber-900">
                          Simulasi Masih Terkunci
                        </h4>
                        <span className="rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          Belum Terbuka
                        </span>
                      </div>
                      <p className="text-xs text-amber-800/90 leading-relaxed">
                        Simulasi TKA akan terbuka setelah kamu menuntaskan seluruh 3 level latihan di setiap submateri mata pelajaran ini.
                      </p>
                      
                      {totalSub > 0 && (
                        <div className="pt-2 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                            <span>Progres Kurikulum Saat Ini</span>
                            <span>{masteredSub} dari {totalSub} Submateri ({completionPercentage}%)</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-amber-200/70 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-amber-500 transition-all duration-500"
                              style={{ width: `${completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-amber-200/60 flex justify-end">
                    <Link
                      href={`/curriculum/${subjectId}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-5 transition-colors shadow-2xs"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Lanjutkan Belajar Submateri</span>
                    </Link>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
