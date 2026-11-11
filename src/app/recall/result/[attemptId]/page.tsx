'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  ArrowLeft,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface RecallResultData {
  isPassed?: boolean;
  is_passed?: boolean;
  totalQuestions?: number;
  total_questions?: number;
  correctAnswers?: number;
  correct_answers?: number;
  totalCorrect?: number;
  total_correct?: number;
  totalScore?: number;
  score?: number;
  earnedXp?: number;
  xpEarned?: number;
  xp_earned?: number;
}

export default function RecallResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [result, setResult] = useState<RecallResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading || !user) return;
    let active = true;

    api.recall
      .getResult(attemptId)
      .then((res: unknown) => {
        if (!active) return;
        const resAny = res as { data?: RecallResultData } | RecallResultData;
        const data = (resAny as { data?: RecallResultData })?.data || (resAny as RecallResultData);
        setResult(data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        console.error('Failed to load recall result:', err);
        const error = err as { status?: number; response?: { status?: number }; message?: string };
        if (error?.status === 401 || error?.response?.status === 401) {
          router.replace('/login');
          return;
        }
        setErrorMsg(error.message || 'Gagal memuat hasil asesmen Recall dari server.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [attemptId, authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF2FA]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#1B68FF] border-t-transparent" />
      </div>
    );
  }

  const isPassed = Boolean(result?.isPassed ?? result?.is_passed);
  const totalQuestions = result?.totalQuestions ?? result?.total_questions ?? 30;
  const totalCorrect =
    result?.correctAnswers ??
    result?.correct_answers ??
    result?.totalCorrect ??
    result?.total_correct ??
    (result?.score ? Math.round((result.score / 100) * totalQuestions) : 0);
  const formattedCorrect = Number.isInteger(Number(totalCorrect))
    ? totalCorrect
    : Number(totalCorrect).toFixed(1);
  const wrongCount = Math.max(0, totalQuestions - Number(totalCorrect));
  const formattedWrong = Number.isInteger(Number(wrongCount))
    ? wrongCount
    : Number(wrongCount).toFixed(1);
  const score =
    result?.totalScore ??
    result?.score ??
    (totalQuestions > 0 ? Math.round((Number(totalCorrect) / totalQuestions) * 100) : 0);
  const earnedXp = result?.earnedXp ?? result?.xpEarned ?? result?.xp_earned ?? 0;

  return (
    <div
      style={{ fontFamily: "'Onest', sans-serif" }}
      className="relative flex min-h-screen flex-col bg-[#EEF2FA] text-[#0A0D14] overflow-x-hidden"
    >
      {/* Tekstur Architectural Grid 56x56 & Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15,23,42,0.032) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,0.032) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-160px] right-[-100px] w-[560px] h-[560px] rounded-full bg-[#1B68FF]/10 blur-[130px] z-0"
      />

      <Navbar />

      <main className="relative z-10 flex-1 w-full px-6 sm:px-12 lg:px-16 py-8 sm:py-12 space-y-10">
        {/* Top Action Bar */}
        <div>
          <Link
            href="/dashboard"
            className="min-h-[48px] px-5 py-2.5 rounded-[14px] bg-white hover:bg-[#F4F7FC] text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[16px] font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali ke Dasbor</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#1B68FF] border-t-transparent" />
          </div>
        ) : errorMsg || !result ? (
          <div className="bg-white rounded-[32px] border border-slate-200/90 p-12 text-center shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] max-w-xl mx-auto space-y-4">
            <AlertCircle className="h-12 w-12 text-[#D97706] mx-auto" />
            <h2 className="text-[22px] font-semibold text-[#0A0D14]">Data Hasil Tidak Ditemukan</h2>
            <p className="text-[16px] text-[#1E293B] leading-[1.55]">
              {errorMsg || 'Data evaluasi asesmen Recall tidak dapat dimuat dari server.'}
            </p>
            <Link
              href="/recall"
              className="min-h-[48px] px-7 py-3 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] text-white text-[16px] font-semibold transition-all inline-flex items-center justify-center cursor-pointer"
            >
              Kembali ke Halaman Recall
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Status Hero Card */}
            <div
              className={`rounded-[32px] p-8 sm:p-10 border transition-all ${
                isPassed
                  ? 'bg-white border-2 border-[#059669]/40 shadow-[0_24px_60px_-15px_rgba(5,150,105,0.12)]'
                  : 'bg-white border-2 border-[#D97706]/40 shadow-[0_24px_60px_-15px_rgba(217,119,6,0.12)]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {isPassed ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[14px] font-semibold bg-[#ECFDF5] text-[#065F46] border border-[#059669]/30">
                      <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                      <span>Lulus Tes Awal</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[14px] font-semibold bg-[#FFFBEB] text-[#78350F] border border-[#D97706]/30">
                      <ShieldCheck className="h-4 w-4 text-[#D97706]" />
                      <span>Belum Mencapai Target</span>
                    </span>
                  )}
                  <span className="text-[15px] text-[#334155] font-medium">
                    Target Kelulusan 90%
                  </span>
                </div>

                <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.035em] text-[#0A0D14] leading-[1.1]">
                  {isPassed
                    ? 'Keren! Kamu Berhasil Lulus'
                    : 'Yuk, Coba Sekali Lagi!'}
                </h1>

                <p className="text-[16px] sm:text-[17px] text-[#1E293B] leading-[1.55] max-w-3xl">
                  {isPassed
                    ? `Kamu berhasil mencapai target kelulusan 90% (${formattedCorrect} dari ${totalQuestions} soal benar). Semua materi pembelajaran Matematika dan Bahasa Indonesia sekarang sudah terbuka dan siap kamu pelajari!`
                    : `Jangan berkecil hati! Kamu bisa melihat pembahasan soal-soal di bawah ini, pelajari yang masih keliru, lalu coba lagi sampai nilaimu mencapai 90% agar materinya terbuka.`}
                </p>
              </div>
            </div>

            {/* Score & Metrics Bento Card */}
            <div className="rounded-[32px] bg-white border border-slate-200/90 p-8 sm:p-10 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.07)] space-y-8">
              {/* Score Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                <div>
                  <span className="text-[15px] font-medium text-[#334155]">
                    Skor Akhir
                  </span>
                  <div className="text-[44px] sm:text-[56px] font-semibold tracking-[-0.04em] text-[#0A0D14] leading-none mt-2 tabular-nums">
                    {Math.round(score)}%
                  </div>
                  <p className="text-[16px] text-[#1E293B] mt-2 font-medium">
                    {formattedCorrect} dari {totalQuestions} soal berhasil dijawab dengan benar
                  </p>
                </div>

                {earnedXp > 0 && (
                  <div className="inline-flex items-center gap-2 rounded-[20px] bg-[#FFFBEB] border border-[#D97706]/30 px-6 py-4 text-[16px] font-semibold text-[#78350F]">
                    <Sparkles className="h-5 w-5 text-[#D97706]" />
                    <span>+{earnedXp} XP</span>
                  </div>
                )}
              </div>

              {/* 4 Metric Columns */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-[20px] bg-[#F8FAFC] border-2 border-slate-200/80 p-5 text-center">
                  <span className="text-[14px] font-medium text-[#334155]">Total Soal</span>
                  <p className="text-[26px] font-semibold text-[#0A0D14] mt-1 tabular-nums">
                    {totalQuestions}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#ECFDF5] border-2 border-[#059669]/30 p-5 text-center">
                  <span className="text-[14px] font-semibold text-[#065F46]">Jawaban Benar</span>
                  <p className="text-[26px] font-semibold text-[#059669] mt-1 tabular-nums">
                    {formattedCorrect}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#FFFBEB] border-2 border-[#D97706]/30 p-5 text-center">
                  <span className="text-[14px] font-semibold text-[#78350F]">Jawaban Salah</span>
                  <p className="text-[26px] font-semibold text-[#D97706] mt-1 tabular-nums">
                    {formattedWrong}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#EEF2FA] border-2 border-[#1B68FF]/30 p-5 text-center">
                  <span className="text-[14px] font-semibold text-[#1454D6]">Syarat Lulus</span>
                  <p className="text-[26px] font-semibold text-[#1B68FF] mt-1 tabular-nums">
                    90% (27 Soal)
                  </p>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href={`/recall/review/${attemptId}`}
                  className="min-h-[48px] px-6 py-2.5 rounded-[14px] bg-white hover:bg-[#F4F7FC] active:translate-y-0.5 text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[16px] font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                >
                  <FileText className="h-5 w-5 text-[#1B68FF]" />
                  <span>Lihat Pembahasan Soal</span>
                </Link>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  {!isPassed && (
                    <Link
                      href="/recall"
                      className="min-h-[48px] px-6 py-2.5 rounded-[14px] bg-white hover:bg-[#F4F7FC] active:translate-y-0.5 text-[#0A0D14] border-2 border-[#0A0D14]/20 hover:border-[#1B68FF] text-[16px] font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                    >
                      <RotateCcw className="h-5 w-5 text-[#334155]" />
                      <span>Coba Tes Lagi</span>
                    </Link>
                  )}

                  <Link
                    href="/curriculum"
                    className="min-h-[48px] px-8 py-3.5 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[16px] font-semibold transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] inline-flex items-center justify-center gap-2.5 cursor-pointer w-full sm:w-auto"
                  >
                    <span>Mulai Belajar Materi</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
