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

  useEffect(() => {
    api.learning
      .getReview(attemptId)
      .then((res: any) => {
        if (res?.questions && Array.isArray(res.questions) && res.questions.length > 0) {
          setQuestions(res.questions);
        } else {
          generateMock10Reviews();
        }
      })
      .catch(() => {
        generateMock10Reviews();
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  const generateMock10Reviews = () => {
    const list: ReviewItem[] = [];
    for (let i = 1; i <= 10; i++) {
      const isCorrect = i !== 5; // question 5 wrong as demo
      list.push({
        id: `rev_${i}`,
        questionNumber: i,
        stimulus: i % 3 === 0 ? 'Stimulus teks atau gambar pemantik konteks permasalahan.' : '',
        questionText: `Soal Latihan Butir ${i}: Penyelesaian terstruktur dari persamaan atau konsep berikut adalah...`,
        options: [
          { key: 'A', text: 'Opsi alternatif A' },
          { key: 'B', text: 'Opsi alternatif B' },
          { key: 'C', text: 'Opsi alternatif C' },
          { key: 'D', text: 'Opsi alternatif D' },
        ],
        studentAnswer: isCorrect ? 'B' : 'A',
        correctAnswer: 'B',
        isCorrect,
        explanation:
          'Pembahasan Nalar: Identifikasi variabel utama terlebih dahulu, kemudian lakukan manipulasi aljabar dengan menerapkan prinsip kesetaraan nilai pada kedua ruas.',
      });
    }
    setQuestions(list);
  };

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
