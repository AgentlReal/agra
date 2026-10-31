'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { 
  Database, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  AlertCircle,
  Image as ImageIcon,
  Clock,
  Send,
  AlertTriangle,
} from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import FormattedContent from '@/components/common/FormattedContent';

const SUBMATERIAL_MAP: Record<number, { title: string; material: string }> = {
  1: { title: 'Bilangan Real', material: 'Bilangan' },
  2: { title: 'Persamaan & Pertidaksamaan Linier', material: 'Aljabar' },
  3: { title: 'Bentuk Aljabar', material: 'Aljabar' },
  4: { title: 'Relasi dan Fungsi', material: 'Aljabar' },
  5: { title: 'Barisan dan Deret', material: 'Aljabar' },
  6: { title: 'Objek Geometri', material: 'Geometri & Pengukuran' },
  7: { title: 'Transformasi Geometri', material: 'Geometri & Pengukuran' },
  8: { title: 'Pengukuran', material: 'Geometri & Pengukuran' },
  9: { title: 'Data (Statistika)', material: 'Data & Peluang' },
  10: { title: 'Peluang (Probabilitas)', material: 'Data & Peluang' },
  11: { title: 'Pemahaman Tekstual (Teks Informasi)', material: 'Teks Informasi' },
  12: { title: 'Pemahaman Inferensial (Teks Informasi)', material: 'Teks Informasi' },
  13: { title: 'Evaluasi dan Apresiasi (Teks Informasi)', material: 'Teks Informasi' },
  14: { title: 'Pemahaman Tekstual (Teks Fiksi)', material: 'Teks Fiksi' },
  15: { title: 'Pemahaman Inferensial (Teks Fiksi)', material: 'Teks Fiksi' },
  16: { title: 'Evaluasi dan Apresiasi (Teks Fiksi)', material: 'Teks Fiksi' },
};

