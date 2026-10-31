'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AppLogo } from '@/components/common/AppLogo';
import { Footer } from '@/components/layout/Footer';
import { 
  ArrowRight, 
  Brain, 
  CheckCircle2, 
  GraduationCap, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  Zap 
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      if (role === 'TIM_KURIKULUM' || role === 'SUPERADMIN') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, role, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Memuat AGRA Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 p-1">
              <AppLogo size={28} />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-blue-600 flex items-center gap-1.5">
                AGRA
                <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                  TKA SMP
                </span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Ruang Belajar & Simulasi Potensi Akademik
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3.5 py-2 rounded-xl transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
            >
              <span>Daftar Akun Baru</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 shadow-2xs">
            <GraduationCap className="h-4 w-4" />
            <span>Standar Asesmen Kurikulum Kemendikdasmen</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Ruang Belajar & Simulasi Mandiri <br className="hidden sm:inline" />
            <span className="text-blue-600">Tes Kemampuan Akademik SMP</span>
          </h1>

          <p className="mx-auto max-w-2xl text-slate-600 text-sm sm:text-base leading-relaxed">
            Persiapkan dirimu menghadapi asesmen TKA jenjang SMP/MTs dengan latihan berjenjang 3 level kognitif, evaluasi diagnostik awal Recall, dan simulasi CBT 75 menit yang dirancang terstruktur dan terukur.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Mulai Belajar Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-xs transition-all cursor-pointer"
            >
              <span>Masuk ke Akun</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Core Values Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pilar Pembelajaran & Asesmen AGRA
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Pendekatan bertahap yang memastikan kesiapan kognitif siswa terbentuk kokoh sebelum menempuh simulasi puncak.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all space-y-4">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Diagnostik Recall Kemampuanmu</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Asesmen diagnostik 30 butir untuk memetakan kesiapan dan prasyarat dasar sebelum memasuki materi kurikulum inti.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Prasyarat Akses Kurikulum</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all space-y-4">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Latihan 3 Level Kognitif</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Latihan drill terarah pada setiap submateri: Level 1 Pemahaman, Level 2 Aplikasi, dan Level 3 Penalaran mendalam (HOTS).
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Drill Sekuensial Adaptif</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all space-y-4">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Simulasi CBT 75 Menit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ujian capstone 30 butir soal dengan timer nyata, peta navigasi soal, dan pembobotan parsial pilihan ganda kompleks.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-purple-700">
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              <span>Evaluasi & Pembahasan Komprehensif</span>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Belajar Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl border border-blue-100 bg-[#EFF6FF]/70 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Alur Belajar Terstruktur 4 Tahap
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Panduan langkah demi langkah meraih ketuntasan akademik di platform AGRA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Lulus Recall', desc: 'Selesaikan diagnostik awal Recall Kemampuanmu untuk membuka peta kurikulum.' },
              { step: '02', title: 'Pelajari Submateri', desc: 'Pelajari konsep materi pokok secara sekuensial pada kurikulum Matematika & B. Indonesia.' },
              { step: '03', title: 'Kuasai 3 Level', desc: 'Tuntaskan Level 1, 2, dan 3 di setiap submateri dengan nilai passing grade &ge; 90%.' },
              { step: '04', title: 'Uji di Simulasi CBT', desc: 'Buka paket simulasi capstone 75 menit dan tinjau evaluasi pembahasan kunci nalar.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
                <span className="inline-block text-xs font-black text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded-md">
                  Tahap {item.step}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Siap Memulai Langkah Pertamamu?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Daftar sekarang dan bergabung dengan ruang latihan mandiri berbasis asesmen terstandar.
        </p>
        <div className="pt-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-xs font-bold text-white shadow-sm transition-all"
          >
            <span>Buat Akun Siswa Baru</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
