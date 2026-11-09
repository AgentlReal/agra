import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';

export const metadata: Metadata = {
  title: 'AGRA - Platform TKA & Kurikulum SMP (Fase D)',
  description: 'Ruang Belajar Mandiri & Asesmen Adaptif TKA Kemendikdasmen Jenjang SMP/MTs Berbasis Mastery Learning',
  icons: {
    icon: '/assets/images/agra-icon.png',
    apple: '/assets/images/agra-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('agra_theme')||'light';document.documentElement.setAttribute('data-theme',t);document.documentElement.classList.add(t);}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F4F7FC] text-[#0A0D14] antialiased flex flex-col relative selection:bg-[#1B68FF] selection:text-white transition-colors duration-150" style={{ fontFamily: "'Onest', sans-serif" }}>
        <ThemeProvider>
          <AuthProvider>
            <div className="relative z-10 flex min-h-screen flex-col">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
