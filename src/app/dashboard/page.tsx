'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Award,
  ChevronRight,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadDashboard = () => {
    setLoading(true);
    setErrorMsg('');
    api.dashboard
      .get()
      .then((res: any) => {
        const data = res?.data || res;
        setDashboardData(data);
      })
      .catch((err: any) => {
        console.error('Failed to load dashboard:', err);
        if (err.code === 'PROFILE_INCOMPLETE' || err.status === 409) {
          router.push('/onboarding');
          return;
        }
        if (err.status === 401) {
          router.push('/login');
          return;
        }
        setErrorMsg(err.message || 'Gagal memuat ringkasan belajar dari server.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const student = dashboardData?.student || user;
  const subjects = dashboardData?.subjects || [];
  const nextAction = dashboardData?.nextAction;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {errorMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadDashboard}
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
            {/* Student Hero Header */}
            <div className="relative overflow-hidden rounded-3xl border border-indigo-900/50 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-2xl font-bold text-white shadow-xl shadow-indigo-600/30 overflow-hidden">
                    {student?.avatar?.imageUrl ? (
                      <img src={student.avatar.imageUrl} alt={student.name} className="h-full w-full object-cover" />
                    ) : (
                      student?.name?.[0]?.toUpperCase() || 'S'
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                        Halo, {student?.name || 'Siswa Hebat'}! 👋
                      </h1>
                      <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/30">
                        Kelas {user?.grade || 8} SMP
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">
                      Tier: <span className="font-semibold text-cyan-400">{student?.milestone?.tierName || 'Penjelajah Pengetahuan'}</span>
                    </p>
                  </div>
                </div>

                {/* Formative Stats Pills */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    <div>
                      <p className="text-[10px] text-amber-400 uppercase font-semibold">Total XP Formatif</p>
                      <p className="text-sm font-bold text-white">{student?.totalXp ?? user?.totalXp ?? 0} XP</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5">
                    <Flame className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-[10px] text-orange-400 uppercase font-semibold">Aktif Belajar</p>
                      <p className="text-sm font-bold text-white">{user?.currentStreak ?? 1} Hari</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Learning Recommendation Banner */}
            {nextAction && (
              <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-900/30 via-slate-900 to-slate-900 p-5 sm:p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Langkah Belajar Selanjutnya:</span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {nextAction.title || 'Lanjutkan Aktivitas Belajar'}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    {nextAction.type === 'RECALL'
                      ? 'Selesaikan asesmen diagnostik pembuka (Recall Kemampuanmu) untuk membuka akses materi kurikulum Fase D.'
                      : 'Kuasai kompetensi submateri ini melalui 3 level kognitif adaptif secara bertahap.'}
                  </p>
                </div>

                <Link
                  href={nextAction.type === 'RECALL' ? '/recall' : `/submaterials/${nextAction.submaterialId || 1}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:opacity-95 transition-opacity whitespace-nowrap"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Subject Mastery Progress Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Kurikulum & Capaian Belajar</h2>
                  <p className="text-xs text-slate-400">
                    Selesaikan 3 level kognitif di setiap submateri untuk membuka Simulasi TKA Capstone
                  </p>
                </div>
                <Link
                  href="/curriculum"
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  Lihat Semua Materi <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {subjects.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
                  <BookOpen className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Belum ada mata pelajaran aktif yang terdaftar.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subjects.map((sub: any, idx: number) => {
                    const subjectId = sub.subjectCode === 'MAT' ? 1 : 2;
                    const masteryPercent = sub.masteryPercent ?? sub.masteryPercentage ?? 0;
                    const masteredCount = sub.masteredSubmaterials ?? sub.completedSubmaterials ?? 0;
                    const totalCount = sub.totalSubmaterials ?? 0;

                    return (
                      <div
                        key={sub.subjectCode || idx}
                        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md flex flex-col justify-between space-y-5"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 font-bold text-xs">
                              {sub.subjectCode}
                            </span>
                            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                              {masteredCount}/{totalCount} Submateri Tuntas
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-white">{sub.subjectName}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Kurikulum Fase D (SMP/MTs)
                          </p>

                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="text-slate-400">Penguasaan Kompetensi (Mastery)</span>
                              <span className="font-bold text-indigo-400">{masteryPercent}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                                style={{ width: `${masteryPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Capstone status & action */}
                        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {sub.simulationUnlocked ? (
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-0.5 border border-emerald-500/20">
                                <ShieldCheck className="h-3.5 w-3.5" /> Simulasi Terbuka
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800/60 rounded-full px-2.5 py-0.5 border border-slate-700">
                                <Lock className="h-3 w-3" /> Simulasi Terkunci
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/curriculum/${subjectId}`}
                              className="rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors"
                            >
                              Buka Materi
                            </Link>

                            {sub.simulationUnlocked ? (
                              <Link
                                href={`/simulations/${subjectId}`}
                                className="rounded-xl bg-purple-600 hover:bg-purple-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/20 transition-all"
                              >
                                Ujian Simulasi
                              </Link>
                            ) : (
                              <Link
                                href={`/simulations/${subjectId}`}
                                className="rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-300 transition-colors"
                              >
                                Cek Syarat
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
