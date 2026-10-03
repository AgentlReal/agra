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
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Filter
} from 'lucide-react';
import FormattedContent from '@/components/common/FormattedContent';
import OptionRenderer from '@/components/common/OptionRenderer';
import { normalizeImageUrl } from '@/lib/image-utils';

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
  const [currentIndex, setCurrentIndex] = useState(0);
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

            const sessionQuestionId = q.session_question_id ?? q.id;
            if (!sessionQuestionId) {
              throw new Error(`Data butir soal review #${i + 1} tidak valid.`);
            }

            return {
              id: sessionQuestionId,
              questionNumber: q.question_order ?? q.questionNumber ?? (i + 1),
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
              explanation: q.explanation_text || q.explanation || q.reasoning_guide || 'Pembahasan kunci penalaran butir soal ini telah diverifikasi.',
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

  const correctCount = questions.filter((q) => q.isCorrect).length;
  const reviewCount = questions.length - correctCount;
  const isAllPassed = (correctCount / (questions.length || 30)) >= 0.8;

  const currentQ = questions[currentIndex];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Memuat pembahasan simulasi TKA...</p>
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
          <p className="text-xs text-slate-500 leading-relaxed">{errorMsg || 'Data butir soal tidak ditemukan.'}</p>
          <Link
            href={`/simulations/result/${attemptId}`}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Kembali ke Hasil
          </Link>
        </div>
      </div>
    );
  }

  const normStimulusImg = normalizeImageUrl(currentQ.stimulusImageUrl);
  const normQuestionImg = normalizeImageUrl(currentQ.questionImageUrl);
  const showQuestionImg = normQuestionImg && (normQuestionImg !== normStimulusImg || !normStimulusImg);

  const filteredIndices = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => {
      if (filter === 'correct') return q.isCorrect;
      if (filter === 'wrong') return !q.isCorrect;
      return true;
    })
    .map(({ idx }) => idx);

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
            <Link href={`/simulations/result/${attemptId}`} className="hover:text-blue-600 transition-colors">
              Hasil Simulasi
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold">Pembahasan Capstone</span>
          </nav>

          <Link
            href={`/simulations/result/${attemptId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Ringkasan Skor</span>
          </Link>
        </div>

        {/* Top Status Banner */}
        {isAllPassed ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Simulasi Tuntas: {correctCount} dari {questions.length} Butir Benar
                </h2>
                <p className="text-xs text-slate-600">
                  Kamu berhasil melampaui kriteria kelulusan 80%. Tinjau pembahasan nalar butir soal di bawah ini.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 transition-colors shadow-2xs"
            >
              <span>Dasbor Belajar</span>
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
                  Sesi Penguatan Nalar: {reviewCount} Butir Perlu Ditinjau
                </h2>
                <p className="text-xs text-slate-600">
                  Pelajari langkah penyelesaian dan kunci konsep butir yang keliru untuk memperkuat nalar secara aman (<strong className="font-semibold text-slate-800">Safe-to-Fail</strong>).
                </p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 transition-colors shadow-2xs"
            >
              <span>Dasbor Belajar</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Dual-Pane Layout: Left Main Question Workspace, Right Sticky "Peta Pembahasan" */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Question Details & Discussion (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              
              {/* Question Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white text-xs font-black">
                    {currentQ.questionNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        Soal Nomor {currentQ.questionNumber}
                      </span>
                      {currentQ.questionFormat === 'COMPLEX_CHOICE' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                          <CheckSquare className="h-3 w-3" /> Pilihan Ganda Kompleks
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                          <CircleDot className="h-3 w-3" /> Pilihan Ganda
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Simulasi Standar TKA SMP
                    </p>
                  </div>
                </div>

                {/* Accuracy Status Badge */}
                {currentQ.score === 0.5 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                    <CheckCircle2 className="h-4 w-4 text-amber-600" />
                    <span>Benar Sebagian (+0.5)</span>
                  </span>
                ) : currentQ.isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Jawaban Tepat (+1.0)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                    <RotateCcw className="h-4 w-4 text-amber-600" />
                    <span>Perlu Ditinjau (0.0)</span>
                  </span>
                )}
              </div>

              {/* Main Question Body */}
              <div className="p-6 sm:p-7 space-y-6">
                
                {/* Stimulus Context Box (if available) */}
                {(currentQ.stimulus || normStimulusImg) && (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5 space-y-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 uppercase tracking-wider">
                      <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                      <span>Stimulus Bacaan / Konteks Soal</span>
                    </div>

                    {currentQ.stimulus && (
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                        <FormattedContent content={currentQ.stimulus} />
                      </div>
                    )}

                    {normStimulusImg && (
                      <div className="relative group overflow-hidden rounded-xl border border-blue-100 bg-white p-2 text-center">
                        <img
                          src={normStimulusImg}
                          alt="Stimulus visual simulasi"
                          className="max-h-64 sm:max-h-72 w-auto mx-auto object-contain rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity"
                          onClick={() => setZoomImageUrl(normStimulusImg)}
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() => setZoomImageUrl(normStimulusImg)}
                          className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-white transition-colors"
                        >
                          <ZoomIn className="h-3 w-3 text-blue-600" />
                          <span>Perbesar Gambar</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Question Prompt */}
                <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                  <FormattedContent content={currentQ.questionText} />
                </div>

                {/* Question Image (if distinct from stimulus) */}
                {showQuestionImg && (
                  <div className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 text-center">
                    <img
                      src={normQuestionImg!}
                      alt="Gambar pertanyaan"
                      className="max-h-64 sm:max-h-72 w-auto mx-auto object-contain rounded-xl cursor-zoom-in hover:opacity-95 transition-opacity"
                      onClick={() => setZoomImageUrl(normQuestionImg!)}
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => setZoomImageUrl(normQuestionImg!)}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-xs border border-slate-200 hover:bg-white transition-colors"
                    >
                      <ZoomIn className="h-3 w-3 text-blue-600" />
                      <span>Perbesar Gambar</span>
                    </button>
                  </div>
                )}

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Pilihan Jawaban:
                  </p>

                  <div className="space-y-2.5">
                    {currentQ.options.map((opt, oIdx) => {
                      const studentKeys = currentQ.studentAnswer && currentQ.studentAnswer !== '-'
                        ? currentQ.studentAnswer.split(',').map((s) => s.trim())
                        : [];
                      const correctKeys = currentQ.correctAnswer && currentQ.correctAnswer !== '-'
                        ? currentQ.correctAnswer.split(',').map((s) => s.trim())
                        : [];

                      const isStudentOpt = studentKeys.includes(opt.key);
                      const isCorrectOpt = opt.isCorrect || correctKeys.includes(opt.key);

                      let containerStyle = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300';
                      let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

                      if (isCorrectOpt && isStudentOpt) {
                        containerStyle = 'border-emerald-500 bg-emerald-50/70 text-slate-900 font-semibold ring-1 ring-emerald-400';
                        badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                      } else if (isCorrectOpt) {
                        containerStyle = 'border-emerald-300 bg-emerald-50/40 text-slate-800 font-medium';
                        badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                      } else if (isStudentOpt) {
                        containerStyle = 'border-amber-300 bg-amber-50 text-amber-900';
                        badgeStyle = 'bg-amber-500 text-white border-amber-500';
                      }

                      return (
                        <div
                          key={opt.key || opt.id || `opt-${oIdx}`}
                          className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all ${containerStyle}`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold border ${badgeStyle}`}
                          >
                            {opt.key}
                          </span>

                          <div className="flex-1 font-medium leading-relaxed pt-0.5 text-xs sm:text-sm">
                            <OptionRenderer text={opt.text} onZoom={setZoomImageUrl} />
                          </div>

                          <div className="shrink-0 self-center">
                            {isCorrectOpt && isStudentOpt && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="h-3 w-3" /> Kunci Benar &bull; Pilihan Anda
                              </span>
                            )}
                            {isCorrectOpt && !isStudentOpt && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="h-3 w-3" /> Kunci Jawaban Benar
                              </span>
                            )}
                            {isStudentOpt && !isCorrectOpt && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md">
                                <RotateCcw className="h-3 w-3" /> Pilihan Anda
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation Card */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 sm:p-6 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <span>Kunci Nalar &amp; Langkah Pembahasan Capstone</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    <FormattedContent content={currentQ.explanation} />
                  </div>
                </div>

              </div>

              {/* Bottom Action Toolbar */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Sebelumnya</span>
                </button>

                <span className="text-xs font-bold text-slate-600">
                  {currentIndex + 1} dari {questions.length} Soal
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Sticky Sidebar "Peta Pembahasan" (Span 4) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Peta Pembahasan</h3>
                    <p className="text-[11px] text-slate-400">Navigasi 30 Butir Soal</p>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-slate-500">
                  {correctCount}/{questions.length} Tepat
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex rounded-xl bg-slate-100/80 p-1 text-[11px] font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
                    filter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Semua ({questions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('correct')}
                  className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
                    filter === 'correct'
                      ? 'bg-white text-emerald-700 shadow-2xs'
                      : 'hover:text-emerald-700'
                  }`}
                >
                  Tepat ({correctCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('wrong')}
                  className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
                    filter === 'wrong'
                      ? 'bg-white text-amber-700 shadow-2xs'
                      : 'hover:text-amber-700'
                  }`}
                >
                  Tinjau ({reviewCount})
                </button>
              </div>

              {/* Grid 30 Numbers */}
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 pt-1">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isCorrect = q.isCorrect;
                  const isFilteredOut = !filteredIndices.includes(idx);

                  let colorClass = 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100';
                  if (isCorrect) {
                    colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100';
                  }

                  if (isCurrent) {
                    colorClass = 'ring-2 ring-blue-600 font-black ' + (isCorrect ? 'bg-emerald-100 text-emerald-900 border-emerald-400' : 'bg-amber-100 text-amber-900 border-amber-400');
                  }

                  return (
                    <button
                      key={q.id || `grid-${idx}`}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      disabled={isFilteredOut}
                      className={`h-9 rounded-xl border text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${colorClass} ${
                        isFilteredOut ? 'opacity-25 grayscale cursor-not-allowed' : ''
                      }`}
                    >
                      {q.questionNumber}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-[10px] text-slate-500 font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>Jawaban Tepat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>Perlu Penguatan</span>
                </div>
              </div>

              {/* Return CTA */}
              <div className="pt-2">
                <Link
                  href={`/simulations/result/${attemptId}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Kembali ke Hasil Skor</span>
                </Link>
              </div>

            </div>
          </div>

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
