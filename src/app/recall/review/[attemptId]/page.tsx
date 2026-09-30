'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  BookOpen, 
  HelpCircle,
  CheckSquare,
  CircleDot
} from 'lucide-react';

interface ReviewQuestion {
  id: string | number;
  questionNumber: number;
  subjectName: string;
  stimulus?: string;
  questionText: string;
  options: { id?: number; key: string; text: string; isCorrect: boolean }[];
  questionFormat: 'SINGLE_CHOICE' | 'COMPLEX_CHOICE';
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export default function RecallReviewPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params);
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong'>('all');
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
              subjectName: q.subjectName || (i < 15 ? 'Matematika SD' : 'Bahasa Indonesia SD'),
              stimulus: stimulusText,
              questionText: q.question_text || q.questionText || '',
              options: mappedOptions,
              questionFormat,
              studentAnswer,
              correctAnswer,
              isCorrect: Boolean(q.is_correct ?? q.isCorrect),
              explanation: q.explanation_text || q.explanation || q.reasoning_guide || 'Pembahasan belum tersedia untuk butir soal ini.',
            };
          });
          setQuestions(qs);
        } else {
          setErrorMsg('Tidak ada data review pembahasan untuk sesi ini.');
        }
      })
      .catch((err: any) => {
        console.error('Failed to load review:', err);
        setErrorMsg(err.message || 'Gagal memuat pembahasan review dari server.');
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  const filtered = questions.filter((q) => {
    if (filter === 'correct') return q.isCorrect;
    if (filter === 'wrong') return !q.isCorrect;
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : errorMsg || questions.length === 0 ? (
          <div className="rounded-3xl border border-rose-500/30 bg-slate-900/80 p-8 text-center space-y-4">
            <p className="text-sm font-semibold text-rose-400">{errorMsg || 'Tidak ada butir soal pembahasan yang dapat dimuat.'}</p>
            <Link
              href="/recall"
              className="inline-block rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Kembali ke Halaman Recall
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Kunci Jawaban & Pembahasan Nalar</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Review Sesi Recall Kemampuanmu</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Pelajari konsep dan alasan di balik setiap butir soal untuk memperkuat pemahaman Anda.
                </p>
              </div>

              <Link
                href={`/recall/result/${attemptId}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Hasil
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Semua ({questions.length})
              </button>
              <button
                onClick={() => setFilter('correct')}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === 'correct'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Benar ({questions.filter((q) => q.isCorrect).length})</span>
              </button>
              <button
                onClick={() => setFilter('wrong')}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === 'wrong'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Salah ({questions.filter((q) => !q.isCorrect).length})</span>
              </button>
            </div>

            {/* Questions Review List */}
            <div className="space-y-6">
              {filtered.map((q) => (
                <div
                  key={q.questionNumber}
                  className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-md transition-all ${
                    q.isCorrect
                      ? 'border-emerald-500/20 bg-slate-900/60'
                      : 'border-rose-500/20 bg-slate-900/60'
                  }`}
                >
                  {/* Top Item Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white">
                        {q.questionNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{q.subjectName}</span>
                      <span className="text-slate-600 hidden sm:inline">•</span>
                      {q.questionFormat === 'COMPLEX_CHOICE' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-purple-400">
                          <CheckSquare className="h-3 w-3" /> Pilihan Ganda Kompleks
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-400">
                          <CircleDot className="h-3 w-3" /> Pilihan Ganda
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {q.isCorrect ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Jawaban Tepat
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full px-2.5 py-0.5">
                          <XCircle className="h-3.5 w-3.5" /> Jawaban Keliru
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stimulus */}
                  {q.stimulus && (
                    <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-300">
                      {q.stimulus}
                    </div>
                  )}

                  {/* Question Text */}
                  <p className="text-sm font-medium text-white mb-4 leading-relaxed">
                    {q.questionText}
                  </p>

                  {/* Options */}
                  <div className="space-y-2 mb-4">
                    {q.options.map((opt) => {
                      const studentKeys = q.studentAnswer && q.studentAnswer !== '-' 
                        ? q.studentAnswer.split(',').map((s: string) => s.trim()) 
                        : [];
                      const correctKeys = q.correctAnswer && q.correctAnswer !== '-' 
                        ? q.correctAnswer.split(',').map((s: string) => s.trim()) 
                        : [];

                      const isStudentOpt = studentKeys.includes(opt.key);
                      const isCorrectOpt = opt.isCorrect || correctKeys.includes(opt.key);

                      let optClass = 'border-slate-800 bg-slate-950/40 text-slate-300';
                      if (isCorrectOpt && isStudentOpt) {
                        optClass = 'border-emerald-500/60 bg-emerald-500/15 text-emerald-200 font-semibold ring-1 ring-emerald-500/30';
                      } else if (isCorrectOpt) {
                        optClass = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-medium';
                      } else if (isStudentOpt) {
                        optClass = 'border-rose-500/50 bg-rose-500/10 text-rose-200 line-through';
                      }

                      return (
                        <div
                          key={opt.key}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-xs ${optClass}`}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-800 text-[11px] font-bold">
                            {opt.key}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {isCorrectOpt && isStudentOpt && (
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                              (Kunci Benar • Jawaban Anda)
                            </span>
                          )}
                          {isCorrectOpt && !isStudentOpt && (
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                              (Kunci Benar)
                            </span>
                          )}
                          {isStudentOpt && !isCorrectOpt && (
                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                              (Jawaban Anda)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Block */}
                  <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 text-xs text-indigo-200">
                    <p className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                      <BookOpen className="h-3.5 w-3.5" /> Pembahasan Konsep:
                    </p>
                    <p className="leading-relaxed text-slate-300">{q.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
