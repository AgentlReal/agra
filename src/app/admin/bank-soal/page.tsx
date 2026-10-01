'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  Database, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  BarChart2, 
  Layers, 
  Edit3, 
  Trash2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

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

  useEffect(() => {
    fetchStock();
    fetchQuestions();
  }, [bankType, subjectFilter, levelFilter, statusFilter]);

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
      const params: any = { bank: bankType };
      if (subjectFilter !== 'ALL') params.subject = subjectFilter;
      if (levelFilter !== 'ALL') params.level = levelFilter;
      if (statusFilter !== 'ALL') params.status = statusFilter;

      const res = await api.admin.getQuestions(params);
      const list = res?.items || (Array.isArray(res) ? res : res?.data || []);
      const mapped = list.map((q: any) => ({
        id: q.id,
        bankType: q.bankType || q.bank_type || bankType,
        subjectName: q.subjectName || (q.subject_id === 1 ? 'Matematika SMP' : 'Bahasa Indonesia SMP'),
        materialName: q.materialName || q.material_name || '-',
        cognitiveLevel: q.cognitiveLevel || (q.cognitive_level_id ? `Level ${q.cognitive_level_id}` : 'C1'),
        type: q.questionFormat || q.question_format || q.type || 'SINGLE_CHOICE',
        questionText: q.questionText || q.question_text || '',
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
    <div className="flex min-h-screen flex-col bg-slate-950">
      <AdminNav />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-semibold mb-1">
              <Database className="h-4 w-4" />
              <span>Manajemen Konten Kurikulum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Tata Kelola Bank Soal TKA
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Kelola butir soal pada 3 bank terpisah: Bank Recall, Bank Latihan Kognitif, dan Bank Simulasi.
            </p>
          </div>

          <Link
            href="/admin/bank-soal/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all"
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
              className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                bankType === tab.key
                  ? 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/30 shadow-lg'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className={`text-xs font-bold ${bankType === tab.key ? 'text-purple-300' : ''}`}>{tab.title}</span>
              <span className={`text-[11px] mt-1 ${bankType === tab.key ? 'text-purple-400' : 'text-slate-400'}`}>{tab.desc}</span>
            </button>
          ))}
        </div>

        {/* Monitoring Stok & Kecukupan Soal */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-purple-400" />
            <span>Monitoring Kecukupan Stok Soal Aktif</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Bank Recall</span>
                <span className="font-bold text-emerald-400">
                  {stockData?.recall?.current || 60} / {stockData?.recall?.target || 60} Butir
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Bank Latihan Kognitif</span>
                <span className="font-bold text-amber-400">
                  {stockData?.latihan?.current || 180} / {stockData?.latihan?.target || 240} Butir
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Bank Simulasi TKA</span>
                <span className="font-bold text-purple-400">
                  {stockData?.simulasi?.current || 120} / {stockData?.simulasi?.target || 120} Butir
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }} />
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
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">Semua Mapel</option>
              <option value="MAT">Matematika</option>
              <option value="BIN">Bahasa Indonesia</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">Semua Level</option>
              <option value="L1">Level 1 (Pemahaman)</option>
              <option value="L2">Level 2 (Aplikasi)</option>
              <option value="L3">Level 3 (Penalaran)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Aktif</option>
              <option value="INACTIVE">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Questions Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Tidak ada butir soal yang sesuai dengan kriteria filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                    <th className="py-3.5 px-4 font-semibold">Teks Soal & Materi</th>
                    <th className="py-3.5 px-4 font-semibold">Mapel & Level</th>
                    <th className="py-3.5 px-4 font-semibold">Tipe Soal</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 max-w-md">
                        <p className="font-semibold text-white line-clamp-2">{q.questionText}</p>
                        <p className="text-[11px] text-purple-300 mt-1">
                          Materi: {q.materialName}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-medium text-slate-200">{q.subjectName}</p>
                        <span className="inline-block mt-0.5 rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/30">
                          {q.cognitiveLevel || 'L1'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                          {q.type === 'PG_KOMPLEKS' ? 'Pilihan Kompleks (MCMA)' : 'Pilihan Tunggal'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {q.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" /> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400 border border-rose-500/20">
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
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                              q.isActive
                                ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                                : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                          >
                            {q.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                          <Link
                            href={`/admin/bank-soal/${q.id}`}
                            className="rounded-lg bg-slate-800 hover:bg-slate-700 p-1.5 text-slate-300 hover:text-white transition-colors"
                            title="Edit Butir Soal"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
