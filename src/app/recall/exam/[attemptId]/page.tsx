'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { 
  GraduationCap, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Check,
  CheckSquare,
  CircleDot,
  ZoomIn
} from 'lucide-react';
import FormattedContent from '@/components/common/FormattedContent';
import OptionRenderer from '@/components/common/OptionRenderer';

interface QuestionItem {
  id: string | number;
  questionNumber: number;
  subjectName: string;
  stimulus?: string;
  stimulusImageUrl?: string | null;
  questionImageUrl?: string | null;
  questionText: string;
  options: { id?: number; key: string; text: string }[];
  questionFormat: 'SINGLE_CHOICE' | 'COMPLEX_CHOICE';
  currentAnswer?: string[] | null;
  isDoubtful?: boolean;
}

export default function RecallExamPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const router = useRouter();
  const { attemptId } = use(params);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [doubtfuls, setDoubtfuls] = useState<Record<number, boolean>>({});
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  // Initialize questions
  useEffect(() => {
    api.recall
      .getAttempt(attemptId)
      .then((res: any) => {
        const rawQs = res?.questions || res?.data?.questions;
        if (Array.isArray(rawQs) && rawQs.length > 0) {
          const qs: QuestionItem[] = rawQs.map((q: any, i: number) => {
            const stimulusText =
              typeof q.stimulus === 'string'
                ? q.stimulus
                : (q.stimulus?.content_text || q.stimulusText || '');

            const questionImageUrl =
              q.question_image_url ||
              q.questionImageUrl ||
              null;

            const stimulusImageUrl =
              q.stimulus_image_url ||
              q.stimulusImageUrl ||
              (typeof q.stimulus === 'object' && (q.stimulus?.stimulus_image_url || q.stimulus?.image_url)) ||
              q.imageUrl ||
              null;

            const mappedOptions = (q.options || []).map((opt: any) => ({
              id: opt.id ?? opt.option_id,
              key: opt.option_label || opt.optionKey || opt.key,
              text: opt.option_text || opt.optionText || opt.text,
            }));

            const rawFormat = q.question_type || q.question_format || q.questionFormat || 'SINGLE_CHOICE';
            const questionFormat: 'SINGLE_CHOICE' | 'COMPLEX_CHOICE' =
              rawFormat === 'COMPLEX_CHOICE' || rawFormat === 'PG_KOMPLEKS' ? 'COMPLEX_CHOICE' : 'SINGLE_CHOICE';

            let currentAnswer: string[] = [];
            if (Array.isArray(q.selected_option_ids) && q.selected_option_ids.length > 0) {
              const matchedKeys = mappedOptions
                .filter((o: any) => q.selected_option_ids.includes(o.id))
                .map((o: any) => o.key);
              if (matchedKeys.length > 0) currentAnswer = matchedKeys;
            } else if (q.studentAnswer) {
              currentAnswer = Array.isArray(q.studentAnswer)
                ? q.studentAnswer
                : typeof q.studentAnswer === 'string' && q.studentAnswer.includes(',')
                ? q.studentAnswer.split(',').map((s: string) => s.trim())
                : [q.studentAnswer];
            }

            return {
              id: q.session_question_id ?? q.id ?? i + 1,
              questionNumber: q.question_order ?? q.questionNumber ?? i + 1,
              subjectName: q.subjectName || (i < 15 ? 'Matematika SD' : 'Bahasa Indonesia SD'),
              stimulus: stimulusText,
              stimulusImageUrl,
              questionImageUrl,
              questionText: q.question_text || q.questionText || '',
              options: mappedOptions,
              questionFormat,
              currentAnswer,
              isDoubtful: Boolean(q.is_doubtful ?? q.isDoubtful ?? q.is_flagged ?? q.isFlagged),
            };
          });

          setQuestions(qs);
          const initAns: Record<number, string[]> = {};
          const initDbt: Record<number, boolean> = {};
          qs.forEach((q, idx) => {
            if (q.currentAnswer && q.currentAnswer.length > 0) initAns[idx] = q.currentAnswer;
            if (q.isDoubtful) initDbt[idx] = true;
          });
          setAnswers(initAns);
          setDoubtfuls(initDbt);
        } else {
          setErrorMsg('Tidak ada butir soal yang ditemukan pada sesi Recall ini.');
        }
      })
      .catch((err: any) => {
        setErrorMsg(err.message || 'Gagal memuat butir soal Recall dari server.');
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = async (optionKey: string) => {
    if (!currentQ) return;

    let nextAnswerKeys: string[] = [];
    if (currentQ.questionFormat === 'COMPLEX_CHOICE') {
      const cur = answers[currentIndex] || [];
      if (cur.includes(optionKey)) {
        nextAnswerKeys = cur.filter((k) => k !== optionKey);
      } else {
        if (cur.length >= 2) return; // Guard: batas maksimal 2 pilihan
        nextAnswerKeys = [...cur, optionKey].sort();
      }
    } else {
      nextAnswerKeys = [optionKey];
    }

    const newAnswers = { ...answers, [currentIndex]: nextAnswerKeys };
    setAnswers(newAnswers);

    const selectedOptionIds = currentQ.options
      .filter((o) => nextAnswerKeys.includes(o.key) && o.id)
      .map((o) => o.id as number);

    // Trigger autosave to backend
    setSaving(true);
    try {
      await api.recall.saveAnswer(attemptId, currentQ.id, {
        selectedOptionIds,
        isFlagged: doubtfuls[currentIndex] || false,
        currentQuestionOrder: currentQ.questionNumber,
        answer: nextAnswerKeys.join(', '),
      });
    } catch {
      // offline/silent autosave fallback
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDoubtful = async () => {
    if (!currentQ) return;
    const nextDoubtful = !doubtfuls[currentIndex];
    const newDoubtfuls = { ...doubtfuls, [currentIndex]: nextDoubtful };
    setDoubtfuls(newDoubtfuls);

    const curKeys = answers[currentIndex] || [];
    const selectedOptionIds = currentQ.options
      .filter((o) => curKeys.includes(o.key) && o.id)
      .map((o) => o.id as number);

    try {
      await api.recall.saveAnswer(attemptId, currentQ.id, {
        selectedOptionIds,
        isFlagged: nextDoubtful,
        currentQuestionOrder: currentQ.questionNumber,
        answer: curKeys.join(', '),
      });
    } catch {
      // silent
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.recall.submit(attemptId);
      router.push(`/recall/result/${attemptId}`);
    } catch {
      router.push(`/recall/result/${attemptId}`);
    }
  };

  const answeredCount = Object.values(answers).filter((arr) => arr && arr.length > 0).length;
  const doubtfulCount = Object.values(doubtfuls).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-400">Menyiapkan Lembar Asesmen Recall...</p>
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
          <h2 className="text-lg font-bold text-white">Kendala Sesi Asesmen</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {errorMsg || 'Tidak ada butir soal yang tersedia pada sesi ini.'}
          </p>
          <button
            onClick={() => router.push('/recall')}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Kembali ke Halaman Recall
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Top Header CBT Bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">Recall Kemampuanmu</h2>
            <p className="text-[11px] text-indigo-300 font-medium">{currentQ?.subjectName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Autosave status indicator */}
          <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1.5">
            {saving ? (
              <span className="text-amber-400">Menyimpan...</span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3" /> Tersimpan Otomatis
              </span>
            )}
          </span>

          {/* Palette button */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <span>Daftar Soal</span>
            <span className="rounded-md bg-indigo-500/30 px-1.5 py-0.5 text-[10px] text-indigo-300 font-mono">
              {answeredCount}/{questions.length}
            </span>
          </button>

          {/* Submit Action */}
          <button
            onClick={() => setSubmitModalOpen(true)}
            className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-colors"
          >
            Selesaikan
          </button>
        </div>
      </header>

      {/* Main CBT Workspace */}
      <main className="flex-1 mx-auto max-w-4xl w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Question Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                {currentQ.questionNumber}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                dari {questions.length} Butir Soal
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              {currentQ.questionFormat === 'COMPLEX_CHOICE' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-purple-400">
                  <CheckSquare className="h-3 w-3" />
                  Pilihan Ganda Kompleks (Pilih 1 atau 2)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400">
                  <CircleDot className="h-3 w-3" />
                  Pilihan Ganda (1 Jawaban)
                </span>
              )}
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

          {/* Stimulus (if present) */}
          {(currentQ.stimulus || currentQ.stimulusImageUrl) && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-l-4 border-l-indigo-500 space-y-3">
              {currentQ.stimulus && (
                <div>
                  <p className="font-semibold text-indigo-400 mb-1 text-[11px] uppercase tracking-wider">
                    Teks Stimulus Soal:
                  </p>
                  <FormattedContent content={currentQ.stimulus} />
                </div>
              )}

              {currentQ.stimulusImageUrl && (
                <div className="relative group overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/60 p-2 text-center">
                  <img
                    src={currentQ.stimulusImageUrl}
                    alt="Stimulus visual wacana/soal"
                    className="max-h-72 sm:max-h-96 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                    onClick={() => setZoomImageUrl(currentQ.stimulusImageUrl || null)}
                  />
                  <button
                    type="button"
                    onClick={() => setZoomImageUrl(currentQ.stimulusImageUrl || null)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-slate-900/90 px-2.5 py-1 text-[11px] font-semibold text-slate-300 backdrop-blur-sm border border-slate-700 hover:text-white transition-colors"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                    <span>Perbesar</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Question Text */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-md">
            {currentQ.questionImageUrl && (
              <div className="relative group overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/60 p-2 text-center mb-4">
                <img
                  src={currentQ.questionImageUrl}
                  alt="Gambar soal"
                  className="max-h-64 sm:max-h-80 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                  onClick={() => setZoomImageUrl(currentQ.questionImageUrl || null)}
                />
              </div>
            )}
            <div className="text-sm sm:text-base font-medium text-white leading-relaxed">
              <FormattedContent content={currentQ.questionText} />
            </div>

            {/* Options List */}
            <div className="mt-6 space-y-3">
              {currentQ.options.map((opt) => {
                const currentAnswers = answers[currentIndex] || [];
                const isSelected = currentAnswers.includes(opt.key);
                const isComplex = currentQ.questionFormat === 'COMPLEX_CHOICE';
                const isMaxReached = isComplex && currentAnswers.length >= 2 && !isSelected;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    disabled={isMaxReached}
                    className={`w-full flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? isComplex
                          ? 'border-purple-500 bg-purple-600/20 text-white ring-2 ring-purple-500/30'
                          : 'border-indigo-500 bg-indigo-600/20 text-white ring-2 ring-indigo-500/30'
                        : isMaxReached
                        ? 'border-slate-800/50 bg-slate-950/40 text-slate-500 opacity-60 cursor-not-allowed'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center text-xs font-bold transition-colors ${
                        isComplex ? 'rounded-md' : 'rounded-lg'
                      } ${
                        isSelected
                          ? isComplex
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isSelected && isComplex ? <Check className="h-4 w-4" /> : opt.key}
                    </div>
                    <div className="text-xs sm:text-sm pt-0.5 leading-relaxed flex-1">
                      <OptionRenderer text={opt.text} onZoom={setZoomImageUrl} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Sebelumnya</span>
          </button>

          <span className="text-xs text-slate-500 hidden sm:inline">
            Soal {currentIndex + 1} dari {questions.length}
          </span>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-colors"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setSubmitModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-colors"
            >
              <span>Kumpulkan Jawaban</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </main>

      {/* Palette Modal / Drawer */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Palet Daftar Soal (1 - 30)</h3>
              <button
                onClick={() => setPaletteOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Legend */}
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

            {/* Grid of 30 Buttons */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const isAnswered = (answers[idx] || []).length > 0;
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
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Tutup Palet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="text-base font-bold text-white">Konfirmasi Pengumpulan Asesmen</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pastikan Anda telah memeriksa jawaban sebelum menyelesaikan sesi ini.
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

            {unansweredCount > 0 && (
              <p className="text-[11px] text-amber-400">
                ⚠️ Masih ada {unansweredCount} soal yang belum Anda jawab. Anda tetap dapat mengumpulkannya.
              </p>
            )}

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cek Kembali
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 disabled:opacity-50"
              >
                {submitting ? 'Mengirim...' : 'Ya, Kumpulkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150"
          onClick={() => setZoomImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomImageUrl(null)}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={zoomImageUrl}
              alt="Stimulus visual diperbesar"
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
