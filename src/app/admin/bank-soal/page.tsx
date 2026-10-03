'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  Database, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  BarChart2, 
  Edit3, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import FormattedContent from '@/components/common/FormattedContent';

export default function AdminBankSoalPage() {
  const [bankType, setBankType] = useState<string>('LATIHAN');
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [questions, setQuestions] = useState<any[]>([]);
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  // Pagination states
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [bankType, subjectFilter, levelFilter, statusFilter]);

  useEffect(() => {
    fetchStock();
    fetchQuestions();
  }, [bankType, subjectFilter, levelFilter, statusFilter, page, limit]);

  const [errorMsg, setErrorMsg] = useState('');

  const fetchStock = async () => {
    try {
      const res = await api.admin.getQuestionBanksStock();
      const data = res?.data || res;
      setStockData(data);
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

      // Recall questions do not have cognitive levels in database
      if (normalizedBank !== 'RECALL') {
        if (levelFilter === 'L1') params.level = 1;
        else if (levelFilter === 'L2') params.level = 2;
        else if (levelFilter === 'L3') params.level = 3;
        else if (levelFilter !== 'ALL') params.level = levelFilter;
      }

      if (statusFilter === 'ACTIVE') params.is_active = true;
      else if (statusFilter === 'INACTIVE') params.is_active = false;

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

      const mapped = list.map((q: any) => ({
        id: q.id,
        bankType: q.bankType || q.bank_type || bankType,
        subjectName: q.subjectName || (q.subject_id === 1 ? 'Matematika SMP' : 'Bahasa Indonesia SMP'),
        materialName: q.materialName || q.material_name || '-',
        cognitiveLevel: q.cognitiveLevel || (q.cognitive_level_id ? `Level ${q.cognitive_level_id}` : (normalizedBank === 'RECALL' ? 'Recall' : 'L1')),
        type: q.questionFormat || q.question_format || q.type || 'SINGLE_CHOICE',
        questionText: q.questionText || q.question_text || '',
        imageUrl: q.question_image_url || q.questionImageUrl || q.stimulus_image_url || q.stimulusImageUrl || q.imageUrl || q.stimulus?.stimulus_image_url || null,
        isActive: Boolean(q.isActive ?? q.is_active ?? true),
        updatedAt: q.updatedAt || q.created_at || '-',
      }));
      setQuestions(mapped);
    } catch (err: any) {
      console.error('Failed to load questions:', err);
      setErrorMsg(err.message || 'Gagal memuat daftar soal dari server.');
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
        prev.map((q) => (q.id === qId ? { ...q, isActive: !currentActive } : q))
      );
    } catch {
      setQuestions((prev) =>
        prev.map((q) => (q.id === qId ? { ...q, isActive: !currentActive } : q))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (!searchQuery) return true;
    return (
      q.questionText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.materialName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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

          <Link
            href="/admin/bank-soal/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Butir Soal Baru</span>
          </Link>
        </div>

        {/* 3 Bank Soal Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { key: 'RECALL', title: '1. Bank Recall Kemampuanmu', desc: 'Gerbang diagnostik 30 soal SD' },
            { key: 'LATIHAN', title: '2. Bank Latihan Level Kognitif', desc: '3 Level drill adaptif (L1, L2, L3)' },
            { key: 'SIMULASI', title: '3. Bank Simulasi TKA', desc: 'Paket capstone 75 menit (30 soal)' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setBankType(tab.key)}
              className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                bankType === tab.key
                  ? 'border-purple-600 bg-purple-50/70 shadow-xs ring-1 ring-purple-500'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className={`text-xs font-bold ${bankType === tab.key ? 'text-purple-800' : 'text-slate-900'}`}>{tab.title}</span>
              <span className={`text-[11px] mt-1 ${bankType === tab.key ? 'text-purple-700' : 'text-slate-500'}`}>{tab.desc}</span>
            </button>
          ))}
        </div>

        {/* Monitoring Stok & Kecukupan Soal */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-purple-600" />
            <span>Monitoring Kecukupan Stok Soal Aktif</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-600">Bank Recall</span>
                <span className="font-bold text-emerald-700">
                  {stockData?.recall?.current || 60} / {stockData?.recall?.target || 60} Butir
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-600">Bank Latihan Kognitif</span>
                <span className="font-bold text-amber-700">
                  {stockData?.latihan?.current || 180} / {stockData?.latihan?.target || 240} Butir
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-600">Bank Simulasi TKA</span>
                <span className="font-bold text-purple-700">
                  {stockData?.simulasi?.current || 120} / {stockData?.simulasi?.target || 120} Butir
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari teks soal atau materi..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-10 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-xs"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-purple-600 focus:outline-none shadow-xs"
            >
              <option value="ALL">Semua Mapel</option>
              <option value="MAT">Matematika</option>
              <option value="BIN">Bahasa Indonesia</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              disabled={bankType === 'RECALL'}
              className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-purple-600 focus:outline-none shadow-xs ${
                bankType === 'RECALL' ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              title={bankType === 'RECALL' ? 'Bank Recall tidak memiliki level kognitif' : 'Filter Level Kognitif'}
            >
              <option value="ALL">Semua Level</option>
              <option value="L1">Level 1 (Pemahaman)</option>
              <option value="L2">Level 2 (Aplikasi)</option>
              <option value="L3">Level 3 (Penalaran)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-purple-600 focus:outline-none shadow-xs"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Aktif</option>
              <option value="INACTIVE">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Questions Table */}
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Tidak ada butir soal yang sesuai dengan kriteria filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                    <th className="py-3.5 px-4 font-bold">Teks Soal & Materi</th>
                    <th className="py-3.5 px-4 font-bold">Mapel & Level</th>
                    <th className="py-3.5 px-4 font-bold">Tipe Soal</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="flex items-start gap-2">
                          {q.imageUrl && (
                            <span className="shrink-0 mt-0.5 inline-flex items-center gap-1 rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 border border-purple-200" title="Memuat Gambar Stimulus">
                              <ImageIcon className="h-3 w-3" />
                            </span>
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 line-clamp-2">
                              <FormattedContent content={q.questionText} inline />
                            </div>
                            <p className="text-[11px] text-purple-700 font-medium mt-1">
                              Materi: {q.materialName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-medium text-slate-800">{q.subjectName}</p>
                        <span className="inline-block mt-0.5 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-100">
                          {q.cognitiveLevel || 'L1'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
                          {q.type === 'PG_KOMPLEKS' ? 'Pilihan Kompleks (MCMA)' : 'Pilihan Tunggal'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {q.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" /> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                            <XCircle className="h-3 w-3" /> Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
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
                            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 p-1.5 text-slate-700 shadow-xs transition-colors"
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
          {!loading && (
            <div className="p-4 bg-slate-50/50">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={limit}
                onPageChange={(newPage) => setPage(newPage)}
                onItemsPerPageChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
                itemsPerPageOptions={[10, 20, 50]}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
