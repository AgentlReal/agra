import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-[#eff4ff]/60 text-slate-500">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 p-0.5">
              <AppLogo size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-800">
              AGRA Platform TKA SMP (Fase D)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/80 border border-slate-200/80 rounded-full px-3 py-1 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Standar Asesmen Ramah Siswa (Safe-to-Fail) Kurikulum Kemendikdasmen</span>
          </div>

          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} AGRA. Hak Cipta Dilindungi.
          </div>
        </div>
      </div>
    </footer>
  );
};
