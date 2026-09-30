'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  BookOpen 
} from 'lucide-react';

interface ReviewItem {
  id: string | number;
  questionNumber: number;
  stimulus?: string;
  questionText: string;
  options: { key: string; text: string }[];
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export default function LearningReviewPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params);
  const [questions, setQuestions] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.learning
      .getReview(attemptId)
      .then((res: any) => {
        const rawQs = res?.reviews || res?.questions || res?.data?.reviews || res?.data?.questions;
        if (Array.isArray(rawQs) && rawQs.length > 0) {
          const qs: ReviewItem[] = rawQs.map((q: any, i: number) => {
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
              stimulus: stimulusText,
              questionText: q.question_text || q.questionText || '',
              options: mappedOptions,
              studentAnswer,
              correctAnswer,
              isCorrect: Boolean(q.is_correct ?? q.isCorrect),
              explanation: q.explanation_text || q.explanation || q.reasoning_guide || 'Pembahasan belum tersedia untuk butir soal ini.',
            };
          });
          setQuestions(qs);
        } else {
          setErrorMsg('Tidak ada data review untuk sesi latihan ini.');
        }
      })
      .catch((err: any) => {
        console.error('Failed to load learning review:', err);
        setErrorMsg(err.message || 'Gagal memuat review latihan dari server.');
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
              <BookOpen className="h-4 w-4" />
              <span>Pembahasan Detail 10 Soal</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Review Latihan Level Kognitif</h1>
          </div>

          <Link
            href={`/learning/result/${attemptId}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Hasil
          </Link>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : errorMsg || questions.length === 0 ? (
          <div className="rounded-3xl border border-rose-500/30 bg-slate-900/80 p-8 text-center space-y-4">
            <p className="text-sm font-semibold text-rose-400">{errorMsg || 'Tidak ada butir pembahasan yang dapat ditampilkan.'}</p>
            <Link
              href="/curriculum"
              className="inline-block rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Kembali ke Kurikulum
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q) => (
              <div
                key={q.questionNumber}
                className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-md ${
                  q.isCorrect ? 'border-emerald-500/20 bg-slate-900/60' : 'border-rose-500/20 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white">
                    {q.questionNumber}
                  </span>
                  {q.isCorrect ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-0.5 border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Jawaban Tepat
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 rounded-full px-2.5 py-0.5 border border-rose-500/20">
                      <XCircle className="h-3.5 w-3.5" /> Jawaban Kurang Tepat
                    </span>
                  )}
                </div>

                {q.stimulus && (
                  <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
                    {q.stimulus}
                  </div>
                )}

                <p className="text-sm font-medium text-white mb-4 leading-relaxed">{q.questionText}</p>

                <div className="space-y-2 mb-4">
                  {q.options.map((opt) => {
                    const isCorrectOpt = opt.key === q.correctAnswer;
                    const isStudentOpt = opt.key === q.studentAnswer;

                    let optClass = 'border-slate-800 bg-slate-950/40 text-slate-300';
                    if (isCorrectOpt) {
                      optClass = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200 font-semibold';
                    } else if (isStudentOpt && !q.isCorrect) {
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
                        {isCorrectOpt && (
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

                <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 text-xs text-indigo-200">
                  <p className="font-bold text-indigo-400 flex items-center gap-1 mb-1 text-[11px] uppercase tracking-wider">
                    <BookOpen className="h-3.5 w-3.5" /> Pembahasan Nalar:
                  </p>
                  <p className="leading-relaxed text-slate-300">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
