'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';

export default function CreateSimulationPackagePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('1');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PUBLISHED');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Judul paket simulasi wajib diisi.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const payload = {
      title,
      subjectId: Number(subjectId),
      description,
      status,
    };

    try {
      await api.admin.createSimulationPackage(payload);
      setSuccessMsg('Paket simulasi 30 butir soal berhasil dibuat!');
      setTimeout(() => router.push('/admin/paket-simulasi'), 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal membuat paket simulasi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <AdminNav />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-8">
        <Link
          href="/admin/paket-simulasi"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Paket
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Buat Paket Simulasi TKA Baru
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Paket simulasi memuat tepat 30 butir soal dengan alokasi waktu 75 menit (4.500 detik).
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Judul Paket Simulasi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Paket Try Out 02 - Matematika SMP Fase D"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Mata Pelajaran</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-xs"
              >
                <option value="1">Matematika SMP</option>
                <option value="2">Bahasa Indonesia SMP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Status Awal</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-xs"
              >
                <option value="PUBLISHED">Published (Dapat diakses peserta)</option>
                <option value="DRAFT">Draft (Disimpan sementara)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Deskripsi & Catatan Kurikulum
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Keterangan blueprint paket, tanggal rilis, dan fokus pengujian kompetensi..."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-xs"
            />
          </div>

          <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 text-xs text-purple-900">
            <p className="font-bold text-purple-800">Aturan Blueprint Sistem Otomatis:</p>
            <p className="mt-1 text-slate-600 leading-relaxed text-[11px] font-medium">
              Sistem akan memetakan 30 butir soal secara berimbang dari Bank Soal Simulasi aktif berdasarkan distribusi kurikulum (proporsi L1, L2, dan L3 sesuai Dokumen Blueprint 13).
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/admin/paket-simulasi"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-tactile-primary rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Membuat...' : 'Buat Paket Sekarang'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
