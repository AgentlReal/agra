'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  AlertCircle,
  Eye,
  Check,
  X,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import FormattedContent from '@/components/common/FormattedContent';
import OptionRenderer from '@/components/common/OptionRenderer';

export default function AdminValidasiSoalPage() {
  const router = useRouter();
  const { user, role, isLoading: authLoading, isAuthenticated } = useAuth();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Selected question for review modal
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Auth guard: allow TIM_KURIKULUM and SUPERADMIN
  useEffect(() => {
    const isAuthorized =
      isAuthenticated &&
      (role === 'TIM_KURIKULUM' ||
        user?.role === 'TIM_KURIKULUM' ||
        role === 'SUPERADMIN' ||
        user?.role === 'SUPERADMIN');

    if (!authLoading && !isAuthorized) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, role, user, router]);

  const fetchPendingQuestions = () => {
    setLoading(true);
    setErrorMsg('');
    api.admin
      .getQuestions({ status: 'PENDING_REVIEW', limit: 50 })
      .then((res: any) => {
        const list = res?.data || res?.items || (Array.isArray(res) ? res : []);
        setQuestions(list);
      })
      .catch((err: any) => {
        console.error('Failed to load pending questions:', err);
        setErrorMsg(err.message || 'Gagal memuat antrean validasi soal.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPendingQuestions();
  }, []);

  const handleApprove = async (questionId: string | number) => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.admin.updateQuestionReviewStatus(questionId, {
        status: 'ACTIVE',
        is_active: true,
      });
      setSuccessMsg(`Butir soal #${questionId} berhasil disetujui & dipublikasikan!`);
      setSelectedQuestion(null);
      fetchPendingQuestions();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyetujui butir soal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestRevision = async (questionId: string | number) => {
    if (!revisionNotes.trim()) {
      setErrorMsg('Catatan revisi wajib diisi agar penulis kurikulum mengetahui perbaikan yang diperlukan.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.admin.updateQuestionReviewStatus(questionId, {
        status: 'REVISION',
        is_active: false,
        revision_notes: revisionNotes.trim(),
      });
      setSuccessMsg(`Butir soal #${questionId} telah dikembalikan untuk revisi.`);
      setSelectedQuestion(null);
      setRevisionNotes('');
      fetchPendingQuestions();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal meminta revisi butir soal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <AdminNav />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-bold mb-1">
              <ClipboardCheck className="h-4 w-4" />
              <span>Pusat Kendali Mutu Asesmen</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Antrean Validasi Butir Soal
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              Tinjau kesesuaian stimulus, format, dan kunci jawaban sebelum soal diterbitkan ke bank aktif.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPendingQuestions}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Segarkan Antrean</span>
          </button>
        </div>

        {errorMsg && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-amber-600 hover:text-amber-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Pending Items Count Banner */}
        <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
              {questions.length}
            </div>
            <p className="text-xs font-semibold text-purple-900">
              Butir soal sedang menunggu validasi mutu kurikulum.
            </p>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-2xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">Antrean Validasi Bersih!</p>
            <p className="text-xs text-slate-400 mt-1">
              Seluruh butir soal yang diajukan telah ditinjau atau tidak ada butir soal dalam antrean.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => {
              const questionFormat = q.question_format || q.questionFormat || 'SINGLE_CHOICE';
              const isComplex = questionFormat === 'COMPLEX_CHOICE';
              return (
                <div
                  key={q.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4 hover:border-slate-300 transition"
                >
                  {/* Item Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                        Soal #{q.id}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {q.bank_type || q.bankType || 'LATIHAN'}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {q.subject_id === 1 ? 'Matematika SMP' : 'Bahasa Indonesia SMP'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isComplex
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}
                      >
                        {isComplex ? 'Pilihan Ganda Kompleks' : 'Pilihan Tunggal'}
                      </span>
                    </div>
                  </div>

                  {/* Stimulus & Question Content */}
                  <div className="space-y-3">
                    {q.stimulus && (
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-mono">
                        <FormattedContent
                          content={
                            typeof q.stimulus === 'string'
                              ? q.stimulus
                              : q.stimulus?.stimulus_text || ''
                          }
                        />
                      </div>
                    )}

                    <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                      <FormattedContent content={q.question_text || q.questionText || ''} />
                    </div>

                    {(q.question_image_url || q.stimulus_image_url) && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-semibold bg-purple-50 px-3 py-1 rounded-xl">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Gambar Soal Terlampir</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedQuestion(q);
                        setRevisionNotes('');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 text-xs font-bold text-amber-900 transition cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Minta Revisi</span>
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleApprove(q.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-2xs transition cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Setujui & Terbitkan</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Minta Revisi */}
        {selectedQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Catatan Perbaikan Soal #{selectedQuestion.id}</span>
                </h3>
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tuliskan poin koreksi atau instruksi perbaikan materi kurikulum yang harus diperbaiki oleh penulis soal:
                </p>

                <textarea
                  rows={4}
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Contoh: Alternatif jawaban C dan D memiliki rumus yang ambigu, perbaiki penulisan KaTeX pada variabel x..."
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedQuestion(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleRequestRevision(selectedQuestion.id)}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl disabled:opacity-50"
                >
                  {submitting ? 'Mengirim...' : 'Kirim Catatan Revisi'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