export default function AdminBankSoalPage() {
  const router = useRouter();
  const { user, role, isLoading: authLoading, isAuthenticated } = useAuth();

  const [bankType, setBankType] = useState<string>('LATIHAN');
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'SINGLE_CHOICE' | 'COMPLEX_CHOICE'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const [questions, setQuestions] = useState<any[]>([]);
  const [stockData, setStockData] = useState<{
    recall: { current: number; target: number };
    latihan: { current: number; target: number };
    simulasi: { current: number; target: number };
  }>({
    recall: { current: 60, target: 60 },
    latihan: { current: 180, target: 240 },
    simulasi: { current: 120, target: 120 },
  });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Pagination states
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Auth guard: allow both TIM_KURIKULUM and SUPERADMIN
  useEffect(() => {
    const isAuthorized =
      isAuthenticated &&
      (role === 'TIM_KURIKULUM' ||
        user?.role === 'TIM_KURIKULUM' ||
        role === 'SUPERADMIN' ||
        user?.role === 'SUPERADMIN');

    if (!authLoading && !isAuthorized) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, role, user, router]);

  // Debounce search query [FE-28]
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [bankType, subjectFilter, levelFilter, statusFilter, typeFilter]);

  useEffect(() => {
    fetchStock();
    fetchQuestions();
  }, [bankType, subjectFilter, levelFilter, statusFilter, typeFilter, page, limit, debouncedSearch]);

  const fetchStock = async () => {
    try {
      const res = await api.admin.getQuestionBanksStock();
      const raw = res?.data || res;
      const stockArr = Array.isArray(raw) ? raw : raw?.data || [];

      let recallCount = 0;
      let latihanCount = 0;
      let simulasiCount = 0;

      for (const item of stockArr) {
        const count = Number(item.active_question_count ?? item.activeQuestionCount ?? 0);
        const b = item.bank_type ?? item.bankType;
        if (b === 'RECALL') recallCount += count;
        else if (b === 'LEVEL_EXERCISE') latihanCount += count;
        else if (b === 'SIMULATION') simulasiCount += count;
      }

      setStockData({
        recall: { current: recallCount || 60, target: 60 },
        latihan: { current: latihanCount || 180, target: 240 },
        simulasi: { current: simulasiCount || 120, target: 120 },
      });
    } catch (err: any) {
      console.error('Failed to load stock data:', err);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const bankMap: Record<string, string> = {
        LATIHAN: 'LEVEL_EXERCISE',
        SIMULASI: 'SIMULATION',
        RECALL: 'RECALL',
      };
      const normalizedBank = bankMap[bankType] || bankType;
      const params: any = {
        bank: normalizedBank,
        page,
        limit,
      };

      if (subjectFilter === 'MAT') params.subject = 1;
      else if (subjectFilter === 'BIN') params.subject = 2;
      else if (subjectFilter !== 'ALL') params.subject = subjectFilter;

      if (normalizedBank !== 'RECALL') {
        if (levelFilter === 'L1') params.level = 1;
        else if (levelFilter === 'L2') params.level = 2;
        else if (levelFilter === 'L3') params.level = 3;
        else if (levelFilter !== 'ALL') params.level = levelFilter;
      }

      // Status Filter [FE-22]
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }

      // Server-Side Search [FE-28]
      if (debouncedSearch.trim()) {
        params.q = debouncedSearch.trim();
      }

      if (typeFilter !== 'ALL') {
        params.type = typeFilter;
      }

      const res = await api.admin.getQuestions(params);
      const list = res?.data || res?.items || (Array.isArray(res) ? res : []);
      const paginationMeta = res?.pagination;

      if (paginationMeta) {
        setTotalPages(paginationMeta.total_pages || paginationMeta.totalPages || 1);
        setTotalItems(paginationMeta.total_items ?? paginationMeta.totalItems ?? list.length);
      } else {
        setTotalPages(1);
        setTotalItems(list.length);
      }

      const mapQuestionItem = (q: any) => {
        const subInfo = q.sub_material_id ? SUBMATERIAL_MAP[q.sub_material_id] : null;
        const qStatus = q.status || (q.is_active || q.isActive ? 'ACTIVE' : 'DRAFT');
        return {
          id: q.id,
          bankType: q.bankType || q.bank_type || bankType,
          subjectName: q.subjectName || (q.subject_id === 1 ? 'Matematika SMP' : 'Bahasa Indonesia SMP'),
          materialName: subInfo?.material || q.materialName || q.material_name || (normalizedBank === 'RECALL' ? 'Recall Diagnostik' : '-'),
          submaterialName: subInfo?.title || '',
          cognitiveLevel: q.cognitiveLevel || (q.cognitive_level_id ? `Level ${q.cognitive_level_id}` : (normalizedBank === 'RECALL' ? 'Recall' : 'L1')),
          type: q.questionFormat || q.question_format || q.type || 'SINGLE_CHOICE',
          questionText: q.questionText || q.question_text || '',
          imageUrl: q.question_image_url || q.questionImageUrl || q.stimulus_image_url || q.stimulusImageUrl || q.imageUrl || q.stimulus?.stimulus_image_url || null,
          isActive: Boolean(q.isActive ?? q.is_active ?? (qStatus === 'ACTIVE')),
          status: qStatus,
          revisionNotes: q.revision_notes || q.revisionNotes || q.notes || null,
          updatedAt: q.updatedAt || q.created_at || '-',
        };
      };

      setQuestions(list.map(mapQuestionItem));
    } catch (err: any) {
      console.error('Failed to load questions:', err);
      setErrorMsg(err.message || 'Gagal memuat daftar butir soal dari server.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (qId: string | number, currentActive: boolean) => {
    setUpdatingId(qId);
    try {
      await api.admin.updateQuestionStatus(qId, !currentActive);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === qId
            ? { ...q, isActive: !currentActive, status: !currentActive ? 'ACTIVE' : 'INACTIVE' }
            : q
        )
      );
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status soal.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRequestReview = async (qId: string | number) => {
    setUpdatingId(qId);
    try {
      await api.admin.updateQuestionReviewStatus(qId, { status: 'PENDING_REVIEW' });
      setQuestions((prev) =>
        prev.map((q) => (q.id === qId ? { ...q, status: 'PENDING_REVIEW' } : q))
      );
    } catch (err: any) {
      alert(err.message || 'Gagal mengajukan validasi.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <AdminNav />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-bold mb-1">
              <Database className="h-4 w-4" />
              <span>Manajemen Konten Kurikulum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Tata Kelola Bank Soal TKA
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              Kelola butir soal pada 3 bank terpisah: Bank Recall, Bank Latihan Kognitif, dan Bank Simulasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/bank-soal/import"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
            >
              <span>Impor Massal</span>
            </Link>
            <Link
              href="/admin/bank-soal/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Butir Soal</span>
            </Link>
          </div>
        </div>

        {/* 3 Interactive Cards Selector [FE-18] */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              key: 'LATIHAN',
              title: 'Bank Latihan Kognitif',
              subtitle: 'Modul drill 3 level adaptif (L1, L2, L3)',
              current: stockData.latihan.current,
              target: stockData.latihan.target,
            },
            {
              key: 'RECALL',
              title: 'Bank Recall Kemampuan',
              subtitle: 'Asesmen diagnostik awal 10 butir',
              current: stockData.recall.current,
              target: stockData.recall.target,
            },
            {
              key: 'SIMULASI',
              title: 'Bank Simulasi Asesmen',
              subtitle: 'Ujian capstone 75 menit (30 butir)',
              current: stockData.simulasi.current,
              target: stockData.simulasi.target,
            },
          ].map((tab) => {
            const isSelected = bankType === tab.key;
            const percent = Math.min(100, Math.round((tab.current / tab.target) * 100));
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setBankType(tab.key)}
                className={`flex flex-col justify-between p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/60 shadow-xs ring-2 ring-purple-600/30'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                      {tab.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-purple-200 text-purple-900' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.current} / {tab.target} Butir
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{tab.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 w-full">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500">Kecukupan Stok</span>
                    <span className={percent >= 100 ? 'text-emerald-700' : 'text-purple-700'}>
                      {percent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        percent >= 100 ? 'bg-emerald-600' : 'bg-purple-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Filter & Search Bar [FE-28] */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari butir soal berdasarkan teks stimulus atau pertanyaan..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-10 pr-9 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-2xs"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Hapus kata kunci pencarian"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-purple-600 focus:outline-none shadow-2xs"
              >
                <option value="ALL">Semua Mapel</option>
                <option value="MAT">Matematika</option>
                <option value="BIN">Bahasa Indonesia</option>
              </select>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                disabled={bankType === 'RECALL'}
                className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-purple-600 focus:outline-none shadow-2xs ${
                  bankType === 'RECALL' ? 'opacity-40 cursor-not-allowed' : ''
                }`}
                title={bankType === 'RECALL' ? 'Bank Recall tidak memiliki level kognitif' : 'Filter Level Kognitif'}
              >
                <option value="ALL">Semua Level</option>
                <option value="L1">Level 1 (Pemahaman)</option>
                <option value="L2">Level 2 (Aplikasi)</option>
                <option value="L3">Level 3 (Penalaran)</option>
              </select>

              {/* Status Filter [FE-22] */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-purple-600 focus:outline-none shadow-2xs"
              >
                <option value="ALL">Semua Status</option>
                <option value="DRAFT">Draf</option>
                <option value="PENDING_REVIEW">Menunggu Validasi</option>
                <option value="ACTIVE">Aktif / Disetujui</option>
                <option value="REVISION">Perlu Revisi</option>
                <option value="INACTIVE">Nonaktif</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-purple-600 focus:outline-none shadow-2xs"
              >
                <option value="ALL">Semua Tipe Soal</option>
                <option value="SINGLE_CHOICE">Pilihan Tunggal</option>
                <option value="COMPLEX_CHOICE">Pilihan Ganda Kompleks</option>
              </select>
            </div>
          </div>

          {/* Search Result Indicator */}
          {debouncedSearch.trim() && (
            <div className="flex items-center justify-between bg-purple-50/80 border border-purple-200 rounded-2xl px-4 py-2.5 text-xs text-purple-900">
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                <span>
                  Ditemukan <strong>{totalItems}</strong> butir soal untuk kata kunci &ldquo;{debouncedSearch}&rdquo;
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline cursor-pointer"
              >
                Hapus Pencarian
              </button>
            </div>
          )}
        </div>

        {/* Questions Table */}
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 px-4 text-slate-500 text-xs">
              <Database className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">Tidak ada butir soal yang sesuai kriteria.</p>
              <p className="text-[11px] mt-1 text-slate-400">
                Ubah parameter filter atau gunakan kata kunci pencarian yang lain.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">ID</th>
                    <th className="py-3 px-4">Stimulus & Teks Soal</th>
                    <th className="py-3 px-4 w-40">Mata Pelajaran & Level</th>
                    <th className="py-3 px-4 w-36">Tipe Soal</th>
                    <th className="py-3 px-4 w-32">Status</th>
                    <th className="py-3 px-4 w-44 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                        #{q.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400">
                              {q.materialName}
                            </span>
                            {q.submaterialName && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-[10px] font-medium text-slate-500">
                                  {q.submaterialName}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-slate-900 font-medium line-clamp-2">
                            <FormattedContent content={q.questionText} inline />
                          </div>
                          {q.imageUrl && (
                            <div className="inline-flex items-center gap-1 text-[10px] text-purple-700 font-semibold mt-1">
                              <ImageIcon className="h-3 w-3" />
                              <span>Memuat Ilustrasi Gambar</span>
                            </div>
                          )}
                          {q.status === 'REVISION' && q.revisionNotes && (
                            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-1.5 mt-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span>Catatan: {q.revisionNotes}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-medium text-slate-800">{q.subjectName}</p>
                        <span className="inline-block mt-0.5 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-100">
                          {q.cognitiveLevel || 'L1'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {q.type === 'COMPLEX_CHOICE' || q.type === 'PG_KOMPLEKS' ? (
                          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 border border-purple-200">
                            Pilihan Ganda Kompleks
                          </span>
                        ) : (
                          <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 border border-sky-200">
                            Pilihan Tunggal
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {q.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" /> Aktif
                          </span>
                        ) : q.status === 'PENDING_REVIEW' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                            <Clock className="h-3 w-3" /> Validasi
                          </span>
                        ) : q.status === 'REVISION' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700 border border-orange-200">
                            <AlertTriangle className="h-3 w-3" /> Revisi
                          </span>
                        ) : q.status === 'DRAFT' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                            Draf
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                            <XCircle className="h-3 w-3" /> Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {q.status === 'DRAFT' && (
                            <button
                              type="button"
                              onClick={() => handleRequestReview(q.id)}
                              disabled={updatingId === q.id}
                              className="inline-flex items-center gap-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer"
                              title="Ajukan butir soal ke antrean validasi"
                            >
                              <Send className="w-3 h-3" />
                              <span>Validasi</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(q.id, q.isActive)}
                            disabled={updatingId === q.id}
                            className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold border transition-colors cursor-pointer ${
                              q.isActive
                                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {q.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>

                          <Link
                            href={`/admin/bank-soal/${q.id}`}
                            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 p-1.5 text-slate-700 shadow-2xs transition-colors"
                            title="Edit Butir Soal"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-purple-600" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination controls */}
          {!loading && questions.length > 0 && (
            <div className="p-4 bg-slate-50/50">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={limit}
                onPageChange={(newPage) => setPage(newPage)}
                onItemsPerPageChange={(newLimit: number) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
