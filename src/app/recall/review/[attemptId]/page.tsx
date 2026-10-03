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
  Check
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
              studentAnswer,
              correctAnswer,
              isCorrect: Boolean(q.is_correct ?? q.isCorrect),
              score: q.score,
              explanation: q.explanation || q.discussion || 'Belum ada catatan pembahasan khusus untuk butir soal ini.',
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

  const filteredQuestions = questions.filter((q) => {
    if (filter === 'correct') return q.isCorrect;
    if (filter === 'wrong') return !q.isCorrect;
    return true;
  });

  const correctCount = questions.filter((q) => q.isCorrect).length;
  const reviewCount = questions.length - correctCount;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href={`/recall/result/${attemptId}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-2"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Ringkasan Skor
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pembahasan Recall Kemampuanmu
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pelajari konsep kunci di balik setiap soal untuk memperkuat pemahaman belajarmu.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Semua ({questions.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === 'correct'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Tepat ({correctCount})
            </button>
            <button
              onClick={() => setFilter('wrong')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === 'wrong'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              Perlu Ditinjau ({reviewCount})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : errorMsg ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">{errorMsg}</p>
            <Link
              href="/recall"
              className="btn-tactile-primary inline-block px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              Kembali ke Beranda Recall
            </Link>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <HelpCircle className="h-10 w-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">Tidak ada butir soal dalam kategori ini.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQuestions.map((q, idx) => {
              const studentAnswerKeys = q.studentAnswer.split(',').map((s) => s.trim());
              const normStimulusImg = normalizeImageUrl(q.stimulusImageUrl);
              const normQuestionImg = normalizeImageUrl(q.questionImageUrl);
              // Avoid duplicate image if stimulus has no text and uses the same image
              const showQuestionImg = normQuestionImg && (normQuestionImg !== normStimulusImg || !normStimulusImg);

              return (
                <div
                  key={q.id || q.questionNumber || `q-${idx}`}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6"
                >
                  {/* Question Header Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                        {q.questionNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-700">Soal #{q.questionNumber}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-blue-600 font-semibold">{q.subjectName}</span>
                    </div>

                    <div>
                      {q.isCorrect ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Jawaban Tepat
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
                          <RotateCcw className="h-3.5 w-3.5" /> Perlu Ditinjau
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stimulus if available */}
                  {(q.stimulus || normStimulusImg) && (
                    <div className="rounded-2xl border border-blue-100 bg-[#eff6ff]/50 p-4 sm:p-5 text-xs sm:text-sm text-slate-700 leading-relaxed border-l-4 border-l-blue-600 space-y-3">
                      {q.stimulus && (
                        <div>
                          <p className="font-bold text-blue-700 mb-1 text-[11px] uppercase tracking-wider">
                            Teks Stimulus:
                          </p>
                          <FormattedContent content={q.stimulus} />
                        </div>
                      )}
                      {normStimulusImg && (
                        <div className="relative group overflow-hidden rounded-xl border border-blue-100 bg-white p-2 text-center">
                          <img
                            src={normStimulusImg}
                            alt="Stimulus visual"
                            className="max-h-72 w-auto mx-auto object-contain rounded-lg cursor-zoom-in"
                            onClick={() => setZoomImageUrl(normStimulusImg)}
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                    <FormattedContent content={q.questionText} />
                  </div>

                  {/* Question Image (Rendered below question text if present and not duplicate) */}
                  {showQuestionImg && (
                    <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-white p-2 text-center">
                      <img
                        src={normQuestionImg!}
                        alt="Visual Soal"
                        className="max-h-80 w-auto mx-auto object-contain rounded-lg cursor-zoom-in"
                        onClick={() => setZoomImageUrl(normQuestionImg!)}
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Options List with Safe-to-Fail state (Emerald for correct, Amber for student review) */}
                  <div className="space-y-3">
                    {q.options.map((opt, oIdx) => {
                      const isStudentAnswer = studentAnswerKeys.includes(opt.key);
                      const isKey = opt.isCorrect;

                      let containerStyle = 'border-slate-200 bg-white text-slate-700';
                      let badgeStyle = 'bg-slate-100 text-slate-600 border border-slate-200';
                      let statusNote = null;

                      if (isKey) {
                        containerStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500/20';
                        badgeStyle = 'bg-emerald-600 text-white font-bold';
                        statusNote = (
                          <span className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Kunci Jawaban Benar
                          </span>
                        );
                      } else if (isStudentAnswer && !isKey) {
                        // Safe-to-fail Warm Amber highlight (NO RED)
                        containerStyle = 'border-amber-400 bg-amber-50/70 text-amber-950 ring-1 ring-amber-400/20';
                        badgeStyle = 'bg-amber-500 text-white font-bold';
                        statusNote = (
                          <span className="text-[11px] font-bold text-amber-800 inline-flex items-center gap-1">
                            <RotateCcw className="h-3 w-3" /> Jawaban yang Kamu Pilih
                          </span>
                        );
                      }

                      return (
                        <div
                          key={opt.key || opt.id || `opt-${oIdx}`}
                          className={`w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border text-left transition-all ${containerStyle}`}
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center text-xs font-bold rounded-full ${badgeStyle}`}
                            >
                              {opt.key}
                            </div>
                            <div className="text-xs sm:text-sm pt-0.5 leading-relaxed flex-1">
                              <OptionRenderer text={opt.text} onZoom={setZoomImageUrl} />
                            </div>
                          </div>

                          {statusNote && (
                            <div className="pl-10 sm:pl-0 shrink-0">
                              {statusNote}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pedagogical Explanation Box */}
                  <div className="bg-[#eff6ff] border border-blue-100 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-slate-700 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-blue-700">
                      <Lightbulb className="h-4 w-4" />
                      <span>Pembahasan & Kunci Konsep:</span>
                    </div>
                    <div className="text-slate-700 leading-relaxed pl-6">
                      <FormattedContent content={q.explanation} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

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

      <Footer />
    </div>
  );
}
