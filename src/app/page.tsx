"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface SubmateriItem {
  code: string;
  title: string;
  scope: string;
  itemsCount: string;
  cognitive: string;
}

const NUMERASI_DATA: SubmateriItem[] = [
  {
    code: "01",
    title: "Bilangan Bulat & Pecahan",
    scope: "Operasi hitung campuran, estimasi, dan pemodelan kontekstual",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "02",
    title: "Aljabar & Persamaan Linear",
    scope: "Penyederhanaan bentuk aljabar, fungsi, dan sistem persamaan linear",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "03",
    title: "Perbandingan & Skala Numerik",
    scope: "Proporsi senilai, berbalik nilai, laju perubahan, dan skala peta",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "04",
    title: "Geometri Datar & Ruang",
    scope: "Teorema Pythagoras, jaring-jaring, luas permukaan, dan volume",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "05",
    title: "Statistika & Representasi Data",
    scope: "Interpretasi grafik, ukuran pemusatan, dan sebaran data",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "06",
    title: "Peluang Kejadian Majemuk",
    scope: "Ruang sampel, frekuensi harapan, dan inferensi ketidakpastian",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "07",
    title: "Barisan, Pola & Deret Angka",
    scope: "Generalisasi pola aritmetika, geometri, dan konfigurasi objek",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "08",
    title: "Aritmetika Sosial & Finansial",
    scope: "Literasi finansial dasar, persentase, diskon, dan bunga tunggal",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
];

const LITERASI_DATA: SubmateriItem[] = [
  {
    code: "01",
    title: "Informasi Tersurat & Eksplisit",
    scope: "Identifikasi fakta spesifik, gagasan pokok, dan verifikasi data teks",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "02",
    title: "Inferensi & Makna Tersirat",
    scope: "Menyimpulkan hubungan sebab-akibat, asumsi penulis, dan prediksi",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "03",
    title: "Struktur & Kohesi Wacana",
    scope: "Analisis kepaduan antarparagraf, konjungsi, dan kerangka logika",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "04",
    title: "Evaluasi Kredibilitas Informasi",
    scope: "Membedakan fakta dan opini, mendeteksi bias, serta validitas argumen",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "05",
    title: "Sintesis Multi-Teks & Infografik",
    scope: "Membandingkan dua sumber bacaan dan menafsirkan tabel/visual",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "06",
    title: "Refleksi Isi & Nilai Kontekstual",
    scope: "Mengaitkan pesan wacana dengan problematika nyata dan etika",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "07",
    title: "Semantik, Diksi & Gaya Bahasa",
    scope: "Ketepatan istilah, makna denotatif-konotatif, dan majas dalam teks",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
  {
    code: "08",
    title: "Penalaran Kritis Teks Eksposisi",
    scope: "Bedah argumen ilmiah populer, tesis, dan ketajaman simpulan",
    itemsCount: "30 Soal",
    cognitive: "L1 • L2 • HOTS",
  },
];

function RevealPop({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionProperty: "opacity, transform",
        transitionDuration: "850ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate3d(0, 0px, 0) scale(1)"
          : "translate3d(0, 42px, 0) scale(0.92)",
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

function SmartStudentCutout() {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [candidateIdx, setCandidateIdx] = useState(0);
  const [ready, setReady] = useState(false);

  const candidates = [
    "/assets/images/anak-smp.png",
    "/assets/images/anak-smp.jpg",
    "/assets/images/anak-smp.webp",
    "/assets/anak-smp.png",
    "/assets/hero-cutout.png",
  ];

  useEffect(() => {
    let active = true;
    const url = candidates[candidateIdx];
    if (!url) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (!active) return;
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setProcessedSrc(url);
          setReady(true);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;

        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0;
        let tail = 0;

        const isBgWhite = (idx: number) => {
          const p = idx * 4;
          if (d[p + 3] < 20) return true;
          return d[p] >= 244 && d[p + 1] >= 244 && d[p + 2] >= 244;
        };

        const push = (x: number, y: number) => {
          if (x < 0 || x >= w || y < 0 || y >= h) return;
          const idx = y * w + x;
          if (!visited[idx] && isBgWhite(idx)) {
            visited[idx] = 1;
            queue[tail++] = idx;
          }
        };

        const maxSeedY = Math.floor(h * 0.89);
        for (let x = 0; x < w; x++) push(x, 0);
        for (let y = 0; y < maxSeedY; y++) {
          push(0, y);
          push(w - 1, y);
        }

        while (head < tail) {
          const curr = queue[head++];
          const cx = curr % w;
          const cy = (curr / w) | 0;
          if (cy < maxSeedY) {
            push(cx - 1, cy);
            push(cx + 1, cy);
            push(cx, cy - 1);
            push(cx, cy + 1);
          }
        }

        let minX = w;
        let maxX = 0;
        let minY = h;
        const maxY = h - 1;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            if (visited[idx]) {
              d[idx * 4 + 3] = 0;
            } else {
              if (
                (x > 0 && visited[idx - 1]) ||
                (x < w - 1 && visited[idx + 1]) ||
                (y > 0 && visited[idx - w]) ||
                (y < h - 1 && visited[idx + w])
              ) {
                d[idx * 4 + 3] = 180;
              }
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);

        // Auto-crop dead margins so the SMP student fills the giant hero stage
        if (maxX > minX && maxY > minY) {
          const padX = Math.max(0, minX - 12);
          const padY = Math.max(0, minY - 12);
          const cropW = Math.min(w - padX, maxX - padX + 24);
          const cropH = h - padY;

          const trimmed = document.createElement("canvas");
          trimmed.width = cropW;
          trimmed.height = cropH;
          const tCtx = trimmed.getContext("2d");
          if (tCtx) {
            tCtx.drawImage(canvas, padX, padY, cropW, cropH, 0, 0, cropW, cropH);
            setProcessedSrc(trimmed.toDataURL("image/png"));
            setReady(true);
            return;
          }
        }

        setProcessedSrc(canvas.toDataURL("image/png"));
        setReady(true);
      } catch {
        setProcessedSrc(url);
        setReady(true);
      }
    };

    img.onerror = () => {
      if (!active) return;
      if (candidateIdx < candidates.length - 1) {
        setCandidateIdx((p) => p + 1);
      }
    };

    img.src = url;
    return () => {
      active = false;
    };
  }, [candidateIdx]);

  if (!processedSrc) return null;

  return (
    <img
      src={processedSrc}
      alt="Siswa SMP AGRA"
      style={{
        transition: "opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0) scale(1)" : "translateY(48px) scale(0.9)",
      }}
      className="w-full h-full object-contain object-bottom drop-shadow-[0_32px_64px_rgba(4,18,56,0.42)] select-none"
    />
  );
}

export default function HomePage() {
  const [activeDomain, setActiveDomain] = useState<"numerasi" | "literasi">(
    "numerasi"
  );

  const activeItems =
    activeDomain === "numerasi" ? NUMERASI_DATA : LITERASI_DATA;

  return (
    <main
      style={{ fontFamily: "'Onest', sans-serif" }}
      className="relative min-h-screen w-full bg-[#EEF2FA] text-[#0A0D14] overflow-x-hidden"
    >
      {/* ═══════════════════════════════════════════════════════════════════
          1. HEADER WITH OFFICIAL AGRA LOGO (RESPECTS 50/50 SPLIT)
         ═══════════════════════════════════════════════════════════════════ */}
      <header className="absolute top-0 inset-x-0 z-50 w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center px-6 sm:px-12 lg:px-16 pt-6 pb-4">
          <div className="lg:col-span-6 flex items-center justify-between lg:justify-start gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)] border border-slate-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src="/assets/images/agra-icon.png"
                  alt="Logo AGRA"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <span className="text-2xl font-medium tracking-[-0.04em] text-[#0A0D14] flex items-center">
                AGRA
                <span className="inline-block w-2 h-2 rounded-full bg-[#1B68FF] ml-1" />
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-[15px] font-light text-slate-500">
              <a
                href="#alur"
                className="hover:text-[#0A0D14] transition-colors"
              >
                Alur Belajar
              </a>
              <a
                href="#submateri"
                className="hover:text-[#0A0D14] transition-colors"
              >
                Kurikulum
              </a>
              <a
                href="#simulasi"
                className="hover:text-[#0A0D14] transition-colors"
              >
                Simulasi CBT
              </a>
            </nav>
          </div>

          <div className="hidden lg:flex lg:col-span-6 items-center justify-end gap-6">
            <Link
              href="/login"
              className="text-[15px] font-light text-white/85 hover:text-white transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-full bg-white text-[#1B68FF] text-sm font-medium hover:bg-blue-50 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_10px_25px_rgba(0,0,0,0.14)]"
            >
              Mulai Belajar →
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          2. HERO SECTION — 50/50 SALVAMEDIC SPLIT + GIANT SMP STUDENT CUTOUT
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#F4F7FC]">
        {/* Background 50/50 Split */}
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 pointer-events-none">
          <div className="lg:col-span-6 relative bg-[#F4F7FC] overflow-hidden">
            <svg
              className="absolute -top-10 -left-16 w-[540px] h-[540px] text-slate-900 opacity-[0.04]"
              viewBox="0 0 400 400"
              fill="none"
            >
              <polygon
                points="200,20 340,100 340,260 200,340 60,260 60,100"
                stroke="currentColor"
                strokeWidth="2"
              />
              <polygon
                points="120,160 220,220 220,340 120,400 20,340 20,220"
                stroke="currentColor"
                strokeWidth="2"
              />
              <polygon
                points="280,140 380,200 380,320 280,380 180,320 180,200"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="lg:col-span-6 relative bg-gradient-to-br from-[#2370FF] via-[#1B68FF] to-[#0D4EE0] lg:rounded-bl-[64px] overflow-hidden min-h-[580px]">
            <svg
              className="absolute top-1/4 -right-24 w-[500px] h-[500px] text-white opacity-[0.07]"
              viewBox="0 0 400 400"
              fill="none"
            >
              <polygon
                points="200,20 340,100 340,260 200,340 60,260 60,100"
                stroke="currentColor"
                strokeWidth="2"
              />
              <polygon
                points="140,180 280,260 280,400 140,480 0,400 0,260"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Left & Right Vertical Edge Micro-Labels */}
        <div className="hidden xl:flex items-center gap-3 absolute left-6 top-[32%] -translate-y-1/2 -rotate-90 origin-left z-30 pointer-events-none text-xs font-light tracking-widest text-slate-300">
          <span className="w-8 h-px bg-slate-300" />
          <span>AGRA</span>
        </div>
        <div className="hidden xl:flex items-center gap-3 absolute right-6 top-[32%] -translate-y-1/2 rotate-90 origin-right z-30 pointer-events-none text-xs font-light tracking-widest text-white/45">
          <span className="w-8 h-px bg-white/45" />
          <span>AGRA</span>
        </div>

        {/* FOREGROUND STAGE */}
        <div className="relative z-20 w-full pt-28 sm:pt-32 lg:pt-32 flex-1 flex flex-col justify-between">
          {/* TOP GIANT HEADLINE: "AGRA" + CONNECTED "Asesmen Mandiri" */}
          <div className="relative w-full">
            {/* Row 1: "AGRA" + Official Tagline on the Blue Side */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-end px-6 sm:px-12 lg:px-16 gap-4">
              <div className="lg:col-span-6 flex lg:justify-start">
                <RevealPop delay={40}>
                  <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9.2vw] font-normal tracking-[-0.055em] leading-[0.88] text-[#0A0D14] select-none">
                    AGRA
                  </h1>
                </RevealPop>
              </div>

              <div className="lg:col-span-6 flex lg:justify-start lg:pl-6 lg:pb-3">
                <RevealPop delay={140}>
                  <p className="max-w-[440px] text-lg sm:text-xl lg:text-[22px] font-light leading-[1.35] text-white/95">
                    Ruang Belajar &amp; Simulasi Mandiri <br />
                    <span className="text-white/70">
                      Tes Kemampuan Akademik SMP.
                    </span>
                  </p>
                </RevealPop>
              </div>
            </div>

            {/* Row 2: CONNECTED "Asesmen Mandiri" (Locked Together Across the 50/50 Split Line!) */}
            <RevealPop delay={220} className="w-full mt-1 lg:mt-2">
              <div className="w-full px-6 sm:px-12 lg:px-0 grid grid-cols-1 lg:grid-cols-12 items-baseline">
                <div className="lg:col-span-6 flex lg:justify-end lg:pr-[0.14em]">
                  <span className="text-[4.2rem] sm:text-[6.5rem] lg:text-[8.6vw] font-normal tracking-[-0.05em] leading-[0.9] text-[#0A0D14] select-none whitespace-nowrap">
                    Asesmen
                  </span>
                </div>
                <div className="lg:col-span-6 flex lg:justify-start lg:pl-[0.14em]">
                  <span className="text-[4.2rem] sm:text-[6.5rem] lg:text-[8.6vw] font-normal tracking-[-0.05em] leading-[0.9] text-white select-none whitespace-nowrap">
                    Mandiri
                  </span>
                </div>
              </div>
            </RevealPop>
          </div>

          {/* BOTTOM ROW: LEFT "SOLUSI" CARD + RIGHT GIANT SMP STUDENT CUTOUT */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-end px-6 sm:px-12 lg:px-16 gap-8 mt-8 lg:mt-0">
            {/* Bottom-Left: "Solusi" Editorial Card */}
            <div className="lg:col-span-6 pb-12 lg:pb-16 lg:pr-8 relative z-30">
              <RevealPop delay={320}>
                <div className="relative bg-white rounded-[32px] p-8 sm:p-11 shadow-[0_24px_60px_rgba(15,23,42,0.05)] border border-slate-100 max-w-[580px] hover:-translate-y-1 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#1B68FF] text-white flex items-center justify-center shadow-sm">
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                          <path d="M21 3v5h-5" />
                        </svg>
                      </span>
                      <h2 className="text-2xl sm:text-[28px] font-normal tracking-[-0.03em] text-[#0A0D14]">
                        Solusi
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-light text-slate-300">
                      <span className="w-7 h-px bg-slate-200" />
                      <span>AGRA</span>
                    </div>
                  </div>

                  <p className="text-[15px] sm:text-[16.5px] font-light leading-[1.7] text-slate-500 mb-8">
                    <strong className="font-medium text-[#0A0D14]">
                      Ruang Belajar &amp; Simulasi Mandiri Tes Kemampuan
                      Akademik SMP
                    </strong>{" "}
                    yang dirancang jernih, tenang, dan empatik untuk membangun
                    kepercayaan diri siswa.{" "}
                    <strong className="font-medium text-[#0A0D14]">
                      Struktur evaluasi 4 tahap tersusun praktis dan logis,
                    </strong>{" "}
                    memadukan konsep esensial dengan latihan terarah.{" "}
                    <span className="text-[#1B68FF] font-normal">
                      Perhatian khusus diberikan pada pengalaman belajar:
                    </span>{" "}
                    diagnostik awal 90%, drill 3 level kognitif, dan simulasi
                    CBT 75 menit yang adaptif.
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/register"
                      className="px-7 py-3.5 rounded-full bg-[#1B68FF] hover:bg-[#1454D6] hover:scale-[1.02] active:scale-[0.98] text-white text-sm font-medium transition-all shadow-[0_12px_28px_rgba(27,104,255,0.28)]"
                    >
                      Mulai Asesmen Sekarang →
                    </Link>
                    <Link
                      href="/login"
                      className="px-6 py-3.5 rounded-full bg-[#F4F7FC] hover:bg-slate-200/70 text-[#0A0D14] text-sm font-normal transition-all"
                    >
                      Masuk ke Akun
                    </Link>
                  </div>

                  {/* 3D Paper Dart Accent */}
                  <svg
                    className="absolute -bottom-6 left-4 w-12 h-12 drop-shadow-[0_10px_14px_rgba(27,104,255,0.28)] pointer-events-none"
                    viewBox="0 0 64 64"
                    fill="none"
                  >
                    <path d="M58 10L8 28L26 36L58 10Z" fill="#93BAFF" />
                    <path d="M58 10L26 36L32 54L58 10Z" fill="#4D8BFF" />
                    <path d="M26 36L32 54L38 40L58 10L26 36Z" fill="#1B68FF" />
                  </svg>
                </div>
              </RevealPop>
            </div>

            {/* Bottom-Right: GIANT SMP STUDENT CUTOUT OVERLAPPING "Mandiri" */}
            <div className="lg:col-span-6 relative flex items-end justify-center lg:-mt-44 xl:-mt-52 z-30 pointer-events-none">
              <div className="relative w-full sm:w-[540px] lg:w-[660px] xl:w-[760px] max-w-none h-[380px] sm:h-[470px] lg:h-[540px] xl:h-[600px] flex items-end justify-center">
                <SmartStudentCutout />
              </div>

              <svg
                className="hidden sm:block absolute bottom-6 right-2 w-11 h-11 rotate-[-70deg] drop-shadow-[0_10px_14px_rgba(0,0,0,0.2)]"
                viewBox="0 0 64 64"
                fill="none"
              >
                <path d="M58 10L8 28L26 36L58 10Z" fill="#B8D0FF" />
                <path d="M58 10L26 36L32 54L58 10Z" fill="#6CA0FF" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. SECTION: ALUR BELAJAR 4 TAHAP (#alur) — ASYMMETRIC BENTO
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="alur"
        className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-16 bg-[#F4F7FC]"
      >
        <RevealPop>
          <div className="flex items-start justify-between gap-6 mb-14 lg:mb-20">
            <h2 className="text-5xl sm:text-7xl lg:text-[5.6rem] font-normal tracking-[-0.045em] leading-none text-[#0A0D14]">
              Alur Belajar
            </h2>

            <span className="text-xl sm:text-2xl font-light tracking-[-0.02em] text-[#5A524C] pt-2">
              &#123;04 Tahap&#125;
            </span>
          </div>
        </RevealPop>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <RevealPop delay={60} className="lg:col-span-7">
            <div className="h-full bg-white rounded-[36px] p-8 sm:p-12 shadow-[0_20px_50px_rgba(15,23,42,0.03)] border border-slate-100 flex flex-col justify-between min-h-[320px] hover:-translate-y-1.5 transition-transform duration-500">
              <div className="flex items-start justify-between">
                <span className="text-6xl sm:text-7xl font-light tracking-[-0.05em] text-[#1B68FF]">
                  01
                </span>
                <span className="text-sm font-light text-slate-400">
                  &#123;Diagnostik&#125;
                </span>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl sm:text-3xl font-normal tracking-[-0.03em] text-[#0A0D14] mb-3">
                  Recall Kemampuan Prasyarat
                </h3>
                <p className="text-[15.5px] font-light leading-[1.7] text-slate-500 max-w-xl">
                  <strong className="font-medium text-[#0A0D14]">
                    Tuntaskan asesmen awal 30 butir soal
                  </strong>{" "}
                  dengan ambang penguasaan minimal 90%. Tahap ini memastikan
                  pondasi konsep dasar siswa benar-benar matang sebelum memasuki{" "}
                  <span className="text-[#1B68FF] font-normal">
                    peta kurikulum inti Fase D.
                  </span>
                </p>
              </div>
            </div>
          </RevealPop>

          <RevealPop delay={140} className="lg:col-span-5">
            <div className="h-full bg-[#1B68FF] text-white rounded-[36px] p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[320px] hover:-translate-y-1.5 transition-transform duration-500">
              <div className="flex items-start justify-between relative z-10">
                <span className="text-6xl sm:text-7xl font-light tracking-[-0.05em] text-white">
                  02
                </span>
                <span className="text-sm font-light text-white/70">
                  &#123;Konsep&#125;
                </span>
              </div>

              <div className="mt-10 relative z-10">
                <h3 className="text-2xl sm:text-3xl font-normal tracking-[-0.03em] text-white mb-3">
                  Eksplorasi 16 Submateri
                </h3>
                <p className="text-[15.5px] font-light leading-[1.7] text-white/85">
                  Pelajari ringkasan konsep esensial dan pemodelan visual pada 8
                  topik Numerasi Matematika serta 8 topik Literasi Bahasa
                  Indonesia.
                </p>
              </div>
            </div>
          </RevealPop>

          <RevealPop delay={200} className="lg:col-span-5">
            <div className="h-full bg-[#EEF2FA] rounded-[36px] p-8 sm:p-12 border border-white flex flex-col justify-between min-h-[320px] hover:-translate-y-1.5 transition-transform duration-500">
              <div className="flex items-start justify-between">
                <span className="text-6xl sm:text-7xl font-light tracking-[-0.05em] text-[#0A0D14]">
                  03
                </span>
                <span className="text-sm font-light text-slate-500">
                  &#123;Drill&#125;
                </span>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl sm:text-3xl font-normal tracking-[-0.03em] text-[#0A0D14] mb-3">
                  Latihan 3 Level Kognitif
                </h3>
                <p className="text-[15.5px] font-light leading-[1.7] text-slate-500">
                  <strong className="font-medium text-[#0A0D14]">
                    Selesaikan latihan bertahap
                  </strong>{" "}
                  mulai dari Level 1 (Pemahaman), Level 2 (Aplikasi
                  Kontekstual), hingga{" "}
                  <span className="text-[#1B68FF] font-normal">
                    Level 3 (Penalaran HOTS).
                  </span>
                </p>
              </div>
            </div>
          </RevealPop>

          <RevealPop delay={280} className="lg:col-span-7">
            <div className="h-full bg-[#0A0D14] text-white rounded-[36px] p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[320px] hover:-translate-y-1.5 transition-transform duration-500">
              <div className="flex items-start justify-between relative z-10">
                <span className="text-6xl sm:text-7xl font-light tracking-[-0.05em] text-[#1B68FF]">
                  04
                </span>
                <span className="text-sm font-light text-white/50">
                  &#123;Evaluasi&#125;
                </span>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
                <div className="max-w-lg">
                  <h3 className="text-2xl sm:text-3xl font-normal tracking-[-0.03em] text-white mb-3">
                    Simulasi CBT 75 Menit
                  </h3>
                  <p className="text-[15.5px] font-light leading-[1.7] text-white/70">
                    Uji kesiapan puncak dalam simulasi berwaktu 75 menit dengan
                    skoring pilihan ganda kompleks dan bedah kunci nalar.
                  </p>
                </div>

                <Link
                  href="/register"
                  className="px-7 py-3.5 rounded-full bg-[#1B68FF] hover:bg-[#1454D6] text-white text-sm font-medium whitespace-nowrap transition-all self-start sm:self-end"
                >
                  Mulai Tahap 01 →
                </Link>
              </div>
            </div>
          </RevealPop>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. SECTION: KURIKULUM 16 SUBMATERI (#submateri)
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="submateri"
        className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-16 bg-[#EEF2FA]"
      >
        <RevealPop>
          <div className="flex items-start justify-between gap-6 mb-14 lg:mb-20">
            <h2 className="text-5xl sm:text-7xl lg:text-[5.6rem] font-normal tracking-[-0.045em] leading-none text-[#0A0D14]">
              Kurikulum
            </h2>

            <span className="text-xl sm:text-2xl font-light tracking-[-0.02em] text-[#5A524C] pt-2">
              &#123;16 Submateri&#125;
            </span>
          </div>
        </RevealPop>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <RevealPop delay={80} className="lg:col-span-4 lg:sticky lg:top-12">
            <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(15,23,42,0.03)] border border-slate-100">
              <p className="text-xs font-light uppercase tracking-widest text-slate-400 mb-4">
                Pilih Domain Kompetensi
              </p>

              <div className="flex flex-col gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => setActiveDomain("numerasi")}
                  className={`w-full text-left px-6 py-4 rounded-[20px] transition-all flex items-center justify-between cursor-pointer ${activeDomain === "numerasi"
                      ? "bg-[#1B68FF] text-white shadow-[0_12px_28px_rgba(27,104,255,0.25)]"
                      : "bg-[#F4F7FC] text-[#0A0D14] hover:bg-slate-200/60"
                    }`}
                >
                  <span className="text-base font-normal">
                    Matematika (Numerasi)
                  </span>
                  <span className="text-xs font-light opacity-80">08</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDomain("literasi")}
                  className={`w-full text-left px-6 py-4 rounded-[20px] transition-all flex items-center justify-between cursor-pointer ${activeDomain === "literasi"
                      ? "bg-[#1B68FF] text-white shadow-[0_12px_28px_rgba(27,104,255,0.25)]"
                      : "bg-[#F4F7FC] text-[#0A0D14] hover:bg-slate-200/60"
                    }`}
                >
                  <span className="text-base font-normal">
                    Bahasa Indonesia (Literasi)
                  </span>
                  <span className="text-xs font-light opacity-80">08</span>
                </button>
              </div>

              <p className="text-[15px] font-light leading-[1.7] text-slate-500">
                <strong className="font-medium text-[#0A0D14]">
                  Setiap submateri dirancang sistematis
                </strong>{" "}
                dengan 30 butir soal adaptif yang mencakup pemahaman konsep,
                aplikasi, hingga{" "}
                <span className="text-[#1B68FF] font-normal">
                  penalaran analitis HOTS.
                </span>
              </p>
            </div>
          </RevealPop>

          <div
            key={activeDomain}
            className="lg:col-span-8 flex flex-col gap-3.5"
          >
            {activeItems.map((item, idx) => (
              <RevealPop key={item.code} delay={idx * 45}>
                <div className="group bg-white hover:bg-[#1B68FF] rounded-[28px] px-7 sm:px-9 py-6 transition-all duration-300 shadow-[0_10px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_18px_40px_rgba(27,104,255,0.22)] hover:-translate-y-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-5 sm:gap-7">
                    <span className="text-2xl sm:text-3xl font-light tracking-[-0.04em] text-[#1B68FF] group-hover:text-white/80 transition-colors">
                      {item.code}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-normal tracking-[-0.02em] text-[#0A0D14] group-hover:text-white transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm font-light text-slate-400 group-hover:text-white/75 transition-colors mt-0.5">
                        {item.scope}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 group-hover:border-white/15">
                    <div className="text-left sm:text-right">
                      <span className="block text-xs font-medium text-[#0A0D14] group-hover:text-white transition-colors">
                        {item.itemsCount}
                      </span>
                      <span className="block text-[11px] font-light text-slate-400 group-hover:text-white/75 transition-colors">
                        {item.cognitive}
                      </span>
                    </div>
                    <span className="w-9 h-9 rounded-full bg-[#F4F7FC] group-hover:bg-white/20 text-[#0A0D14] group-hover:text-white flex items-center justify-center text-sm transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </div>
                </div>
              </RevealPop>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. SECTION: SIMULASI & CLOSING STAGE (#simulasi) + FOOTER
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="simulasi"
        className="relative w-full pt-12 pb-20 px-6 sm:px-12 lg:px-16 bg-[#EEF2FA]"
      >
        <RevealPop>
          <div className="relative w-full rounded-[44px] bg-gradient-to-br from-[#2370FF] via-[#1B68FF] to-[#0E50E4] p-10 sm:p-16 lg:p-24 overflow-hidden text-white shadow-[0_30px_80px_rgba(27,104,255,0.22)]">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <div className="max-w-2xl">
                <h2 className="text-4xl sm:text-6xl lg:text-[4.8rem] font-normal tracking-[-0.045em] leading-[0.95] text-white mb-6">
                  Siap Memulai <br />
                  Asesmen Mandiri?
                </h2>

                <p className="text-base sm:text-lg font-light leading-relaxed text-white/80 max-w-xl">
                  Buka akses penuh ke diagnostik prasyarat 90%, eksplorasi 16
                  submateri Fase D, dan simulasi ujian CBT 75 menit dalam satu
                  antarmuka yang tenang dan terukur.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-6">
                <span className="text-xl sm:text-2xl font-light text-white/75">
                  &#123;CBT 75m&#125;
                </span>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/register"
                    className="px-8 py-4 rounded-full bg-white text-[#1B68FF] hover:bg-blue-50 hover:scale-[1.03] active:scale-[0.98] text-sm font-medium transition-all shadow-[0_16px_36px_rgba(0,0,0,0.18)]"
                  >
                    Daftar Akun Siswa →
                  </Link>
                  <Link
                    href="/login"
                    className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-normal transition-all"
                  >
                    Masuk ke Akun
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </RevealPop>

        {/* Clean Architectural Footer with Official AGRA Logo */}
        <footer className="mt-14 pt-8 border-t border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-sm font-light text-slate-400">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/agra-icon.png"
              alt="Logo AGRA"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="w-6 h-6 object-contain"
            />
            <span className="text-lg font-medium tracking-[-0.04em] text-[#0A0D14]">
              AGRA.
            </span>
            <span>
              — Ruang Belajar &amp; Simulasi Mandiri Tes Kemampuan Akademik SMP
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-7">
            <a href="#alur" className="hover:text-[#0A0D14] transition-colors">
              Alur Belajar
            </a>
            <a
              href="#submateri"
              className="hover:text-[#0A0D14] transition-colors"
            >
              Kurikulum
            </a>
            <a
              href="#simulasi"
              className="hover:text-[#0A0D14] transition-colors"
            >
              Simulasi
            </a>
            <Link
              href="/login"
              className="hover:text-[#0A0D14] transition-colors"
            >
              Masuk
            </Link>
            <span>© 2026 AGRA</span>
          </div>
        </footer>
      </section>
    </main>
  );
}
