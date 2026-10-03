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
  AlertCircle
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
              subjectName: q.subject_name || q.subjectName || 'TKA SMP',
              stimulus: stimulusText,
              stimulusImageUrl,
              questionImageUrl,
              questionText: q.question_text || q.questionText || '',
              options: mappedOptions,
              questionFormat,
              currentAnswer,
              isDoubtful: Boolean(q.is_doubtful ?? q.isDoubtful),
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
    saveAnswer(currentIndex, updated);
  };

  const saveAnswer = async (qIndex: number, selectedKeys: string[]) => {
    const targetQ = questions[qIndex];
    if (!targetQ) return;

    setSaving(true);
    try {
      const selectedOptionIds = targetQ.options
        .filter((o) => selectedKeys.includes(o.key) && o.id !== undefined)
        .map((o) => o.id as number);

      await api.recall.saveAnswer(attemptId, targetQ.id, {
        answer: selectedKeys,
        selectedOptionIds,
        isDoubtful: Boolean(doubtfuls[qIndex]),
      });
    } catch (err) {
      console.error('Autosave failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDoubtful = () => {
    const nextVal = !doubtfuls[currentIndex];
    setDoubtfuls((prev) => ({ ...prev, [currentIndex]: nextVal }));
    const curAns = answers[currentIndex] || [];
    saveAnswer(currentIndex, curAns);
  };

  const handleSubmitAttempt = async () => {
    setSubmitting(true);
    try {
      await api.recall.submit(attemptId);
      router.push(`/recall/result/${attemptId}`);
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim lembar jawaban Recall.');
      setSubmitting(false);
    }
  };

  const answeredCount = Object.values(answers).filter((a) => a && a.length > 0).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-600">Menyiapkan butir soal Recall Kemampuanmu...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !currentQ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Kendala Memuat Sesi</h2>
          <p className="text-xs text-slate-500 leading-relaxed">{errorMsg || 'Soal tidak ditemukan.'}</p>
          <button
            onClick={() => router.push('/recall')}
            className="btn-tactile-primary px-5 py-2.5 rounded-xl text-xs font-bold"
          >
            Kembali ke Beranda Recall
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      {/* Top Header CBT Bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-8 backdrop-blur-md shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Recall Kemampuanmu</h2>
            <p className="text-[11px] text-blue-600 font-medium">{currentQ?.subjectName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Autosave status indicator */}
          <span className="text-[11px] text-slate-500 hidden sm:inline-flex items-center gap-1.5 font-medium">
            {saving ? (
              <span className="text-amber-600">Menyimpan...</span>
            ) : (
              <span className="text-emerald-600 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Tersimpan Otomatis
              </span>
            )}
          </span>

          {/* Palette button */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Daftar Soal</span>
            <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700 font-bold border border-blue-100">
              {answeredCount}/{questions.length}
            </span>
          </button>

          {/* Submit Action */}
          <button
            onClick={() => setSubmitModalOpen(true)}
            className="btn-tactile-secondary rounded-xl px-4 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
          >
            Selesaikan
          </button>
        </div>
      </header>

      {/* Main CBT Workspace */}
      <main className="flex-1 mx-auto max-w-4xl w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Question Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
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

          {/* Stimulus (if present) & Question Images */}
          {(() => {
            const normStimulusImg = normalizeImageUrl(currentQ.stimulusImageUrl);
            const normQuestionImg = normalizeImageUrl(currentQ.questionImageUrl);
            const showQuestionImg = normQuestionImg && (normQuestionImg !== normStimulusImg || !normStimulusImg);

            return (
              <>
                {(currentQ.stimulus || normStimulusImg) && (
                  <div className="rounded-2xl border border-blue-100 bg-[#eff6ff]/50 p-4 sm:p-5 text-xs sm:text-sm text-slate-700 leading-relaxed border-l-4 border-l-blue-600 space-y-3">
                    {currentQ.stimulus && (
                      <div>
                        <p className="font-bold text-blue-700 mb-1.5 text-[11px] uppercase tracking-wider">
                          Teks Stimulus Bacaan:
                        </p>
                        <FormattedContent content={currentQ.stimulus} />
                      </div>
                    )}

                    {normStimulusImg && (
                      <div className="relative group overflow-hidden rounded-xl border border-blue-100 bg-white p-2 text-center">
                        <img
                          src={normStimulusImg}
                          alt="Stimulus visual wacana/soal"
                          className="max-h-72 sm:max-h-96 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                          onClick={() => setZoomImageUrl(normStimulusImg)}
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() => setZoomImageUrl(normStimulusImg)}
                          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-white transition-colors"
                        >
                          <ZoomIn className="h-3.5 w-3.5 text-blue-600" />
                          <span>Perbesar</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Question Text & Options Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
                  {showQuestionImg && (
                    <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 text-center mb-5">
                      <img
                        src={normQuestionImg!}
                        alt="Gambar soal"
                        className="max-h-64 sm:max-h-80 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                        onClick={() => setZoomImageUrl(normQuestionImg!)}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                    <FormattedContent content={currentQ.questionText} />
                  </div>

                  {/* Options List (Strictly follows DESIGN.md Multiple-Choice Option Cards) */}
                  <div className="mt-6 space-y-3">
                    {currentQ.options.map((opt, oIdx) => {
                      const currentAnswers = answers[currentIndex] || [];
                      const isSelected = currentAnswers.includes(opt.key);
                      const isComplex = currentQ.questionFormat === 'COMPLEX_CHOICE';
                      const isMaxReached = isComplex && currentAnswers.length >= 2 && !isSelected;

                      return (
                        <button
                          key={opt.key || opt.id || `opt-${oIdx}`}
                          onClick={() => handleSelectOption(opt.key)}
                          disabled={isMaxReached}
                    className={`w-full flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-[#eff6ff] text-slate-900 shadow-2xs'
                        : isMaxReached
                        ? 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center text-xs font-bold transition-colors ${
                        isComplex ? 'rounded-lg' : 'rounded-full'
                      } ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
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
              </>
            );
          })()}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Sebelumnya</span>
          </button>

          <span className="text-xs text-slate-500 hidden sm:inline font-medium">
            Soal {currentIndex + 1} dari {questions.length}
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
              className="btn-tactile-secondary flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white cursor-pointer shadow-xs"
            >
              <span>Kirim Jawaban</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </main>

      {/* Palette Drawer Modal */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Daftar Nomor Soal</h3>
                <p className="text-xs text-slate-500">Pilih nomor untuk langsung menuju butir soal terkait.</p>
              </div>
              <button
                onClick={() => setPaletteOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2.5 max-h-72 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const isAns = (answers[idx] || []).length > 0;
                const isDoubt = doubtfuls[idx];
                const isCur = currentIndex === idx;

                return (
                  <button
                    key={q.id || q.questionNumber || `pal-${idx}`}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setPaletteOpen(false);
                    }}
                    className={`h-10 rounded-xl text-xs font-bold flex items-center justify-center border transition-all cursor-pointer ${
                      isCur
                        ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50 text-blue-700'
                        : isDoubt
                        ? 'border-amber-300 bg-amber-50 text-amber-800'
                        : isAns
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {q.questionNumber}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-blue-600" /> Sudah Dijawab
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-amber-100 border border-amber-300" /> Ragu-ragu
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-white border border-slate-300" /> Belum Dijawab
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Selesaikan Sesi Recall?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kamu telah menjawab <span className="font-bold text-blue-600">{answeredCount}</span> dari{' '}
              <span className="font-bold text-slate-700">{questions.length}</span> butir soal.
              {answeredCount < questions.length && (
                <span className="block text-amber-700 font-semibold mt-1">
                  Masih ada {questions.length - answeredCount} butir yang belum terisi.
                </span>
              )}
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Lanjut Mengerjakan
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitAttempt}
                className="btn-tactile-secondary px-6 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Memproses...' : 'Ya, Kirim Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomImageUrl && (
        <div
          onClick={() => setZoomImageUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            <img src={zoomImageUrl} alt="Zoomed" className="max-h-[85vh] w-auto object-contain mx-auto rounded-lg" />
            <button
              onClick={() => setZoomImageUrl(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
