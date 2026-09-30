import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'AGRA - Platform TKA & Kurikulum SMP (Fase D)',
  description: 'Ruang Belajar Mandiri & Asesmen Adaptif TKA Kemendikdasmen Jenjang SMP/MTs Berbasis Mastery Learning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased flex flex-col relative selection:bg-indigo-500 selection:text-white">
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />
        <AuthProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
