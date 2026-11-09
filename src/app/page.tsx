"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * DESIGN SYSTEM TOKENS (Rule #3.3 — Unified Style Guide)
 * - Typography: Onest 100% everywhere across display, body, and tabular numerics (JetBrains Mono strictly banned)
 * - Golden Ratio Typography Scale (Base = 16px, Multiplier = 1.618):
 *   • Body Text: 16px (text-[16px]) | Line-height: 155% (leading-[1.55])
 *   • H3 Subheading: 26px (16 * 1.618) | Line-height: 130% (leading-[1.3])
 *   • H2 Section Heading: 42px -> 68px (26 * 1.618)
 * - Buttons: Minimum 48x48px touch target (min-h-[48px] min-w-[48px])
 */
const UI = {
  btnPrimary:
    "min-h-[48px] min-w-[48px] px-7 py-3 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[16px] font-medium transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] inline-flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75",
  btnSecondaryOutline:
    "min-h-[48px] min-w-[48px] px-6 py-3 rounded-[14px] bg-white hover:bg-[#F4F7FC] active:translate-y-0.5 text-[#0A0D14] border-2 border-slate-300 hover:border-[#1B68FF] text-[16px] font-medium transition-all inline-flex items-center justify-center gap-2 cursor-pointer",
  bodyText: "text-[16px] sm:text-[17px] font-normal leading-[1.55] text-[#1E293B] text-pretty",
  h3Title: "text-[24px] sm:text-[26px] font-medium tracking-[-0.025em] leading-[1.3] text-[#0A0D14] text-balance",
  h2Section: "text-[38px] sm:text-[52px] lg:text-[68px] font-normal tracking-[-0.04em] leading-[1.05] text-[#0A0D14] text-balance",
};

interface SubmateriItem {
  code: string;
  title: string;
  scope: string;
  itemsCount: number;
  passRate: string;
}

const NUMERASI_DATA: SubmateriItem[] = [
  {
    code: "01",
    title: "Bilangan Bulat & Pecahan",
    scope: "Operasi hitung campuran, estimasi nilai, dan pemodelan kontekstual.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "02",
    title: "Aljabar & Persamaan Linear",
    scope: "Penyederhanaan bentuk aljabar, relasi fungsi, dan persamaan linear.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "03",
    title: "Perbandingan & Skala Numerik",
    scope: "Proporsi senilai, berbalik nilai, laju perubahan, dan skala peta.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "04",
    title: "Geometri Datar & Ruang",
    scope: "Teorema Pythagoras, jaring-jaring bangun, luas permukaan, dan volume.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "05",
    title: "Statistika & Representasi Data",
    scope: "Interpretasi grafik, ukuran pemusatan, dan analisis sebaran data.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "06",
    title: "Peluang Kejadian Majemuk",
    scope: "Ruang sampel, frekuensi harapan, dan perhitungan peluang kejadian.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "07",
    title: "Barisan, Pola & Deret Angka",
    scope: "Generalisasi pola aritmetika, geometri, dan konfigurasi objek.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "08",
    title: "Aritmetika Sosial & Finansial",
    scope: "Literasi finansial dasar, persentase untung-rugi, diskon, dan pajak.",
    itemsCount: 30,
    passRate: "90%",
  },
];

const LITERASI_DATA: SubmateriItem[] = [
  {
    code: "01",
    title: "Informasi Tersurat & Eksplisit",
    scope: "Identifikasi fakta spesifik, gagasan pokok, dan verifikasi data teks.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "02",
    title: "Inferensi & Makna Tersirat",
    scope: "Menyimpulkan hubungan sebab-akibat, asumsi penulis, dan prediksi.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "03",
    title: "Struktur & Kohesi Wacana",
    scope: "Analisis kepaduan antarparagraf, konjungsi, dan kerangka logika.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "04",
    title: "Evaluasi Kredibilitas Informasi",
    scope: "Membedakan fakta dan opini, mendeteksi bias, serta validitas argumen.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "05",
    title: "Sintesis Multi-Teks & Infografik",
    scope: "Membandingkan dua sumber bacaan dan menafsirkan tabel atau visual.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "06",
    title: "Refleksi Isi & Nilai Kontekstual",
    scope: "Mengaitkan pesan wacana dengan problematika nyata dan etika sosial.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "07",
    title: "Semantik, Diksi & Gaya Bahasa",
    scope: "Ketepatan istilah, makna denotatif-konotatif, dan majas dalam teks.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "08",
    title: "Penalaran Kritis Teks Eksposisi",
    scope: "Bedah argumen ilmiah populer, tesis utama, dan ketajaman simpulan.",
    itemsCount: 30,
    passRate: "90%",
  },
];

