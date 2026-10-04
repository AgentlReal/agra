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
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  TrendingUp, 
  ChevronRight,
  AlertCircle,
  RefreshCw,
  GraduationCap
} from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';

export default function DashboardPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
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
        if (data?.student) {
          updateUser({
            name: data.student.name || user?.name,
            avatarUrl: data.student.avatar?.imageUrl || data.student.avatarUrl || user?.avatarUrl,
            avatarId: data.student.avatar?.id || user?.avatarId,
            totalXp: data.student.totalXp ?? data.student.total_xp ?? user?.totalXp,
            currentStreak: data.student.currentStreak ?? data.student.current_streak ?? user?.currentStreak,
          });
        }
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
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Error Notification (Safe-to-fail warm amber, red banned) */}
        {errorMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadDashboard}
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
          <>
            {/* Student Hero Header (Crisp Light Card) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <UserAvatar
                    src={student?.avatar?.imageUrl || user?.avatarUrl}
                    name={student?.name || user?.name || user?.username}
                    size="xl"
                    rounded="full"
                    className="ring-4 ring-blue-50"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        Halo, {student?.name || user?.name || user?.username || 'Siswa'}! 👋
                      </h1>
                      {user?.grade ? (
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-100 flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>Kelas {user.grade} SMP</span>
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Fase Belajar Aktif:{' '}
                      <span className="font-bold text-blue-600">
                        {student?.milestone?.title || student?.milestone?.tierName || 'Pemula TKA'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Formative Stats Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 shadow-2xs">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-[10px] text-amber-700 uppercase font-semibold">Total XP Belajar</p>
                      <p className="text-sm font-extrabold text-slate-900">{student?.totalXp ?? user?.totalXp ?? 0} XP</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 shadow-2xs">
                    <Flame className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-[10px] text-amber-700 uppercase font-semibold">Aktif Belajar</p>
                      <p className="text-sm font-extrabold text-slate-900">{user?.currentStreak ?? 0} Hari</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Learning Recommendation Banner */}
            {nextAction && (
              <div className="rounded-3xl border border-blue-100 bg-[#eff6ff] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                    <TrendingUp className="h-4 w-4" />
                    <span>Langkah Belajar Selanjutnya:</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {nextAction.title || 'Lanjutkan Aktivitas Belajar'}
                  </h2>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {nextAction.type === 'RECALL'
                      ? 'Selesaikan asesmen diagnostik awal (Recall Kemampuanmu) untuk memetakan kesiapanmu sebelum masuk ke kurikulum inti.'
                      : 'Kuasai kompetensi submateri ini melalui 3 level kognitif adaptif secara bertahap dan menyenangkan.'}
                  </p>
                </div>

                <Link
                  href={nextAction.type === 'RECALL' ? '/recall' : `/submaterials/${nextAction.submaterialId || 1}`}
                  className="btn-tactile-primary inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Subject Mastery Progress Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Kurikulum & Capaian Belajar</h2>
                  <p className="text-xs text-slate-500">
                    Selesaikan 3 level kognitif di setiap submateri untuk membuka Simulasi CBT 75 menit.
                  </p>
                </div>
                <Link
                  href="/curriculum"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Lihat Semua Materi <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {subjects.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
                  <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Belum ada mata pelajaran aktif yang terdaftar.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subjects.map((sub: any, idx: number) => {
                    const subjectId = sub.subjectId ?? sub.id ?? (sub.subjectCode === 'MAT' ? 1 : 2);
                    const masteryPercent = sub.masteryPercent ?? sub.masteryPercentage ?? 0;
                    const masteredCount = sub.masteredSubmaterials ?? sub.completedSubmaterials ?? 0;
                    const totalCount = sub.totalSubmaterials ?? 0;
                    const isSimulationUnlocked = Boolean(
                      sub.simulationUnlocked ??
                      sub.simulation_unlocked ??
                      (totalCount > 0 && masteredCount >= totalCount)
                    );

                    return (
                      <div
                        key={sub.subjectCode || idx}
                        className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-5 hover:border-slate-300 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-extrabold text-xs border border-blue-100">
                              {sub.subjectCode}
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              {masteredCount}/{totalCount} Submateri Tuntas
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900">{sub.subjectName}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Kurikulum Fase D (SMP/MTs)
                          </p>

                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                              <span className="text-slate-500">Penguasaan Kompetensi</span>
                              <span className="font-bold text-blue-600">{masteryPercent}%</span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
                                style={{ width: `${masteryPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Capstone status & action */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                          <div>
                            {isSimulationUnlocked ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 border border-emerald-200">
                                <ShieldCheck className="h-3.5 w-3.5" /> Simulasi Terbuka
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-3 py-1 border border-slate-200">
                                <Lock className="h-3.5 w-3.5" /> Simulasi Terkunci
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/curriculum/${subjectId}`}
                              className="rounded-xl border border-slate-200 hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors"
                            >
                              Buka Materi
                            </Link>

                            {isSimulationUnlocked ? (
                              <Link
                                href={`/simulations/${subjectId}`}
                                className="btn-tactile-secondary rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition-all"
                              >
                                Ujian Simulasi
                              </Link>
                            ) : (
                              <Link
                                href={`/simulations/${subjectId}`}
                                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
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
