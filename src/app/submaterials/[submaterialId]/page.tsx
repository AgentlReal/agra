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
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface CognitiveLevelItem {
  levelNumber: number;
  name: string;
  category: string;
  description: string;
  isUnlocked: boolean;
  isPassed: boolean;
  highestScore: number | null;
  xpReward: number;
  icon: any;
}

const LEVEL_CONFIGS = [
  {
    levelNumber: 1,
    name: 'Level 1: Pemahaman & Pengetahuan',
    category: 'Recall & Faktual',
    description: 'Mengenali konsep dasar, istilah matematis/literasi, dan prosedur operasi langsung.',
    xpReward: 50,
    icon: Brain,
  },
  {
    levelNumber: 2,
    name: 'Level 2: Aplikasi & Prosedural',
    category: 'Penerapan Konsep',
    description: 'Menerapkan prosedur multi-langkah dan pemecahan masalah kontekstual sehari-hari.',
    xpReward: 75,
    icon: Target,
  },
  {
    levelNumber: 3,
    name: 'Level 3: Penalaran & Analisis',
    category: 'HOTS & Problem Solving',
    description: 'Menganalisis skenario baru, mengevaluasi validitas strategi, dan penarikan simpulan.',
    xpReward: 100,
    icon: Zap,
  },
];

export default function SubmaterialDetailPage({ params }: { params: Promise<{ submaterialId: string }> }) {
  const router = useRouter();
  const { submaterialId } = use(params);

  const [submaterial, setSubmaterial] = useState<any>(null);
  const [levels, setLevels] = useState<CognitiveLevelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingLevel, setStartingLevel] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const loadProgress = () => {
    setLoading(true);
    setErrorMsg('');

    api.curriculum
      .getSubmaterialProgress(submaterialId)
      .then((res: any) => {
        const data = res?.data || res;
        setSubmaterial({
          id: submaterialId,
          title: data?.title || data?.name || `Submateri #${submaterialId}`,
          isMastered: Boolean(data?.isMastered),
          progressState: data?.progressState || 'IN_PROGRESS',
        });

        const apiLevels = data?.levels || [];
        const mappedLevels: CognitiveLevelItem[] = LEVEL_CONFIGS.map((cfg) => {
          const found = apiLevels.find((l: any) => Number(l.level) === cfg.levelNumber);
          const isUnlocked = found ? found.status !== 'LOCKED' : cfg.levelNumber === 1;
          const isPassed = found ? found.status === 'COMPLETED' : false;
          return {
            ...cfg,
            name: found?.name || cfg.name,
            isUnlocked,
            isPassed,
            highestScore: found?.score ?? null,
          };
        });

        setLevels(mappedLevels);
      })
      .catch((err: any) => {
        console.error('Failed to load submaterial progress:', err);
        setErrorMsg(err.message || 'Gagal memuat status level latihan dari server.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProgress();
  }, [submaterialId]);

  const handleStartLevel = async (levelNumber: number) => {
    setStartingLevel(levelNumber);
    setErrorMsg('');

    try {
      const res = await api.learning.startAttempt(levelNumber, submaterialId);
      const attemptId =
        res?.id ||
        res?.session_id ||
        res?.attempt_id ||
        res?.attemptId ||
        res?.sessionId ||
        res?.session?.id ||
        res?.data?.id ||
        res?.data?.session_id ||
        res?.data?.attempt_id ||
        res?.data?.attemptId;
      if (!attemptId) {
        throw new Error('Sesi latihan tidak dapat dibuat.');
      }
      router.push(`/learning/exam/${attemptId}`);
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          'Gagal memulai sesi latihan level. Pastikan Anda telah lulus Recall Kemampuanmu dan level prasyarat telah tuntas.'
      );
    } finally {
      setStartingLevel(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <Link
          href="/curriculum"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Kurikulum
        </Link>

        {errorMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadProgress}
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
        ) : (
          <>
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
                <Layers className="h-3.5 w-3.5" />
                <span>Pohon Level Kognitif Asesmen</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {submaterial?.title || 'Submateri Pembelajaran'}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Selesaikan 3 level kognitif secara bertahap dengan ambang kelulusan 90% (KKM 9/10 butir) untuk menuntaskan submateri ini.
              </p>
            </div>

            {/* Levels List */}
            <div className="space-y-4">
              {levels.map((lvl, idx) => {
                const IconComponent = lvl.icon;
                return (
                  <div
                    key={lvl.levelNumber || `lvl-${idx}`}
                    className={`bg-white rounded-3xl border p-6 sm:p-7 transition-all ${
                      lvl.isPassed
                        ? 'border-emerald-200 shadow-xs'
                        : lvl.isUnlocked
                        ? 'border-blue-200 shadow-xs'
                        : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                            lvl.isPassed
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                              : lvl.isUnlocked
                              ? 'border-blue-100 bg-blue-50 text-blue-600'
                              : 'border-slate-200 bg-slate-100 text-slate-400'
                          }`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h2 className="text-base font-bold text-slate-900">{lvl.name}</h2>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                              {lvl.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 max-w-lg leading-relaxed">{lvl.description}</p>
                          <div className="mt-2.5 flex items-center gap-3">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              <Sparkles className="h-3 w-3 text-amber-500" />
                              +{lvl.xpReward} XP Reward
                            </span>
                            {lvl.highestScore !== null && (
                              <span className="text-[11px] font-semibold text-slate-500">
                                Skor Tertinggi:{' '}
                                <span className={lvl.isPassed ? 'text-emerald-700 font-bold' : 'text-slate-800 font-bold'}>
                                  {lvl.highestScore}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center">
                        {lvl.isPassed ? (
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                              <CheckCircle2 className="h-4 w-4" /> Tuntas
                            </span>
                            <button
                              onClick={() => handleStartLevel(lvl.levelNumber)}
                              disabled={startingLevel === lvl.levelNumber}
                              className="w-full sm:w-auto rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              Latihan Ulang
                            </button>
                          </div>
                        ) : lvl.isUnlocked ? (
                          <button
                            onClick={() => handleStartLevel(lvl.levelNumber)}
                            disabled={startingLevel === lvl.levelNumber}
                            className="btn-tactile-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                          >
                            {startingLevel === lvl.levelNumber ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <>
                                <span>Mulai Latihan Level</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-400">
                            <Lock className="h-3.5 w-3.5" />
                            <span>Terkunci</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
