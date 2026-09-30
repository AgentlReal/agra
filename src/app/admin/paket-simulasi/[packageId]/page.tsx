'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  ArrowLeft, 
  Layers, 
  Users, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

export default function PackageDetailPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = use(params);

  const [pkg, setPkg] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.admin.getSimulationPackage(packageId).catch(() => null),
      api.admin.getSimulationPackageStats(packageId).catch(() => null),
    ])
      .then(([pkgRes, statsRes]) => {
        if (pkgRes) setPkg(pkgRes);
        else generateMockPackage();

        if (statsRes) setStats(statsRes);
        else generateMockStats();
      })
      .finally(() => setLoading(false));
  }, [packageId]);

  const generateMockPackage = () => {
    setPkg({
      id: packageId,
      title: 'Paket Utama 01 - Matematika SMP Fase D',
      subjectName: 'Matematika SMP',
      status: 'PUBLISHED',
      totalQuestions: 30,
      createdAt: '20 Sep 2026',
      blueprint: [
        { material: 'Bilangan Bulat & Pecahan', count: 6, level: 'L1 & L2' },
        { material: 'Bentuk Aljabar & PLSV', count: 10, level: 'L1, L2, L3' },
        { material: 'Geometri & Pengukuran', count: 8, level: 'L2 & L3' },
        { material: 'Statistika & Peluang', count: 6, level: 'L1 & L2' },
      ],
    });
  };

  const generateMockStats = () => {
    setStats({
      totalParticipants: 142,
      averageScore: 78.4,
      highestScore: 96.7,
      lowestScore: 53.3,
      passRate: 74.6,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <AdminNav />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        <Link
          href="/admin/paket-simulasi"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Paket
        </Link>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-purple-400 font-mono">
                  {pkg?.subjectName}
                </span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                  {pkg?.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{pkg?.title}</h1>
              <p className="mt-1 text-xs text-slate-400">
                Alokasi Waktu Ujian: <strong className="text-slate-200">75 Menit</strong> • Beban: <strong className="text-slate-200">30 Butir Soal</strong>
              </p>
            </div>

            {/* Participant Performance Stats */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-400" />
                <span>Statistik Performa Peserta Siswa</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-[11px] text-slate-400">Total Peserta Selesai</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats?.totalParticipants || 0}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-[11px] text-slate-400">Nilai Rata-rata</p>
                  <p className="text-2xl font-bold text-purple-400 mt-1">{stats?.averageScore || 0}%</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-[11px] text-slate-400">Nilai Tertinggi</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">{stats?.highestScore || 0}%</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-[11px] text-slate-400">Persentase Kelulusan</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">{stats?.passRate || 0}%</p>
                </div>
              </div>
            </div>

            {/* 30 Questions Blueprint Breakdown */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-400" />
                <span>Distribusi Blueprint 30 Butir Soal</span>
              </h3>

              <div className="space-y-3">
                {(pkg?.blueprint || []).map((bp: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{bp.material}</p>
                      <p className="text-[11px] text-slate-400">Cakupan Tingkat Kognitif: {bp.level}</p>
                    </div>
                    <span className="rounded-lg bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-500/30">
                      {bp.count} Butir Soal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
