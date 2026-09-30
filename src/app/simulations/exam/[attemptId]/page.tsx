'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { 
  ShieldCheck, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle2, 
  Check, 
  AlertTriangle, 
  X 
} from 'lucide-react';

interface QuestionItem {
  id: string | number;
  questionNumber: number;
  stimulus?: string;
  questionText: string;
  options: { id?: number; key: string; text: string }[];
  currentAnswer?: string | null;
  isDoubtful?: boolean;
}

export default function SimulationExamPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const router = useRouter();
  const { attemptId } = use(params);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [doubtfuls, setDoubtfuls] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 75 minutes = 4500 seconds
  const [timeLeft, setTimeLeft] = useState<number>(4500);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.simulation
      .getAttempt(attemptId)
      .then((res: any) => {
        if (res?.timing?.remaining_seconds) {
          setTimeLeft(res.timing.remaining_seconds);
        } else if (res?.remainingTimeSeconds) {
          setTimeLeft(res.remainingTimeSeconds);
        }
        const rawQs = res?.questions || res?.data?.questions;
        if (Array.isArray(rawQs) && rawQs.length > 0) {
          const qs: QuestionItem[] = rawQs.map((q: any, i: number) => {
            const stimulusText =
              typeof q.stimulus === 'string'
                ? q.stimulus
                : (q.stimulus?.content_text || q.stimulusText || '');

            const mappedOptions = (q.options || []).map((opt: any) => ({
              id: opt.id ?? opt.option_id,
              key: opt.option_label || opt.optionKey || opt.key,
              text: opt.option_text || opt.optionText || opt.text,
            }));

            const savedIds = q.saved_answer?.selected_option_ids || q.selected_option_ids;
            let currentAnswer: string | null = null;
            if (Array.isArray(savedIds) && savedIds.length > 0) {
              const matched = mappedOptions.find((o: any) => savedIds.includes(o.id));
              if (matched) currentAnswer = matched.key;
            } else if (q.studentAnswer) {
              currentAnswer = q.studentAnswer;
            }

            const isDoubtful = Boolean(
              q.saved_answer?.is_doubtful ??
              q.is_doubtful ??
              q.isDoubtful ??
              q.is_flagged ??
              q.isFlagged
            );

            return {
              id: q.session_question_id ?? q.id ?? i + 1,
              questionNumber: q.question_order ?? q.questionNumber ?? i + 1,
              stimulus: stimulusText,
              questionText: q.question_text || q.questionText || '',
              options: mappedOptions,
              currentAnswer,
              isDoubtful,
            };
          });

          setQuestions(qs);
          const initAns: Record<number, string> = {};
          const initDbt: Record<number, boolean> = {};
          qs.forEach((q, idx) => {
            if (q.currentAnswer) initAns[idx] = q.currentAnswer;
            if (q.isDoubtful) initDbt[idx] = true;
          });
          setAnswers(initAns);
          setDoubtfuls(initDbt);
        } else {
          setErrorMsg('Tidak ada butir soal yang ditemukan pada sesi simulasi ini.');
        }
      })
      .catch((err: any) => {
        setErrorMsg(err.message || 'Gagal memuat butir soal simulasi dari server.');
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  // Countdown Timer Effect
  useEffect(() => {
    if (loading) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAutoSubmitTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading]);

  const handleAutoSubmitTimeout = async () => {
    try {
      await api.simulation.submit(attemptId);
    } catch {
      // silent
    } finally {
      router.push(`/simulations/result/${attemptId}`);
    }
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = async (optionKey: string) => {
    const newAnswers = { ...answers, [currentIndex]: optionKey };
    setAnswers(newAnswers);

    const selectedOpt = currentQ?.options?.find((o) => o.key === optionKey);
    const selectedOptionIds = selectedOpt?.id ? [selectedOpt.id] : [];

    setSaving(true);
    try {
      await api.simulation.saveAnswer(attemptId, currentQ.id, {
        selectedOptionIds,
        is_doubtful: doubtfuls[currentIndex] || false,
        currentQuestionOrder: currentQ.questionNumber,
        answer: optionKey,
      });
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDoubtful = async () => {
    const nextDoubtful = !doubtfuls[currentIndex];
    setDoubtfuls({ ...doubtfuls, [currentIndex]: nextDoubtful });

    const selectedOpt = currentQ?.options?.find((o) => o.key === answers[currentIndex]);
    const selectedOptionIds = selectedOpt?.id ? [selectedOpt.id] : [];

    try {
      await api.simulation.saveAnswer(attemptId, currentQ.id, {
        selectedOptionIds,
        is_doubtful: nextDoubtful,
        currentQuestionOrder: currentQ.questionNumber,
        answer: answers[currentIndex] || '',
      });
    } catch {
      // silent
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.simulation.submit(attemptId);
      router.push(`/simulations/result/${attemptId}`);
    } catch {
      router.push(`/simulations/result/${attemptId}`);
    }
  };

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft <= 300; // <= 5 mins

  const answeredCount = Object.keys(answers).length;
  const doubtfulCount = Object.values(doubtfuls).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-400">Menyiapkan Ruang Ujian CBT Simulasi...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <div className="max-w-md space-y-4 rounded-3xl border border-rose-500/30 bg-slate-900/80 p-8 shadow-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 mx-auto">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Kendala Sesi Simulasi</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {errorMsg || 'Tidak ada butir soal yang tersedia pada simulasi ini.'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
          >
            Kembali ke Dasbor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Header CBT with 75-min Timer */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-purple-950/60 bg-slate-900/90 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">Simulasi TKA CBT</h2>
            <p className="text-[11px] text-purple-300 font-medium">Asesmen Puncak Terstandar</p>
          </div>
        </div>

        {/* 75-Min Countdown Timer */}
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-1.5 border font-mono text-sm font-bold transition-colors ${
            isLowTime
              ? 'border-rose-500/50 bg-rose-500/20 text-rose-300 animate-pulse'
              : 'border-purple-500/30 bg-purple-950/40 text-purple-200'
          }`}
        >
          <Clock className={`h-4 w-4 ${isLowTime ? 'text-rose-400' : 'text-purple-400'}`} />
          <span>Sisa Waktu: {formatTime(timeLeft)}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            <span>Daftar Soal</span>
            <span className="rounded-md bg-purple-500/30 px-1.5 py-0.5 text-[10px] text-purple-300 font-mono">
              {answeredCount}/{questions.length}
            </span>
          </button>

          <button
            onClick={() => setSubmitModalOpen(true)}
            className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md transition-colors"
          >
            Kumpulkan
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 mx-auto max-w-4xl w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-xs font-bold text-white">
                {currentQ.questionNumber}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                dari {questions.length} Butir Soal
              </span>
            </div>

            <button
              onClick={handleToggleDoubtful}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                doubtfuls[currentIndex]
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              <Flag className="h-3.5 w-3.5" />
              <span>{doubtfuls[currentIndex] ? 'Ditandai Ragu-ragu' : 'Tandai Ragu-ragu'}</span>
            </button>
          </div>

          {currentQ.stimulus && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-l-4 border-l-purple-500">
              {currentQ.stimulus}
            </div>
          )}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-md">
            <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
              {currentQ.questionText}
            </p>

            <div className="mt-6 space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentIndex] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-600/20 text-white ring-2 ring-purple-500/30'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {opt.key}
                    </div>
                    <span className="text-xs sm:text-sm pt-0.5 leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Sebelumnya</span>
          </button>

          <span className="text-xs text-slate-500">
            Nomor {currentIndex + 1} dari 30
          </span>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 shadow-md shadow-purple-600/20"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setSubmitModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md"
            >
              <span>Kumpulkan Ujian</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </main>

      {/* Palette Modal */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Palet 30 Butir Soal Simulasi</h3>
              <button onClick={() => setPaletteOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 flex flex-wrap gap-4 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-emerald-600" />
                <span>Dijawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-amber-500" />
                <span>Ragu-ragu ({doubtfulCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md border border-slate-700 bg-slate-950" />
                <span>Belum ({unansweredCount})</span>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const isAnswered = answers[idx] !== undefined;
                const isDoubt = doubtfuls[idx];
                const isCurrent = currentIndex === idx;

                let colorClass = 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700';
                if (isDoubt) {
                  colorClass = 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold';
                } else if (isAnswered) {
                  colorClass = 'border-emerald-500 bg-emerald-600/30 text-emerald-300 font-bold';
                }

                return (
                  <button
                    key={q.questionNumber}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setPaletteOpen(false);
                    }}
                    className={`flex h-10 w-full items-center justify-center rounded-xl border text-xs transition-all ${colorClass} ${
                      isCurrent ? 'ring-2 ring-white scale-105' : ''
                    }`}
                  >
                    {q.questionNumber}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setPaletteOpen(false)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="text-base font-bold text-white">Kumpulkan Lembar Jawaban Simulasi?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sisa waktu Anda masih <strong className="text-purple-400 font-mono">{formatTime(timeLeft)}</strong>. Setelah dikumpulkan, hasil dan evaluasi nilai Anda akan segera diproses.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-slate-400">Dijawab</p>
                <p className="text-lg font-bold text-emerald-400">{answeredCount}</p>
              </div>
              <div>
                <p className="text-slate-400">Ragu-ragu</p>
                <p className="text-lg font-bold text-amber-400">{doubtfulCount}</p>
              </div>
              <div>
                <p className="text-slate-400">Belum</p>
                <p className="text-lg font-bold text-rose-400">{unansweredCount}</p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Lanjutkan Ujian
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md disabled:opacity-50"
              >
                {submitting ? 'Mengumpulkan...' : 'Ya, Selesaikan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
