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
  X,
  CheckSquare,
  CircleDot,
  ZoomIn,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import FormattedContent from '@/components/common/FormattedContent';
import OptionRenderer from '@/components/common/OptionRenderer';
import { normalizeImageUrl } from '@/lib/image-utils';

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
  isDoubtful?: boolean;
}

export default function SimulationExamPage({ params }: { params: Promise<{ attemptId: string }> }) {
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

            const savedIds = q.saved_answer?.selected_option_ids || q.selected_option_ids;
            let currentAnswer: string[] = [];
            if (Array.isArray(savedIds) && savedIds.length > 0) {
              const matchedKeys = mappedOptions
                .filter((o: any) => savedIds.includes(o.id))
                .map((o: any) => o.key);
              if (matchedKeys.length > 0) currentAnswer = matchedKeys;
            } else if (q.studentAnswer) {
              currentAnswer = Array.isArray(q.studentAnswer)
                ? q.studentAnswer
                : typeof q.studentAnswer === 'string' && q.studentAnswer.includes(',')
                ? q.studentAnswer.split(',').map((s: string) => s.trim())
                : [q.studentAnswer];
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
              stimulusImageUrl,
              questionText: q.question_text || q.questionText || '',
              questionImageUrl,
              options: mappedOptions,
              questionFormat,
              currentAnswer,
              isDoubtful,
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

    const newAnswers = { ...answers, [currentIndex]: nextAnswerKeys };
    setAnswers(newAnswers);

    const selectedOptionIds = currentQ.options
      .filter((o) => nextAnswerKeys.includes(o.key) && o.id)
      .map((o) => o.id as number);

    setSaving(true);
    try {
      await api.simulation.saveAnswer(attemptId, currentQ.id, {
        selectedOptionIds,
        is_doubtful: doubtfuls[currentIndex] || false,
        currentQuestionOrder: currentQ.questionNumber,
        answer: nextAnswerKeys.join(', '),
      });
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDoubtful = async () => {
    if (!currentQ) return;
    const nextDoubtful = !doubtfuls[currentIndex];
    setDoubtfuls({ ...doubtfuls, [currentIndex]: nextDoubtful });

    const curKeys = answers[currentIndex] || [];
    const selectedOptionIds = currentQ.options
      .filter((o) => curKeys.includes(o.key) && o.id)
      .map((o) => o.id as number);

    try {
      await api.simulation.saveAnswer(attemptId, currentQ.id, {
        selectedOptionIds,
        is_doubtful: nextDoubtful,
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

  const isLowTime = timeLeft <= 300; // <= 5 mins (Safe-to-fail: use warm amber, not red)

  const answeredCount = Object.values(answers).filter((arr) => arr && arr.length > 0).length;
  const doubtfulCount = Object.values(doubtfuls).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Menyiapkan Ruang Ujian CBT Simulasi...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] p-6 text-center">
        <div className="max-w-md space-y-4 rounded-3xl border border-amber-200 bg-white p-8 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mx-auto border border-amber-200">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Kendala Sesi Simulasi</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {errorMsg || 'Tidak ada butir soal yang tersedia pada simulasi ini.'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full btn-tactile-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-white cursor-pointer"
          >
            Kembali ke Dasbor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-800">
      {/* Header CBT with 75-min Timer */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Simulasi TKA CBT</h2>
            <p className="text-[11px] text-purple-700 font-medium">Asesmen Puncak Terstandar</p>
          </div>
        </div>

        {/* 75-Min Countdown Timer (Zero-Red: uses warm amber when low) */}
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-1.5 border font-mono text-sm font-bold transition-colors ${
            isLowTime
              ? 'border-amber-400 bg-amber-50 text-amber-800'
              : 'border-slate-200 bg-slate-50 text-slate-700'
          }`}
        >
          <Clock className={`h-4 w-4 ${isLowTime ? 'text-amber-600' : 'text-purple-600'}`} />
          <span>Sisa Waktu: {formatTime(timeLeft)}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Daftar Soal</span>
            <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-700 font-bold border border-purple-100 font-mono">
              {answeredCount}/{questions.length}
            </span>
          </button>

          <button
            onClick={() => setSubmitModalOpen(true)}
            className="btn-tactile-secondary rounded-xl px-4 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
          >
            Kumpulkan
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 mx-auto max-w-4xl w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-xs font-bold text-white">
                {currentQ.questionNumber}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                dari {questions.length} Butir Soal
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              {currentQ.questionFormat === 'COMPLEX_CHOICE' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-0.5 text-[11px] font-semibold text-purple-700">
                  <CheckSquare className="h-3.5 w-3.5" />
                  Pilihan Ganda Kompleks (Pilih 1 atau 2)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 text-[11px] font-semibold text-blue-700">
                  <CircleDot className="h-3.5 w-3.5" />
                  Pilihan Ganda (1 Jawaban)
                </span>
              )}
            </div>

            <button
              onClick={handleToggleDoubtful}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                doubtfuls[currentIndex]
                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Flag className={`h-3.5 w-3.5 ${doubtfuls[currentIndex] ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>{doubtfuls[currentIndex] ? 'Ditandai Ragu-ragu' : 'Tandai Ragu-ragu'}</span>
            </button>
          </div>

          {(() => {
            const normStimulusImg = normalizeImageUrl(currentQ.stimulusImageUrl);
            const normQuestionImg = normalizeImageUrl(currentQ.questionImageUrl);
            const showQuestionImg = normQuestionImg && (normQuestionImg !== normStimulusImg || !normStimulusImg);

            return (
              <>
                {(currentQ.stimulus || normStimulusImg) && (
                  <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 sm:p-5 text-xs sm:text-sm text-slate-700 leading-relaxed border-l-4 border-l-purple-600 space-y-3">
                    {currentQ.stimulus && (
                      <div>
                        <p className="font-bold text-purple-700 mb-1.5 text-[11px] uppercase tracking-wider">
                          Teks Stimulus Bacaan:
                        </p>
                        <FormattedContent content={currentQ.stimulus} />
                      </div>
                    )}

                    {normStimulusImg && (
                      <div className="relative group overflow-hidden rounded-xl border border-purple-100 bg-white p-2 text-center">
                        <img
                          src={normStimulusImg}
                          alt="Stimulus visual simulasi"
                          className="max-h-72 sm:max-h-96 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                          onClick={() => setZoomImageUrl(normStimulusImg)}
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() => setZoomImageUrl(normStimulusImg)}
                          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-white transition-colors"
                        >
                          <ZoomIn className="h-3.5 w-3.5 text-purple-600" />
                          <span>Perbesar</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                      Soal #{currentQ.questionNumber}
                    </span>
                    {currentQ.questionFormat === 'COMPLEX_CHOICE' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                        <CheckSquare className="h-3 w-3" />
                        Pilihan Ganda Kompleks (Pilih 1 atau 2)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                        <CircleDot className="h-3 w-3" />
                        Pilihan Ganda (1 Jawaban)
                      </span>
                    )}
                  </div>

                  <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                    <FormattedContent content={currentQ.questionText} />
                  </div>

                  {showQuestionImg && (
                    <div className="mt-4 relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 text-center">
                      <img
                        src={normQuestionImg!}
                        alt="Ilustrasi pertanyaan"
                        className="max-h-72 sm:max-h-96 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                        onClick={() => setZoomImageUrl(normQuestionImg!)}
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => setZoomImageUrl(normQuestionImg!)}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-white transition-colors"
                      >
                        <ZoomIn className="h-3.5 w-3.5 text-purple-600" />
                        <span>Perbesar</span>
                      </button>
                    </div>
                  )}

                  <div className="mt-6 space-y-3">
                    {currentQ.options.map((opt, oIdx) => {
                      const currentAnswers = answers[currentIndex] || [];
                      const isSelected = currentAnswers.includes(opt.key);
                      const isComplex = currentQ.questionFormat === 'COMPLEX_CHOICE';
                      const isMaxReached = isComplex && currentAnswers.length >= 2 && !isSelected;
                      return (
                        <button
                          key={opt.key || opt.id || `opt-${oIdx}`}
                          disabled={isMaxReached}
                          onClick={() => handleSelectOption(opt.key)}
                          className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            isMaxReached
                              ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400'
                              : isSelected
                              ? 'border-purple-600 bg-purple-50/70 text-slate-900 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-slate-50/60'
                          }`}
                        >
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center text-xs font-bold transition-colors ${
                              isComplex ? 'rounded-lg' : 'rounded-full'
                            } ${
                              isSelected
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {isSelected && isComplex ? <Check className="h-4 w-4" /> : opt.key}
                          </div>
                          <div className="text-xs sm:text-sm pt-0.5 leading-relaxed flex-1 font-medium">
                            <OptionRenderer text={opt.text} onZoom={setZoomImageUrl} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Bottom Nav */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Sebelumnya</span>
          </button>

          <span className="text-xs font-semibold text-slate-500">
            Nomor {currentIndex + 1} dari {questions.length}
          </span>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="btn-tactile-primary flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setSubmitModalOpen(true)}
              className="btn-tactile-secondary flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              <span>Kumpulkan Ujian</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </main>

      {/* Palette Modal */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Palet 30 Butir Soal Simulasi</h3>
              <button 
                onClick={() => setPaletteOpen(false)} 
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 flex flex-wrap gap-4 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-emerald-600" />
                <span>Dijawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-amber-500" />
                <span>Ragu-ragu ({doubtfulCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md border border-slate-200 bg-slate-50" />
                <span>Belum ({unansweredCount})</span>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const isAnswered = (answers[idx] || []).length > 0;
                const isDoubt = doubtfuls[idx];
                const isCurrent = currentIndex === idx;

                let colorClass = 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100';
                if (isDoubt) {
                  colorClass = 'border-amber-300 bg-amber-50 text-amber-800 font-bold';
                } else if (isAnswered) {
                  colorClass = 'border-emerald-200 bg-emerald-50 text-emerald-800 font-bold';
                }

                return (
                  <button
                    key={q.id || q.questionNumber || `pal-${idx}`}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setPaletteOpen(false);
                    }}
                    className={`flex h-10 w-full items-center justify-center rounded-xl border text-xs transition-all cursor-pointer ${colorClass} ${
                      isCurrent ? 'ring-2 ring-purple-600 scale-105' : ''
                    }`}
                  >
                    {q.questionNumber}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPaletteOpen(false)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">Kumpulkan Lembar Jawaban Simulasi?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sisa waktu Anda masih <strong className="text-purple-700 font-mono">{formatTime(timeLeft)}</strong>. Setelah dikumpulkan, hasil dan evaluasi nilai Anda akan segera diproses.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-slate-500 font-medium">Dijawab</p>
                <p className="text-xl font-bold text-emerald-700 mt-0.5">{answeredCount}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Ragu-ragu</p>
                <p className="text-xl font-bold text-amber-700 mt-0.5">{doubtfulCount}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Belum</p>
                <p className="text-xl font-bold text-slate-700 mt-0.5">{unansweredCount}</p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Lanjutkan Ujian
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 btn-tactile-secondary rounded-xl px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Mengumpulkan...' : 'Ya, Selesaikan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-150"
          onClick={() => setZoomImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"
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
