'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { user, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else if (role === 'TIM_KURIKULUM') {
        router.replace('/admin/bank-soal');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, role, isLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="text-sm font-medium text-slate-400">Memuat AGRA Platform...</p>
      </div>
    </div>
  );
}
