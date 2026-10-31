'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { 
  ArrowLeft, 
  Upload, 
  Check, 
  AlertCircle, 
  ShieldCheck,
  Trash2,
  Image as ImageIcon,
  Eye,
  Send,
  Save,
} from 'lucide-react';
import FormattedContent from '@/components/common/FormattedContent';
import OptionRenderer from '@/components/common/OptionRenderer';

export default function CreateQuestionPage() {
  const router = useRouter();
  const { user, role, isLoading: authLoading, isAuthenticated } = useAuth();

  const [curriculumTree, setCurriculumTree] = useState<any[]>([]);
  const [bankType, setBankType] = useState('LEVEL_EXERCISE');
  const [subjectId, setSubjectId] = useState('1');
  const [materialId, setMaterialId] = useState<string>('');
  const [submaterialId, setSubmaterialId] = useState<string>('');
  const [cognitiveLevel, setCognitiveLevel] = useState('1');
  const [questionType, setQuestionType] = useState<'PG_TUNGGAL' | 'PG_KOMPLEKS'>('PG_TUNGGAL');

  const [stimulus, setStimulus] = useState('');
  const [questionText, setQuestionText] = useState('');

  // 4 Options
  const [options, setOptions] = useState([
    { key: 'A', text: '' },
    { key: 'B', text: '' },
    { key: 'C', text: '' },
    { key: 'D', text: '' },
  ]);

  // Keys
  const [singleKey, setSingleKey] = useState('A');
  const [complexKeys, setComplexKeys] = useState<string[]>(['A', 'B']);

  const [explanation, setExplanation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  // Fetch Curriculum Metadata Tree for cascading dropdown [FE-19]
  useEffect(() => {
    api.admin
      .getCurriculumTree()
      .then((res: any) => {
        const tree = res?.data || res;
        if (Array.isArray(tree) && tree.length > 0) {
          setCurriculumTree(tree);
          const firstSub = tree[0];
          setSubjectId(String(firstSub.id));
          if (firstSub.materials && firstSub.materials.length > 0) {
            const firstMat = firstSub.materials[0];
            setMaterialId(String(firstMat.id));
            if (firstMat.submaterials && firstMat.submaterials.length > 0) {
              setSubmaterialId(String(firstMat.submaterials[0].id));
            }
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load curriculum tree:', err);
      });
  }, []);

  // Derive cascaded lists from curriculumTree
  const currentSubject = curriculumTree.find((s) => String(s.id) === String(subjectId));
  const availableMaterials: any[] = currentSubject?.materials || [];
  const currentMaterial = availableMaterials.find((m) => String(m.id) === String(materialId)) || availableMaterials[0];
  const availableSubmaterials: any[] = currentMaterial?.submaterials || [];

  // When subject changes, reset material and submaterial
  const handleSubjectChange = (newSubId: string) => {
    setSubjectId(newSubId);
    const sub = curriculumTree.find((s) => String(s.id) === newSubId);
    if (sub && sub.materials && sub.materials.length > 0) {
      const firstMat = sub.materials[0];
      setMaterialId(String(firstMat.id));
      if (firstMat.submaterials && firstMat.submaterials.length > 0) {
        setSubmaterialId(String(firstMat.submaterials[0].id));
      } else {
        setSubmaterialId('');
      }
    } else {
      setMaterialId('');
      setSubmaterialId('');
    }
  };

  // When material changes, reset submaterial
  const handleMaterialChange = (newMatId: string) => {
    setMaterialId(newMatId);
    const mat = availableMaterials.find((m) => String(m.id) === newMatId);
    if (mat && mat.submaterials && mat.submaterials.length > 0) {
      setSubmaterialId(String(mat.submaterials[0].id));
    } else {
      setSubmaterialId('');
    }
  };

  const handleOptionChange = (key: string, text: string) => {
    setOptions(options.map((opt) => (opt.key === key ? { ...opt, text } : opt)));
  };

  const handleToggleComplexKey = (key: string) => {
    if (complexKeys.includes(key)) {
      setComplexKeys(complexKeys.filter((k) => k !== key));
    } else {
      if (complexKeys.length >= 2) return; // max 2 keys
      setComplexKeys([...complexKeys, key]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.admin.uploadImage(formData);
      const permanentUrl = res?.imageUrl || res?.image_url || res?.url;
      if (permanentUrl) {
        setImageUrl(permanentUrl);
      }
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      setErrorMsg(err.message || 'Gagal mengunggah berkas gambar ke server.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitWithStatus = async (targetStatus: 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE') => {
    if (!questionText.trim()) {
      setErrorMsg('Teks pertanyaan wajib diisi.');
      return;
    }
    if (options.some((opt) => !opt.text.trim())) {
      setErrorMsg('Harap lengkapi seluruh alternatif pilihan jawaban A sampai D.');
      return;
    }
    if (questionType === 'PG_KOMPLEKS' && complexKeys.length !== 2) {
      setErrorMsg('Pilihan Ganda Kompleks harus memiliki tepat 2 kunci jawaban yang benar.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const question_format = questionType === 'PG_KOMPLEKS' ? 'COMPLEX_CHOICE' : 'SINGLE_CHOICE';

    const formattedOptions = options.map((opt) => ({
      option_label: opt.key,
      option_text: opt.text,
      is_correct:
        questionType === 'PG_KOMPLEKS'
          ? complexKeys.includes(opt.key)
          : singleKey === opt.key,
    }));

    const isRecall = bankType === 'RECALL';

    const payload = {
      bank_type: bankType,
      subject_id: Number(subjectId),
      sub_material_id: isRecall ? null : Number(submaterialId) || null,
      cognitive_level_id: isRecall ? null : Number(cognitiveLevel),
      question_format,
      question_text: questionText,
      options: formattedOptions,
      status: targetStatus,
      is_active: targetStatus === 'ACTIVE',
      explanation: {
        explanation_text: explanation?.trim() || 'Pembahasan soal terlampir pada kunci jawaban.',
      },
      stimulus: stimulus?.trim()
        ? {
            title: `Wacana - ${questionText.slice(0, 30)}`,
            stimulus_text: stimulus,
            stimulus_image_url: imageUrl || null,
          }
        : null,
      stimulus_image_url: imageUrl || null,
      question_image_url: imageUrl || null,
      // Backward-compatible fields
      bankType,
      subjectId: Number(subjectId),
      materialName: currentMaterial?.name || '',
      submaterialName: availableSubmaterials.find((sm) => String(sm.id) === String(submaterialId))?.title || '',
      cognitiveLevel: isRecall ? null : Number(cognitiveLevel),
      questionType,
      questionFormat: question_format,
      questionText,
      correctAnswer: questionType === 'PG_TUNGGAL' ? singleKey : complexKeys,
      imageUrl,
      isActive: targetStatus === 'ACTIVE',
    };

    try {
      const res = await api.admin.createQuestion(payload);
      const newQuestionId = res?.id || res?.data?.id;

      // Ensure review status if created as PENDING_REVIEW
      if (targetStatus === 'PENDING_REVIEW' && newQuestionId) {
        await api.admin.updateQuestionReviewStatus(newQuestionId, { status: 'PENDING_REVIEW' }).catch(() => {});
      }

      setSuccessMsg(
        targetStatus === 'DRAFT'
          ? 'Butir soal berhasil disimpan sebagai Draf!'
          : targetStatus === 'PENDING_REVIEW'
          ? 'Butir soal berhasil diajukan ke antrean validasi!'
          : 'Butir soal berhasil diterbitkan ke Bank Soal!'
      );
      setTimeout(() => router.push('/admin/bank-soal'), 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan butir soal baru.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <AdminNav />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <Link
          href="/admin/bank-soal"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Manajemen Bank Soal
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Formulir Pembuatan Butir Soal Baru
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Dukung bentuk soal Pilihan Ganda Tunggal dan Pilihan Ganda Kompleks (MCMA) dengan tepat 2 kunci jawaban benar.
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
            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmitWithStatus('ACTIVE'); }} className="space-y-6">
          {/* Metadata Taksonomi Soal [FE-19] */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              <span>Taksonomi & Penempatan Bank Soal</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Tipe Bank Soal</label>
                <select
                  value={bankType}
                  onChange={(e) => setBankType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-2xs"
                >
                  <option value="LEVEL_EXERCISE">Bank Latihan Level Kognitif</option>
                  <option value="RECALL">Bank Recall Kemampuanmu</option>
                  <option value="SIMULATION">Bank Simulasi TKA</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Mata Pelajaran</label>
                <select
                  value={subjectId}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-2xs"
                >
                  {curriculumTree.length > 0 ? (
                    curriculumTree.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1">Matematika SMP (MAT)</option>
                      <option value="2">Bahasa Indonesia SMP (BIN)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Tingkat Kognitif</label>
                <select
                  value={cognitiveLevel}
                  onChange={(e) => setCognitiveLevel(e.target.value)}
                  disabled={bankType === 'RECALL'}
                  className={`mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-2xs ${
                    bankType === 'RECALL' ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''
                  }`}
                  title={bankType === 'RECALL' ? 'Bank Recall tidak memiliki level kognitif' : 'Tingkat Kognitif'}
                >
                  <option value="1">Level 1 - Pemahaman (Knowing / Recall)</option>
                  <option value="2">Level 2 - Aplikasi (Applying)</option>
                  <option value="3">Level 3 - Penalaran (Reasoning / HOTS)</option>
                </select>
              </div>
            </div>

            {/* Cascading Materi & Submateri [FE-19] */}
            {bankType !== 'RECALL' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Materi Pokok</label>
                  <select
                    value={materialId}
                    onChange={(e) => handleMaterialChange(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-2xs"
                  >
                    {availableMaterials.length > 0 ? (
                      availableMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name || m.title}
                        </option>
                      ))
                    ) : (
                      <option value="">(Belum ada materi)</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Submateri Pokok</label>
                  <select
                    value={submaterialId}
                    onChange={(e) => setSubmaterialId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-2xs"
                  >
                    {availableSubmaterials.length > 0 ? (
                      availableSubmaterials.map((sm) => (
                        <option key={sm.id} value={sm.id}>
                          {sm.code ? `[${sm.code}] ` : ''}{sm.title}
                        </option>
                      ))
                    ) : (
                      <option value="">(Belum ada submateri)</option>
                    )}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Format & Konten Soal */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Format & Konten Pertanyaan
            </h2>

            {/* Format Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Bentuk Butir Soal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setQuestionType('PG_TUNGGAL')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    questionType === 'PG_TUNGGAL'
                      ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600 text-purple-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold">Pilihan Ganda Tunggal</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hanya 1 alternatif jawaban yang bernilai benar (Radio button).
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setQuestionType('PG_KOMPLEKS')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    questionType === 'PG_KOMPLEKS'
                      ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600 text-purple-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold">Pilihan Ganda Kompleks (MCMA)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tepat 2 kunci jawaban benar dari 4 opsi (Checkbox).
                  </p>
                </button>
              </div>
            </div>

            {/* Stimulus / Wacana */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Wacana / Konteks Stimulus (Opsional)
              </label>
              <textarea
                rows={3}
                value={stimulus}
                onChange={(e) => setStimulus(e.target.value)}
                placeholder="Masukkan teks stimulus atau wacana (dapat menggunakan KaTeX / Markdown)..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-2xs font-mono"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Ilustrasi Gambar Soal (Opsional)
              </label>
              <div className="mt-1 flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{uploadingImage ? 'Mengunggah...' : 'Pilih Berkas Gambar'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                {imageUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-700 font-semibold truncate max-w-xs">
                      {imageUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="p-1 text-slate-400 hover:text-amber-700"
                      title="Hapus gambar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Pertanyaan Soal <span className="text-amber-600">*</span>
              </label>
              <textarea
                rows={4}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Tuliskan butir pertanyaan di sini..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-2xs font-mono"
                required
              />
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-700">
                Opsi Pilihan Jawaban & Kunci Jawaban
              </label>

              {options.map((opt) => {
                const isCorrect =
                  questionType === 'PG_KOMPLEKS'
                    ? complexKeys.includes(opt.key)
                    : singleKey === opt.key;

                return (
                  <div
                    key={opt.key}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${
                      isCorrect
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (questionType === 'PG_KOMPLEKS') {
                          handleToggleComplexKey(opt.key);
                        } else {
                          setSingleKey(opt.key);
                        }
                      }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCorrect
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {opt.key}
                    </button>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleOptionChange(opt.key, e.target.value)}
                        placeholder={`Teks atau rumus pilihan ${opt.key}...`}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none font-mono"
                        required
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Pembahasan & Kunci Jawaban
              </label>
              <textarea
                rows={3}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Jelaskan langkah penyelesaian dan rasionalisasi kunci jawaban..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-2xs font-mono"
              />
            </div>
          </div>

          {/* Form Actions [FE-22] */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Link
              href="/admin/bank-soal"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              Batal
            </Link>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmitWithStatus('DRAFT')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan sebagai Draf</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmitWithStatus('PENDING_REVIEW')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 px-4 py-2.5 text-xs font-bold text-amber-900 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ajukan Validasi</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmitWithStatus('ACTIVE')}
              className="btn-tactile-primary rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Terbitkan Langsung'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
