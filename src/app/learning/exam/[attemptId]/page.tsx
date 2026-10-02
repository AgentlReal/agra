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
  AlertTriangle,
  CheckSquare,
  CircleDot,
  ZoomIn
} from 'lucide-react';
import FormattedContent from '@/components/common/FormattedContent';
import OptionRenderer from '@/components/common/OptionRenderer';

interface QuestionItem {
  id: string | number;
  questionNumber: number;
  stimulus?: string;
  stimulusImageUrl?: string | null;
  questionText: string;
  questionImageUrl?: string | null;
  options: { id?: number; key: string; text: string }[];
  questionFormat: 'SINGLE_CHOICE' | 'COMPLEX_CHOICE';
  currentAnswer?: string[] | null;
}

export default function LearningExamPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const router = useRouter();
  const { attemptId } = use(params);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
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
          const qs: QuestionItem[] = rawQs.map((q: any, i: number) => {
            const stimulusText =
              typeof q.stimulus === 'string'
                ? q.stimulus
                : (q.stimulus?.content_text || q.stimulusText || '');

            const stimulusImageUrl =
              q.stimulus_image_url ||
              q.stimulusImageUrl ||
              (typeof q.stimulus === 'object' && (q.stimulus?.stimulus_image_url || q.stimulus?.image_url)) ||
              q.imageUrl ||
              null;

            const questionImageUrl =
              q.question_image_url ||
              q.questionImageUrl ||
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
              stimulus: stimulusText,
              stimulusImageUrl,
              questionText: q.question_text || q.questionText || '',
              questionImageUrl,
              options: mappedOptions,
              questionFormat,
              currentAnswer,
            };
          });

          setQuestions(qs);
          const initAns: Record<number, string[]> = {};
          qs.forEach((q, idx) => {
            if (q.currentAnswer && q.currentAnswer.length > 0) initAns[idx] = q.currentAnswer;
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
    if (!currentQ) return;

    let nextAnswerKeys: string[] = [];
    if (currentQ.questionFormat === 'COMPLEX_CHOICE') {
      const cur = answers[currentIndex] || [];
      if (cur.includes(optionKey)) {
        nextAnswerKeys = cur.filter((k) => k !== optionKey);
      } else {
        if (cur.length >= 2) return;
        nextAnswerKeys = [...cur, optionKey].sort();
      }
    } else {
      nextAnswerKeys = [optionKey];
    }

    const newAns = { ...answers, [currentIndex]: nextAnswerKeys };
    setAnswers(newAns);

    const selectedOptionIds = currentQ.options
      .filter((o) => nextAnswerKeys.includes(o.key) && o.id)
      .map((o) => o.id as number);

    setSaving(true);
    try {
      await api.learning.saveAnswer(attemptId, currentQ.id, {
        selectedOptionIds,
        currentQuestionOrder: currentQ.questionNumber,
        answer: nextAnswerKeys.join(', '),
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

  const answeredCount = Object.values(answers).filter((arr) => arr && arr.length > 0).length;
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
                const isAns = (answers[idx] || []).length > 0;
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
          {(currentQ.stimulus || currentQ.stimulusImageUrl) && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-300 border-l-4 border-l-indigo-500 space-y-3">
              {currentQ.stimulus && <FormattedContent content={currentQ.stimulus} />}

              {currentQ.stimulusImageUrl && (
                <div className="relative group overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/60 p-2 text-center">
                  <img
                    src={currentQ.stimulusImageUrl}
                    alt="Stimulus visual latihan"
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

          {/* Question Text & Options */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Soal #{currentQ.questionNumber}
              </span>
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

            <div className="text-sm sm:text-base font-medium text-white leading-relaxed">
              <FormattedContent content={currentQ.questionText} />
            </div>

            {currentQ.questionImageUrl && (
              <div className="mt-4 relative group overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/60 p-2 text-center">
                <img
                  src={currentQ.questionImageUrl}
                  alt="Ilustrasi pertanyaan"
                  className="max-h-72 sm:max-h-96 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                  onClick={() => setZoomImageUrl(currentQ.questionImageUrl || null)}
                />
                <button
                  type="button"
                  onClick={() => setZoomImageUrl(currentQ.questionImageUrl || null)}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-slate-900/90 px-2.5 py-1 text-[11px] font-semibold text-slate-300 backdrop-blur-sm border border-slate-700 hover:text-white transition-colors"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                  <span>Perbesar</span>
                </button>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {currentQ.options.map((opt) => {
                const currentAnswers = answers[currentIndex] || [];
                const isSelected = currentAnswers.includes(opt.key);
                const isComplex = currentQ.questionFormat === 'COMPLEX_CHOICE';
                const isMaxReached = isComplex && currentAnswers.length >= 2 && !isSelected;
                return (
                  <button
                    key={opt.key}
                    disabled={isMaxReached}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all ${
                      isMaxReached
                        ? 'opacity-60 cursor-not-allowed border-slate-800 bg-slate-950/40 text-slate-500'
                        : isSelected
                        ? isComplex
                          ? 'border-purple-500 bg-purple-600/20 text-white ring-2 ring-purple-500/30'
                          : 'border-indigo-500 bg-indigo-600/20 text-white ring-2 ring-indigo-500/30'
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
