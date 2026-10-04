'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle2, 
  X, 
  Check,
  CheckSquare,
  CircleDot,
  ZoomIn,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  BookOpen,
  LayoutGrid,
  FastForward,
  Loader2
} from 'lucide-react';
import FormattedContent from '@/components/common/FormattedContent';
import OptionRenderer from '@/components/common/OptionRenderer';
import { normalizeImageUrl } from '@/lib/image-utils';

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
  const [paletteMobileOpen, setPaletteMobileOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [saveError, setSaveError] = useState<{
    message: string;
    status?: number;
    questionNumber?: number;
  } | null>(null);
  const [failedSaveIndices, setFailedSaveIndices] = useState<number[]>([]);
  const [showSubmitWarningModal, setShowSubmitWarningModal] = useState(false);

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

            const sessionQuestionId = q.session_question_id ?? q.id;
            if (!sessionQuestionId || isNaN(Number(sessionQuestionId))) {
              throw new Error(`Data butir soal nomor urut ${q.question_order ?? (i + 1)} tidak valid (ID sesi soal tidak ditemukan dari server).`);
            }

            return {
              id: sessionQuestionId,
              questionNumber: q.question_order ?? q.questionNumber ?? (i + 1),
              subjectName: q.subject_name || q.subjectName || 'TKA SMP',
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

          // Populate initial answers & doubtfuls map
          const initAns: Record<number, string[]> = {};
          const initDoubt: Record<number, boolean> = {};
          qs.forEach((q, idx) => {
            if (q.currentAnswer && q.currentAnswer.length > 0) {
              initAns[idx] = q.currentAnswer;
            }
            if (q.isDoubtful) {
              initDoubt[idx] = true;
            }
          });
          setAnswers(initAns);
          setDoubtfuls(initDoubt);
        } else {
          setErrorMsg('Tidak ada butir soal asesmen yang ditemukan.');
        }
      })
      .catch((err: any) => {
        console.error('Failed to load recall attempt:', err);
        setErrorMsg(err.message || 'Gagal memuat sesi pengerjaan Recall.');
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (key: string) => {
    if (!currentQ) return;
    const isComplex = currentQ.questionFormat === 'COMPLEX_CHOICE';
    const cur = answers[currentIndex] || [];
    let updated: string[];

    if (isComplex) {
      if (cur.includes(key)) {
        updated = cur.filter((k) => k !== key);
      } else {
        if (cur.length >= 2) return;
        updated = [...cur, key];
      }
    } else {
      updated = [key];
    }

    setAnswers((prev) => ({ ...prev, [currentIndex]: updated }));
    saveAnswer(currentIndex, updated, doubtfuls[currentIndex] || false);
  };

  const handleToggleDoubtful = () => {
    const nextVal = !doubtfuls[currentIndex];
    setDoubtfuls((prev) => ({ ...prev, [currentIndex]: nextVal }));
    saveAnswer(currentIndex, answers[currentIndex] || [], nextVal);
  };

  const saveAnswer = async (qIndex: number, selectedKeys: string[], isDoubt: boolean) => {
    const targetQ = questions[qIndex];
    if (!targetQ) return;

    setSaving(true);
    try {
      const selectedOptionIds = targetQ.options
        .filter((o) => selectedKeys.includes(o.key) && o.id !== undefined && o.id !== null)
        .map((o) => Number(o.id));

      await api.recall.saveAnswer(attemptId, targetQ.id, {
        answer: selectedKeys,
        selectedOptionIds,
        selected_option_ids: selectedOptionIds,
        isFlagged: isDoubt,
        is_flagged: isDoubt,
        isDoubtful: isDoubt,
        currentQuestionOrder: qIndex + 1,
        current_question_order: qIndex + 1,
      });

      // Clear successful question from failed list
      setFailedSaveIndices((prev) => prev.filter((idx) => idx !== qIndex));
      setSaveError((prev) => (prev?.questionNumber === qIndex + 1 ? null : prev));
    } catch (err: any) {
      console.error('Autosave failed:', err);
      setFailedSaveIndices((prev) => (prev.includes(qIndex) ? prev : [...prev, qIndex]));
      setSaveError({
        message: err.message || 'Gagal menyimpan jawaban ke server.',
        status: err.status,
        questionNumber: qIndex + 1,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRetrySave = (qIndex: number) => {
    saveAnswer(qIndex, answers[qIndex] || [], doubtfuls[qIndex] || false);
  };

  const handleRetryAllFailed = async () => {
    const targets = [...failedSaveIndices];
    for (const idx of targets) {
      await saveAnswer(idx, answers[idx] || [], doubtfuls[idx] || false);
    }
  };

  const handleSubmit = async (force = false) => {
    if (!force && failedSaveIndices.length > 0) {
      setShowSubmitWarningModal(true);
      return;
    }

    setSubmitting(true);
    try {
      await api.recall.submit(attemptId);
      router.push(`/recall/result/${attemptId}`);
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim jawaban Recall.');
      setSubmitting(false);
    }
  };

  const answeredCount = Object.values(answers).filter((a) => a && a.length > 0).length;
  const doubtfulCount = Object.values(doubtfuls).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;
  const answeredProgressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-xs font-semibold text-slate-500">Menyiapkan butir soal Recall Kemampuan...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !currentQ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Kendala Sesi Recall</h2>
          <p className="text-xs text-slate-500 leading-relaxed">{errorMsg || 'Soal tidak ditemukan.'}</p>
          <button
            onClick={() => router.push('/recall')}
            className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 transition-colors cursor-pointer"
          >
            Kembali ke Beranda Recall
          </button>
        </div>
      </div>
    );
  }

  const normStimulusImg = normalizeImageUrl(currentQ.stimulusImageUrl);
  const normQuestionImg = normalizeImageUrl(currentQ.questionImageUrl);
  const showQuestionImg = normQuestionImg && (normQuestionImg !== normStimulusImg || !normStimulusImg);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Sub-header Navigation & Progress Bar (Inspired by reference-design/recall-kemampuan-9b) */}
      <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white shadow-2xs backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  Recall Kemampuan
                </span>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  Asesmen Diagnostik
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {currentQ.subjectName || 'Matematika & Bahasa Indonesia SMP'} • Standar Fase D
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Top Progress Indicator */}
            <div className="hidden md:flex flex-col items-end gap-1 min-w-[200px]">
              <div className="flex items-center justify-between w-full text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Progres Jawaban</span>
                <span className="font-bold text-blue-600">
                  {answeredCount} dari {questions.length} Terjawab ({answeredProgressPercent}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${answeredProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Mobile Peta Soal Trigger */}
            <button
              onClick={() => setPaletteMobileOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              <LayoutGrid className="h-4 w-4 text-blue-600" />
              <span>Peta Soal</span>
              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 font-mono">
                {answeredCount}/{questions.length}
              </span>
            </button>

            {/* Selesaikan Button */}
            <button
              onClick={() => setSubmitModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 transition-colors shadow-2xs cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Selesaikan Recall</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Autosave Error Notification Banner */}
        {saveError && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950">
                  {saveError.status === 404
                    ? 'Sesi Ujian Tidak Valid / Soal Tidak Ditemukan (404)'
                    : `Gagal Menyimpan Jawaban (Soal #${saveError.questionNumber})`}
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  {saveError.status === 404
                    ? 'Sesi Recall tidak ditemukan atau telah berakhir di server. Silakan kembali ke halaman utama Recall.'
                    : saveError.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {saveError.status === 404 ? (
                <button
                  type="button"
                  onClick={() => router.push('/recall')}
                  className="rounded-xl bg-amber-900 text-white px-3.5 py-1.5 text-xs font-bold hover:bg-amber-950 transition-colors shadow-2xs cursor-pointer"
                >
                  Kembali ke Halaman Recall
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => saveError.questionNumber && handleRetrySave(saveError.questionNumber - 1)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Coba Simpan Ulang</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* LEFT PANE: Question, Stimulus & Option Area (~68% width on desktop) */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Stimulus Section (Inspired by reference-design/recall-kemampuan-9b) */}
            {(currentQ.stimulus || normStimulusImg) && (
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 text-white px-3 py-1 text-[11px] font-bold tracking-wider uppercase shadow-2xs">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>STIMULUS SOAL</span>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-[11px] font-semibold">
                    <span>{currentQ.subjectName || 'Numerasi & Geometri Ruang'}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 space-y-3.5">
                  {currentQ.stimulus && (
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      <FormattedContent content={currentQ.stimulus} />
                    </div>
                  )}

                  {normStimulusImg && (
                    <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 text-center">
                      <img
                        src={normStimulusImg}
                        alt="Visual Stimulus"
                        className="max-h-72 sm:max-h-96 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                        onClick={() => setZoomImageUrl(normStimulusImg)}
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => setZoomImageUrl(normStimulusImg)}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-white transition-colors"
                      >
                        <ZoomIn className="h-3.5 w-3.5 text-blue-600" />
                        <span>Perbesar Gambar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Question Stem Box */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-sm shadow-2xs">
                  ?
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Butir Soal #{currentQ.questionNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    {currentQ.questionFormat === 'COMPLEX_CHOICE' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        <CheckSquare className="h-3 w-3 text-purple-600" /> Pilihan Ganda Kompleks (Maks. 2 Jawaban)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        <CircleDot className="h-3 w-3 text-blue-600" /> Pilihan Ganda Tunggal
                      </span>
                    )}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed pt-1">
                    <FormattedContent content={currentQ.questionText} />
                  </div>
                </div>
              </div>

              {showQuestionImg && (
                <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-center">
                  <img
                    src={normQuestionImg!}
                    alt="Ilustrasi Pertanyaan"
                    className="max-h-72 sm:max-h-96 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                    onClick={() => setZoomImageUrl(normQuestionImg!)}
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => setZoomImageUrl(normQuestionImg!)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-white transition-colors"
                  >
                    <ZoomIn className="h-3.5 w-3.5 text-blue-600" />
                    <span>Perbesar</span>
                  </button>
                </div>
              )}

              {/* Options Stack (With "Pilihan Anda" badge tag) */}
              <div className="space-y-3 pt-2">
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
                      className={`group w-full flex items-center justify-between gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isMaxReached
                          ? 'opacity-40 cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                          : isSelected
                          ? 'border-blue-600 bg-blue-50/40 text-slate-900 shadow-2xs ring-1 ring-blue-600/30'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center text-xs font-bold rounded-full transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-slate-200/80'
                          }`}
                        >
                          {isSelected && isComplex ? <Check className="h-4 w-4" /> : opt.key}
                        </div>
                        <div className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                          <OptionRenderer text={opt.text} onZoom={setZoomImageUrl} />
                        </div>
                      </div>

                      {/* Selected State Badge */}
                      {isSelected && (
                        <div className="shrink-0 flex items-center gap-1.5 rounded-full bg-blue-100 border border-blue-200/80 px-3 py-1 text-[11px] font-bold text-blue-700">
                          <Check className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Pilihan Anda</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Question Navigation Toolbar */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Skip Question (Left) */}
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIndex >= questions.length - 1}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <FastForward className="h-4 w-4 text-slate-400" />
                  <span>Lewati Soal Ini</span>
                </button>

                {/* Right: Ragu-ragu & Save/Next */}
                <div className="w-full sm:w-auto flex items-center gap-2.5">
                  <button
                    onClick={handleToggleDoubtful}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      doubtfuls[currentIndex]
                        ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <Flag className={`h-3.5 w-3.5 ${doubtfuls[currentIndex] ? 'text-amber-600 fill-amber-600' : 'text-slate-400'}`} />
                    <span>{doubtfuls[currentIndex] ? 'Ditandai Ragu-ragu' : 'Ragu-ragu'}</span>
                  </button>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Simpan &amp; Lanjut</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setSubmitModalOpen(true)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Selesaikan Recall</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Sticky Sidebar "Peta Soal" (~32% width on desktop) */}
          <aside className="hidden lg:block w-80 shrink-0 sticky top-24 space-y-5">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
              
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <LayoutGrid className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-extrabold text-slate-900 tracking-tight">Peta Soal</span>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-600 border border-slate-200">
                  {questions.length} Butir
                </span>
              </div>

              {/* Diagnostic Info Card */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>Asesmen Awal Safe-to-Fail</span>
                </div>
                <p className="text-[11px] text-blue-700/90 leading-relaxed">
                  Skor &ge; 90% (minimal 27 benar) membuka bypass kurikulum. Hasil keliru tidak memotong poin.
                </p>
              </div>

              {/* Status Color Legend */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full border border-slate-300 bg-slate-100" />
                  <span>Belum ({unansweredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-blue-600" />
                  <span>Sudah ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span>Ragu ({doubtfulCount})</span>
                </div>
              </div>

              {/* Failed Sync Alert in Palette */}
              {failedSaveIndices.length > 0 && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950">
                  <span className="flex items-center gap-1 font-bold">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    {failedSaveIndices.length} Belum Tersinkron
                  </span>
                  <button
                    type="button"
                    onClick={handleRetryAllFailed}
                    className="font-bold underline text-amber-800 hover:text-amber-950 transition-colors cursor-pointer"
                  >
                    Simpan Ulang
                  </button>
                </div>
              )}

              {/* Question Matrix Grid */}
              <div className="grid grid-cols-5 gap-2 max-h-[340px] overflow-y-auto p-1">
                {questions.map((q, idx) => {
                  const isAnswered = (answers[idx] || []).length > 0;
                  const isDoubt = doubtfuls[idx];
                  const isCurrent = currentIndex === idx;
                  const isFailedSave = failedSaveIndices.includes(idx);

                  let colorClass = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300';
                  if (isFailedSave) {
                    colorClass = 'border-amber-400 bg-amber-100 text-amber-900 font-black ring-1 ring-amber-400';
                  } else if (isDoubt) {
                    colorClass = 'border-amber-400 bg-amber-50 text-amber-800 font-bold';
                  } else if (isAnswered) {
                    colorClass = 'border-blue-600 bg-blue-600 text-white font-bold shadow-2xs';
                  }

                  return (
                    <button
                      key={q.id || q.questionNumber || `pal-${idx}`}
                      onClick={() => setCurrentIndex(idx)}
                      title={isFailedSave ? 'Belum berhasil tersimpan ke server' : undefined}
                      className={`flex h-10 items-center justify-center rounded-xl border text-xs font-mono transition-all cursor-pointer relative ${colorClass} ${
                        isCurrent ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 font-extrabold z-10' : ''
                      }`}
                    >
                      {String(q.questionNumber).padStart(2, '0')}
                      {isFailedSave && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 border border-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Finish Exam Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleSubmit(false)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 transition-colors shadow-2xs cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Selesaikan Recall</span>
                </button>
              </div>

            </div>
          </aside>

        </div>
      </main>

      {/* Mobile Palette Drawer / Modal */}
      {paletteMobileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 lg:hidden animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Peta Soal Recall</h3>
              </div>
              <button 
                onClick={() => setPaletteMobileOpen(false)} 
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 px-1">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full border border-slate-300 bg-slate-100" />
                <span>Belum ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-blue-600" />
                <span>Sudah ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span>Ragu ({doubtfulCount})</span>
              </div>
            </div>

            {failedSaveIndices.length > 0 && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950">
                <span className="flex items-center gap-1 font-bold">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  {failedSaveIndices.length} Belum Tersinkron
                </span>
                <button
                  type="button"
                  onClick={handleRetryAllFailed}
                  className="font-bold underline text-amber-800 hover:text-amber-950 transition-colors cursor-pointer"
                >
                  Simpan Ulang
                </button>
              </div>
            )}

            <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const isAnswered = (answers[idx] || []).length > 0;
                const isDoubt = doubtfuls[idx];
                const isCurrent = currentIndex === idx;
                const isFailedSave = failedSaveIndices.includes(idx);

                let colorClass = 'border-slate-200 bg-white text-slate-700';
                if (isFailedSave) {
                  colorClass = 'border-amber-400 bg-amber-100 text-amber-900 font-bold';
                } else if (isDoubt) {
                  colorClass = 'border-amber-400 bg-amber-50 text-amber-800 font-bold';
                } else if (isAnswered) {
                  colorClass = 'border-blue-600 bg-blue-600 text-white font-bold';
                }

                return (
                  <button
                    key={q.id || q.questionNumber || `pal-mob-${idx}`}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setPaletteMobileOpen(false);
                    }}
                    className={`flex h-10 items-center justify-center rounded-xl border text-xs font-mono transition-all cursor-pointer relative ${colorClass} ${
                      isCurrent ? 'ring-2 ring-blue-600 scale-105' : ''
                    }`}
                  >
                    {String(q.questionNumber).padStart(2, '0')}
                    {isFailedSave && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 border border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPaletteMobileOpen(false)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Tutup Peta Soal
            </button>
          </div>
        </div>
      )}

      {/* Warning Modal when Submitting with Unsaved/Failed Questions */}
      {showSubmitWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Ada Jawaban Belum Tersimpan</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Terdapat {failedSaveIndices.length} butir jawaban yang belum berhasil tersinkronisasi ke server.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
              Sebaiknya Anda mencoba simpan ulang terlebih dahulu agar seluruh hasil pekerjaan Anda dinilai secara akurat oleh sistem.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSubmitWarningModal(false);
                  handleRetryAllFailed();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 transition-colors shadow-2xs cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Simpan Ulang Semua</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitWarningModal(false);
                  handleSubmit(true);
                }}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-4 transition-colors cursor-pointer"
              >
                <span>Tetap Kumpulkan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Submit Confirmation Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">Selesaikan Sesi Recall Kemampuan?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Setelah dikumpulkan, hasil asesmen diagnostik Anda akan diproses untuk memetakan kesiapan nalar belajar.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-slate-500 font-medium">Dijawab</p>
                <p className="text-xl font-bold text-blue-700 mt-0.5">{answeredCount}</p>
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
                Lanjutkan Soal
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitModalOpen(false);
                  handleSubmit(false);
                }}
                disabled={submitting}
                className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 transition-colors disabled:opacity-50 cursor-pointer"
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
