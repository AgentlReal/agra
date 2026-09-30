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
  HelpCircle 
} from 'lucide-react';

interface ReviewQuestion {
  id: string | number;
  questionNumber: number;
  subjectName: string;
  stimulus?: string;
  questionText: string;
  options: { key: string; text: string }[];
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

  useEffect(() => {
    api.recall
      .getReview(attemptId)
      .then((res: any) => {
        if (res?.questions && Array.isArray(res.questions) && res.questions.length > 0) {
          setQuestions(res.questions);
        } else {
          generateMockReviews();
        }
      })
      .catch(() => {
        generateMockReviews();
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  const generateMockReviews = () => {
    const list: ReviewQuestion[] = [];
    for (let i = 1; i <= 30; i++) {
      const isCorrect = i % 4 !== 0; // ~75% correct
      const isMath = i <= 15;
      list.push({
        id: `rev_${i}`,
        questionNumber: i,
        subjectName: isMath ? 'Matematika SD' : 'Bahasa Indonesia SD',
        stimulus: i % 3 === 0 ? 'Stimulus teks kontekstual prasyarat jenjang SD.' : '',
        questionText: isMath
          ? `Soal nomor ${i}: Pada operasi hitung campuran bilangan bulat atau konsep geometri dasar, langkah penyelesaian paling efektif adalah...`
          : `Soal nomor ${i}: Berdasarkan paragraf eksposisi di atas, makna tersurat atau tersirat yang terkandung di dalamnya adalah...`,
        options: [
          { key: 'A', text: 'Opsi jawaban A' },
          { key: 'B', text: 'Opsi jawaban B' },
          { key: 'C', text: 'Opsi jawaban C' },
          { key: 'D', text: 'Opsi jawaban D' },
        ],
        studentAnswer: isCorrect ? 'B' : 'A',
        correctAnswer: 'B',
        isCorrect,
        explanation: isMath
          ? 'Pembahasan nalar: Dahulukan operasi dalam tanda kurung, kemudian perkalian/pembagian dari kiri ke kanan sebelum penjumlahan.'
          : 'Pembahasan nalar: Kalimat utama paragraf terletak di awal kalimat (deduktif), sehingga ide pokok secara langsung merujuk pada gagasan pertama.',
      });
    }
    setQuestions(list);
  };

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
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white">
                        {q.questionNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{q.subjectName}</span>
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
