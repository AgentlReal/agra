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
    scope:
      "Operasi hitung campuran bilangan bulat, pecahan, desimal, serta estimasi nilai pada masalah sehari-hari.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "02",
    title: "Aljabar & Persamaan Linear",
    scope:
      "Penyederhanaan bentuk aljabar, persamaan dan pertidaksamaan linear satu variabel, serta sistem persamaan linear.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "03",
    title: "Perbandingan & Skala Numerik",
    scope:
      "Perbandingan senilai dan berbalik nilai, pembacaan skala peta, serta perhitungan laju perubahan.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "04",
    title: "Geometri Datar & Ruang",
    scope:
      "Teorema Pythagoras, sifat sudut, keliling dan luas bangun datar, serta luas permukaan dan volume bangun ruang.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "05",
    title: "Statistika & Representasi Data",
    scope:
      "Pembacaan tabel, diagram batang, garis, dan lingkaran, serta perhitungan rata-rata, median, dan modus.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "06",
    title: "Peluang Kejadian",
    scope:
      "Penentuan ruang sampel, titik sampel, peluang teoretik, dan frekuensi harapan dari suatu percobaan.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "07",
    title: "Barisan, Pola & Deret Angka",
    scope:
      "Penentuan suku berikutnya pada barisan aritmetika, geometri, dan pola susunan objek bergambar.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "08",
    title: "Aritmetika Sosial",
    scope:
      "Perhitungan harga jual, harga beli, persentase untung dan rugi, diskon bertingkat, bruto, neto, dan tara.",
    itemsCount: 30,
    passRate: "90%",
  },
];

const LITERASI_DATA: SubmateriItem[] = [
  {
    code: "01",
    title: "Informasi Tersurat",
    scope:
      "Penemuan fakta langsung, tokoh, latar, dan pernyataan yang tertulis jelas di dalam paragraf bacaan.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "02",
    title: "Simpulan & Makna Tersirat",
    scope:
      "Penarikan simpulan paragraf, hubungan sebab-akibat, serta maksud penulis yang tidak ditulis secara langsung.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "03",
    title: "Struktur & Kepaduan Teks",
    scope:
      "Penggunaan kata hubung antarkalimat, kalimat utama, kalimat penjelas, dan keruntutan gagasan antarparagraf.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "04",
    title: "Evaluasi Fakta & Opini",
    scope:
      "Pembedaan kalimat fakta dan opini, penilaian kelogisan argumen, serta ketepatan bukti pendukung dalam teks.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "05",
    title: "Perbandingan Dua Teks & Tabel",
    scope:
      "Pembandingan persamaan dan perbedaan isi dua wacana serta pembacaan data pada infografik atau tabel.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "06",
    title: "Pesan & Nilai Teks Sastra",
    scope:
      "Penentuan amanat cerita, watak tokoh, konflik utama, dan keterkaitan isi cerita dengan situasi sehari-hari.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "07",
    title: "Makna Kata & Gaya Bahasa",
    scope:
      "Penentuan arti istilah dalam konteks kalimat, sinonim, antonim, ungkapan, dan majas pada teks.",
    itemsCount: 30,
    passRate: "90%",
  },
  {
    code: "08",
    title: "Teks Eksposisi & Laporan",
    scope:
      "Bedah struktur teks laporan hasil observasi, teks eksposisi, dan ketepatan penggunaan ejaan bahasa Indonesia.",
    itemsCount: 30,
    passRate: "90%",
  },
];

const SAMPLE_OPTIONS = [
  {
    id: "A",
    text: "Rp136.000,00 karena potongan kedua dihitung dari harga awal sebelum potongan pertama.",
    isCorrect: false,
    feedback:
      "Belum tepat. Diskon bertingkat 50% + 20% tidak dijumlahkan langsung menjadi 70%, tetapi dihitung berurutan dari harga setelah diskon pertama.",
  },
  {
    id: "B",
    text: "Rp160.000,00 karena diskon 20% dihitung dari sisa harga setelah dipotong 50%.",
    isCorrect: true,
    feedback:
      "Tepat. Harga Rp400.000,00 dipotong 50% menjadi Rp200.000,00. Potongan kedua sebesar 20% dari Rp200.000,00 adalah Rp40.000,00, sehingga harga akhirnya Rp160.000,00.",
  },
  {
    id: "C",
    text: "Rp120.000,00 karena total potongan harga mencapai 70% dari harga label toko.",
    isCorrect: false,
    feedback:
      "Belum tepat. Menjumlahkan 50% + 20% = 70% secara langsung adalah kesalahan hitung yang sering muncul pada soal Aritmetika Sosial.",
  },
];

