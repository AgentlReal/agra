'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  CheckCircle2, 
  ArrowLeft, 
  BookOpen, 
  HelpCircle,
  CheckSquare,
  CircleDot,
  ZoomIn,
  X,
  Lightbulb,
  Sparkles,
  RotateCcw,
  Check,
  AlertCircle,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import FormattedContent from '@/components/common/FormattedContent';
import OptionRenderer from '@/components/common/OptionRenderer';
import { normalizeImageUrl } from '@/lib/image-utils';

interface ReviewQuestion {
  id: string | number;
  questionNumber: number;
  subjectName: string;
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

export default function RecallReviewPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params);
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong'>('all');
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.recall
      .getReview(attemptId)
      .then((res: any) => {
        const rawQs = res?.reviews || res?.questions || res?.data?.reviews || res?.data?.questions;
        if (Array.isArray(rawQs) && rawQs.length > 0) {
          const qs: ReviewQuestion[] = rawQs.map((q: any, i: number) => {
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
            } else if (q.correctAnswer) {
              correctAnswer = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer;
            }

            const sessionQuestionId = q.session_question_id ?? q.id;
            if (!sessionQuestionId) {
              throw new Error(`Data butir soal review #${i + 1} tidak valid.`);
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
              studentAnswer,
              correctAnswer,
              isCorrect: Boolean(q.is_correct ?? q.isCorrect),
              score: q.score,
              explanation: q.explanation || q.discussion || 'Kunci pemecahan butir soal ini telah diverifikasi sesuai kurikulum standar.',
            };
          });
          setQuestions(qs);
        } else {
          setErrorMsg('Data review pembahasan butir soal tidak ditemukan.');
        }
      })
      .catch((err: any) => {
        console.error('Failed to load recall review:', err);
        setErrorMsg(err.message || 'Gagal memuat review Recall.');
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  const correctCount = questions.filter((q) => q.isCorrect).length;
  const reviewCount = questions.length - correctCount;
  const isAllPassed = correctCount >= 27;

  const currentQ = questions[currentIndex];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Memuat Ulasan Pembahasan Recall...</p>
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
          <h2 className="text-lg font-bold text-slate-900">Kendala Review</h2>
          <p className="text-xs text-slate-500 leading-relaxed">{errorMsg || 'Data soal tidak ditemukan.'}</p>
          <Link
            href="/recall"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Kembali ke Recall
          </Link>
        </div>
      </div>
    );
  }

  const normStimulusImg = normalizeImageUrl(currentQ.stimulusImageUrl);
  const normQuestionImg = normalizeImageUrl(currentQ.questionImageUrl);
  const showQuestionImg = normQuestionImg && (normQuestionImg !== normStimulusImg || !normStimulusImg);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-800 font-sans">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Breadcrumbs Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
              Dasbor
            </Link>
            <span className="text-slate-300">/</span>
            <Link href={`/recall/result/${attemptId}`} className="hover:text-blue-600 transition-colors">
              Hasil Recall
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold">Pembahasan Butir Soal</span>
          </nav>

          <Link
            href={`/recall/result/${attemptId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Ringkasan Skor</span>
          </Link>
        </div>

        {/* Top Status Banner (Inspired by recall-kemampuan-lulus-81 & tidak-dq) */}
        {isAllPassed ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Pretest Tuntas: {correctCount} dari {questions.length} Butir Benar
                </h2>
                <p className="text-xs text-slate-600">
                  Kamu berhasil melampaui kriteria ketuntasan 90%. Silakan tinjau pembahasan butir soal di bawah ini.
                </p>
              </div>
            </div>
            <Link
              href="/curriculum"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 transition-colors shadow-2xs"
            >
              <span>Lanjut ke Kurikulum</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Sesi Remedial Terbimbing: {reviewCount} Butir Perlu Ditinjau
                </h2>
                <p className="text-xs text-slate-600">
                  Pelajari pembahasan dan konsep kunci butir yang keliru untuk memperkuat nalar belajarmu secara aman (<strong className="font-semibold text-slate-800">Safe-to-Fail</strong>).
                </p>
              </div>
            </div>
            <Link
              href="/recall"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 transition-colors shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Ulangi Pretest</span>
            </Link>
          </div>
        )}

        {/* Dual-Pane Review Workspace */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* LEFT PANE: Question Item Review (~68% width) */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Stimulus Section if present */}
            {(currentQ.stimulus || normStimulusImg) && (
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>STIMULUS BACAAN</span>
                  </div>
                  <span className="rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-[11px] font-semibold">
                    {currentQ.subjectName}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 space-y-3">
                  {currentQ.stimulus && (
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <FormattedContent content={currentQ.stimulus} />
                    </div>
                  )}

                  {normStimulusImg && (
                    <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 text-center">
                      <img
                        src={normStimulusImg}
                        alt="Stimulus visual"
                        className="max-h-72 sm:max-h-96 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                        onClick={() => setZoomImageUrl(normStimulusImg)}
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => setZoomImageUrl(normStimulusImg)}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-white"
                      >
                        <ZoomIn className="h-3.5 w-3.5 text-blue-600" />
                        <span>Perbesar Gambar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Question Details Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Header Row: Question number & Status pill */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                    {currentQ.questionNumber}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Soal #{currentQ.questionNumber} dari {questions.length}
                  </span>
                </div>

                {/* Status Badge: Exact replica of reference design */}
                {currentQ.isCorrect ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Jawaban Anda Benar</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-200 px-3.5 py-1 text-xs font-bold text-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span>Jawaban Anda Perlu Ditinjau</span>
                  </div>
                )}
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                <FormattedContent content={currentQ.questionText} />
              </div>

              {showQuestionImg && (
                <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-center">
                  <img
                    src={normQuestionImg!}
                    alt="Ilustrasi soal"
                    className="max-h-72 sm:max-h-96 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                    onClick={() => setZoomImageUrl(normQuestionImg!)}
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => setZoomImageUrl(normQuestionImg!)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-white"
                  >
                    <ZoomIn className="h-3.5 w-3.5 text-blue-600" />
                    <span>Perbesar</span>
                  </button>
                </div>
              )}

              {/* Options Review List with color coding */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, oIdx) => {
                  const studentKeys = currentQ.studentAnswer ? currentQ.studentAnswer.split(',').map((s) => s.trim()) : [];
                  const isStudentChosen = studentKeys.includes(opt.key);
                  const isKeyCorrect = opt.isCorrect;

                  let borderClass = 'border-slate-200 bg-white text-slate-700';
                  let badgeClass = 'bg-slate-100 text-slate-700 border border-slate-200';

                  if (isKeyCorrect) {
                    borderClass = 'border-emerald-300 bg-emerald-50/60 text-slate-900';
                    badgeClass = 'bg-emerald-600 text-white font-bold';
                  } else if (isStudentChosen && !isKeyCorrect) {
                    borderClass = 'border-amber-300 bg-amber-50/60 text-slate-900';
                    badgeClass = 'bg-amber-500 text-white font-bold';
                  }

                  return (
                    <div
                      key={opt.key || opt.id || `rev-opt-${oIdx}`}
                      className={`w-full flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${borderClass}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center text-xs font-bold rounded-full ${badgeClass}`}>
                          {opt.key}
                        </div>
                        <div className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                          <OptionRenderer text={opt.text} onZoom={setZoomImageUrl} />
                        </div>
                      </div>

                      {/* Badges on right */}
                      <div className="shrink-0 flex items-center gap-2">
                        {isStudentChosen && (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isKeyCorrect
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {isKeyCorrect ? <Check className="h-3 w-3" /> : null} Pilihan Anda
                          </span>
                        )}
                        {isKeyCorrect && !isStudentChosen && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold">
                            <Check className="h-3 w-3" /> Kunci Jawaban
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Solution / Explanation Box (Exact style of reference-design) */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 sm:p-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <span>Pembahasan Solusi &amp; Konsep Kunci:</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal pt-1">
                  <FormattedContent content={currentQ.explanation} />
                </div>
              </div>

              {/* Bottom Pagination Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Sebelumnya</span>
                </button>

                <span className="text-xs font-bold text-slate-600">
                  {currentIndex + 1} / {questions.length}
                </span>

                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIndex >= questions.length - 1}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

            </div>

          </div>

          {/* RIGHT PANE: Sticky Sidebar "Peta Soal Review" (~32% width) */}
          <aside className="w-full lg:w-80 shrink-0 sticky top-24 space-y-5">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-extrabold text-slate-900 tracking-tight">Peta Pembahasan</span>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-600 border border-slate-200">
                  {questions.length} Butir
                </span>
              </div>

              {/* Status Legend */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span>Benar ({correctCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span>Perlu Ditinjau ({reviewCount})</span>
                </div>
              </div>

              {/* Matrix Grid */}
              <div className="grid grid-cols-5 gap-2 max-h-[340px] overflow-y-auto p-1">
                {questions.map((q, idx) => {
                  const isCurrent = currentIndex === idx;
                  const isQCorrect = q.isCorrect;

                  let colorClass = isQCorrect
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-amber-300 bg-amber-50 text-amber-800 font-bold';

                  return (
                    <button
                      key={q.id || q.questionNumber || `rev-pal-${idx}`}
                      onClick={() => setCurrentIndex(idx)}
                      className={`flex h-10 items-center justify-center rounded-xl border text-xs font-mono transition-all cursor-pointer ${colorClass} ${
                        isCurrent ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 font-black z-10' : ''
                      }`}
                    >
                      {String(q.questionNumber).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Action Button */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <Link
                  href={`/recall/result/${attemptId}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 transition-colors shadow-2xs"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Lihat Skor Rinci</span>
                </Link>

                <Link
                  href="/curriculum"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 transition-colors shadow-2xs"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Ke Kurikulum Inti</span>
                </Link>
              </div>

            </div>
          </aside>

        </div>

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
