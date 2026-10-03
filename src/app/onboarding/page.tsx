'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { GraduationCap, ArrowRight, Check, Sparkles, AlertCircle } from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';
import { AppLogo } from '@/components/common/AppLogo';
import { Footer } from '@/components/layout/Footer';

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
        const list = res?.data?.items || res?.items || (Array.isArray(res) ? res : res.data || []);
        if (Array.isArray(list) && list.length > 0) {
          setAvatars(list);
          const active = list.find((a: any) => a.selected);
          setSelectedAvatarId(active ? active.id : list[0].id);
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

      const chosenAvatar = avatars.find((a) => a.id === selectedAvatarId);
      updateUser({ 
        grade: selectedGrade,
        avatarId: selectedAvatarId,
        avatarUrl: chosenAvatar?.imageUrl || (chosenAvatar as any)?.image_url,
        needsOnboarding: false,
      });
      // Proceed to the Gatekeeper diagnostic test (Recall Kemampuanmu)
      router.push('/recall');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan profil awal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <header className="w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 p-1">
              <AppLogo size={26} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-blue-600">AGRA</span>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-500 border-l border-slate-200 pl-2">
                TKA Pintar SMP
              </span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Langkah Awal Penyiapan Profil Siswa</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Hai, {user?.name || user?.username || 'Siswa'}! 👋
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Pilih jenjang kelas dan avatar karakter belajarmu sebelum memulai asesmen adaptif TKA SMP.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
            {errorMsg && (
              <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Choose Grade */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-3">
                1. Pilih Tingkat Kelasmu (Fase D SMP/MTs)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[7, 8, 9].map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setSelectedGrade(grade)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedGrade === grade
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className={`h-6 w-6 mb-1.5 ${selectedGrade === grade ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-base font-bold">Kelas {grade}</span>
                    <span className="text-[11px] text-slate-500">SMP / MTs</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Choose Avatar */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-3">
                2. Pilih Avatar Karakter Belajar
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {avatars.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatarId(av.id)}
                    className={`relative flex flex-col items-center p-3.5 rounded-2xl border transition-all text-center cursor-pointer ${
                      selectedAvatarId === av.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {selectedAvatarId === av.id && (
                      <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs z-10">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    <UserAvatar
                      src={av.imageUrl}
                      name={av.name}
                      size="lg"
                      rounded="full"
                      className="mb-2"
                    />
                    <span className="text-xs font-semibold leading-tight line-clamp-1 mt-0.5">{av.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                onClick={handleComplete}
                disabled={loading}
                className="btn-tactile-primary w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
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
              <p className="mt-3 text-center text-xs text-slate-500">
                Setelah ini, kamu akan diarahkan ke tes diagnostik awal 30 butir soal (tanpa batas waktu ketat).
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
