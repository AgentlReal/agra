import React from 'react';
import { GraduationCap, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950/70 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-slate-300">
              AGRA Platform TKA SMP (Fase D)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="h-3.5 w-3.5 text-emerald-500" />
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
