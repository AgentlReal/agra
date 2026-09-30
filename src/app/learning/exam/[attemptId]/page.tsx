'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Check, 
  X, 
  AlertTriangle 
} from 'lucide-react';

interface QuestionItem {
  id: string | number;
  questionNumber: number;
  stimulus?: string;
  questionText: string;
  options: { key: string; text: string }[];
  currentAnswer?: string | null;
}

export default function LearningExamPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const router = useRouter();
  const { attemptId } = use(params);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.learning
      .getAttempt(attemptId)
      .then((res: any) => {
        const rawQs = res?.questions || res?.data?.questions;
        if (Array.isArray(rawQs) && rawQs.length > 0) {
          const qs: QuestionItem[] = rawQs.map((q: any, i: number) => ({
            id: q.id ?? i + 1,
            questionNumber: q.questionNumber ?? i + 1,
            stimulus: q.stimulusText || q.stimulus || '',
            questionText: q.questionText || `Pertanyaan latihan butir nomor ${i + 1}`,
            options: (q.options || []).map((opt: any) => ({
              key: opt.optionKey || opt.key || opt.option_label,
              text: opt.optionText || opt.text || opt.option_text,
            })),
            currentAnswer: q.studentAnswer || null,
          }));
          setQuestions(qs);
          const initAns: Record<number, string> = {};
          qs.forEach((q, idx) => {
            if (q.currentAnswer) initAns[idx] = q.currentAnswer;
          });
          setAnswers(initAns);
        } else {
          setErrorMsg('Tidak ada butir soal yang ditemukan pada sesi latihan ini.');
        }
      })
      .catch((err: any) => {
        setErrorMsg(err.message || 'Gagal memuat sesi latihan level dari server.');
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = async (optionKey: string) => {
    const newAns = { ...answers, [currentIndex]: optionKey };
    setAnswers(newAns);

    setSaving(true);
    try {
      await api.learning.saveAnswer(attemptId, currentQ.id, {
        answer: optionKey,
      });
    } catch {
      // offline/silent fallback
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.learning.submit(attemptId);
      router.push(`/learning/result/${attemptId}`);
    } catch (err: any) {
      alert(err.message || 'Gagal mengumpulkan jawaban latihan.');
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-400">Menyiapkan Lembar Latihan...</p>
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
          <h2 className="text-lg font-bold text-white">Kendala Sesi Latihan</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {errorMsg || 'Tidak ada butir soal yang tersedia pada level latihan ini.'}
          </p>
          <button
            onClick={() => router.push('/curriculum')}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Kembali ke Kurikulum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">Latihan Level Kognitif</h2>
            <p className="text-[11px] text-emerald-400 font-medium">Bebas Waktu (Safe-to-Fail)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1.5">
            {saving ? (
              <span className="text-amber-400">Menyimpan...</span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3" /> Jawaban Tersimpan
              </span>
            )}
          </span>

          <button
            onClick={() => setSubmitModalOpen(true)}
            className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-colors"
          >
            Selesaikan ({answeredCount}/{questions.length})
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 mx-auto max-w-3xl w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Question Number Palette 1-10 Bar */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            <div className="flex gap-2">
              {questions.map((q, idx) => {
                const isAns = answers[idx] !== undefined;
                const isCur = currentIndex === idx;
                return (
                  <button
                    key={q.questionNumber}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                      isAns
                        ? 'border-emerald-500 bg-emerald-600/30 text-emerald-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    } ${isCur ? 'ring-2 ring-white scale-105' : ''}`}
                  >
                    {q.questionNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stimulus */}
          {currentQ.stimulus && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-300 border-l-4 border-l-indigo-500">
              {currentQ.stimulus}
            </div>
          )}

          {/* Question Text & Options */}
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
                        ? 'border-indigo-500 bg-indigo-600/20 text-white ring-2 ring-indigo-500/30'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md'
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

        {/* Bottom Navigation */}
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
            Nomor {currentIndex + 1} dari 10
          </span>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setSubmitModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
            >
              <span>Selesaikan Latihan</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h3 className="text-base font-bold text-white">Selesaikan Latihan 10 Soal?</h3>
            <p className="text-xs text-slate-300">
              Anda telah menjawab <span className="font-bold text-emerald-400">{answeredCount}</span> dari 10 butir soal.
            </p>

            {unansweredCount > 0 && (
              <p className="text-[11px] text-amber-400">
                ⚠️ Ada {unansweredCount} butir yang belum dijawab.
              </p>
            )}

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md disabled:opacity-50"
              >
                {submitting ? 'Menilai...' : 'Ya, Selesaikan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
