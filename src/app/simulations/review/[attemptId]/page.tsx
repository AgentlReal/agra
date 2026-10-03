'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw, 
  ArrowLeft, 
  BookOpen,
  CheckSquare,
  CircleDot,
  ZoomIn,
  X,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import FormattedContent from '@/components/common/FormattedContent';
import OptionRenderer from '@/components/common/OptionRenderer';

interface ReviewItem {
  id: string | number;
  questionNumber: number;
  stimulus?: string;
  stimulusImageUrl?: string | null;
  questionText: string;
  questionImageUrl?: string | null;
  options: { id?: number; key: string; text: string; isCorrect: boolean }[];
  questionFormat: 'SINGLE_CHOICE' | 'COMPLEX_CHOICE';
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score?: number;
  explanation: string;
}

export default function SimulationReviewPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params);
  const [questions, setQuestions] = useState<ReviewItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong'>('all');
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.simulation
      .getReview(attemptId)
      .then((res: any) => {
        const rawQs = res?.reviews || res?.questions || res?.data?.reviews || res?.data?.questions;
        if (Array.isArray(rawQs) && rawQs.length > 0) {
          const qs: ReviewItem[] = rawQs.map((q: any, i: number) => {
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
              isCorrect: Boolean(opt.is_correct ?? opt.isCorrect),
            }));

            const rawFormat = q.question_type || q.question_format || q.questionFormat || 'SINGLE_CHOICE';
            const questionFormat: 'SINGLE_CHOICE' | 'COMPLEX_CHOICE' =
              rawFormat === 'COMPLEX_CHOICE' || rawFormat === 'PG_KOMPLEKS' ? 'COMPLEX_CHOICE' : 'SINGLE_CHOICE';

            let studentAnswer = '-';
            if (Array.isArray(q.selected_option_ids) && q.selected_option_ids.length > 0) {
              const selectedKeys = mappedOptions
                .filter((o: any) => q.selected_option_ids.includes(o.id))
                .map((o: any) => o.key);
              if (selectedKeys.length > 0) studentAnswer = selectedKeys.join(', ');
            } else if (q.studentAnswer) {
              studentAnswer = Array.isArray(q.studentAnswer) ? q.studentAnswer.join(', ') : q.studentAnswer;
            }

            let correctAnswer = '-';
            const correctKeys = mappedOptions.filter((o: any) => o.isCorrect).map((o: any) => o.key);
            if (correctKeys.length > 0) {
              correctAnswer = correctKeys.join(', ');
            } else if (q.correct_option_ids && Array.isArray(q.correct_option_ids) && q.correct_option_ids.length > 0) {
              const correctKeysById = mappedOptions
                .filter((o: any) => q.correct_option_ids.includes(o.id))
                .map((o: any) => o.key);
              if (correctKeysById.length > 0) correctAnswer = correctKeysById.join(', ');
            } else if (q.correctAnswer) {
              correctAnswer = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer;
            }

            const rawScore = typeof q.score === 'number' ? q.score : typeof q.point === 'number' ? q.point : null;
            const isCorrect = Boolean(q.is_correct ?? q.isCorrect);
            const score = rawScore !== null ? rawScore : (isCorrect ? 1 : 0);

            return {
              id: q.session_question_id ?? q.id ?? i + 1,
              questionNumber: q.question_order ?? q.questionNumber ?? i + 1,
              stimulus: stimulusText,
              stimulusImageUrl,
              questionText: q.question_text || q.questionText || '',
              questionImageUrl,
              options: mappedOptions,
              questionFormat,
              studentAnswer,
              correctAnswer,
              isCorrect,
              score,
              explanation: q.explanation_text || q.explanation || q.reasoning_guide || 'Pembahasan belum tersedia untuk butir soal ini.',
            };
          });
          setQuestions(qs);
        } else {
          setErrorMsg('Tidak ada butir pembahasan yang ditemukan untuk simulasi ini.');
        }
      })
      .catch((err: any) => {
        console.error('Failed to load simulation review:', err);
        setErrorMsg(err.message || 'Gagal memuat pembahasan simulasi dari server.');
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  const filtered = questions.filter((q) => {
    if (filter === 'correct') return q.isCorrect;
    if (filter === 'wrong') return !q.isCorrect;
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-bold mb-1">
              <BookOpen className="h-4 w-4" />
              <span>Kunci Jawaban & Pembahasan Nalar Capstone</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Review Simulasi TKA 30 Soal</h1>
          </div>

          <Link
            href={`/simulations/result/${attemptId}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Hasil
          </Link>
        </div>

        {/* Filter buttons (Zero Red: Warm amber for review/wrong) */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Semua ({questions.length})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              filter === 'correct'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Tepat ({questions.filter((q) => q.isCorrect).length})</span>
          </button>
          <button
            onClick={() => setFilter('wrong')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              filter === 'wrong'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
            <span>Perlu Ditinjau ({questions.filter((q) => !q.isCorrect).length})</span>
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          </div>
        ) : errorMsg || questions.length === 0 ? (
          <div className="rounded-3xl border border-amber-200 bg-white p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">{errorMsg || 'Tidak ada butir pembahasan yang dapat ditampilkan.'}</p>
            <Link
              href="/dashboard"
              className="inline-block btn-tactile-primary rounded-xl px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              Kembali ke Dasbor
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((q) => (
              <div
                key={q.questionNumber}
                className={`rounded-3xl border p-6 sm:p-7 bg-white shadow-sm transition-all ${
                  q.score === 0.5
                    ? 'border-amber-300'
                    : q.isCorrect
                    ? 'border-slate-200'
                    : 'border-amber-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                      {q.questionNumber}
                    </span>
                    {q.questionFormat === 'COMPLEX_CHOICE' ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
                        <CheckSquare className="h-3 w-3" /> Pilihan Ganda Kompleks
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                        <CircleDot className="h-3 w-3" /> Pilihan Ganda
                      </span>
                    )}
                  </div>

                  {q.score === 0.5 ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 rounded-full px-3 py-0.5 border border-amber-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" /> Benar Sebagian (+0.5)
                    </span>
                  ) : q.isCorrect ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-full px-3 py-0.5 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Jawaban Tepat (+1)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 rounded-full px-3 py-0.5 border border-amber-300">
                      <RotateCcw className="h-3.5 w-3.5 text-amber-600" /> Perlu Ditinjau
                    </span>
                  )}
                </div>

                {(q.stimulus || q.stimulusImageUrl) && (
                  <div className="mb-5 rounded-2xl border border-purple-100 bg-purple-50/40 p-4 text-xs text-slate-700 space-y-2.5 leading-relaxed">
                    {q.stimulus && (
                      <div>
                        <p className="font-bold text-purple-700 mb-1 text-[10px] uppercase tracking-wider">
                          Teks Stimulus Bacaan:
                        </p>
                        <FormattedContent content={q.stimulus} />
                      </div>
                    )}

                    {q.stimulusImageUrl && (
                      <div className="relative group overflow-hidden rounded-xl border border-purple-100 bg-white p-2 text-center">
                        <img
                          src={q.stimulusImageUrl}
                          alt="Stimulus visual simulasi"
                          className="max-h-60 sm:max-h-72 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                          onClick={() => setZoomImageUrl(q.stimulusImageUrl || null)}
                        />
                        <button
                          type="button"
                          onClick={() => setZoomImageUrl(q.stimulusImageUrl || null)}
                          className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-white transition-colors"
                        >
                          <ZoomIn className="h-3 w-3 text-purple-600" />
                          <span>Perbesar</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-sm font-medium text-slate-900 mb-4 leading-relaxed">
                  <FormattedContent content={q.questionText} />
                </div>

                {q.questionImageUrl && (
                  <div className="mb-4 relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 text-center">
                    <img
                      src={q.questionImageUrl}
                      alt="Ilustrasi pertanyaan"
                      className="max-h-60 sm:max-h-72 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                      onClick={() => setZoomImageUrl(q.questionImageUrl || null)}
                    />
                    <button
                      type="button"
                      onClick={() => setZoomImageUrl(q.questionImageUrl || null)}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-white transition-colors"
                    >
                      <ZoomIn className="h-3 w-3 text-purple-600" />
                      <span>Perbesar</span>
                    </button>
                  </div>
                )}

                <div className="space-y-2.5 mb-5">
                  {q.options.map((opt) => {
                    const studentKeys = q.studentAnswer && q.studentAnswer !== '-' 
                      ? q.studentAnswer.split(',').map((s: string) => s.trim()) 
                      : [];
                    const correctKeys = q.correctAnswer && q.correctAnswer !== '-' 
                      ? q.correctAnswer.split(',').map((s: string) => s.trim()) 
                      : [];

                    const isStudentOpt = studentKeys.includes(opt.key);
                    const isCorrectOpt = opt.isCorrect || correctKeys.includes(opt.key);

                    let optClass = 'border-slate-200 bg-white text-slate-700';
                    if (isCorrectOpt && isStudentOpt) {
                      optClass = 'border-emerald-500 bg-emerald-50/70 text-slate-900 font-semibold ring-1 ring-emerald-400';
                    } else if (isCorrectOpt) {
                      optClass = 'border-emerald-300 bg-emerald-50/40 text-slate-800 font-medium';
                    } else if (isStudentOpt) {
                      optClass = 'border-amber-300 bg-amber-50 text-amber-900';
                    }

                    return (
                      <div
                        key={opt.key}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm ${optClass}`}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                          isCorrectOpt 
                            ? 'bg-emerald-600 text-white' 
                            : isStudentOpt 
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {opt.key}
                        </span>
                        <div className="flex-1 font-medium leading-relaxed pt-0.5">
                          <OptionRenderer text={opt.text} onZoom={setZoomImageUrl} />
                        </div>
                        {isCorrectOpt && isStudentOpt && (
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/60 px-2 py-0.5 rounded-md self-center">
                            Kunci Benar • Pilihan Anda
                          </span>
                        )}
                        {isCorrectOpt && !isStudentOpt && (
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/60 px-2 py-0.5 rounded-md self-center">
                            Kunci Benar
                          </span>
                        )}
                        {isStudentOpt && !isCorrectOpt && (
                          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-md self-center">
                            Pilihan Anda • Perlu Penguatan
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5 text-xs text-slate-800">
                  <p className="font-bold text-purple-800 flex items-center gap-1.5 mb-1.5 text-xs uppercase tracking-wider">
                    <BookOpen className="h-4 w-4 text-purple-600" /> Pembahasan Capstone:
                  </p>
                  <div className="leading-relaxed text-slate-700 font-medium">
                    <FormattedContent content={q.explanation} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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

      <Footer />
    </div>
  );
}
