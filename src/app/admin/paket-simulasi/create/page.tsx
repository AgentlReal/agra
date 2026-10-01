'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { ArrowLeft, Layers, Check, AlertCircle, ShieldCheck } from 'lucide-react';

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
    <div className="flex min-h-screen flex-col bg-slate-950">
      <AdminNav />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-8">
        <Link
          href="/admin/paket-simulasi"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Paket
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Buat Paket Simulasi TKA Baru
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Paket simulasi memuat tepat 30 butir soal dengan alokasi waktu 75 menit (4.500 detik).
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300">
              Judul Paket Simulasi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Paket Try Out 02 - Matematika SMP Fase D"
              required
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300">Mata Pelajaran</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="1">Matematika SMP</option>
                <option value="2">Bahasa Indonesia SMP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">Status Awal</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="PUBLISHED">Published (Dapat diakses peserta)</option>
                <option value="DRAFT">Draft (Disimpan sementara)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">
              Deskripsi & Catatan Kurikulum
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Keterangan blueprint paket, tanggal rilis, dan fokus pengujian kompetensi..."
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-4 text-xs text-purple-200">
            <p className="font-semibold text-purple-400">Aturan Blueprint Sistem Otomatis:</p>
            <p className="mt-1 text-slate-300 leading-relaxed text-[11px]">
              Sistem akan memetakan 30 butir soal secara berimbang dari Bank Soal Simulasi aktif berdasarkan distribusi kurikulum (proporsi L1, L2, dan L3 sesuai Dokumen Blueprint 13).
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/admin/paket-simulasi"
              className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-purple-600 px-6 py-2 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-50"
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
