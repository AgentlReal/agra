'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { GraduationCap, ArrowRight, Check, Sparkles, Smile } from 'lucide-react';

interface AvatarPreset {
  id: number;
  name: string;
  imageUrl?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<number>(8);
  const [avatars, setAvatars] = useState<AvatarPreset[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.profile
      .getAvatars()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : res.data || [];
        if (Array.isArray(list) && list.length > 0) {
          setAvatars(list);
          setSelectedAvatarId(list[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load avatars:', err);
        setErrorMsg('Gagal memuat daftar avatar dari server.');
      });
  }, []);

  const handleComplete = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      await api.profile.complete({
        grade: selectedGrade,
        avatarId: selectedAvatarId,
      });

      updateUser({ grade: selectedGrade });
      // Proceed to the Gatekeeper diagnostic test (Recall Kemampuanmu)
      router.push('/recall');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan profil awal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Langkah Awal Penyiapan Profil
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Hai, {user?.name || 'Siswa Hebat'}! 👋
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Pilih jenjang kelas dan avatar belajarmu sebelum memulai latihan adaptif TKA SMP.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-8">
          {errorMsg && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Choose Grade */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              1. Pilih Tingkat Kelas Anda (Fase D SMP/MTs)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[7, 8, 9].map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setSelectedGrade(grade)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    selectedGrade === grade
                      ? 'border-indigo-500 bg-indigo-600/20 text-white ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <GraduationCap className={`h-6 w-6 mb-1.5 ${selectedGrade === grade ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-base font-bold">Kelas {grade}</span>
                  <span className="text-[10px] text-slate-500">SMP / MTs</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Choose Avatar */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              2. Pilih Avatar Karakter Belajar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {avatars.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatarId(av.id)}
                  className={`relative flex flex-col items-center p-3 rounded-xl border transition-all text-center ${
                    selectedAvatarId === av.id
                      ? 'border-indigo-500 bg-indigo-600/20 text-white ring-2 ring-indigo-500/40'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {selectedAvatarId === av.id && (
                    <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-white">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                  )}
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-2">
                    <Smile className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-semibold leading-tight line-clamp-1">{av.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/30 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Simpan & Masuk ke Recall Kemampuanmu</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-500">
              Setelah ini, Anda akan diarahkan ke tes diagnostik awal 30 butir soal (tanpa batas waktu).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
