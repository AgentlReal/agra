'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { BookOpen, GraduationCap, ChevronRight, Layers, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

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
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <BookOpen className="h-4 w-4" />
            Struktur Kurikulum Resmi Fase D (SMP/MTs)
          </div>
          <h1 className="text-3xl font-extrabold text-white">Mata Pelajaran TKA SMP</h1>
          <p className="mt-1 text-sm text-slate-400">
            Pilih mata pelajaran untuk melihat pohon materi pokok, submateri, dan 3 level kognitif latihan.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={fetchSubjects}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : subjects.length === 0 && !errorMsg ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">
            <BookOpen className="h-12 w-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">Belum Ada Mata Pelajaran</h3>
            <p className="text-xs text-slate-400 mt-1">
              Data mata pelajaran kurikulum belum tersedia di server.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((sub: any) => (
              <div
                key={sub.id || sub.subjectId}
                className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 font-bold text-base border border-indigo-500/30">
                      {sub.code || 'TKA'}
                    </span>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                      {sub.totalMaterials ?? sub.total_materials ?? 0} Materi Pokok
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {sub.description || 'Pelajari kompetensi esensial dan drill latihan terstruktur.'}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Layers className="h-4 w-4 text-cyan-400" />
                    <span>3 Level Kognitif per Submateri</span>
                  </div>

                  <Link
                    href={`/curriculum/${sub.id || sub.subjectId || 1}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    <span>Jelajahi Kurikulum</span>
                    <ArrowRight className="h-4 w-4" />
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
