'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { BookOpen, ChevronRight, Layers, ArrowRight, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function CurriculumIndexPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSubjects = () => {
    setLoading(true);
    setErrorMsg('');
    api.curriculum
      .getSubjects()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : res.data || [];
        setSubjects(list);
      })
      .catch((err) => {
        console.error('Failed to load subjects:', err);
        setErrorMsg(err.message || 'Gagal memuat mata pelajaran dari server.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 mb-2">
            <BookOpen className="h-4 w-4" />
            <span>Struktur Kurikulum Resmi Fase D (SMP/MTs)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mata Pelajaran TKA SMP</h1>
          <p className="mt-1 text-sm text-slate-500">
            Pilih mata pelajaran untuk melihat pohon materi pokok, submateri, dan 3 level kognitif latihan.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={fetchSubjects}
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
        ) : subjects.length === 0 && !errorMsg ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
            <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">Belum Ada Mata Pelajaran</h3>
            <p className="text-xs text-slate-500 mt-1">
              Data mata pelajaran kurikulum belum tersedia di server.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((sub: any, idx: number) => (
              <div
                key={sub.id || sub.subjectId || `sub-${idx}`}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-base border border-blue-100">
                      {sub.code || 'TKA'}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {sub.totalMaterials ?? sub.total_materials ?? 0} Materi Pokok
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {sub.description || 'Pelajari kompetensi esensial dan drill latihan terstruktur.'}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Standar Kemendikdasmen</span>
                  <Link
                    href={`/curriculum/${sub.id || sub.subjectId}`}
                    className="btn-tactile-primary inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer"
                  >
                    <span>Masuk ke Materi</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
