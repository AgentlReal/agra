'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import {
  Network,
  BookOpen,
  Plus,
  Layers,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';

export default function AdminCurriculumPage() {
  const router = useRouter();
  const { user, role, isLoading: authLoading, isAuthenticated } = useAuth();

  const [tree, setTree] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Expand / collapse states
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({ '1': true, '2': true });
  const [expandedMaterials, setExpandedMaterials] = useState<Record<string, boolean>>({});

  // Modals
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [submaterialModalOpen, setSubmaterialModalOpen] = useState(false);

  // Forms
  const [subjectForm, setSubjectForm] = useState({ code: '', name: '', description: '' });
  const [materialForm, setMaterialForm] = useState({ subject_id: '1', title: '', order_index: 1 });
  const [submaterialForm, setSubmaterialForm] = useState({
    subject_id: '1',
    material_id: '',
    code: '',
    title: '',
    order_index: 1,
  });

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

  const fetchTree = () => {
    setLoading(true);
    setErrorMsg('');
    api.admin
      .getCurriculumTree()
      .then((res: any) => {
        const data = res?.data || res || [];
        setTree(Array.isArray(data) ? data : []);
        // default material_id for modal
        if (data.length > 0 && data[0].materials?.length > 0) {
          setMaterialForm((prev) => ({ ...prev, subject_id: String(data[0].id) }));
          setSubmaterialForm((prev) => ({
            ...prev,
            subject_id: String(data[0].id),
            material_id: String(data[0].materials[0].id),
          }));
        }
      })
      .catch((err: any) => {
        console.error('Failed to load curriculum tree:', err);
        setErrorMsg(err.message || 'Gagal memuat pohon kurikulum.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const toggleSubject = (sId: string | number) => {
    setExpandedSubjects((prev) => ({ ...prev, [String(sId)]: !prev[String(sId)] }));
  };

  const toggleMaterial = (mId: string | number) => {
    setExpandedMaterials((prev) => ({ ...prev, [String(mId)]: !prev[String(mId)] }));
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.code.trim() || !subjectForm.name.trim()) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.admin.createSubject(subjectForm);
      setSuccessMsg(`Mata pelajaran ${subjectForm.name} berhasil ditambahkan!`);
      setSubjectModalOpen(false);
      setSubjectForm({ code: '', name: '', description: '' });
      fetchTree();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menambahkan mata pelajaran.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialForm.title.trim()) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.admin.createMaterial({
        subject_id: Number(materialForm.subject_id),
        title: materialForm.title,
        order_index: Number(materialForm.order_index),
      });
      setSuccessMsg(`Materi pokok ${materialForm.title} berhasil ditambahkan!`);
      setMaterialModalOpen(false);
      setMaterialForm((prev) => ({ ...prev, title: '', order_index: prev.order_index + 1 }));
      fetchTree();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menambahkan materi pokok.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSubmaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submaterialForm.material_id || !submaterialForm.code.trim() || !submaterialForm.title.trim()) {
      setErrorMsg('Harap lengkapi seluruh formulir submateri.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.admin.createSubmaterial({
        material_id: Number(submaterialForm.material_id),
        code: submaterialForm.code,
        title: submaterialForm.title,
        order_index: Number(submaterialForm.order_index),
      });
      setSuccessMsg(`Submateri ${submaterialForm.title} berhasil ditambahkan!`);
      setSubmaterialModalOpen(false);
      setSubmaterialForm((prev) => ({ ...prev, code: '', title: '', order_index: prev.order_index + 1 }));
      fetchTree();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menambahkan submateri.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSubjectForSubmaterial = tree.find((s) => String(s.id) === String(submaterialForm.subject_id));
  const materialsForSubmaterialModal = selectedSubjectForSubmaterial?.materials || [];

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <AdminNav />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-bold mb-1">
              <Network className="h-4 w-4" />
              <span>Hierarki Taksonomi Resmi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Struktur Kurikulum & Pohon Materi
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              Tata kelola taksonomi 3 level: Mata Pelajaran &rarr; Materi Pokok &rarr; Submateri Pembelajaran.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSubjectModalOpen(true);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Mapel</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMaterialModalOpen(true);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Materi Pokok</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSubmaterialModalOpen(true);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2 text-xs font-bold text-white shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Submateri</span>
            </button>
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

        {/* Tree List */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          </div>
        ) : tree.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-2xs">
            <Network className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Belum ada struktur kurikulum terdaftar.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tree.map((subject) => {
              const isSubExpanded = expandedSubjects[String(subject.id)] ?? true;
              const materials = subject.materials || [];
              const totalSub = materials.reduce((acc: number, m: any) => acc + (m.submaterials?.length || 0), 0);

              return (
                <div
                  key={subject.id}
                  className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                >
                  {/* Subject Header */}
                  <div
                    onClick={() => toggleSubject(subject.id)}
                    className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm border border-purple-200">
                        {subject.code}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900">{subject.name}</h2>
                        <p className="text-xs text-slate-500">
                          {materials.length} Materi Pokok • {totalSub} Submateri Pembelajaran
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                        {isSubExpanded ? 'Tutup' : 'Lihat Materi'}
                      </span>
                      {isSubExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Materials Accordion */}
                  {isSubExpanded && (
                    <div className="p-4 sm:p-6 space-y-4">
                      {materials.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-4 text-center">
                          Belum ada materi pokok pada mata pelajaran ini.
                        </p>
                      ) : (
                        materials.map((mat: any) => {
                          const isMatExpanded = expandedMaterials[String(mat.id)] ?? true;
                          const submaterials = mat.submaterials || [];

                          return (
                            <div
                              key={mat.id}
                              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                            >
                              <div
                                onClick={() => toggleMaterial(mat.id)}
                                className="p-3.5 sm:p-4 bg-slate-50/40 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
                              >
                                <div className="flex items-center gap-2.5">
                                  <BookOpen className="w-4 h-4 text-blue-600" />
                                  <span className="text-xs font-bold text-slate-800">
                                    {mat.name || mat.title}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    ({submaterials.length} Submateri)
                                  </span>
                                </div>
                                {isMatExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-slate-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                )}
                              </div>

                              {isMatExpanded && (
                                <div className="p-3 divide-y divide-slate-100">
                                  {submaterials.length === 0 ? (
                                    <p className="text-[11px] text-slate-400 italic py-2 px-3">
                                      Belum ada submateri pada materi pokok ini.
                                    </p>
                                  ) : (
                                    submaterials.map((sm: any) => (
                                      <div
                                        key={sm.id}
                                        className="py-2 px-3 flex items-center justify-between hover:bg-slate-50 rounded-xl transition"
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-mono text-[10px] font-bold border border-purple-100">
                                            {sm.code}
                                          </span>
                                          <span className="text-xs font-medium text-slate-800">
                                            {sm.title}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] font-bold text-slate-400">
                                            3 Level Kognitif (L1, L2, L3)
                                          </span>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Tambah Mapel */}
        {subjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Tambah Mata Pelajaran Baru</h3>
                <button onClick={() => setSubjectModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubject} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Kode Singkat (3 Karakter)</label>
                  <input
                    type="text"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                    placeholder="Contoh: MAT, BIN, IPA"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none uppercase font-mono"
                    maxLength={10}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Nama Mata Pelajaran</label>
                  <input
                    type="text"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    placeholder="Contoh: Ilmu Pengetahuan Alam SMP"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Deskripsi / Ruang Lingkup</label>
                  <textarea
                    rows={3}
                    value={subjectForm.description}
                    onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                    placeholder="Deskripsi singkat kurikulum..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSubjectModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-50"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan Mapel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Tambah Materi Pokok */}
        {materialModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Tambah Materi Pokok</h3>
                <button onClick={() => setMaterialModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMaterial} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Mata Pelajaran</label>
                  <select
                    value={materialForm.subject_id}
                    onChange={(e) => setMaterialForm({ ...materialForm, subject_id: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                  >
                    {tree.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Judul Materi Pokok</label>
                  <input
                    type="text"
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                    placeholder="Contoh: Aljabar, Bilangan, Geometri..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Nomor Urutan</label>
                  <input
                    type="number"
                    min={1}
                    value={materialForm.order_index}
                    onChange={(e) => setMaterialForm({ ...materialForm, order_index: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setMaterialModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-50"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan Materi'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Tambah Submateri */}
        {submaterialModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Tambah Submateri Pembelajaran</h3>
                <button onClick={() => setSubmaterialModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmaterial} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Mata Pelajaran</label>
                  <select
                    value={submaterialForm.subject_id}
                    onChange={(e) => {
                      const newSubId = e.target.value;
                      const s = tree.find((x) => String(x.id) === newSubId);
                      const mats = s?.materials || [];
                      setSubmaterialForm({
                        ...submaterialForm,
                        subject_id: newSubId,
                        material_id: mats.length > 0 ? String(mats[0].id) : '',
                      });
                    }}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                  >
                    {tree.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Materi Pokok Induk</label>
                  <select
                    value={submaterialForm.material_id}
                    onChange={(e) => setSubmaterialForm({ ...submaterialForm, material_id: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                    required
                  >
                    {materialsForSubmaterialModal.map((m: any) => (
                      <option key={m.id} value={m.id}>
                        {m.name || m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Kode Submateri</label>
                  <input
                    type="text"
                    value={submaterialForm.code}
                    onChange={(e) => setSubmaterialForm({ ...submaterialForm, code: e.target.value })}
                    placeholder="Contoh: MAT-01, BIN-05"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Judul Submateri</label>
                  <input
                    type="text"
                    value={submaterialForm.title}
                    onChange={(e) => setSubmaterialForm({ ...submaterialForm, title: e.target.value })}
                    placeholder="Contoh: Bilangan Bulat dan Pecahan"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Urutan Indeks</label>
                  <input
                    type="number"
                    min={1}
                    value={submaterialForm.order_index}
                    onChange={(e) => setSubmaterialForm({ ...submaterialForm, order_index: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSubmaterialModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-50"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan Submateri'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

