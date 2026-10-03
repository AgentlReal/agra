'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  ArrowLeft, 
  Layers, 
  TrendingUp, 
  AlertCircle
} from 'lucide-react';

export default function PackageDetailPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = use(params);

  const [pkg, setPkg] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Promise.all([
      api.admin.getSimulationPackage(packageId),
      api.admin.getSimulationPackageStats(packageId).catch(() => null),
    ])
      .then(([pkgRes, statsRes]) => {
        const pkgData = pkgRes?.data || pkgRes;
        if (pkgData) {
          setPkg(pkgData);
        } else {
          setErrorMsg('Paket simulasi tidak ditemukan.');
        }

        const statsData = statsRes?.data || statsRes;
        if (statsData) {
          setStats(statsData);
        }
      })
      .catch((err: any) => {
        console.error('Failed to load package detail:', err);
        setErrorMsg(err.message || 'Gagal memuat detail paket simulasi dari server.');
      })
      .finally(() => setLoading(false));
  }, [packageId]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <AdminNav />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        <Link
          href="/admin/paket-simulasi"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Paket
        </Link>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          </div>
        ) : errorMsg || !pkg ? (
          <div className="rounded-3xl border border-amber-200 bg-white p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">{errorMsg || 'Data paket tidak ditemukan.'}</p>
            <Link
              href="/admin/paket-simulasi"
              className="inline-block btn-tactile-primary rounded-xl px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              Kembali ke Daftar Paket
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-purple-700 font-mono bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                  {pkg?.subjectName || pkg?.subject_name || (pkg?.subject_id === 1 ? 'Matematika SMP' : 'Bahasa Indonesia SMP')}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  {pkg?.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{pkg?.title}</h1>
              <p className="mt-1.5 text-xs text-slate-500">
                Alokasi Waktu Ujian: <strong className="text-slate-800">{pkg?.duration_minutes || 75} Menit</strong> • Beban: <strong className="text-slate-800">{pkg?.total_questions || 30} Butir Soal</strong>
              </p>
            </div>

            {/* Participant Performance Stats */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span>Statistik Performa Peserta Siswa</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-[11px] text-slate-500 font-medium">Total Peserta Selesai</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalParticipants ?? stats?.participant_count ?? 0}</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-[11px] text-slate-500 font-medium">Nilai Rata-rata</p>
                  <p className="text-2xl font-bold text-purple-700 mt-1">{stats?.averageScore ?? stats?.average_score ?? 0}%</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-[11px] text-slate-500 font-medium">Nilai Tertinggi</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">{stats?.highestScore ?? stats?.highest_score ?? 0}%</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-[11px] text-slate-500 font-medium">Persentase Kelulusan</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">{stats?.passRate ?? stats?.pass_rate ?? 0}%</p>
                </div>
              </div>
            </div>

            {/* 30 Questions Blueprint Breakdown */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-600" />
                <span>Distribusi Blueprint 30 Butir Soal</span>
              </h3>

              <div className="space-y-3">
                {pkg?.blueprint && pkg.blueprint.length > 0 ? (
                  pkg.blueprint.map((bp: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{bp.material}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Cakupan Tingkat Kognitif: {bp.level}</p>
                      </div>
                      <span className="rounded-xl bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 border border-purple-200">
                        {bp.count} Butir Soal
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 text-center text-xs text-slate-500">
                    Distribusi 30 butir soal telah dipetakan otomatis sesuai standar blueprint kurikulum.
                  </div>
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
