'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { BookOpen, GraduationCap, ChevronRight, Layers, ArrowRight } from 'lucide-react';

export default function CurriculumIndexPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.curriculum
      .getSubjects()
      .then((res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          setSubjects(res);
        } else {
          setSubjects(fallbackSubjects);
        }
      })
      .catch(() => setSubjects(fallbackSubjects))
      .finally(() => setLoading(false));
  }, []);

  const fallbackSubjects = [
    {
      id: 1,
      name: 'Matematika SMP',
      code: 'MAT',
      description: 'Domain Bilangan, Aljabar, Geometri & Pengukuran, serta Analisis Data & Peluang.',
      totalMaterials: 4,
      totalSubmaterials: 12,
    },
    {
      id: 2,
      name: 'Bahasa Indonesia SMP',
      code: 'BIN',
      description: 'Literasi Membaca: Teks Informasi, Teks Fiksi, Pemahaman Inferensial, dan Evaluasi.',
      totalMaterials: 4,
      totalSubmaterials: 12,
    },
  ];

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

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
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
                      {sub.totalMaterials || 4} Materi Pokok
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
