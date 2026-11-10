import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{ fontFamily: "'Onest', sans-serif" }}
      className="relative z-10 mt-auto border-t border-slate-300/80 bg-[#EEF2FA]/80 text-[#334155]"
    >
      <div className="w-full px-6 sm:px-12 lg:px-16 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[14px]">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/images/agra-icon.png"
              alt="Logo AGRA"
              className="w-6 h-6 object-contain"
            />
            <span className="text-[18px] font-semibold tracking-[-0.04em] text-[#0A0D14]">
              AGRA.
            </span>
            <span>
              — Ruang Belajar &amp; Simulasi Mandiri Tes Kemampuan Akademik SMP
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-[#0A0D14] transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms-of-service" className="hover:text-[#0A0D14] transition-colors">
              Ketentuan Layanan
            </Link>
            <span>&copy; {new Date().getFullYear()} AGRA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