function RevealOnScroll({
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
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
        transitionDuration: "800ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate3d(0, 0, 0) scale(1)"
          : "translate3d(0, 40px, 0) scale(0.96)",
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
    <div className="relative w-full h-full flex items-end justify-center select-none">
      {!ready && (
        <div className="w-[260px] sm:w-[340px] h-[280px] sm:h-[360px] rounded-t-full bg-[#1B68FF]/10 animate-pulse" />
      )}
      {processedSrc && (
        <img
          src={processedSrc}
          alt="Siswa SMP AGRA"
          style={{
            transition:
              "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(28px)",
          }}
          className="w-auto h-full max-h-[300px] sm:max-h-[420px] lg:max-h-[500px] object-contain object-bottom drop-shadow-[0_32px_60px_rgba(6,18,54,0.38)]"
        />
      )}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const mainRef = useRef<HTMLElement>(null);
  const [activeDomain, setActiveDomain] = useState<"numerasi" | "literasi">(
    "numerasi"
  );
  const [selectedOption, setSelectedOption] = useState<string>("B");
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(4499);

  // 60fps Hardware-Accelerated Scroll & Mouse 3D Parallax
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    let rafId = 0;
    let targetScroll = 0;
    let currentScroll = 0;
    let targetMx = 0;
    let targetMy = 0;
    let currentMx = 0;
    let currentMy = 0;

    const onScroll = () => {
      targetScroll = window.scrollY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetMx = nx;
      targetMy = ny;
    };

    const update = () => {
      currentScroll += (targetScroll - currentScroll) * 0.12;
      currentMx += (targetMx - currentMx) * 0.08;
      currentMy += (targetMy - currentMy) * 0.08;

      el.style.setProperty("--sy", currentScroll.toFixed(2));
      el.style.setProperty("--mx", currentMx.toFixed(4));
      el.style.setProperty("--my", currentMy.toFixed(4));
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

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
      ref={mainRef}
      style={
        {
          fontFamily: "'Onest', sans-serif",
          "--sy": "0",
          "--mx": "0",
          "--my": "0",
        } as React.CSSProperties
      }
      className="relative min-h-screen w-full bg-[#EEF2FA] text-[#0A0D14] text-[16px] leading-[1.6] overflow-x-hidden"
    >
      {/* Subtle Tactile Grain Texture Overlay across the whole page */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.028] mix-blend-overlay"
      >
        <filter id="agra-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#agra-noise)" />
      </svg>

      {/* ═══════════════════════════════════════════════════════════════════
          1. PANEL ATAS (GAYA MONTIX / AETHERON)
             - Navigasi Simetris + Logo Seamless Tanpa Kotak
             - Teks Raksasa di Belakang + Bola Cahaya Biru 3D + Anak SMP 3D Parallax
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col justify-between bg-[#F4F7FC] overflow-hidden pt-5 pb-12 sm:pb-16">
        {/* Background Architectural Grid + Vector Bezier Lines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(27,104,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(27,104,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "56px 56px",
          }}
        />

        {/* Vector Bezier Arcs in Background */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 700"
          fill="none"
          className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[1440px] max-w-none opacity-40"
        >
          <path
            d="M-100 580 C 320 120, 1120 120, 1540 580"
            stroke="#1B68FF"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <path
            d="M120 640 C 460 240, 980 240, 1320 640"
            stroke="#38BDF8"
            strokeWidth="1.5"
          />
          <circle cx="430" cy="318" r="5" fill="#1B68FF" />
          <circle cx="1010" cy="318" r="5" fill="#1B68FF" />
        </svg>

        {/* TOP NAVIGATION BAR — Simetris & Logo Seamless Tanpa Kotak */}
        <header className="relative z-40 w-full max-w-[1320px] mx-auto px-5 sm:px-10">
          <div className="flex items-center justify-between py-2">
            {/* Left Nav Links */}
            <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold tracking-[0.08em] uppercase text-[#334155]">
              <a
                href="#tahapan"
                className="hover:text-[#1B68FF] transition-colors"
              >
                Alur Sistem
              </a>
              <a
                href="#simulasi"
                className="hover:text-[#1B68FF] transition-colors"
              >
                Simulasi CBT
              </a>
              <a
                href="#kurikulum"
                className="hover:text-[#1B68FF] transition-colors"
              >
                16 Submateri
              </a>
            </nav>

            {/* Center Seamless Brand Logo (Tanpa Kotak) */}
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group"
            >
              <img
                src="/assets/images/agra-icon.png"
                alt="Logo AGRA"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="text-[24px] sm:text-[28px] font-bold tracking-[-0.05em] text-[#0A0D14] flex items-start">
                AGRA
                <span className="text-[11px] font-mono font-semibold text-[#1B68FF] ml-0.5 mt-1">
                  TM
                </span>
              </span>
            </Link>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3 sm:gap-5">
              <Link
                href="/login"
                className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#334155] hover:text-[#0A0D14] transition-colors px-2 py-2"
              >
                Masuk
              </Link>
              <button
                type="button"
                onClick={() => handleNavigate("/register")}
                disabled={loadingRoute === "/register"}
                className="min-h-[42px] px-5 sm:px-6 py-2 rounded-full bg-[#1B68FF] hover:bg-[#1454D6] text-white text-[13px] sm:text-[14px] font-semibold tracking-wide transition-all shadow-[0_8px_20px_rgba(27,104,255,0.28)] cursor-pointer"
              >
                {loadingRoute === "/register" ? "Memuat..." : "Daftar Siswa"}
              </button>
            </div>
          </div>
        </header>

        {/* CENTER 3D STAGE (Giant Wordmark + Glowing Sphere + 3D Student Cutout) */}
        <div className="relative z-20 w-full max-w-[1320px] mx-auto px-5 sm:px-10 mt-6 sm:mt-8 flex-1 flex flex-col justify-center">
          <div className="relative w-full flex flex-col items-center justify-center">
            {/* LAYER 1 (Deep Background): Giant Display Wordmark */}
            <div
              style={{
                transform:
                  "translate3d(calc(var(--mx) * -14px), calc(var(--sy) * 0.18px), 0)",
              }}
              className="relative z-10 w-full text-center pointer-events-none select-none will-change-transform"
            >
              <h1 className="text-[17vw] sm:text-[15.5vw] lg:text-[188px] font-semibold tracking-[-0.055em] leading-[0.86] text-[#081538]">
                Asesmen
              </h1>
            </div>

            {/* LAYER 2 (Midground): Giant Glowing 3D Blue Sphere / Sun */}
            <div
              aria-hidden="true"
              style={{
                transform:
                  "translate3d(calc(var(--mx) * 10px), calc(var(--sy) * 0.08px), 0)",
              }}
              className="pointer-events-none absolute top-[12%] sm:top-[8%] z-10 w-[260px] h-[260px] sm:w-[400px] sm:h-[400px] lg:w-[470px] lg:h-[470px] rounded-full bg-gradient-to-b from-[#38BDF8] via-[#1B68FF] to-[#EEF2FA]/10 shadow-[0_0_120px_rgba(27,104,255,0.45)] will-change-transform"
            />

            {/* LAYER 3 (Foreground 3D Subject): Anak SMP Overlapping Sphere & Text */}
            <div
              style={{
                transform:
                  "translate3d(calc(var(--mx) * 22px), calc(var(--sy) * -0.09px + var(--my) * 10px), 0)",
              }}
              className="relative z-30 -mt-[11vw] sm:-mt-[100px] lg:-mt-[135px] w-full max-w-[680px] h-[290px] sm:h-[410px] lg:h-[480px] flex items-end justify-center will-change-transform"
            >
              <SmartStudentCutout />

              {/* Floating 3D Telemetry Card — Left (Matematika) */}
              <div
                style={{
                  transform:
                    "translate3d(calc(var(--mx) * 32px), calc(var(--sy) * -0.15px), 0)",
                }}
                className="hidden sm:flex absolute left-0 lg:-left-12 bottom-16 z-40 bg-white/90 backdrop-blur-md border border-white rounded-[20px] p-4 shadow-[0_20px_40px_rgba(6,18,54,0.12)] items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-[12px] bg-[#1B68FF] text-white font-mono text-[14px] font-bold flex items-center justify-center">
                  ∑
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#1B68FF] font-semibold">
                    NUMERASI SMP
                  </p>
                  <p className="text-[14px] font-semibold text-[#0A0D14]">
                    8 Submateri Matematika
                  </p>
                </div>
              </div>

              {/* Floating 3D Telemetry Card — Right (Bahasa Indonesia) */}
              <div
                style={{
                  transform:
                    "translate3d(calc(var(--mx) * -28px), calc(var(--sy) * -0.18px), 0)",
                }}
                className="hidden sm:flex absolute right-0 lg:-right-12 top-16 z-40 bg-[#081538] text-white border border-white/15 rounded-[20px] p-4 shadow-[0_20px_40px_rgba(6,18,54,0.22)] items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-[12px] bg-[#38BDF8] text-[#081538] font-mono text-[14px] font-bold flex items-center justify-center">
                  Aa
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#38BDF8] font-semibold">
                    LITERASI WACANA
                  </p>
                  <p className="text-[14px] font-semibold text-white">
                    8 Submateri B. Indonesia
                  </p>
                </div>
              </div>
            </div>

            {/* Ground Pedestal Shadow under Student Cutout */}
            <div className="w-[75%] max-w-[520px] h-5 rounded-full bg-gradient-to-r from-transparent via-[#081538]/25 to-transparent blur-md -mt-2 z-20" />
          </div>

          {/* BOTTOM HERO BAR — Rata Kanan-Kiri Konsisten */}
          <div className="relative z-30 mt-8 sm:mt-10 w-full max-w-[1120px] mx-auto bg-white rounded-[24px] p-6 sm:p-8 border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.06)] grid grid-cols-1 lg:grid-cols-12 items-center gap-6">
            <div className="lg:col-span-8">
              <p className="text-[15px] sm:text-[16px] font-normal leading-[1.65] text-[#334155] text-justify">
                Platform latihan dan simulasi Tes Kemampuan Akademik (TKA) untuk
                siswa SMP/MTs. Mencakup 30 soal pemetaan awal, latihan bertahap
                pada 16 submateri Matematika dan Bahasa Indonesia, serta
                simulasi ujian berbasis komputer berdurasi 75 menit.
              </p>
            </div>
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => handleNavigate("/register")}
                className="min-h-[48px] px-5 py-3 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] text-white text-[14px] font-semibold transition-all shadow-[0_10px_24px_rgba(27,104,255,0.25)] inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Mulai Belajar</span>
                <span>→</span>
              </button>
              <a
                href="#simulasi"
                className="min-h-[48px] px-5 py-3 rounded-[14px] bg-[#F4F7FC] hover:bg-slate-200/70 text-[#0A0D14] border border-slate-300 text-[14px] font-semibold transition-all inline-flex items-center justify-center whitespace-nowrap"
              >
                Coba Soal CBT
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. PANEL TENGAH — DARK ARCHITECTURAL 3-COLUMN BENTO (GAYA BANEVOX)
             - Background Midnight Navy #050C1E + Tekstur Vektor
             - 3 Kolom Bento Asimetris Persis Referensi Gambar
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="tahapan"
        className="relative w-full py-20 sm:py-28 px-5 sm:px-10 lg:px-16 bg-[#050C1E] text-white overflow-hidden"
      >
        {/* Background Radial Glow & Vector Grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(56,189,248,0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(56,189,248,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#1B68FF]/20 blur-[150px]"
        />

        <div className="relative z-10 max-w-[1240px] mx-auto">
          {/* Section Header — Rata Kanan Kiri */}
          <RevealOnScroll>
            <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-6 mb-12 pb-6 border-b border-white/10">
              <div className="lg:col-span-6">
                <span className="font-mono text-[12px] uppercase tracking-[0.15em] text-[#38BDF8] block mb-2">
                  ARSITEKTUR EVALUASI • 04 TAHAP
                </span>
                <h2 className="text-[32px] sm:text-[44px] font-semibold tracking-[-0.035em] leading-[1.1] text-white text-left">
                  Alur Ketuntasan Materi &amp; Ujian
                </h2>
              </div>
              <div className="lg:col-span-6">
                <p className="text-[15px] sm:text-[16px] text-slate-300 leading-[1.65] text-justify">
                  Setiap siswa melewati empat tahapan berurutan mulai dari
                  pemetaan kemampuan dasar, penguasaan materi Matematika dan
                  Bahasa Indonesia, latihan tiga tingkat kesulitan, hingga
                  simulasi ujian akhir.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* 3-COLUMN ASYMMETRIC BENTO GRID (Persis Komposisi Banevox) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* KOLOM 1 (KIRI - 4 COL): Kartu Visual Atas + Blok Angka Biru Terang Bawah */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <RevealOnScroll delay={40} className="flex-1">
                <div className="h-full rounded-[28px] bg-gradient-to-b from-[#DCE7F9] to-[#B8CDF0] text-[#06102B] p-7 flex flex-col justify-between relative overflow-hidden min-h-[340px]">
                  <div className="relative z-10">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#06102B]/10 text-[#06102B]">
                      TAHAP 01 • DIAGNOSTIK
                    </span>
                    <h3 className="text-[26px] sm:text-[28px] font-semibold tracking-[-0.03em] leading-[1.15] mt-4">
                      Recall Kemampuan Awal
                    </h3>
                    <p className="text-[32px] sm:text-[36px] font-bold tracking-[-0.04em] text-[#1B68FF] leading-none mt-1">
                      30 Butir Soal.
                    </p>
                    <p className="text-[14px] text-[#1E293B] leading-[1.6] text-justify mt-4">
                      Mengukur penguasaan materi dasar Matematika dan Bahasa
                      Indonesia sebelum membuka seluruh topik latihan Fase D.
                    </p>
                  </div>

                  {/* Vector Perspective Highway/Bridge Graphic */}
                  <svg
                    viewBox="0 0 320 110"
                    fill="none"
                    className="w-full h-24 mt-6 opacity-85"
                  >
                    <path
                      d="M0 110 L130 20 L190 20 L320 110 Z"
                      fill="#081538"
                    />
                    <path
                      d="M160 20 L160 110"
                      stroke="#38BDF8"
                      strokeWidth="3"
                      strokeDasharray="8 6"
                    />
                    <path
                      d="M70 110 L145 20 M250 110 L175 20"
                      stroke="#1B68FF"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </RevealOnScroll>

              {/* Blok Bawah Kolom 1: Giant Architectural Glyph */}
              <RevealOnScroll delay={100}>
                <div className="rounded-[28px] bg-[#38BDF8] text-[#050C1E] p-7 flex items-center justify-between min-h-[175px] relative overflow-hidden">
                  <div className="max-w-[55%]">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider block opacity-75">
                      SYARAT KELULUSAN
                    </span>
                    <p className="text-[15px] font-semibold leading-[1.45] mt-1 text-justify">
                      Batas minimal ketuntasan di setiap tahap evaluasi.
                    </p>
                  </div>
                  <span className="text-[64px] sm:text-[76px] font-extrabold tracking-[-0.06em] leading-none select-none">
                    90%
                  </span>
                </div>
              </RevealOnScroll>
            </div>

            {/* KOLOM 2 (TENGAH - 4 COL): Kartu Vertikal Utama + Brand Lockup di Bawah */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-6">
              <RevealOnScroll delay={80} className="flex-1">
                <div className="h-full rounded-[28px] bg-gradient-to-b from-[#0D255C] via-[#09193E] to-[#07122E] border border-[#38BDF8]/25 p-7 flex flex-col justify-between relative overflow-hidden min-h-[400px]">
                  {/* Vector Wave Lines */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 360 200"
                    fill="none"
                    className="pointer-events-none absolute inset-x-0 top-12 w-full opacity-35"
                  >
                    <path
                      d="M-20 120 C 90 30, 250 190, 380 60"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M-20 160 C 110 60, 230 210, 380 95"
                      stroke="#1B68FF"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Top Pill Header */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-[#38BDF8] text-[#050C1E] font-mono text-[13px] font-extrabold flex items-center justify-center">
                        3
                      </span>
                      <span className="text-[13px] font-medium text-slate-200">
                        Latihan Berjenjang
                      </span>
                    </div>
                    <span className="font-mono text-[12px] text-[#38BDF8]">
                      L1 • L2 • L3
                    </span>
                  </div>

                  {/* Center Headline */}
                  <div className="relative z-10 my-6 text-center">
                    <h3 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.15] text-white">
                      Tiga Level
                      <span className="block text-[#38BDF8]">
                        Kognitif Siswa
                      </span>
                    </h3>
                  </div>

                  {/* 3 Level Stack Cards */}
                  <div className="relative z-10 space-y-2.5">
                    <div className="p-3.5 rounded-[16px] bg-white/8 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[11px] text-[#38BDF8] block">
                          LEVEL 01
                        </span>
                        <span className="text-[14px] font-medium text-white">
                          Pemahaman Konsep Dasar
                        </span>
                      </div>
                      <span className="font-mono text-[12px] text-emerald-400">
                        10 Soal
                      </span>
                    </div>
                    <div className="p-3.5 rounded-[16px] bg-white/8 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[11px] text-[#38BDF8] block">
                          LEVEL 02
                        </span>
                        <span className="text-[14px] font-medium text-white">
                          Penerapan Kasus Kontekstual
                        </span>
                      </div>
                      <span className="font-mono text-[12px] text-emerald-400">
                        10 Soal
                      </span>
                    </div>
                    <div className="p-3.5 rounded-[16px] bg-[#1B68FF]/30 border border-[#38BDF8]/40 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[11px] text-[#38BDF8] block">
                          LEVEL 03 • HOTS
                        </span>
                        <span className="text-[14px] font-medium text-white">
                          Penalaran &amp; Analisis Kritis
                        </span>
                      </div>
                      <span className="font-mono text-[12px] text-white font-semibold">
                        10 Soal
                      </span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Bottom Brand Lockup (Persis Banevox Architecture) */}
              <RevealOnScroll delay={140}>
                <div className="rounded-[24px] bg-white/5 border border-white/10 py-5 px-6 text-center">
                  <p className="text-[26px] font-bold tracking-[-0.04em] text-white leading-none">
                    AGRA<span className="text-[#38BDF8]">CBT</span>
                  </p>
                  <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-slate-400 mt-1.5">
                    FASE D ARCHITECTURE
                  </p>
                </div>
              </RevealOnScroll>
            </div>

            {/* KOLOM 3 (KANAN - 4 COL): Kartu Perspektif + 3-Segment Bar + Kartu 75 Menit */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-6">
              <RevealOnScroll delay={120}>
                <div className="rounded-[28px] bg-gradient-to-br from-[#0F296B] to-[#08163B] border border-white/15 p-7 relative overflow-hidden">
                  <span className="font-mono text-[11px] text-[#38BDF8] uppercase tracking-wider">
                    CAKUPAN KURIKULUM
                  </span>
                  <h3 className="text-[26px] font-bold tracking-[-0.03em] text-white mt-1">
                    16 Submateri Inti
                  </h3>
                  <p className="text-[14px] text-slate-300 leading-[1.6] text-justify mt-2">
                    Terbagi rata menjadi 8 submateri Matematika dan 8 submateri
                    Bahasa Indonesia sesuai kisi-kisi SMP/MTs.
                  </p>
                </div>
              </RevealOnScroll>

              {/* 3-Segment Progress Bar (Persis Referensi Banevox) */}
              <RevealOnScroll delay={150}>
                <div className="grid grid-cols-3 gap-2 p-2 rounded-full bg-white/5 border border-white/10">
                  <div className="h-3.5 rounded-full bg-[#38BDF8]" />
                  <div className="h-3.5 rounded-full bg-[#1B68FF]" />
                  <div className="h-3.5 rounded-full bg-white/20" />
                </div>
              </RevealOnScroll>

              {/* Kartu Bawah Kolom 3: Simulasi 75 Menit */}
              <RevealOnScroll delay={180} className="flex-1">
                <div className="h-full rounded-[28px] bg-[#1B68FF] text-white p-7 flex flex-col justify-between min-h-[250px] relative overflow-hidden shadow-[0_20px_50px_rgba(27,104,255,0.3)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[12px] uppercase tracking-wider text-blue-100 block">
                        UJIAN AKHIR MANDIRI
                      </span>
                      <h3 className="text-[22px] font-semibold tracking-[-0.02em] leading-[1.25] mt-1">
                        Simulasi CBT
                        <span className="block">Terjadwal</span>
                      </h3>
                    </div>

                    {/* Circular Icon Badge */}
                    <div className="w-12 h-12 rounded-full bg-white text-[#1B68FF] flex items-center justify-center shrink-0 shadow-md">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-[54px] sm:text-[64px] font-extrabold tracking-[-0.05em] leading-none">
                      75<span className="text-[28px] font-semibold ml-1">mnt</span>
                    </div>
                    <p className="font-mono text-[12px] uppercase tracking-wider text-blue-100 mt-2">
                      30 SOAL ACAK • PEMBAHASAN LENGKAP
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. PANEL SIMULASI INTERAKTIF (GAYA "WHAT IS BRANDING DESIGNER?")
             - Panggung Biru #1B68FF dengan Grid Kotak-Kotak Vektor
             - Pill Badge Tegas + Teks Rata Kanan-Kiri di Kiri
             - Kartu 3D Miring (Tilted Card) dengan Vektor Bezier di Kanan
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="simulasi"
        className="relative w-full py-20 sm:py-28 px-5 sm:px-10 lg:px-16 bg-[#1B68FF] text-white overflow-hidden"
      >
        {/* Architectural Square Grid Pattern Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 max-w-[1240px] mx-auto">
          {/* Top Bar inside Section (Persis Free E-Course + URL di Referensi) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <span className="px-5 py-2 rounded-full bg-white text-[#0A0D14] font-semibold text-[14px] border-2 border-[#0A0D14] shadow-[4px_4px_0px_#0A0D14]">
              Simulasi Interaktif CBT
            </span>
            <span className="font-mono text-[14px] text-blue-100">
              MAT-08 • Aritmetika Sosial Level 3
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* KIRI (6 COL): Display Title + Soal & Pilihan Jawaban */}
            <div className="lg:col-span-6 space-y-6">
              <RevealOnScroll>
                <h2 className="text-[40px] sm:text-[54px] lg:text-[62px] font-bold tracking-[-0.04em] leading-[1.03] text-white text-left">
                  Uji Coba Soal
                  <span className="block text-[#7DD3FC]">
                    &amp; Kunci Nalar?
                  </span>
                </h2>
              </RevealOnScroll>

              <RevealOnScroll delay={60}>
                <p className="text-[15px] sm:text-[16px] text-blue-50 leading-[1.65] text-justify">
                  Sebuah toko buku memberikan promo bertingkat bertuliskan
                  Diskon 50% + 20% untuk paket buku persiapan ujian seharga
                  Rp400.000,00. Pilih salah satu jawaban di bawah ini untuk
                  melihat cara kerja evaluasi jawaban pada kartu di samping.
                </p>
              </RevealOnScroll>

              {/* Pilihan Opsi Jawaban Interaktif */}
              <RevealOnScroll delay={120}>
                <div className="space-y-3 pt-2">
                  {SAMPLE_OPTIONS.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedOption(opt.id)}
                        className={`w-full text-left p-4 rounded-[16px] border-2 transition-all flex items-start gap-3.5 cursor-pointer ${
                          isSelected
                            ? "bg-white text-[#0A0D14] border-[#0A0D14] shadow-[5px_5px_0px_#0A0D14] -translate-y-0.5"
                            : "bg-[#1454D6]/80 hover:bg-[#1454D6] text-white border-white/25"
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-[10px] font-mono text-[14px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-[#1B68FF] text-white"
                              : "bg-white/15 text-white"
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="text-[14px] sm:text-[15px] leading-[1.55] text-justify flex-1">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </RevealOnScroll>
            </div>

            {/* KANAN (6 COL): TILTED 3D CARD DENGAN VEKTOR BEZIER (Persis Referensi Panel 3) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <RevealOnScroll delay={140} className="w-full max-w-[480px]">
                <div className="bg-white text-[#0A0D14] rounded-[28px] p-5 sm:p-6 border-2 border-[#0A0D14] shadow-[14px_18px_0px_rgba(5,12,30,0.45)] lg:-rotate-3 hover:rotate-0 transition-transform duration-500">
                  {/* Card Top Bar */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#050C1E] text-[#38BDF8] font-mono text-[13px] font-bold flex items-center justify-center">
                        CBT
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#0A0D14] leading-tight">
                          Evaluasi Nalar AGRA
                        </p>
                        <p className="text-[12px] text-slate-500">
                          Timer: {formatTime(secondsLeft)} • Opsi {selectedOption}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                        chosenOptionObj?.isCorrect
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {chosenOptionObj?.isCorrect
                        ? "Jawaban Tepat"
                        : "Perlu Evaluasi"}
                    </span>
                  </div>

                  {/* Dark 3D Vector Canvas Inside Card (Seperti Vektor Pen Tool di Referensi) */}
                  <div className="rounded-[20px] bg-gradient-to-br from-[#06122E] via-[#0B2154] to-[#050C1E] p-5 text-white relative overflow-hidden">
                    {/* Vector Bezier Curve & Control Handles */}
                    <svg
                      viewBox="0 0 400 130"
                      fill="none"
                      className="w-full h-28 mb-3"
                    >
                      {/* Grid inside dark canvas */}
                      <line
                        x1="0"
                        y1="65"
                        x2="400"
                        y2="65"
                        stroke="rgba(255,255,255,0.08)"
                      />
                      {/* Bezier Handle Lines */}
                      <line
                        x1="70"
                        y1="95"
                        x2="140"
                        y2="20"
                        stroke="#38BDF8"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="330"
                        y1="95"
                        x2="260"
                        y2="20"
                        stroke="#38BDF8"
                        strokeWidth="1.5"
                      />
                      {/* Main Bezier Curve */}
                      <path
                        d="M 70 95 C 140 20, 260 20, 330 95"
                        stroke="#38BDF8"
                        strokeWidth="3.5"
                        fill="none"
                      />
                      {/* Control Anchor Nodes */}
                      <rect
                        x="63"
                        y="88"
                        width="14"
                        height="14"
                        rx="3"
                        fill="#1B68FF"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <rect
                        x="323"
                        y="88"
                        width="14"
                        height="14"
                        rx="3"
                        fill="#10B981"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <circle cx="140" cy="20" r="5" fill="#38BDF8" />
                      <circle cx="260" cy="20" r="5" fill="#38BDF8" />
                      <circle
                        cx="200"
                        cy="38"
                        r="8"
                        fill="#FFFFFF"
                        stroke="#1B68FF"
                        strokeWidth="3"
                      />
                    </svg>

                    <div className="font-mono text-[13px] bg-white/10 rounded-[12px] p-3.5 space-y-1 text-blue-50">
                      <div>Tahap 1: 50% × Rp400.000 = Rp200.000</div>
                      <div>Tahap 2: Rp200.000 - (20% × Rp200.000)</div>
                      <div className="text-[#38BDF8] font-bold pt-1">
                        Harga Akhir = Rp160.000,00
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Feedback Description — Rata Kanan-Kiri */}
                  <div className="mt-4 space-y-3">
                    <p className="text-[14px] text-[#334155] leading-[1.6] text-justify">
                      {chosenOptionObj?.feedback}
                    </p>
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="font-mono text-[12px] text-slate-500">
                        480+ SOAL TERSEDIA
                      </span>
                      <button
                        type="button"
                        onClick={() => handleNavigate("/register")}
                        className="px-4 py-2 rounded-[10px] bg-[#0A0D14] hover:bg-[#1B68FF] text-white text-[13px] font-semibold transition-colors cursor-pointer"
                      >
                        Buka Ruang Simulasi →
                      </button>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. PANEL KURIKULUM: MATEMATIKA & BAHASA INDONESIA (#kurikulum)
             - Kotak Penjelasan Dua Mapel + 16 Kotak Submateri Rata Kanan-Kiri
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="kurikulum"
        className="relative w-full py-20 sm:py-28 px-5 sm:px-10 lg:px-16 bg-[#F4F7FC]"
      >
        <div className="max-w-[1240px] mx-auto">
          <RevealOnScroll>
            <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-6 mb-10">
              <div className="lg:col-span-7">
                <span className="font-mono text-[12px] uppercase tracking-[0.15em] text-[#1B68FF] font-semibold block mb-2">
                  KURIKULUM FASE D • SMP/MTS
                </span>
                <h2 className="text-[32px] sm:text-[44px] font-semibold tracking-[-0.035em] leading-[1.1] text-[#0A0D14] text-left">
                  Cakupan Materi Matematika &amp; Bahasa Indonesia
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-[15px] sm:text-[16px] text-[#334155] leading-[1.65] text-justify">
                  Pilih domain mata pelajaran di bawah ini untuk melihat rincian
                  8 submateri Matematika dan 8 submateri Bahasa Indonesia beserta
                  target ketuntasannya.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Dua Kotak Penjelasan Domain (Matematika & Bahasa Indonesia) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <RevealOnScroll delay={40}>
              <div
                onClick={() => setActiveDomain("numerasi")}
                className={`rounded-[26px] p-7 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  activeDomain === "numerasi"
                    ? "bg-[#050C1E] text-white border-[#050C1E] shadow-[0_18px_40px_rgba(5,12,30,0.16)]"
                    : "bg-white text-[#0A0D14] border-slate-200 hover:border-[#1B68FF]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[12px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#1B68FF] text-white">
                      DOMAIN 01 • NUMERASI
                    </span>
                    <span className="font-mono text-[13px] opacity-80">
                      8 Submateri • 240 Soal
                    </span>
                  </div>
                  <h3 className="text-[24px] sm:text-[26px] font-semibold tracking-[-0.025em]">
                    Matematika SMP
                  </h3>
                  <p
                    className={`text-[14px] sm:text-[15px] leading-[1.65] text-justify mt-2.5 ${
                      activeDomain === "numerasi"
                        ? "text-slate-300"
                        : "text-[#334155]"
                    }`}
                  >
                    Menguji kemampuan berhitung, pemodelan aljabar, pengukuran
                    geometri, pengolahan data statistika, hingga penyelesaian
                    masalah aritmetika sosial.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between text-[13px] font-semibold">
                  <span>
                    {activeDomain === "numerasi"
                      ? "Sedang Ditampilkan di Bawah"
                      : "Klik untuk Menampilkan Topik"}
                  </span>
                  <span>→</span>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={90}>
              <div
                onClick={() => setActiveDomain("literasi")}
                className={`rounded-[26px] p-7 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  activeDomain === "literasi"
                    ? "bg-[#1B68FF] text-white border-[#1B68FF] shadow-[0_18px_40px_rgba(27,104,255,0.24)]"
                    : "bg-white text-[#0A0D14] border-slate-200 hover:border-[#1B68FF]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`font-mono text-[12px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        activeDomain === "literasi"
                          ? "bg-white text-[#1B68FF]"
                          : "bg-[#EEF2FA] text-[#1B68FF]"
                      }`}
                    >
                      DOMAIN 02 • LITERASI MEMBACA
                    </span>
                    <span className="font-mono text-[13px] opacity-80">
                      8 Submateri • 240 Soal
                    </span>
                  </div>
                  <h3 className="text-[24px] sm:text-[26px] font-semibold tracking-[-0.025em]">
                    Bahasa Indonesia SMP
                  </h3>
                  <p
                    className={`text-[14px] sm:text-[15px] leading-[1.65] text-justify mt-2.5 ${
                      activeDomain === "literasi"
                        ? "text-blue-50"
                        : "text-[#334155]"
                    }`}
                  >
                    Menguji ketepatan menemukan informasi tersurat, menyimpulkan
                    makna tersirat, mengevaluasi struktur wacana, membandingkan
                    infografik, serta mengkaji teks sastra dan eksposisi.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-current/15 flex items-center justify-between text-[13px] font-semibold">
                  <span>
                    {activeDomain === "literasi"
                      ? "Sedang Ditampilkan di Bawah"
                      : "Klik untuk Menampilkan Topik"}
                  </span>
                  <span>→</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Grid 8 Submateri Aktif — Kotak Bento Rata Kanan-Kiri */}
          <div
            key={activeDomain}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 tabular-nums"
          >
            {activeItems.map((item, idx) => (
              <RevealOnScroll key={item.code} delay={idx * 35}>
                <div className="group h-full bg-white hover:bg-[#050C1E] rounded-[24px] p-6 border border-slate-200/90 hover:border-[#050C1E] transition-all duration-300 flex flex-col justify-between shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-10 h-10 rounded-[12px] bg-[#EEF2FA] group-hover:bg-[#1B68FF] text-[#1B68FF] group-hover:text-white font-mono text-[15px] font-bold flex items-center justify-center transition-colors">
                        {item.code}
                      </span>
                      <span className="font-mono text-[12px] font-semibold px-2.5 py-1 rounded-md bg-emerald-50 group-hover:bg-white/10 text-[#065F46] group-hover:text-[#38BDF8] transition-colors">
                        Lulus {item.passRate}
                      </span>
                    </div>

                    <h4 className="text-[18px] font-semibold tracking-[-0.02em] text-[#0A0D14] group-hover:text-white transition-colors text-left">
                      {item.title}
                    </h4>

                    <p className="text-[14px] text-[#334155] group-hover:text-slate-300 leading-[1.6] text-justify mt-2.5 transition-colors">
                      {item.scope}
                    </p>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-slate-100 group-hover:border-white/10 flex items-center justify-between text-[12px] font-mono text-slate-500 group-hover:text-slate-400">
                    <span>3 LEVEL (L1–L3)</span>
                    <span className="font-semibold text-[#0A0D14] group-hover:text-white">
                      {item.itemsCount} Butir Soal
                    </span>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. CLOSING STAGE & FOOTER — Rata Kanan-Kiri
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full pt-4 pb-16 px-5 sm:px-10 lg:px-16 bg-[#F4F7FC]">
        <div className="max-w-[1240px] mx-auto">
          <RevealOnScroll>
            <div className="rounded-[32px] bg-[#050C1E] text-white p-8 sm:p-12 lg:p-14 border border-white/10 relative overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -bottom-20 w-[380px] h-[380px] rounded-full bg-[#1B68FF]/30 blur-[100px]"
              />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
                <div className="lg:col-span-8">
                  <span className="font-mono text-[12px] uppercase tracking-[0.15em] text-[#38BDF8] block mb-2">
                    MULAI SEKARANG
                  </span>
                  <h2 className="text-[30px] sm:text-[42px] font-semibold tracking-[-0.035em] leading-[1.1] text-white text-left mb-3">
                    Siap Mengukur Penguasaan Materi TKA?
                  </h2>
                  <p className="text-[15px] sm:text-[16px] text-slate-300 leading-[1.65] text-justify">
                    Buat akun siswa untuk memulai 30 soal diagnostik prasyarat,
                    membuka seluruh 16 submateri Matematika dan Bahasa Indonesia,
                    serta mengerjakan simulasi CBT 75 menit.
                  </p>
                </div>

                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => handleNavigate("/register")}
                    className="min-h-[48px] px-6 py-3 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] text-white text-[15px] font-semibold transition-all shadow-[0_12px_28px_rgba(27,104,255,0.3)] inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Daftar Akun Siswa</span>
                    <span>→</span>
                  </button>
                  <Link
                    href="/login"
                    className="min-h-[48px] px-6 py-3 rounded-[14px] bg-white/10 hover:bg-white/15 border border-white/20 text-white text-[15px] font-medium transition-all inline-flex items-center justify-center"
                  >
                    Masuk ke Akun
                  </Link>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <footer className="mt-12 pt-6 border-t border-slate-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[14px] text-[#334155]">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/images/agra-icon.png"
                alt="Logo AGRA"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="w-6 h-6 object-contain"
              />
              <span className="text-[18px] font-bold tracking-[-0.04em] text-[#0A0D14]">
                AGRA.
              </span>
              <span>
                — Ruang Belajar &amp; Simulasi Mandiri Tes Kemampuan Akademik SMP
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <a href="#tahapan" className="hover:text-[#0A0D14]">
                Alur Sistem
              </a>
              <a href="#simulasi" className="hover:text-[#0A0D14]">
                Simulasi CBT
              </a>
              <a href="#kurikulum" className="hover:text-[#0A0D14]">
                16 Submateri
              </a>
              <Link href="/login" className="hover:text-[#0A0D14]">
                Masuk
              </Link>
              <span>© 2026 AGRA</span>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
