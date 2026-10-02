'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  Layers, 
  Plus, 
  CheckCircle2, 
  Clock, 
  BarChart2, 
  Archive, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';
import Pagination from '@/components/common/Pagination';

export default function AdminPaketSimulasiPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  // Pagination states
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(9);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchPackages();
  }, [page, limit]);

  const fetchPackages = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.admin.getSimulationPackages({ page, limit });
      const list = res?.data || res?.items || (Array.isArray(res) ? res : []);
      const paginationMeta = res?.pagination;

      if (paginationMeta) {
        setTotalPages(paginationMeta.total_pages || paginationMeta.totalPages || 1);
        setTotalItems(paginationMeta.total_items ?? paginationMeta.totalItems ?? list.length);
      } else {
        setTotalPages(1);
        setTotalItems(list.length);
      }

      const mapped = list.map((pkg: any) => ({
        id: pkg.id,
        title: pkg.title || `Paket Simulasi #${pkg.id}`,
        subjectName: pkg.subjectName || pkg.subject_name || (pkg.subjectId === 1 || pkg.subject_id === 1 ? 'Matematika SMP' : 'Bahasa Indonesia SMP'),
        totalQuestions: pkg.totalQuestions || pkg.total_questions || 30,
        status: pkg.status || (pkg.isActive || pkg.is_active ? 'ACTIVE' : 'DRAFT'),
        participantsCount: pkg.participantsCount ?? pkg.totalParticipants ?? pkg.participant_count ?? 0,
        averageScore: pkg.averageScore ?? pkg.avg_score ?? 0,
        createdAt: pkg.createdAt || pkg.created_at || '-',
      }));
      setPackages(mapped);
    } catch (err: any) {
      console.error('Failed to load simulation packages:', err);
      setErrorMsg(err.message || 'Gagal memuat paket simulasi dari server.');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (pkgId: string | number, currentStatus: string) => {
    setUpdatingId(pkgId);
    const newStatus = currentStatus === 'ACTIVE' || currentStatus === 'PUBLISHED' ? 'ARCHIVED' : 'ACTIVE';

    try {
      await api.admin.updateSimulationPackageStatus(pkgId, newStatus);
      setPackages((prev) =>
        prev.map((p) => (p.id === pkgId ? { ...p, status: newStatus } : p))
      );
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status paket simulasi.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <AdminNav />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-semibold mb-1">
              <Layers className="h-4 w-4" />
              <span>Manajemen Asesmen Puncak</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Paket Ujian Simulasi TKA
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Kelola susunan 30 butir soal paket capstone, status publikasi, dan statistik nilai peserta.
            </p>
          </div>

          <Link
            href="/admin/paket-simulasi/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Paket Simulasi Baru</span>
          </Link>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
            <p className="text-sm">Tidak ada paket simulasi yang ditemukan.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const isPublished = pkg.status === 'PUBLISHED' || pkg.status === 'ACTIVE';
                return (
                  <div
                    key={pkg.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition-all space-y-5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold text-purple-400 font-mono">
                          {pkg.subjectName}
                        </span>
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" /> Published
                          </span>
                        ) : pkg.status === 'ARCHIVED' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-500/20">
                            <Archive className="h-3 w-3" /> Diarsipkan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                            <Clock className="h-3 w-3" /> {pkg.status || 'Draft'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug">{pkg.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Kapasitas Standar: <strong className="text-slate-200">30 Butir Soal</strong>
                      </p>

                      {/* Stats pills */}
                      <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                          <p className="text-[10px] text-slate-400">Total Peserta</p>
                          <p className="text-sm font-bold text-white mt-0.5">{pkg.participantsCount}</p>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                          <p className="text-[10px] text-slate-400">Rata-rata Nilai</p>
                          <p className="text-sm font-bold text-purple-400 mt-0.5">
                            {pkg.averageScore > 0 ? `${pkg.averageScore}%` : '-'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleStatus(pkg.id, pkg.status)}
                        disabled={updatingId === pkg.id}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                          isPublished
                            ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                            : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {isPublished ? 'Nonaktifkan' : 'Publikasikan'}
                      </button>

                      <Link
                        href={`/admin/paket-simulasi/${pkg.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Rincian & Statistik</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={limit}
              onPageChange={(p: number) => setPage(p)}
              onItemsPerPageChange={(l: number) => {
                setLimit(l);
                setPage(1);
              }}
              itemsPerPageOptions={[6, 9, 15, 30]}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
