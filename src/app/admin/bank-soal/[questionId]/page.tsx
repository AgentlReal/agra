'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import { 
  ArrowLeft, 
  Upload, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Edit3 
} from 'lucide-react';

export default function EditQuestionPage({ params }: { params: Promise<{ questionId: string }> }) {
  const router = useRouter();
  const { questionId } = use(params);

  const [bankType, setBankType] = useState('LATIHAN');
  const [subjectId, setSubjectId] = useState('1');
  const [materialName, setMaterialName] = useState('');
  const [submaterialName, setSubmaterialName] = useState('');
  const [cognitiveLevel, setCognitiveLevel] = useState('L1');
  const [questionType, setQuestionType] = useState<'PG_TUNGGAL' | 'PG_KOMPLEKS'>('PG_TUNGGAL');

  const [stimulus, setStimulus] = useState('');
  const [questionText, setQuestionText] = useState('');

  const [options, setOptions] = useState([
    { key: 'A', text: '' },
    { key: 'B', text: '' },
    { key: 'C', text: '' },
    { key: 'D', text: '' },
  ]);

  const [singleKey, setSingleKey] = useState('A');
  const [complexKeys, setComplexKeys] = useState<string[]>(['A', 'B']);

  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    api.admin
      .getQuestion(questionId)
      .then((res: any) => {
        const data = res?.data || res;
        if (data) {
          populateData(data);
        } else {
          setErrorMsg('Data soal tidak ditemukan di server.');
        }
      })
      .catch((err: any) => {
        console.error('Failed to load question:', err);
        setErrorMsg(err.message || 'Gagal memuat data soal dari server.');
      })
      .finally(() => setLoading(false));
  }, [questionId]);

  const populateData = (q: any) => {
    setBankType(q.bankType || q.bank_type || 'LEVEL_EXERCISE');
    setSubjectId(String(q.subjectId || q.subject_id || 1));
    setMaterialName(q.materialName || q.material_name || '');
    setSubmaterialName(q.submaterialName || q.sub_material_name || '');
    setCognitiveLevel(String(q.cognitiveLevelId || q.cognitive_level_id || '1'));
    setQuestionType(
      (q.questionFormat || q.question_format) === 'COMPLEX_CHOICE' ? 'PG_KOMPLEKS' : 'PG_TUNGGAL'
    );
    setStimulus(q.stimulusText || q.stimulus || '');
    setQuestionText(q.questionText || q.question_text || '');
    if (q.options && Array.isArray(q.options)) {
      setOptions(
        q.options.map((opt: any) => ({
          key: opt.optionLabel || opt.option_label || opt.key,
          text: opt.optionText || opt.option_text || opt.text,
        }))
      );
      const correctList = q.options
        .filter((opt: any) => opt.isCorrect || opt.is_correct)
        .map((opt: any) => opt.optionLabel || opt.option_label || opt.key);
      if (correctList.length > 1) {
        setComplexKeys(correctList);
      } else if (correctList.length === 1) {
        setSingleKey(correctList[0]);
      }
    }
    setExplanation(
      q.explanation?.explanationText ||
        q.explanationText ||
        q.explanation_text ||
        (typeof q.explanation === 'string' ? q.explanation : '')
    );
  };

  const handleOptionChange = (key: string, text: string) => {
    setOptions(options.map((opt) => (opt.key === key ? { ...opt, text } : opt)));
  };

  const handleToggleComplexKey = (key: string) => {
    if (complexKeys.includes(key)) {
      if (complexKeys.length <= 1) return;
      setComplexKeys(complexKeys.filter((k) => k !== key));
    } else {
      setComplexKeys([...complexKeys, key]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questionType === 'PG_KOMPLEKS' && complexKeys.length < 2) {
      setErrorMsg('Pilihan Ganda Kompleks harus memiliki minimal 2 kunci jawaban yang benar.');
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

    const payload = {
      bank_type: bankType,
      subject_id: Number(subjectId),
      cognitive_level_id: Number(cognitiveLevel),
      question_format,
      question_text: questionText,
      options: formattedOptions,
      explanation: {
        explanation_text: explanation?.trim() || 'Pembahasan soal terlampir pada kunci jawaban.',
      },
      stimulus: stimulus?.trim()
        ? {
            title: `Wacana - ${questionText.slice(0, 30)}`,
            stimulus_text: stimulus,
          }
        : null,
      // Backward-compatible properties
      bankType,
      subjectId: Number(subjectId),
      materialName,
      submaterialName,
      cognitiveLevel,
      questionType,
      questionFormat: question_format,
      questionText,
      correctAnswer: questionType === 'PG_TUNGGAL' ? singleKey : complexKeys,
      explanationText: explanation,
    };

    try {
      await api.admin.updateQuestion(questionId, payload);
      setSuccessMsg('Perubahan butir soal berhasil disimpan!');
      setTimeout(() => router.push('/admin/bank-soal'), 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memperbarui soal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <AdminNav />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <Link
          href="/admin/bank-soal"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Bank Soal
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Edit Butir Soal #{questionId}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Perbarui konten pertanyaan, opsi pilihan, dan penjelasan nalar.
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                {successMsg}
              </div>
            )}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                1. Klasifikasi Soal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Bank Soal</label>
                  <select
                    value={bankType}
                    onChange={(e) => setBankType(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    <option value="RECALL">Bank Recall</option>
                    <option value="LATIHAN">Bank Latihan</option>
                    <option value="SIMULASI">Bank Simulasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Level Kognitif</label>
                  <select
                    value={cognitiveLevel}
                    onChange={(e) => setCognitiveLevel(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    <option value="L1">Level 1 (Pemahaman)</option>
                    <option value="L2">Level 2 (Aplikasi)</option>
                    <option value="L3">Level 3 (Penalaran)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Bentuk Soal</label>
                  <select
                    value={questionType}
                    onChange={(e: any) => setQuestionType(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    <option value="PG_TUNGGAL">Pilihan Ganda Tunggal</option>
                    <option value="PG_KOMPLEKS">Pilihan Ganda Kompleks (MCMA)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                2. Teks Pertanyaan & Stimulus
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-300">Stimulus</label>
                <textarea
                  rows={3}
                  value={stimulus}
                  onChange={(e) => setStimulus(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300">Teks Soal</label>
                <textarea
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                3. Pilihan Jawaban
              </h3>
              <div className="space-y-3">
                {options.map((opt) => (
                  <div key={opt.key} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white">
                      {opt.key}
                    </span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionChange(opt.key, e.target.value)}
                      required
                      className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white"
                    />
                    {questionType === 'PG_TUNGGAL' ? (
                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer px-2">
                        <input
                          type="radio"
                          name="editSingleKey"
                          checked={singleKey === opt.key}
                          onChange={() => setSingleKey(opt.key)}
                          className="text-purple-600"
                        />
                        <span>Kunci</span>
                      </label>
                    ) : (
                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer px-2">
                        <input
                          type="checkbox"
                          checked={complexKeys.includes(opt.key)}
                          onChange={() => handleToggleComplexKey(opt.key)}
                          className="text-purple-600 rounded"
                        />
                        <span>Kunci</span>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                4. Pembahasan Nalar
              </h3>
              <textarea
                rows={4}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link
                href="/admin/bank-soal"
                className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-purple-500 shadow-lg"
              >
                {submitting ? 'Menyimpan...' : 'Perbarui Soal'}
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
