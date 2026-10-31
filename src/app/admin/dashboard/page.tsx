'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import {
  Database,
  Layers,
  ClipboardCheck,
  UploadCloud,
  PlusCircle,
  Network,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Clock,
  Shield,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, role } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const isSuperAdmin = role === 'SUPERADMIN' || user?.role === 'SUPERADMIN';

  const fetchStats = () => {
    setLoading(true);
    setErrorMsg('');
    api.admin
      .getDashboardStats()
      .then((res: any) => {
        const data = res?.data || res;
        setStats(data);
      })
      .catch((err: any) => {
        console.error('Failed to load admin stats:', err);
        setErrorMsg(err.message || 'Gagal memuat statistik dasbor admin.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const bankStats = stats?.banks || [];
  const packageStats = stats?.packages || { total_packages: 0, active_packages: 0, draft_packages: 0 };
  const subjectStats = stats?.subjects || [];

  const totalQuestions = bankStats.reduce((acc: number, b: any) => acc + Number(b.total_questions || 0), 0);
  const totalActiveQuestions = bankStats.reduce((acc: number, b: any) => acc + Number(b.active_questions || 0), 0);
  const totalDraftQuestions = bankStats.reduce((acc: number, b: any) => acc + Number(b.draft_questions || 0), 0);

  const latihanBank = bankStats.find((b: any) => b.bank_type === 'LATIHAN') || { total_questions: 0, active_questions: 0 };
  const recallBank = bankStats.find((b: any) => b.bank_type === 'RECALL') || { total_questions: 0, active_questions: 0 };
  const simulasiBank = bankStats.find((b: any) => b.bank_type === 'SIMULASI') || { total_questions: 0, active_questions: 0 };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <AdminNav />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Error notification (Safe-to-fail warm amber container) */}
        {errorMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={fetchStats}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 px-3.5 py-1.5 text-xs font-bold text-amber-900 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {/* Hero Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3.5 py-1 text-xs font-semibold text-purple-700 mb-2">
                <Shield className="h-3.5 w-3.5" />
                <span>Panel Dasbor Tata Kelola Kurikulum AGRA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Selamat Datang, {user?.name || user?.username || 'Admin'}! 👋
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
                Pantau ketersediaan bank soal asesmen formatif dan sumatif, kelola paket simulasi capstone, dan tinjau struktur kurikulum SMP.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/admin/bank-soal/create"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Tambah Butir Soal</span>
              </Link>
              <Link
                href="/admin/validasi-soal"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-purple-50 hover:text-purple-700 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
              >
                <ClipboardCheck className="h-4 w-4 text-purple-600" />
                <span>Antrean Validasi</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Soal */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Butir Soal</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {loading ? '...' : totalQuestions}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {loading ? 'Menghitung...' : `${totalActiveQuestions} Aktif • ${totalDraftQuestions} Draf/Revisi`}
              </p>
            </div>
          </div>

          {/* Bank Latihan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bank Latihan</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {loading ? '...' : latihanBank.total_questions || 0}
              </p>
              <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                Modul drill formatif 3 level kognitif
              </p>
            </div>
          </div>

          {/* Bank Recall */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bank Recall</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {loading ? '...' : recallBank.total_questions || 0}
              </p>
              <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                Asesmen diagnostik awal 10 butir
              </p>
            </div>
          </div>

          {/* Paket Simulasi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Paket Simulasi</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {loading ? '...' : packageStats.total_packages || 0}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {loading ? '...' : `${packageStats.active_packages || 0} Terbit • ${packageStats.draft_packages || 0} Draf`}
              </p>
            </div>
          </div>
        </div>

        {/* Distribution per Subject & Quick Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Subject Distribution */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Sebaran Butir Soal per Mata Pelajaran</h2>
                <p className="text-xs text-slate-500">Ketersediaan butir soal pada kurikulum aktif</p>
              </div>
              <Link
                href="/admin/kurikulum"
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <span>Kelola Struktur</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Memuat statistik mata pelajaran...</div>
            ) : subjectStats.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">Belum ada data mata pelajaran.</div>
            ) : (
              <div className="space-y-4">
                {subjectStats.map((sub: any) => {
                  const qCount = Number(sub.total_questions || 0);
                  const percent = totalQuestions > 0 ? Math.round((qCount / totalQuestions) * 100) : 0;
                  return (
                    <div key={sub.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-extrabold text-[11px]">
                            {sub.code}
                          </span>
                          <span className="font-bold text-slate-800">{sub.name}</span>
                        </div>
                        <span className="font-extrabold text-slate-700">{qCount} Butir Soal ({percent}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-600 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Col: Quick Actions */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Aksi Cepat Tim Kurikulum
            </h2>

            <div className="space-y-2">
              <Link
                href="/admin/bank-soal/create"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Tulis Soal Baru</p>
                    <p className="text-[10px] text-slate-500">Pilihan tunggal & kompleks</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
              </Link>

              <Link
                href="/admin/validasi-soal"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <ClipboardCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Antrean Validasi</p>
                    <p className="text-[10px] text-slate-500">Tinjau & terbitkan butir soal</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
              </Link>

              <Link
                href="/admin/bank-soal/import"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Impor Massal Soal</p>
                    <p className="text-[10px] text-slate-500">Format file CSV & JSON</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
              </Link>

              <Link
                href="/admin/paket-simulasi/create"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Buat Paket Simulasi</p>
                    <p className="text-[10px] text-slate-500">Susun 30 butir asesmen</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
              </Link>

              {isSuperAdmin && (
                <Link
                  href="/admin/users"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Manajemen Pengguna</p>
                      <p className="text-[10px] text-slate-500">Kelola akun SuperAdmin & Tim</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