const SAMPLE_OPTIONS = [
  {
    id: "A",
    text: "Rp136.000,00 karena diskon kedua dihitung dari harga awal sebelum diskon pertama",
    isCorrect: false,
    feedback:
      "Kurang tepat. Diskon bertingkat (50% + 20%) tidak dijumlahkan langsung menjadi 70%, melainkan dihitung secara berurutan.",
  },
  {
    id: "B",
    text: "Rp160.000,00 karena diskon 20% diterapkan setelah harga dipotong 50%",
    isCorrect: true,
    feedback:
      "Tepat! Harga setelah diskon pertama 50% adalah Rp200.000,00. Diskon kedua 20% memotong Rp40.000,00 sehingga harga akhir Rp160.000,00.",
  },
  {
    id: "C",
    text: "Rp120.000,00 karena total potongan harga mencapai 70% dari harga label",
    isCorrect: false,
    feedback:
      "Kurang tepat. Menjumlahkan 50% + 20% = 70% adalah kekeliruan umum pada soal Aritmetika Sosial Level 3 (HOTS).",
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
        transitionDuration: "750ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translate3d(0, 32px, 0) scale(0.95)",
        willChange: visible ? "auto" : "transform, opacity",
      }}
      className={className}
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

  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {!ready && (
        <div className="w-[85%] h-[92%] rounded-t-[200px] bg-white/10 animate-pulse border border-white/15" />
      )}
      {processedSrc && (
        <img
          src={processedSrc}
          alt="Siswa SMP AGRA"
          style={{
            transition:
              "opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(36px)",
          }}
          className="w-full h-full object-contain object-bottom scale-105 sm:scale-115 lg:scale-130 xl:scale-145 2xl:scale-155 origin-bottom drop-shadow-[0_32px_64px_rgba(4,18,56,0.45)] select-none"
        />
      )}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [activeDomain, setActiveDomain] = useState<"numerasi" | "literasi">(
    "numerasi"
  );
  const [selectedOption, setSelectedOption] = useState<string>("B");
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(4499);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 4499));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleNavigate = (href: string) => {
    setLoadingRoute(href);
    router.push(href);
  };

  const activeItems =
    activeDomain === "numerasi" ? NUMERASI_DATA : LITERASI_DATA;

  const chosenOptionObj = SAMPLE_OPTIONS.find((o) => o.id === selectedOption);

  return (
    <main
      style={{ fontFamily: "'Onest', sans-serif" }}
      className="relative min-h-screen w-full bg-[#EEF2FA] text-[#0A0D14] text-[16px] leading-[1.55] overflow-x-hidden"
    >
      {/* ═══════════════════════════════════════════════════════════════════
          1. HEADER (48x48dp Touch Targets & Clear Button Hierarchy)
         ═══════════════════════════════════════════════════════════════════ */}
      <header className="absolute top-0 inset-x-0 z-50 w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center px-6 sm:px-12 lg:px-16 pt-6 pb-4">
          <div className="lg:col-span-6 flex items-center justify-between lg:justify-start gap-10">
            <Link
              href="/"
              className="min-h-[48px] inline-flex items-center gap-3 group"
            >
              <div className="w-11 h-11 rounded-[16px] p-1.5 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)] border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src="/assets/images/agra-icon.png"
                  alt="Logo AGRA"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[26px] font-semibold tracking-[-0.04em] text-[#0A0D14] flex items-center">
                AGRA
                <span className="inline-block w-2 h-2 rounded-full bg-[#1B68FF] ml-1" />
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <a
                href="#alur"
                className="min-h-[48px] px-4 inline-flex items-center rounded-[12px] text-[16px] font-medium text-[#1E293B] hover:text-[#0A0D14] hover:bg-slate-200/50 transition-colors"
              >
                Alur Belajar
              </a>
              <a
                href="#simulasi"
                className="min-h-[48px] px-4 inline-flex items-center rounded-[12px] text-[16px] font-medium text-[#1E293B] hover:text-[#0A0D14] hover:bg-slate-200/50 transition-colors"
              >
                Simulasi CBT
              </a>
              <a
                href="#submateri"
                className="min-h-[48px] px-4 inline-flex items-center rounded-[12px] text-[16px] font-medium text-[#1E293B] hover:text-[#0A0D14] hover:bg-slate-200/50 transition-colors"
              >
                Kurikulum
              </a>
            </nav>
          </div>

          <div className="hidden lg:flex lg:col-span-6 items-center justify-end gap-4">
            {/* Secondary Button (Outline Style on Blue Surface) */}
            <Link
              href="/login"
              className="min-h-[48px] px-6 py-2.5 rounded-[14px] border-2 border-white/40 hover:border-white hover:bg-white/10 text-[16px] font-medium text-white transition-all inline-flex items-center justify-center"
            >
              Masuk ke Akun
            </Link>

            {/* Primary Button (Solid High-Contrast Style) */}
            <button
              type="button"
              onClick={() => handleNavigate("/register")}
              disabled={loadingRoute === "/register"}
              className="min-h-[48px] px-6 py-2.5 rounded-[14px] bg-white text-[#1B68FF] text-[16px] font-semibold hover:bg-blue-50 active:translate-y-0.5 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.16)] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loadingRoute === "/register" ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-[#1B68FF]/30 border-t-[#1B68FF] animate-spin" />
                  <span>Memuat...</span>
                </>
              ) : (
                <>
                  <span>Daftar Akun Siswa</span>
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          2. HERO SECTION — 50/50 SPLIT + GENEROUS WHITE SPACE + HIGH CONTRAST
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full lg:min-h-screen flex flex-col justify-between overflow-hidden bg-[#F4F7FC]">
        {/* Desktop 50/50 Split Background (Only active on lg+, so mobile never has an awkward half-white/half-blue cut behind the card!) */}
        <div className="hidden lg:grid absolute inset-0 grid-cols-12 pointer-events-none">
          <div className="col-span-6 bg-[#F4F7FC]" />
          <div className="col-span-6 bg-gradient-to-br from-[#2370FF] via-[#1B68FF] to-[#0D4EE0] rounded-bl-[64px] min-h-[580px]" />
        </div>

        <div className="relative z-20 w-full pt-24 sm:pt-32 lg:pt-36 flex-1 flex flex-col justify-between">
          {/* TOP GIANT HEADLINE: "AGRA" + CONNECTED "Asesmen Mandiri" */}
          <div className="relative w-full">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-end px-5 sm:px-12 lg:px-16 gap-3 sm:gap-6">
              <div className="lg:col-span-6 flex lg:justify-start">
                <RevealPop delay={40}>
                  <h1 className="-ml-[0.04em] text-[4rem] sm:text-[6.5rem] lg:text-[9.2vw] font-normal tracking-[-0.055em] leading-[0.88] text-[#0A0D14] select-none">
                    AGRA
                  </h1>
                </RevealPop>
              </div>

              {/* On mobile (< lg), tagline is dark slate on white bg so it's 100% readable; on desktop (lg+), it is white on blue bg */}
              <div className="lg:col-span-6 flex lg:justify-start lg:pl-6 lg:pb-3 order-3 lg:order-none mt-2 lg:mt-0">
                <RevealPop delay={120}>
                  <p className="max-w-[460px] text-[16px] sm:text-[20px] lg:text-[22px] font-medium leading-[1.45] text-[#0A0D14] lg:text-white text-balance">
                    Ruang Belajar &amp; Simulasi Mandiri{" "}
                    <span className="block text-[#475569] lg:text-blue-50 font-normal">
                      Tes Kemampuan Akademik SMP.
                    </span>
                  </p>
                </RevealPop>
              </div>
            </div>

            {/* Row 2: CONNECTED "Asesmen Mandiri" */}
            <div className="w-full mt-1 lg:mt-2">
              <div className="w-full px-5 sm:px-12 lg:px-0 flex flex-wrap lg:grid lg:grid-cols-12 items-baseline gap-x-2.5 lg:gap-x-0">
                <div className="lg:col-span-6 flex lg:justify-end lg:pr-[0.14em]">
                  <span className="relative z-10 text-[2.75rem] sm:text-[5.2rem] lg:text-[8.6vw] font-normal tracking-[-0.05em] leading-[0.95] lg:leading-[0.9] text-[#0A0D14] select-none whitespace-nowrap">
                    Asesmen
                  </span>
                </div>
                <div className="lg:col-span-6 flex lg:justify-start lg:pl-[0.14em]">
                  <span className="text-[2.75rem] sm:text-[5.2rem] lg:text-[8.6vw] font-normal tracking-[-0.05em] leading-[0.95] lg:leading-[0.9] select-none whitespace-nowrap inline-flex items-baseline">
                    {/* On mobile (< lg): Electric Blue #1B68FF on white bg. On desktop (lg+): Pure White + Kaiki Knockout Blend */}
                    <span className="relative z-10 text-[#1B68FF] lg:text-white">
                      Ma
                    </span>
                    <span className="relative inline-block">
                      <span className="relative z-10 text-[#1B68FF] lg:text-white">
                        ndiri
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden lg:inline-block absolute inset-0 z-40 text-[#1D4ED8] mix-blend-screen opacity-90 pointer-events-none select-none"
                      >
                        ndiri
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden lg:inline-block absolute inset-0 z-40 text-[#38BDF8] mix-blend-color-dodge opacity-75 pointer-events-none select-none"
                      >
                        ndiri
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: VALUE CARD + GIANT SMP STUDENT CUTOUT */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-end px-5 sm:px-12 lg:px-16 gap-8 lg:gap-10 mt-6 sm:mt-8 lg:mt-4">
            <div className="lg:col-span-6 pb-2 lg:pb-20 lg:pr-8 relative z-30">
              <RevealPop delay={280}>
                <div className="bg-white/80 rounded-[28px] sm:rounded-[32px] p-2.5 sm:p-3 shadow-[0_20px_50px_rgba(15,23,42,0.06)] border border-white max-w-[600px]">
                  <div className="bg-white rounded-[20px] p-6 sm:p-10 border border-slate-200/80">
                    <h2 className={`${UI.h3Title} mb-3.5 sm:mb-4`}>
                      Persiapan Terukur dari Diagnostik hingga Ujian CBT
                    </h2>

                    <p className={`${UI.bodyText} mb-6 sm:mb-8 tabular-nums`}>
                      <strong className="font-semibold text-[#0A0D14]">
                        Dirancang dengan ruang baca yang lega
                      </strong>{" "}
                      agar siswa fokus menguasai konsep esensial Fase D.
                      Evaluasi dimulai dari pemetaan prasyarat{" "}
                      <strong className="font-semibold text-[#0A0D14]">
                        ketuntasan 90%
                      </strong>
                      , dilanjutkan latihan bertahap{" "}
                      <span className="text-[#1B68FF] font-semibold">
                        3 level kognitif (L1, L2, HOTS)
                      </span>
                      , hingga simulasi mandiri{" "}
                      <strong className="font-semibold text-[#0A0D14]">
                        75 menit
                      </strong>
                      .
                    </p>

                    {/* Full-width stacked buttons on mobile (< sm), side-by-side on sm+ */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => handleNavigate("/register")}
                        disabled={loadingRoute === "/register"}
                        className={`${UI.btnPrimary} w-full sm:w-auto whitespace-nowrap`}
                      >
                        {loadingRoute === "/register" ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            <span>Membuka Pendaftaran...</span>
                          </>
                        ) : (
                          <>
                            <span>Daftar &amp; Mulai Diagnostik</span>
                            <svg
                              className="w-4 h-4 shrink-0"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                          </>
                        )}
                      </button>

                      <a
                        href="#simulasi"
                        className={`${UI.btnSecondaryOutline} w-full sm:w-auto whitespace-nowrap`}
                      >
                        <span>Coba Simulasi CBT</span>
                      </a>
                    </div>
                  </div>
                </div>
              </RevealPop>
            </div>

            {/* Bottom-Right:
                - On Mobile (< lg): Compact rounded blue stage right under the card with zero dead blue space!
                - On Desktop (lg+): 100% IDENTICAL to your custom giant dimensions & scales! */}
            <div className="lg:col-span-6 relative -mx-5 sm:-mx-12 lg:mx-0 pt-6 sm:pt-10 lg:pt-0 px-4 sm:px-8 lg:px-0 bg-gradient-to-br from-[#2370FF] via-[#1B68FF] to-[#0D4EE0] lg:bg-none rounded-t-[36px] lg:rounded-none flex items-end justify-center lg:justify-start lg:-translate-x-6 xl:-translate-x-12 lg:-mt-64 xl:-mt-80 2xl:-mt-96 z-20 pointer-events-none overflow-hidden lg:overflow-visible">
              <div className="relative w-full sm:w-[620px] lg:w-[820px] xl:w-[960px] 2xl:w-[1100px] max-w-none h-[300px] sm:h-[460px] lg:h-[700px] xl:h-[820px] 2xl:h-[920px] flex items-end justify-center">
                <SmartStudentCutout />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. SECTION: ALUR BELAJAR 4 TAHAP (#alur)
             (Golden Ratio Hierarchy, 16px Body, 155% Line-Height, White Space)
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="alur"
        className="relative w-full py-28 sm:py-36 px-6 sm:px-12 lg:px-16 bg-[#F4F7FC]"
      >
        <RevealPop>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 lg:mb-20">
            <h2 className={`${UI.h2Section} max-w-3xl`}>
              Empat Tahap Menuju Ketuntasan Akademik
            </h2>
            <p className={`${UI.bodyText} max-w-md`}>
              Setiap tahap disusun berurutan agar siswa menguasai pondasi materi
              sebelum menguji ketepatan waktu di ruang simulasi ujian.
            </p>
          </div>
        </RevealPop>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 tabular-nums">
          <RevealPop delay={50} className="lg:col-span-7">
            <div className="h-full bg-white rounded-[32px] p-8 sm:p-12 shadow-[0_20px_50px_rgba(15,23,42,0.03)] border border-slate-200/80 flex flex-col justify-between min-h-[320px] hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[42px] sm:text-[52px] font-light tracking-[-0.05em] leading-none text-[#1B68FF]">
                  01
                </span>
                <span className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#065F46] text-[14px] font-semibold">
                  Syarat Lulus ≥ 90%
                </span>
              </div>

              <div className="mt-10">
                <h3 className={`${UI.h3Title} mb-3`}>
                  Diagnostik Recall Kemampuan Awal
                </h3>
                <p className={`${UI.bodyText} max-w-xl`}>
                  Siswa mengerjakan{" "}
                  <strong className="font-semibold text-[#0A0D14]">
                    30 butir soal prasyarat
                  </strong>{" "}
                  untuk memetakan penguasaan konsep dasar sebelum membuka
                  seluruh submateri Fase D.
                </p>
              </div>
            </div>
          </RevealPop>

          <RevealPop delay={110} className="lg:col-span-5">
            <div className="h-full bg-[#1B68FF] text-white rounded-[32px] p-8 sm:p-12 flex flex-col justify-between min-h-[320px] hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[42px] sm:text-[52px] font-light tracking-[-0.05em] leading-none text-white">
                  02
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/15 text-white text-[14px] font-medium">
                  16 Topik Inti
                </span>
              </div>

              <div className="mt-10">
                <h3 className="text-[24px] sm:text-[26px] font-medium tracking-[-0.025em] leading-[1.3] text-white mb-3 text-balance">
                  Pemahaman Konsep Numerasi &amp; Literasi
                </h3>
                <p className="text-[16px] sm:text-[17px] font-normal leading-[1.55] text-blue-50 text-pretty">
                  Ringkasan materi terstruktur pada 8 topik Matematika dan 8
                  topik Bahasa Indonesia lengkap dengan pemodelan kontekstual.
                </p>
              </div>
            </div>
          </RevealPop>

          <RevealPop delay={170} className="lg:col-span-5">
            <div className="h-full bg-white rounded-[32px] p-8 sm:p-12 border border-slate-200/80 flex flex-col justify-between min-h-[320px] hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[42px] sm:text-[52px] font-light tracking-[-0.05em] leading-none text-[#0A0D14]">
                  03
                </span>
                <span className="px-4 py-1.5 rounded-full bg-[#EEF2FA] text-[#1B68FF] text-[14px] font-semibold">
                  L1 • L2 • HOTS
                </span>
              </div>

              <div className="mt-10">
                <h3 className={`${UI.h3Title} mb-3`}>
                  Latihan Berjenjang 3 Level Kognitif
                </h3>
                <p className={UI.bodyText}>
                  Latihan bertahap mulai dari Level 1 (Pemahaman Konsep), Level
                  2 (Aplikasi Kontekstual), hingga Level 3 (Penalaran HOTS).
                </p>
              </div>
            </div>
          </RevealPop>

          <RevealPop delay={230} className="lg:col-span-7">
            <div className="h-full bg-[#0A0D14] text-white rounded-[32px] p-8 sm:p-12 flex flex-col justify-between min-h-[320px] hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[42px] sm:text-[52px] font-light tracking-[-0.05em] leading-none text-[#10B981]">
                  04
                </span>
                <span className="text-[14px] font-medium text-slate-200 tabular-nums">
                  75:00 CBT
                </span>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="max-w-lg">
                  <h3 className="text-[24px] sm:text-[26px] font-medium tracking-[-0.025em] leading-[1.3] text-white mb-3 text-balance">
                    Simulasi Ujian CBT 75 Menit
                  </h3>
                  <p className="text-[16px] sm:text-[17px] font-normal leading-[1.55] text-slate-200 text-pretty">
                    Evaluasi komprehensif dengan penghitung waktu nyata, skoring
                    pilihan ganda kompleks, dan pembahasan kunci nalar.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate("/register")}
                  className={`${UI.btnPrimary} whitespace-nowrap self-start sm:self-end`}
                >
                  <span>Mulai Tahap 01</span>
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </RevealPop>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. SECTION: INTERACTIVE CBT PRODUCT PREVIEW (#simulasi)
             (WCAG High Contrast, Zero White-on-Yellow, 48x48dp Option Buttons)
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="simulasi"
        className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-16 bg-[#EEF2FA]"
      >
        <RevealPop>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <h2 className={UI.h2Section}>Antarmuka Simulasi CBT 75 Menit</h2>
            <p className={`${UI.bodyText} max-w-md`}>
              Pilih salah satu opsi jawaban di bawah ini untuk mencoba langsung
              interaksi pengerjaan soal dan melihat evaluasi kunci nalar.
            </p>
          </div>
        </RevealPop>

        <RevealPop delay={100}>
          <div className="w-full rounded-[36px] p-3 sm:p-4 bg-white/80 border border-white shadow-[0_28px_70px_rgba(15,23,42,0.06)]">
            <div className="w-full rounded-[20px] bg-white border border-slate-200 overflow-hidden">
              {/* Top CBT Status Bar */}
              <div className="px-6 sm:px-10 py-5 bg-[#F4F7FC] border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold px-3.5 py-1.5 rounded-[8px] bg-[#0A0D14] text-white tabular-nums">
                    MAT-08 • LEVEL 3 HOTS
                  </span>
                  <span className="text-[16px] font-medium text-[#0A0D14]">
                    Aritmetika Sosial &amp; Finansial
                  </span>
                </div>

                <div className="flex items-center gap-6 tabular-nums">
                  <div className="flex items-center gap-2 text-[#0A0D14]">
                    <svg
                      className="w-5 h-5 text-[#1B68FF]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    <span className="text-[18px] font-semibold text-[#0A0D14] tabular-nums">
                      {formatTime(secondsLeft)}
                    </span>
                  </div>

                  <span className="hidden sm:inline-block text-[15px] font-medium text-[#1E293B] tabular-nums">
                    Soal 14 dari 30
                  </span>
                </div>
              </div>

              {/* Main CBT Split Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 p-6 sm:p-10 lg:border-r border-slate-200">
                  <p className="text-[17px] sm:text-[18px] font-normal leading-[1.6] text-[#0A0D14] mb-7 text-pretty tabular-nums">
                    Sebuah toko buku memberikan promo bertingkat bertuliskan{" "}
                    <strong className="font-semibold">
                      &ldquo;Diskon 50% + 20%&rdquo;
                    </strong>{" "}
                    untuk paket buku persiapan ujian seharga{" "}
                    <strong className="font-semibold">Rp400.000,00</strong>.
                    Berapakah harga akhir yang harus dibayar siswa di kasir?
                  </p>

                  {/* Interactive Answer Choices (Min 48px height, WCAG contrast, NO white on yellow!) */}
                  <div className="flex flex-col gap-3.5">
                    {SAMPLE_OPTIONS.map((opt) => {
                      const isSelected = selectedOption === opt.id;
                      const showEmerald = isSelected && opt.isCorrect;
                      const showAmber = isSelected && !opt.isCorrect;

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedOption(opt.id)}
                          className={`min-h-[56px] w-full text-left p-4 sm:p-5 rounded-[14px] border-2 transition-all duration-200 flex items-start gap-4 cursor-pointer ${
                            showEmerald
                              ? "bg-[#ECFDF5] border-[#059669] text-[#064E3B]"
                              : showAmber
                              ? "bg-[#FFFBEB] border-[#D97706] text-[#78350F]"
                              : "bg-white hover:bg-[#F4F7FC] border-slate-300 text-[#0A0D14]"
                          }`}
                        >
                          {/* Badge Rule #3.1: Dark brown #78350F on soft amber #FDE68A (Never white text on yellow!) */}
                          <span
                            className={`w-8 h-8 rounded-[8px] text-[14px] font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors tabular-nums ${
                              showEmerald
                                ? "bg-[#059669] text-white"
                                : showAmber
                                ? "bg-[#FDE68A] text-[#78350F]"
                                : "bg-[#EEF2FA] text-[#0A0D14]"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="text-[16px] font-normal leading-[1.55] text-pretty tabular-nums">
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right 5 Cols: Instant Diagnostic Feedback */}
                <div className="lg:col-span-5 p-6 sm:p-10 bg-[#F8FAFC] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <span className="text-[16px] font-semibold text-[#0A0D14]">
                        Pembahasan Kunci Nalar
                      </span>
                      {chosenOptionObj?.isCorrect ? (
                        <span className="px-3.5 py-1 rounded-full bg-[#D1FAE5] text-[#065F46] text-[14px] font-semibold">
                          Jawaban Tepat
                        </span>
                      ) : (
                        <span className="px-3.5 py-1 rounded-full bg-[#FEF3C7] text-[#78350F] text-[14px] font-semibold">
                          Perlu Evaluasi Konsep
                        </span>
                      )}
                    </div>

                    <div className="p-5 rounded-[14px] bg-white border border-slate-200 mb-6">
                      <p className="text-[16px] font-normal leading-[1.55] text-[#1E293B] text-pretty tabular-nums">
                        {chosenOptionObj?.feedback}
                      </p>
                    </div>

                    <div className="p-4 rounded-[12px] bg-[#EEF2FA] text-[14px] leading-[1.6] text-[#0A0D14] space-y-1.5 tabular-nums">
                      <div>Tahap 1: 50% × Rp400.000 = Rp200.000</div>
                      <div>Tahap 2: Rp200.000 - (20% × Rp200.000)</div>
                      <div className="font-bold text-[#1B68FF]">
                        Harga Akhir = Rp160.000,00
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-[16px] font-medium text-[#1E293B] tabular-nums">
                      480+ Soal TKA Tersedia
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNavigate("/register")}
                      className={UI.btnPrimary}
                    >
                      <span>Buka Simulasi 75 Menit</span>
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealPop>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. SECTION: KURIKULUM 16 SUBMATERI (#submateri)
             (16px Min Body Text, 26px H3, 48px Tab Buttons, High Contrast)
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="submateri"
        className="relative w-full py-28 sm:py-36 px-6 sm:px-12 lg:px-16 bg-[#F4F7FC]"
      >
        <RevealPop>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <h2 className={`${UI.h2Section} max-w-3xl`}>
              16 Submateri Inti Numerasi &amp; Literasi Fase D
            </h2>

            {/* Domain Switcher with >= 48px touch target buttons */}
            <div className="inline-flex rounded-[20px] p-1.5 bg-[#EEF2FA] border border-slate-300/80 self-start lg:self-end">
              <button
                type="button"
                onClick={() => setActiveDomain("numerasi")}
                className={`min-h-[48px] px-6 py-2.5 rounded-[14px] text-[16px] font-medium transition-all cursor-pointer tabular-nums ${
                  activeDomain === "numerasi"
                    ? "bg-[#1B68FF] text-white shadow-sm"
                    : "text-[#1E293B] hover:text-[#0A0D14]"
                }`}
              >
                Matematika (08)
              </button>
              <button
                type="button"
                onClick={() => setActiveDomain("literasi")}
                className={`min-h-[48px] px-6 py-2.5 rounded-[14px] text-[16px] font-medium transition-all cursor-pointer tabular-nums ${
                  activeDomain === "literasi"
                    ? "bg-[#1B68FF] text-white shadow-sm"
                    : "text-[#1E293B] hover:text-[#0A0D14]"
                }`}
              >
                Bahasa Indonesia (08)
              </button>
            </div>
          </div>
        </RevealPop>

        <div
          key={activeDomain}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 tabular-nums"
        >
          {activeItems.map((item, idx) => (
            <RevealPop key={item.code} delay={idx * 40}>
              <div className="group bg-white hover:bg-[#1B68FF] rounded-[24px] p-7 sm:p-8 transition-all duration-300 border border-slate-200 hover:border-[#1B68FF] shadow-[0_8px_24px_rgba(15,23,42,0.03)] hover:shadow-[0_18px_40px_rgba(27,104,255,0.2)] flex items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <span className="text-[26px] font-normal leading-[1.3] text-[#1B68FF] group-hover:text-blue-100 transition-colors tabular-nums">
                    {item.code}
                  </span>
                  <div>
                    <h3 className="text-[22px] sm:text-[24px] font-medium tracking-[-0.02em] leading-[1.3] text-[#0A0D14] group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[16px] font-normal leading-[1.55] text-[#1E293B] group-hover:text-blue-50 transition-colors mt-2 text-pretty">
                      {item.scope}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <span className="block text-[16px] font-semibold text-[#0A0D14] group-hover:text-white transition-colors tabular-nums">
                    {item.itemsCount} Soal
                  </span>
                  <span className="block text-[14px] font-medium text-[#065F46] group-hover:text-emerald-200 transition-colors mt-1 tabular-nums">
                    Lulus {item.passRate}
                  </span>
                </div>
              </div>
            </RevealPop>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. CLOSING CTA STAGE & ARCHITECTURAL FOOTER
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full pt-8 pb-20 px-6 sm:px-12 lg:px-16 bg-[#F4F7FC]">
        <RevealPop>
          <div className="relative w-full rounded-[36px] bg-gradient-to-br from-[#2370FF] via-[#1B68FF] to-[#0E50E4] p-10 sm:p-16 lg:p-20 overflow-hidden text-white shadow-[0_28px_70px_rgba(27,104,255,0.22)]">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <div className="max-w-2xl">
                <h2 className="text-[38px] sm:text-[52px] lg:text-[64px] font-normal tracking-[-0.04em] leading-[1.05] text-white mb-5 text-balance">
                  Mulai Persiapan TKA SMP Hari Ini
                </h2>
                <p className="text-[16px] sm:text-[18px] font-normal leading-[1.55] text-blue-50 max-w-xl text-pretty tabular-nums">
                  Akses langsung 30 soal diagnostik prasyarat, 16 submateri Fase
                  D, dan paket simulasi CBT 75 menit dalam satu ruang belajar
                  mandiri.
                </p>
              </div>

              {/* Primary Solid vs Secondary Outline Buttons (>= 48x48px) */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleNavigate("/register")}
                  disabled={loadingRoute === "/register"}
                  className="min-h-[48px] px-8 py-3.5 rounded-[14px] bg-white text-[#1B68FF] hover:bg-blue-50 active:translate-y-0.5 text-[16px] font-semibold transition-all shadow-[0_16px_36px_rgba(0,0,0,0.18)] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loadingRoute === "/register"
                    ? "Memuat..."
                    : "Daftar Akun Siswa →"}
                </button>
                <Link
                  href="/login"
                  className="min-h-[48px] px-7 py-3.5 rounded-[14px] bg-transparent hover:bg-white/15 border-2 border-white/60 hover:border-white text-white text-[16px] font-medium transition-all inline-flex items-center justify-center"
                >
                  Masuk ke Akun Siswa
                </Link>
              </div>
            </div>
          </div>
        </RevealPop>

        <footer className="mt-16 pt-8 border-t border-slate-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-[16px] font-normal text-[#1E293B]">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/agra-icon.png"
              alt="Logo AGRA"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="w-7 h-7 object-contain"
            />
            <span className="text-[20px] font-semibold tracking-[-0.04em] text-[#0A0D14]">
              AGRA.
            </span>
            <span>
              — Ruang Belajar &amp; Simulasi Mandiri Tes Kemampuan Akademik SMP
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 tabular-nums">
            <a
              href="#alur"
              className="min-h-[44px] inline-flex items-center hover:text-[#0A0D14] transition-colors"
            >
              Alur Belajar
            </a>
            <a
              href="#simulasi"
              className="min-h-[44px] inline-flex items-center hover:text-[#0A0D14] transition-colors"
            >
              Simulasi CBT
            </a>
            <a
              href="#submateri"
              className="min-h-[44px] inline-flex items-center hover:text-[#0A0D14] transition-colors"
            >
              Kurikulum
            </a>
            <Link
              href="/login"
              className="min-h-[44px] inline-flex items-center hover:text-[#0A0D14] transition-colors"
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
