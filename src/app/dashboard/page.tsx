'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard
      .get()
      .then((res: any) => {
        setDashboardData(res);
      })
      .catch(() => {
        // Fallback rich demo dashboard data
        setDashboardData({
          student: {
            name: user?.name || 'Budi Santoso',
            grade: user?.grade || 8,
            totalXp: user?.totalXp || 450,
            streak: user?.currentStreak || 5,
            tier: 'Penjelajah Pengetahuan',
          },
          recall: {
            isPassed: true,
            score: 86.7,
          },
          recommendation: {
            title: 'Latihan Level 2: Aljabar (PLSV)',
            subject: 'Matematika SMP',
            level: 'Level 2 - Aplikasi',
            description: 'Terapkan konsep persamaan linier satu variabel pada pemecahan masalah kontekstual.',
            link: '/curriculum/1',
          },
          subjects: [
            {
              id: 1,
              name: 'Matematika SMP',
              code: 'MAT',
              masteryPercentage: 65,
              totalMaterials: 4,
              completedMaterials: 2,
              totalSubmaterials: 12,
              completedSubmaterials: 8,
              simulationUnlocked: false,
              prerequisiteRemaining: 4,
            },
            {
              id: 2,
              name: 'Bahasa Indonesia SMP',
              code: 'BIN',
              masteryPercentage: 80,
              totalMaterials: 4,
              completedMaterials: 3,
              totalSubmaterials: 12,
              completedSubmaterials: 10,
              simulationUnlocked: true,
              prerequisiteRemaining: 0,
            },
          ],
          recentActivities: [
            {
              id: 'act_1',
              title: 'Latihan Level 1: Bilangan Bulat',
              subject: 'Matematika',
              score: 90,
              earnedXp: 50,
              date: 'Hari ini, 14:20',
              status: 'TUNTAS',
            },
            {
              id: 'act_2',
              title: 'Recall Kemampuanmu (Diagnostik)',
              subject: 'Lintas Mapel',
              score: 87,
              earnedXp: 100,
              date: 'Kemarin',
              status: 'TUNTAS',
            },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
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
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-2xl font-bold text-white shadow-xl shadow-indigo-600/30">
                    {user?.name?.[0]?.toUpperCase() || 'B'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                        Halo, {user?.name || 'Siswa Hebat'}! 👋
                      </h1>
                      <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/30">
                        Kelas {user?.grade || 8} SMP
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">
                      Tier: <span className="font-semibold text-cyan-400">{dashboardData?.student?.tier || 'Penjelajah Pengetahuan'}</span>
                    </p>
                  </div>
                </div>

                {/* Formative Stats Pills */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    <div>
                      <p className="text-[10px] text-amber-300/80 uppercase font-semibold">Total XP Formatif</p>
                      <p className="text-sm font-bold text-white">{user?.totalXp || 450} XP</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5">
                    <Flame className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-[10px] text-orange-300/80 uppercase font-semibold">Aktif Belajar</p>
                      <p className="text-sm font-bold text-white">{user?.currentStreak || 5} Hari</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Learning Recommendation Banner */}
            {dashboardData?.recommendation && (
              <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-900/30 via-slate-900 to-slate-900 p-5 sm:p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Rekomendasi Langkah Belajar Anda:</span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {dashboardData.recommendation.title}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    {dashboardData.recommendation.description}
                  </p>
                </div>

                <Link
                  href={dashboardData.recommendation.link || '/curriculum/1'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:opacity-95 transition-opacity whitespace-nowrap"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Subject Mastery Progress Cards (Matematika & Bahasa Indonesia) */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(dashboardData?.subjects || []).map((sub: any) => (
                  <div
                    key={sub.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md flex flex-col justify-between space-y-5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 font-bold text-xs">
                          {sub.code}
                        </span>
                        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                          {sub.completedSubmaterials}/{sub.totalSubmaterials} Submateri Tuntas
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">{sub.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {sub.totalMaterials} Materi Pokok (Fase D SMP)
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-400">Penguasaan Kompetensi (Mastery)</span>
                          <span className="font-bold text-indigo-400">{sub.masteryPercentage}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                            style={{ width: `${sub.masteryPercentage}%` }}
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
                            <Lock className="h-3 w-3" /> Sisa {sub.prerequisiteRemaining} submateri
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/curriculum/${sub.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
                      >
                        <span>Buka Materi</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capstone Simulation Quick Access & Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Capstone Simulation Banner (1 column) */}
              <div className="rounded-2xl border border-indigo-900/40 bg-gradient-to-b from-indigo-950/40 to-slate-900 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 mb-3">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Simulasi TKA Capstone</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Ujian puncak 30 butir soal dengan batas waktu 75 menit (4.500 detik) hitung mundur ketat untuk menguji kesiapan asesmen Anda.
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  <Link
                    href="/simulations/2"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    <span>Simulasi B. Indonesia (Siap)</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/simulations/1"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Lock className="h-3 w-3" /> Simulasi Matematika (Terkunci)
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Recent Activities (2 columns) */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="h-4 w-4 text-indigo-400" />
                  Riwayat Aktivitas & Perolehan Formatif Terbaru
                </h3>

                <div className="space-y-3">
                  {(dashboardData?.recentActivities || []).map((act: any) => (
                    <div
                      key={act.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{act.title}</p>
                          <p className="text-[11px] text-slate-400">
                            {act.subject} • {act.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-emerald-400">Nilai: {act.score}%</span>
                        <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/20">
                          +{act.earnedXp} XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
