import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";

export const metadata: Metadata = {
  title: "AGRA — Ruang Belajar & Simulasi Mandiri Tes Kemampuan Akademik SMP",
  description:
    "Ruang Belajar & Simulasi Mandiri Tes Kemampuan Akademik SMP (Fase D) berbasis Mastery Learning.",
  icons: {
    icon: "/assets/images/agra-icon.png",
    apple: "/assets/images/agra-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('agra_theme')||'light';document.documentElement.setAttribute('data-theme',t);document.documentElement.classList.add(t);}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#EEF2FA] text-[#0A0D14] antialiased flex flex-col relative selection:bg-[#1B68FF] selection:text-white transition-colors duration-150">
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
