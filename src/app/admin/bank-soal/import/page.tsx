'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  X,
  FileCheck,
} from 'lucide-react';

export default function AdminImportQuestionsPage() {
  const router = useRouter();
  const { user, role, isLoading: authLoading, isAuthenticated } = useAuth();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [importResult, setImportResult] = useState<{
    total: number;
    importedCount: number;
    failedCount: number;
    errors: { index: number; message: string }[];
  } | null>(null);

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setErrorMsg('');
    setImportResult(null);
    const name = file.name.toLowerCase();
    if (!name.endsWith('.csv') && !name.endsWith('.json')) {
      setErrorMsg('Format berkas harus berupa CSV (.csv) atau JSON (.json).');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMsg('Pilih berkas file soal terlebih dahulu.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = typeof window !== 'undefined' ? localStorage.getItem('agra_token') : null;
      const res = await fetch('/api/v1/admin/questions/import', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || data?.error?.message || 'Gagal memproses berkas impor.');
      }

      setImportResult(data?.data || {
        total: 0,
        importedCount: 0,
        failedCount: 0,
        errors: [],
      });
      setSelectedFile(null);
    } catch (err: any) {
      console.error('Import failed:', err);
      setErrorMsg(err.message || 'Gagal memproses impor berkas.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <AdminNav />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <Link
          href="/admin/bank-soal"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Manajemen Bank Soal
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-bold mb-1">
              <UploadCloud className="w-4 h-4" />
              <span>Tata Kelola Massal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Impor Massal Butir Soal
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              Unggah puluhan butir soal sekaligus melalui berkas terstruktur CSV atau JSON.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/v1/admin/questions/import/template?format=csv"
              download
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Template CSV</span>
            </a>
            <a
              href="/api/v1/admin/questions/import/template?format=json"
              download
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Template JSON</span>
            </a>
          </div>
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

        {/* Upload Zone */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
              dragActive
                ? 'border-purple-600 bg-purple-50/50'
                : selectedFile
                ? 'border-emerald-400 bg-emerald-50/30'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {selectedFile ? (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                  <FileCheck className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Siap diproses
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-xs text-amber-700 hover:underline font-semibold"
                >
                  Ganti berkas lain
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto border border-purple-200">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    Tarik dan lepaskan berkas CSV atau JSON di sini
                  </p>
                  <p className="text-xs text-slate-500">
                    Atau telusuri berkas dari komputer Anda (maksimal 5 MB)
                  </p>
                </div>

                <div>
                  <label className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 transition cursor-pointer shadow-2xs">
                    <span>Pilih Berkas Soal</span>
                    <input
                      type="file"
                      accept=".csv, application/json, text/csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={handleUpload}
                className="btn-tactile-primary px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {uploading ? 'Memproses Impor...' : 'Mulai Proses Impor'}
              </button>
            </div>
          )}
        </div>

        {/* Import Results Report */}
        {importResult && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xs space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Hasil Pemrosesan Impor Butir Soal</span>
              </h2>
              <Link
                href="/admin/bank-soal"
                className="text-xs font-bold text-purple-700 hover:underline"
              >
                Lihat di Bank Soal &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Baris Soal</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{importResult.total}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="text-[10px] uppercase font-bold text-emerald-700">Berhasil Diimpor</p>
                <p className="text-2xl font-extrabold text-emerald-800 mt-1">
                  {importResult.importedCount}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="text-[10px] uppercase font-bold text-amber-700">Gagal / Dilewati</p>
                <p className="text-2xl font-extrabold text-amber-900 mt-1">
                  {importResult.failedCount}
                </p>
              </div>
            </div>

            {importResult.errors && importResult.errors.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-800">
                  Rincian Kesalahan Format ({importResult.errors.length}):
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {importResult.errors.map((err, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Baris #{err.index}:</strong> {err.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

