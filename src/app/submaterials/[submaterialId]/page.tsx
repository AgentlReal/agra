'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  ArrowLeft, 
  Layers, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Target, 
  Zap, 
  AlertCircle 
} from 'lucide-react';

interface CognitiveLevel {
  id: number;
  levelNumber: number;
  name: string;
  category: string;
  description: string;
  isUnlocked: boolean;
  isPassed: boolean;
  highestScore: number | null;
  xpReward: number;
  iconName: string;
}

export default function SubmaterialDetailPage({ params }: { params: Promise<{ submaterialId: string }> }) {
  const router = useRouter();
  const { submaterialId } = use(params);

  const [submaterial, setSubmaterial] = useState<any>(null);
  const [levels, setLevels] = useState<CognitiveLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingLevel, setStartingLevel] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.curriculum
      .getSubmaterialProgress(submaterialId)
      .then((res: any) => {
        setSubmaterial(res?.submaterial || res);
        if (res?.levels && Array.isArray(res.levels) && res.levels.length > 0) {
          setLevels(res.levels);
        } else {
          setupFallbackLevels();
        }
      })
      .catch(() => {
        setSubmaterial({
          id: submaterialId,
          title: 'Operasi Bilangan Bulat & Pecahan',
          subjectName: 'Matematika SMP',
          subjectId: 1,
          description:
            'Menguasai konsep esensial sifat operasi bilangan, pecahan campuran, dan penerapan kontekstual.',
        });
        setupFallbackLevels();
      })
      .finally(() => setLoading(false));
  }, [submaterialId]);

  const setupFallbackLevels = () => {
    setLevels([
      {
        id: 1,
        levelNumber: 1,
        name: 'Level 1: Pemahaman & Pengetahuan',
        category: 'Recall & Faktual',
        description: 'Mengenali konsep dasar, istilah matematis, dan operasi hitung langsung.',
        isUnlocked: true,
        isPassed: true,
        highestScore: 90,
        xpReward: 30,
        iconName: 'brain',
      },
      {
        id: 2,
        levelNumber: 2,
        name: 'Level 2: Aplikasi & Prosedural',
        category: 'Penerapan Konsep',
        description: 'Menerapkan prosedur multi-langkah dan pemecahan masalah sederhana sehari-hari.',
        isUnlocked: true,
        isPassed: false,
        highestScore: 60,
        xpReward: 50,
        iconName: 'target',
      },
      {
        id: 3,
        levelNumber: 3,
        name: 'Level 3: Penalaran & Analisis',
        category: 'HOTS & Problem Solving',
        description: 'Menganalisis skenario baru, mengevaluasi validitas strategi, dan penarikan simpulan.',
        isUnlocked: false,
        isPassed: false,
        highestScore: null,
        xpReward: 80,
        iconName: 'zap',
      },
    ]);
  };

  const handleStartLevel = async (levelId: number) => {
    setStartingLevel(levelId);
    setErrorMsg('');

    try {
      const res = await api.learning.startAttempt(levelId);
      const attemptId = res?.attemptId || res?.id || `att_lvl_${levelId}_${Date.now()}`;
      router.push(`/learning/exam/${attemptId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memulai sesi latihan level. Mengalihkan ke mode demo...');
      setTimeout(() => {
        router.push(`/learning/exam/demo_lvl_${levelId}`);
      }, 1000);
    } finally {
      setStartingLevel(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        <Link
          href={`/curriculum/${submaterial?.subjectId || 1}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Struktur Kurikulum
        </Link>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Submaterial Info Header */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-md">
              <span className="text-xs font-semibold text-indigo-400">
                {submaterial?.subjectName || 'Matematika SMP'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {submaterial?.title}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {submaterial?.description}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 text-xs text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  Setiap level kognitif memuat 10 butir soal *untimed* (ambang kelulusan 80%).
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 3 Cognitive Level Cards */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-400" />
                <span>3 Tingkatan Level Kognitif</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {levels.map((lvl) => {
                  const isLocked = !lvl.isUnlocked;
                  const isPassed = lvl.isPassed;

                  let cardBorder = 'border-slate-800 bg-slate-900/80';
                  let iconBg = 'bg-slate-800 text-slate-400';

                  if (isLocked) {
                    cardBorder = 'border-slate-800/60 bg-slate-950/40 opacity-70';
                  } else if (isPassed) {
                    cardBorder = 'border-emerald-500/30 bg-gradient-to-b from-slate-900 to-emerald-950/20';
                    iconBg = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
                  } else {
                    cardBorder = 'border-indigo-500/40 bg-slate-900/90 shadow-xl shadow-indigo-950/20';
                    iconBg = 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30';
                  }

                  return (
                    <div
                      key={lvl.id}
                      className={`rounded-2xl border p-6 flex flex-col justify-between backdrop-blur-md transition-all ${cardBorder}`}
                    >
                      <div>
                        {/* Top meta */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}>
                            {lvl.levelNumber === 1 && <Brain className="h-6 w-6" />}
                            {lvl.levelNumber === 2 && <Target className="h-6 w-6" />}
                            {lvl.levelNumber === 3 && <Zap className="h-6 w-6" />}
                          </div>

                          {isLocked ? (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800/60 rounded-full px-2.5 py-0.5 border border-slate-700">
                              <Lock className="h-3 w-3" /> Terkunci
                            </span>
                          ) : isPassed ? (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-0.5 border border-emerald-500/20">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Tuntas ({lvl.highestScore}%)
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 rounded-full px-2.5 py-0.5 border border-indigo-500/20">
                              Terbuka
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          {lvl.category}
                        </span>
                        <h3 className="text-base font-bold text-white mt-0.5">{lvl.name}</h3>
                        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                          {lvl.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
                          <span className="text-slate-400">Beban Soal</span>
                          <span className="font-semibold text-slate-200">10 Butir</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Reward Belajar</span>
                          <span className="font-bold text-amber-400 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> +{lvl.xpReward} XP
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-800/80">
                        {isLocked ? (
                          <div className="text-center py-2 text-xs text-slate-500 font-medium">
                            Kuasai Level {lvl.levelNumber - 1} terlebih dahulu
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartLevel(lvl.id)}
                            disabled={startingLevel === lvl.id}
                            className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold transition-all cursor-pointer ${
                              isPassed
                                ? 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                                : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/20 hover:opacity-95'
                            }`}
                          >
                            {startingLevel === lvl.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <>
                                <span>{isPassed ? 'Ulangi Latihan Penguatan' : 'Mulai Latihan Level'}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
