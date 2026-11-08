"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    scope: "Operasi hitung campuran, estimasi, dan pemodelan kontekstual",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "02",
    title: "Aljabar & Persamaan Linear",
    scope: "Penyederhanaan bentuk aljabar, fungsi, dan sistem persamaan linear",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "03",
    title: "Perbandingan & Skala Numerik",
    scope: "Proporsi senilai, berbalik nilai, laju perubahan, dan skala peta",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "04",
    title: "Geometri Datar & Ruang",
    scope: "Teorema Pythagoras, jaring-jaring, luas permukaan, dan volume",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "05",
    title: "Statistika & Representasi Data",
    scope: "Interpretasi grafik, ukuran pemusatan, dan sebaran data",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "06",
    title: "Peluang Kejadian Majemuk",
    scope: "Ruang sampel, frekuensi harapan, dan inferensi ketidakpastian",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "07",
    title: "Barisan, Pola & Deret Angka",
    scope: "Generalisasi pola aritmetika, geometri, dan konfigurasi objek",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "08",
    title: "Aritmetika Sosial & Finansial",
    scope: "Literasi finansial dasar, persentase, diskon, dan bunga tunggal",
    itemsCount: 30,
    passRate: "90%",
  },
];

const LITERASI_DATA: SubmateriItem[] = [
  {
    code: "01",
    title: "Informasi Tersurat & Eksplisit",
    scope: "Identifikasi fakta spesifik, gagasan pokok, dan verifikasi data teks",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "02",
    title: "Inferensi & Makna Tersirat",
    scope: "Menyimpulkan hubungan sebab-akibat, asumsi penulis, dan prediksi",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "03",
    title: "Struktur & Kohesi Wacana",
    scope: "Analisis kepaduan antarparagraf, konjungsi, dan kerangka logika",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "04",
    title: "Evaluasi Kredibilitas Informasi",
    scope: "Membedakan fakta dan opini, mendeteksi bias, serta validitas argumen",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "05",
    title: "Sintesis Multi-Teks & Infografik",
    scope: "Membandingkan dua sumber bacaan dan menafsirkan tabel/visual",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "06",
    title: "Refleksi Isi & Nilai Kontekstual",
    scope: "Mengaitkan pesan wacana dengan problematika nyata dan etika",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "07",
    title: "Semantik, Diksi & Gaya Bahasa",
    scope: "Ketepatan istilah, makna denotatif-konotatif, dan majas dalam teks",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "08",
    title: "Penalaran Kritis Teks Eksposisi",
    scope: "Bedah argumen ilmiah populer, tesis, dan ketajaman simpulan",
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
      "Kurang tepat. Menjumlahkan 50% + 20% = 70% adalah jebakan umum pada soal Aritmetika Sosial Level 3 (HOTS).",
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

/**
 * SmartStudentCutout:
 * Strips outer studio white (#FFFFFF), auto-trims dead margins, and includes a clean loading state (#19).
 */
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
      {/* Rule #19: Loading Skeleton State while processing canvas cutout */}
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
            transform: ready
              ? "translateY(0)"
              : "translateY(36px)",
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
  const [secondsLeft, setSecondsLeft] = useState<number>(4499); // 74:59 in seconds

  // Live countdown timer for the actual CBT product preview (#6, #18)
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
      className="relative min-h-screen w-full bg-[#EEF2FA] text-[#0A0D14] overflow-x-hidden"
    >
      {/* ═══════════════════════════════════════════════════════════════════
          1. HEADER WITH OFFICIAL AGRA LOGO (CONSISTENT SPACING & ALIGNMENT)
         ═══════════════════════════════════════════════════════════════════ */}
      <header className="absolute top-0 inset-x-0 z-50 w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center px-6 sm:px-12 lg:px-16 pt-6 pb-4">
          <div className="lg:col-span-6 flex items-center justify-between lg:justify-start gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Rule #14: Outer rounded-[16px] p-1.5 (6px) -> Inner image fits cleanly */}
              <div className="w-10 h-10 rounded-[16px] p-1.5 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)] border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src="/assets/images/agra-icon.png"
                  alt="Logo AGRA"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-medium tracking-[-0.04em] text-[#0A0D14] flex items-center">
                AGRA
                <span className="inline-block w-2 h-2 rounded-full bg-[#1B68FF] ml-1" />
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-[15px] font-normal text-slate-600">
              <a
                href="#alur"
                className="hover:text-[#0A0D14] transition-colors"
              >
                Alur Belajar
              </a>
              <a
                href="#simulasi"
                className="hover:text-[#0A0D14] transition-colors"
              >
                Simulasi CBT
              </a>
              <a
                href="#submateri"
                className="hover:text-[#0A0D14] transition-colors"
              >
                Kurikulum
              </a>
            </nav>
          </div>

          <div className="hidden lg:flex lg:col-span-6 items-center justify-end gap-6">
            <Link
              href="/login"
              className="text-[15px] font-normal text-white/90 hover:text-white transition-colors"
            >
              Masuk
            </Link>
            <button
              type="button"
              onClick={() => handleNavigate("/register")}
              disabled={loadingRoute === "/register"}
              className="px-6 py-2.5 rounded-full bg-white text-[#1B68FF] text-sm font-medium hover:bg-blue-50 active:translate-y-0.5 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.14)] flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loadingRoute === "/register" ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[#1B68FF]/30 border-t-[#1B68FF] animate-spin" />
                  <span>Memuat...</span>
                </>
              ) : (
                <>
                  <span>Mulai Belajar</span>
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
          2. HERO SECTION — 50/50 SPLIT + CONNECTED "Asesmen Mandiri" + GIANT STUDENT
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#F4F7FC]">
        {/* Clean 50/50 Split Background (#13: Removed decorative wireframe clutter) */}
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 pointer-events-none">
          <div className="lg:col-span-6 bg-[#F4F7FC]" />
          <div className="lg:col-span-6 bg-gradient-to-br from-[#2370FF] via-[#1B68FF] to-[#0D4EE0] lg:rounded-bl-[64px] min-h-[580px]" />
        </div>

        <div className="relative z-20 w-full pt-28 sm:pt-32 lg:pt-32 flex-1 flex flex-col justify-between">
          {/* TOP GIANT HEADLINE: "AGRA" + CONNECTED "Asesmen Mandiri" */}
          <div className="relative w-full">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-end px-6 sm:px-12 lg:px-16 gap-4">
              <div className="lg:col-span-6 flex lg:justify-start">
                <RevealPop delay={40}>
                  {/* Rule #17: Optical margin alignment -ml-[0.04em] */}
                  <h1 className="-ml-[0.04em] text-[4.5rem] sm:text-[7rem] lg:text-[9.2vw] font-normal tracking-[-0.055em] leading-[0.88] text-[#0A0D14] select-none">
                    AGRA
                  </h1>
                </RevealPop>
              </div>

              <div className="lg:col-span-6 flex lg:justify-start lg:pl-6 lg:pb-3">
                <RevealPop delay={120}>
                  <p className="max-w-[440px] text-lg sm:text-xl lg:text-[22px] font-normal leading-[1.38] text-white text-balance">
                    Ruang Belajar &amp; Simulasi Mandiri{" "}
                    <span className="block text-blue-100 font-light">
                      Tes Kemampuan Akademik SMP.
                    </span>
                  </p>
                </RevealPop>
              </div>
            </div>

            {/* Row 2: CONNECTED "Asesmen Mandiri" Across the 50/50 Split (Z-40 in front of student) */}
            <RevealPop delay={200} className="w-full mt-1 lg:mt-2 relative z-40">
              <div className="w-full px-6 sm:px-12 lg:px-0 grid grid-cols-1 lg:grid-cols-12 items-baseline">
                <div className="lg:col-span-6 flex lg:justify-end lg:pr-[0.14em]">
                  <span className="text-[4.2rem] sm:text-[6.5rem] lg:text-[8.6vw] font-normal tracking-[-0.05em] leading-[0.9] text-[#0A0D14] select-none whitespace-nowrap">
                    Asesmen
                  </span>
                </div>
                <div className="lg:col-span-6 flex lg:justify-start lg:pl-[0.14em] relative z-40">
                  <span className="text-[4.2rem] sm:text-[6.5rem] lg:text-[8.6vw] font-normal tracking-[-0.05em] leading-[0.9] text-white select-none whitespace-nowrap">
                    <span>Ma</span>
                    <span className="mix-blend-difference text-white inline-block">
                      ndiri
                    </span>
                  </span>
                </div>
              </div>
            </RevealPop>
          </div>

          {/* BOTTOM ROW: SPECIFIC VALUE CARD + GIANT SMP STUDENT CUTOUT */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-end px-6 sm:px-12 lg:px-16 gap-8 mt-8 lg:mt-0">
            <div className="lg:col-span-6 pb-12 lg:pb-16 lg:pr-8 relative z-30">
              <RevealPop delay={280}>
                {/* Rule #14: Outer rounded-[32px] p-3 (12px) -> Inner content rounded-[20px] */}
                <div className="bg-white/70 rounded-[32px] p-3 shadow-[0_24px_60px_rgba(15,23,42,0.06)] border border-white max-w-[580px]">
                  <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-slate-100">
                    {/* Rule #9: Specific Headline instead of generic "Solusi" */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <h2 className="text-xl sm:text-2xl font-medium tracking-[-0.03em] text-[#0A0D14] text-balance">
                        Persiapan Terukur dari Diagnostik hingga Ujian CBT
                      </h2>
                    </div>

                    {/* Rule #15 & #16 & #18: High contrast slate-600, text-pretty, tabular-nums */}
                    <p className="text-[15.5px] sm:text-[16px] font-normal leading-[1.68] text-slate-600 mb-7 text-pretty tabular-nums">
                      <strong className="font-semibold text-[#0A0D14]">
                        dirancang tanpa tekanan berlebih
                      </strong>{" "}
                      agar siswa fokus menguasai konsep esensial Fase D.
                      Evaluasi dimulai dari pemetaan prasyarat{" "}
                      <strong className="font-semibold text-[#0A0D14]">
                        ketuntasan 90%
                      </strong>
                      , dilanjutkan latihan bertahap{" "}
                      <span className="text-[#1B68FF] font-medium">
                        3 level kognitif (L1, L2, HOTS)
                      </span>
                      , hingga simulasi mandiri{" "}
                      <strong className="font-semibold text-[#0A0D14]">
                        75 menit
                      </strong>
                      .
                    </p>

                    {/* Rule #10 & #19: Emphasized Primary CTA + Loading State */}
                    <div className="flex flex-wrap items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => handleNavigate("/register")}
                        disabled={loadingRoute === "/register"}
                        className="px-7 py-3.5 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-sm font-medium transition-all shadow-[0_12px_28px_rgba(27,104,255,0.28)] flex items-center gap-2.5 cursor-pointer disabled:opacity-75"
                      >
                        {loadingRoute === "/register" ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            <span>Membuka Ruang Asesmen...</span>
                          </>
                        ) : (
                          <>
                            <span>Mulai Asesmen Sekarang</span>
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

                      <a
                        href="#simulasi"
                        className="px-6 py-3.5 rounded-[14px] bg-[#F4F7FC] hover:bg-slate-200/75 text-[#0A0D14] text-sm font-medium transition-colors"
                      >
                        Coba Soal Interaktif
                      </a>
                    </div>
                  </div>
                </div>
              </RevealPop>
            </div>

            {/* Bottom-Right: GIANT SMP STUDENT CUTOUT BEHIND "Mandiri" (Z-20) */}
            <div className="lg:col-span-6 relative flex items-end justify-center lg:justify-start lg:-translate-x-6 xl:-translate-x-12 -mt-16 sm:-mt-24 lg:-mt-64 xl:-mt-80 2xl:-mt-96 z-20 pointer-events-none">
              <div className="relative w-full sm:w-[620px] lg:w-[820px] xl:w-[960px] 2xl:w-[1100px] max-w-none h-[440px] sm:h-[540px] lg:h-[700px] xl:h-[820px] 2xl:h-[920px] flex items-end justify-center">
                <SmartStudentCutout />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. SECTION: ALUR BELAJAR 4 TAHAP (#alur)
             (#8 Group with spacing, #9 Specific Headline, #18 Tabular Nums)
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="alur"
        className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-16 bg-[#F4F7FC]"
      >
        <RevealPop>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 lg:mb-16">
            <h2 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-normal tracking-[-0.045em] leading-[0.96] text-[#0A0D14] text-balance max-w-3xl">
              Empat Tahap Menuju Ketuntasan Akademik
            </h2>
            <p className="text-base sm:text-lg font-normal text-slate-600 max-w-md text-pretty">
              Setiap tahap dirancang berurutan agar siswa memahami pondasi
              materi sebelum menguji kecepatan di simulasi ujian.
            </p>
          </div>
        </RevealPop>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 tabular-nums">
          <RevealPop delay={50} className="lg:col-span-7">
            <div className="h-full bg-white rounded-[32px] p-8 sm:p-11 shadow-[0_20px_50px_rgba(15,23,42,0.03)] border border-slate-200/70 flex flex-col justify-between min-h-[300px] hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <span className="text-5xl sm:text-6xl font-light tracking-[-0.05em] text-[#1B68FF]">
                  01
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#059669] text-xs font-medium">
                  Syarat Lulus ≥ 90%
                </span>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#0A0D14] mb-3 text-balance">
                  Diagnostik Recall Kemampuan Awal
                </h3>
                <p className="text-[16px] font-normal leading-[1.68] text-slate-600 max-w-xl text-pretty">
                  Siswa menyelesaikan{" "}
                  <strong className="font-semibold text-[#0A0D14]">
                    30 butir soal prasyarat
                  </strong>{" "}
                  untuk memetakan kesiapan dasar sebelum membuka seluruh
                  submateri Fase D.
                </p>
              </div>
            </div>
          </RevealPop>

          <RevealPop delay={110} className="lg:col-span-5">
            <div className="h-full bg-[#1B68FF] text-white rounded-[32px] p-8 sm:p-11 flex flex-col justify-between min-h-[300px] hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <span className="text-5xl sm:text-6xl font-light tracking-[-0.05em] text-white">
                  02
                </span>
                <span className="text-sm font-normal text-blue-100">
                  16 Topik Inti
                </span>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-white mb-3 text-balance">
                  Pemahaman Konsep Numerasi &amp; Literasi
                </h3>
                <p className="text-[16px] font-normal leading-[1.68] text-blue-100 text-pretty">
                  Ringkasan terstruktur pada 8 topik Matematika dan 8 topik
                  Bahasa Indonesia lengkap dengan pemodelan kontekstual.
                </p>
              </div>
            </div>
          </RevealPop>

          <RevealPop delay={170} className="lg:col-span-5">
            <div className="h-full bg-white rounded-[32px] p-8 sm:p-11 border border-slate-200/70 flex flex-col justify-between min-h-[300px] hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <span className="text-5xl sm:text-6xl font-light tracking-[-0.05em] text-[#0A0D14]">
                  03
                </span>
                <span className="text-sm font-medium text-[#1B68FF]">
                  L1 • L2 • HOTS
                </span>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#0A0D14] mb-3 text-balance">
                  Latihan Berjenjang 3 Level Kognitif
                </h3>
                <p className="text-[16px] font-normal leading-[1.68] text-slate-600 text-pretty">
                  Latihan adaptif mulai dari Level 1 (Pemahaman), Level 2
                  (Aplikasi), hingga Level 3 (Penalaran HOTS C4).
                </p>
              </div>
            </div>
          </RevealPop>

          <RevealPop delay={230} className="lg:col-span-7">
            <div className="h-full bg-[#0A0D14] text-white rounded-[32px] p-8 sm:p-11 flex flex-col justify-between min-h-[300px] hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <span className="text-5xl sm:text-6xl font-light tracking-[-0.05em] text-[#10B981]">
                  04
                </span>
                <span className="font-mono text-sm text-slate-300">
                  75:00 CBT
                </span>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="max-w-lg">
                  <h3 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-white mb-3 text-balance">
                    Simulasi Ujian CBT 75 Menit
                  </h3>
                  <p className="text-[16px] font-normal leading-[1.68] text-slate-300 text-pretty">
                    Evaluasi komprehensif dengan timer waktu nyata, skoring
                    pilihan ganda kompleks, dan pembahasan kunci nalar.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate("/register")}
                  className="px-6 py-3.5 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] text-white text-sm font-medium whitespace-nowrap transition-all self-start sm:self-end cursor-pointer"
                >
                  Mulai Tahap 01 →
                </button>
              </div>
            </div>
          </RevealPop>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. SECTION: ENLARGED INTERACTIVE CBT PRODUCT PREVIEW (#simulasi)
             (Rules #6 Show actual product, #7 Enlarge main feature, #11 Accent color,
              #14 Inner radius = outer - padding, #18 Tabular nums, #20 Useful feedback)
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="simulasi"
        className="relative w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-16 bg-[#EEF2FA]"
      >
        <RevealPop>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-normal tracking-[-0.045em] leading-[0.96] text-[#0A0D14] text-balance">
                Antarmuka Simulasi CBT 75 Menit
              </h2>
            </div>
            <p className="text-base sm:text-lg font-normal text-slate-600 max-w-md text-pretty">
              Coba langsung pengalaman mengerjakan soal penalaran HOTS di bawah
              ini—klik salah satu opsi jawaban untuk melihat evaluasi kunci
              nalar instan.
            </p>
          </div>
        </RevealPop>

        {/* Rule #14: Outer shell rounded-[36px] p-4 (16px) -> Inner workspace rounded-[20px] (36 - 16 = 20) */}
        <RevealPop delay={100}>
          <div className="w-full rounded-[36px] p-3 sm:p-4 bg-white/80 border border-white shadow-[0_28px_70px_rgba(15,23,42,0.06)]">
            <div className="w-full rounded-[20px] bg-white border border-slate-200/80 overflow-hidden">
              {/* Top CBT Workspace Bar */}
              <div className="px-6 sm:px-10 py-5 bg-[#F4F7FC] border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded-[8px] bg-[#0A0D14] text-white tabular-nums">
                    MAT-08 • LEVEL 3 HOTS
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    Aritmetika Sosial &amp; Finansial
                  </span>
                </div>

                {/* Rule #4 & #18: Mono & Tabular Nums on Live Countdown Timer */}
                <div className="flex items-center gap-6 tabular-nums">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <svg
                      className="w-4 h-4 text-[#1B68FF]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    <span className="font-mono text-base font-semibold text-[#0A0D14] tabular-nums">
                      {formatTime(secondsLeft)}
                    </span>
                  </div>

                  <span className="hidden sm:inline-block text-xs font-medium text-slate-500 tabular-nums">
                    Soal 14 / 30
                  </span>
                </div>
              </div>

              {/* Main CBT Split Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left 7 Cols: Question Stem + Interactive Options */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:border-r border-slate-200/70">
                  <p className="text-base sm:text-[17px] font-normal leading-[1.7] text-[#0A0D14] mb-6 text-pretty tabular-nums">
                    Sebuah toko buku memberikan promo bertingkat bertuliskan{" "}
                    <strong className="font-semibold">
                      &ldquo;Diskon 50% + 20%&rdquo;
                    </strong>{" "}
                    untuk paket buku persiapan ujian seharga{" "}
                    <strong className="font-semibold">Rp400.000,00</strong>.
                    Berapakah harga akhir yang harus dibayar siswa di kasir?
                  </p>

                  {/* Interactive Answer Choices (#20 Animate useful feedback) */}
                  <div className="flex flex-col gap-3">
                    {SAMPLE_OPTIONS.map((opt) => {
                      const isSelected = selectedOption === opt.id;
                      const showEmerald = isSelected && opt.isCorrect;
                      const showAmber = isSelected && !opt.isCorrect;

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedOption(opt.id)}
                          className={`w-full text-left p-4 sm:p-5 rounded-[14px] border-2 transition-all duration-200 flex items-start gap-4 cursor-pointer ${
                            showEmerald
                              ? "bg-emerald-50/70 border-[#10B981] text-[#064E3B]"
                              : showAmber
                              ? "bg-amber-50/80 border-amber-500 text-amber-950"
                              : "bg-white hover:bg-[#F4F7FC] border-slate-200/80 text-slate-800"
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-[8px] font-mono text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              showEmerald
                                ? "bg-[#10B981] text-white"
                                : showAmber
                                ? "bg-amber-500 text-white"
                                : "bg-[#F4F7FC] text-slate-700"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="text-[15px] font-normal leading-[1.55] text-pretty tabular-nums">
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right 5 Cols: Instant "Bedah Kunci Nalar" Diagnostic Panel */}
                <div className="lg:col-span-5 p-6 sm:p-10 bg-[#F8FAFC] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Evaluasi Kunci Nalar Instan
                      </span>
                      {chosenOptionObj?.isCorrect ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#059669] text-xs font-semibold">
                          Jawaban Tepat
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                          Perlu Evaluasi Konsep
                        </span>
                      )}
                    </div>

                    <div className="p-5 rounded-[14px] bg-white border border-slate-200/80 mb-6">
                      <p className="text-[15px] font-normal leading-[1.65] text-slate-700 text-pretty tabular-nums">
                        {chosenOptionObj?.feedback}
                      </p>
                    </div>

                    <div className="p-4 rounded-[12px] bg-[#EEF2FA] font-mono text-xs text-slate-700 space-y-1.5 tabular-nums">
                      <div>Tahap 1: 50% × Rp400.000 = Rp200.000</div>
                      <div>Tahap 2: Rp200.000 - (20% × Rp200.000)</div>
                      <div className="font-semibold text-[#1B68FF]">
                        Harga Akhir = Rp160.000,00
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between gap-4">
                    <span className="text-xs font-normal text-slate-500 tabular-nums">
                      480+ Soal Setara TKA Tersedia
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNavigate("/register")}
                      className="px-5 py-2.5 rounded-[12px] bg-[#0A0D14] hover:bg-[#1B68FF] text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      Buka Simulasi Penuh →
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
             (#2 Drop redundant labels, #14 Inner radius math, #18 Tabular nums)
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="submateri"
        className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-16 bg-[#F4F7FC]"
      >
        <RevealPop>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 lg:mb-16">
            <h2 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-normal tracking-[-0.045em] leading-[0.96] text-[#0A0D14] text-balance max-w-3xl">
              16 Submateri Inti Numerasi &amp; Literasi Fase D
            </h2>

            {/* Rule #14: Outer switcher rounded-[20px] p-1.5 (6px) -> Inner buttons rounded-[14px] (20 - 6 = 14) */}
            <div className="inline-flex rounded-[20px] p-1.5 bg-[#EEF2FA] border border-slate-200/80 self-start lg:self-end">
              <button
                type="button"
                onClick={() => setActiveDomain("numerasi")}
                className={`px-5 py-2.5 rounded-[14px] text-sm font-medium transition-all cursor-pointer tabular-nums ${
                  activeDomain === "numerasi"
                    ? "bg-[#1B68FF] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#0A0D14]"
                }`}
              >
                Matematika (08)
              </button>
              <button
                type="button"
                onClick={() => setActiveDomain("literasi")}
                className={`px-5 py-2.5 rounded-[14px] text-sm font-medium transition-all cursor-pointer tabular-nums ${
                  activeDomain === "literasi"
                    ? "bg-[#1B68FF] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#0A0D14]"
                }`}
              >
                Bahasa Indonesia (08)
              </button>
            </div>
          </div>
        </RevealPop>

        <div
          key={activeDomain}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 tabular-nums"
        >
          {activeItems.map((item, idx) => (
            <RevealPop key={item.code} delay={idx * 40}>
              <div className="group bg-white hover:bg-[#1B68FF] rounded-[24px] p-6 sm:p-7 transition-all duration-300 border border-slate-200/70 hover:border-[#1B68FF] shadow-[0_8px_24px_rgba(15,23,42,0.02)] hover:shadow-[0_18px_40px_rgba(27,104,255,0.2)] flex items-center justify-between gap-4">
                <div className="flex items-start gap-5">
                  <span className="font-mono text-2xl font-normal text-[#1B68FF] group-hover:text-blue-100 transition-colors tabular-nums">
                    {item.code}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-medium tracking-[-0.02em] text-[#0A0D14] group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm font-normal text-slate-600 group-hover:text-blue-100 transition-colors mt-1 text-pretty">
                      {item.scope}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <span className="block text-xs font-semibold text-[#0A0D14] group-hover:text-white transition-colors tabular-nums">
                    {item.itemsCount} Soal
                  </span>
                  <span className="block text-xs font-normal text-[#059669] group-hover:text-emerald-200 transition-colors mt-0.5 tabular-nums">
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
                <h2 className="text-4xl sm:text-6xl lg:text-[4.4rem] font-normal tracking-[-0.045em] leading-[0.96] text-white mb-5 text-balance">
                  Mulai Persiapan TKA SMP Hari Ini
                </h2>
                <p className="text-base sm:text-lg font-normal leading-relaxed text-blue-100 max-w-xl text-pretty tabular-nums">
                  Akses langsung 30 soal diagnostik prasyarat, 16 submateri Fase
                  D, dan paket simulasi CBT 75 menit dalam satu ruang belajar
                  mandiri.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleNavigate("/register")}
                  disabled={loadingRoute === "/register"}
                  className="px-8 py-4 rounded-[16px] bg-white text-[#1B68FF] hover:bg-blue-50 active:translate-y-0.5 text-sm font-semibold transition-all shadow-[0_16px_36px_rgba(0,0,0,0.18)] cursor-pointer"
                >
                  {loadingRoute === "/register"
                    ? "Memuat..."
                    : "Daftar Akun Siswa →"}
                </button>
                <Link
                  href="/login"
                  className="px-7 py-4 rounded-[16px] bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-medium transition-all"
                >
                  Masuk ke Akun
                </Link>
              </div>
            </div>
          </div>
        </RevealPop>

        <footer className="mt-14 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-sm font-normal text-slate-600">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/agra-icon.png"
              alt="Logo AGRA"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="w-6 h-6 object-contain"
            />
            <span className="text-lg font-semibold tracking-[-0.04em] text-[#0A0D14]">
              AGRA.
            </span>
            <span>
              — Ruang Belajar &amp; Simulasi Mandiri Tes Kemampuan Akademik SMP
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-7 tabular-nums">
            <a href="#alur" className="hover:text-[#0A0D14] transition-colors">
              Alur Belajar
            </a>
            <a
              href="#simulasi"
              className="hover:text-[#0A0D14] transition-colors"
            >
              Simulasi CBT
            </a>
            <a
              href="#submateri"
              className="hover:text-[#0A0D14] transition-colors"
            >
              Kurikulum
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
