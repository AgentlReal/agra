"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TopicSummary {
  num: string;
  title: string;
  desc: string;
}

const MATEMATIKA_TOPICS: TopicSummary[] = [
  {
    num: "01",
    title: "Bilangan & Aljabar",
    desc: "Operasi bilangan bulat, pecahan, bentuk aljabar, serta persamaan dan pertidaksamaan linear.",
  },
  {
    num: "02",
    title: "Geometri & Pengukuran",
    desc: "Teorema Pythagoras, sifat sudut, bangun datar, serta luas permukaan dan volume bangun ruang.",
  },
  {
    num: "03",
    title: "Statistika & Peluang",
    desc: "Interpretasi diagram data, ukuran pemusatan rata-rata, median, modus, serta peluang kejadian.",
  },
  {
    num: "04",
    title: "Aritmetika & Perbandingan",
    desc: "Perbandingan senilai, skala peta, barisan bilangan, serta perhitungan diskon dan untung-rugi.",
  },
];

const BAHASA_TOPICS: TopicSummary[] = [
  {
    num: "01",
    title: "Informasi & Simpulan Teks",
    desc: "Penemuan gagasan utama, informasi tersurat, serta penarikan simpulan tersirat dari wacana.",
  },
  {
    num: "02",
    title: "Struktur & Kepaduan Wacana",
    desc: "Kepaduan antarparagraf, penggunaan konjungsi, kalimat efektif, dan ketepatan ejaan.",
  },
  {
    num: "03",
    title: "Evaluasi Fakta & Infografik",
    desc: "Pembedaan kalimat fakta dan opini, penilaian argumen, serta pembacaan tabel dan grafik.",
  },
  {
    num: "04",
    title: "Apresiasi Sastra & Eksposisi",
    desc: "Analisis watak tokoh, konflik, amanat cerita, serta bedah struktur teks laporan dan eksposisi.",
  },
];

const SAMPLE_OPTIONS = [
  {
    id: "A",
    text: "Rp136.000,00 karena potongan kedua dihitung dari harga awal sebelum potongan pertama.",
    isCorrect: false,
    step1: "Potongan 1 (50%): Rp400.000 × 50% = Rp200.000",
    step2: "Keliru jika diskon digabung langsung 50% + 20% = 70%",
    conclusion: "Jawaban belum tepat, ulangi perhitungan diskon kedua.",
    feedback:
      "Diskon bertingkat 50% + 20% tidak dijumlahkan langsung menjadi 70%, tetapi dihitung secara berurutan dari sisa harga setelah potongan pertama.",
  },
  {
    id: "B",
    text: "Rp160.000,00 karena diskon 20% dihitung dari sisa harga setelah dipotong 50%.",
    isCorrect: true,
    step1: "Harga setelah diskon 50%: Rp400.000 - Rp200.000 = Rp200.000",
    step2: "Diskon kedua 20%: Rp200.000 - (20% × Rp200.000) = Rp160.000",
    conclusion: "Harga Akhir = Rp160.000,00",
    feedback:
      "Harga awal Rp400.000,00 dipotong 50% menjadi Rp200.000,00. Diskon kedua 20% dihitung dari Rp200.000,00 yaitu Rp40.000,00, sehingga harga akhirnya Rp160.000,00.",
  },
  {
    id: "C",
    text: "Rp120.000,00 karena total potongan harga mencapai 70% dari harga label toko.",
    isCorrect: false,
    step1: "Jika 70% dipotong langsung: Rp400.000 - Rp280.000 = Rp120.000",
    step2: "Konsep salah: diskon kedua berlaku atas harga setelah diskon pertama",
    conclusion: "Jawaban belum tepat, perhatikan aturan diskon bertingkat.",
    feedback:
      "Menjumlahkan persentase diskon 50% + 20% menjadi 70% secara langsung adalah kekeliruan konsep pada soal Aritmetika Sosial.",
  },
];

/**
 * Komponen Scroll Depth 3D:
 * Memberikan efek masuk (enter dari bawah) DAN keluar (exit ke atas)
 * beserta kedalaman perspektif 3D secara real-time saat halaman di-scroll.
 */
function ScrollDepthBox({
  children,
  className = "",
  speed = 0.08,
  tilt = false,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;

    const updateDepth = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      const norm = Math.max(-1.2, Math.min(1.2, centerOffset / (vh * 0.65)));

      // Efek masuk dari bawah & keluar di atas
      const distance = Math.abs(norm);
      const scale = Math.max(0.92, 1 - distance * 0.065);
      const opacity = Math.max(0.25, Math.min(1, 1.15 - distance * 0.55));
      const translateY = norm * (speed * 420);
      const rotateX = tilt ? norm * -8 : norm * -3.5;

      el.style.transform = `perspective(1200px) translate3d(0, ${translateY.toFixed(
        1
      )}px, 0) scale(${scale.toFixed(3)}) rotateX(${rotateX.toFixed(2)}deg)`;
      el.style.opacity = opacity.toFixed(3);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDepth);
    };

    updateDepth();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed, tilt]);

  return (
    <div
      ref={ref}
      style={{
        transition: "transform 120ms cubic-bezier(0.16, 1, 0.3, 1), opacity 120ms linear",
        willChange: "transform, opacity",
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
  const mainRef = useRef<HTMLElement>(null);
  const [activeDomain, setActiveDomain] = useState<"numerasi" | "literasi">(
    "numerasi"
  );
  const [selectedOption, setSelectedOption] = useState<string>("B");
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);

  // Smooth 60fps Scroll & Pointer Parallax Variables for Hero 3D
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    let rafId = 0;
    let targetSy = 0;
    let currentSy = 0;
    let targetMx = 0;
    let targetMy = 0;
    let currentMx = 0;
    let currentMy = 0;

    const onScroll = () => {
      targetSy = window.scrollY;
    };

    const onMouseMove = (e: MouseEvent) => {
      targetMx = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMy = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      currentSy += (targetSy - currentSy) * 0.12;
      currentMx += (targetMx - currentMx) * 0.08;
      currentMy += (targetMy - currentMy) * 0.08;

      el.style.setProperty("--sy", currentSy.toFixed(2));
      el.style.setProperty("--mx", currentMx.toFixed(4));
      el.style.setProperty("--my", currentMy.toFixed(4));
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNavigate = (href: string) => {
    setLoadingRoute(href);
    router.push(href);
  };

  const activeTopics =
    activeDomain === "numerasi" ? MATEMATIKA_TOPICS : BAHASA_TOPICS;
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
      {/* ═══════════════════════════════════════════════════════════════════
          1. NAVBAR ATAS — Posisi Tetap Seperti Semula + Logo Seamless Tanpa Kotak
         ═══════════════════════════════════════════════════════════════════ */}
      <header className="absolute top-0 inset-x-0 z-50 w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center px-6 sm:px-12 lg:px-16 pt-6 pb-4">
          <div className="lg:col-span-6 flex items-center justify-between lg:justify-start gap-10">
            <Link
              href="/"
              className="min-h-[48px] inline-flex items-center gap-2.5 group"
            >
              <img
                src="/assets/images/agra-icon.png"
                alt="Logo AGRA"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="text-[26px] font-semibold tracking-[-0.04em] text-[#0A0D14] flex items-center">
                AGRA
                <span className="inline-block w-2 h-2 rounded-full bg-[#1B68FF] ml-1" />
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <a
                href="#alur"
                className="min-h-[48px] px-4 inline-flex items-center rounded-[12px] text-[16px] font-medium text-[#334155] hover:text-[#0A0D14] hover:bg-slate-200/50 transition-colors"
              >
                Alur Belajar
              </a>
              <a
                href="#simulasi"
                className="min-h-[48px] px-4 inline-flex items-center rounded-[12px] text-[16px] font-medium text-[#334155] hover:text-[#0A0D14] hover:bg-slate-200/50 transition-colors"
              >
                Simulasi CBT
              </a>
              <a
                href="#submateri"
                className="min-h-[48px] px-4 inline-flex items-center rounded-[12px] text-[16px] font-medium text-[#334155] hover:text-[#0A0D14] hover:bg-slate-200/50 transition-colors"
              >
                Kurikulum
              </a>
            </nav>
          </div>

          <div className="hidden lg:flex lg:col-span-6 items-center justify-end gap-4">
            <Link
              href="/login"
              className="min-h-[48px] px-6 py-2.5 rounded-[14px] border-2 border-white/50 hover:border-white hover:bg-white/10 text-[16px] font-medium text-white transition-all inline-flex items-center justify-center"
            >
              Masuk ke Akun
            </Link>

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
          2. HERO SECTION — 50/50 SPLIT + "ASESMEN MANDIRI" UTUH + 3D PARALLAX
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full lg:min-h-screen flex flex-col justify-between overflow-hidden bg-[#F4F7FC]">
        {/* Desktop 50/50 Split Background dengan Tekstur Grid Halus */}
        <div className="hidden lg:grid absolute inset-0 grid-cols-12 pointer-events-none">
          <div
            className="col-span-6 bg-[#F4F7FC]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(15,23,42,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(15,23,42,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "56px 56px",
            }}
          />
          <div className="col-span-6 bg-gradient-to-br from-[#2370FF] via-[#1B68FF] to-[#0D4EE0] rounded-bl-[64px] min-h-[580px] relative overflow-hidden">
            {/* 3D Depth Halo Glow di Belakang Anak SMP (Tidak Menutupi Teks!) */}
            <div
              style={{
                transform:
                  "translate3d(calc(var(--mx) * -18px), calc(var(--sy) * 0.14px), 0)",
              }}
              className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-[540px] h-[540px] rounded-full bg-gradient-to-t from-[#38BDF8]/55 via-white/20 to-transparent blur-2xl"
            />
          </div>
        </div>

        <div className="relative z-20 w-full pt-24 sm:pt-32 lg:pt-36 flex-1 flex flex-col justify-between">
          {/* TOP GIANT HEADLINE: "AGRA" + NAMETAG + "Asesmen Mandiri" */}
          <div
            style={{
              transform:
                "translate3d(calc(var(--mx) * -8px), calc(var(--sy) * 0.15px), 0)",
            }}
            className="relative w-full will-change-transform"
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-end px-5 sm:px-12 lg:px-16 gap-3 sm:gap-6">
              <div className="lg:col-span-6 flex lg:justify-start">
                <h1 className="-ml-[0.04em] text-[4rem] sm:text-[6.5rem] lg:text-[9.2vw] font-normal tracking-[-0.055em] leading-[0.88] text-[#0A0D14] select-none">
                  AGRA
                </h1>
              </div>

              {/* Nametag: Ruang Belajar & Simulasi Mandiri Tes Kemampuan Akademik SMP */}
              <div className="lg:col-span-6 flex lg:justify-start lg:pl-6 lg:pb-3 order-3 lg:order-none mt-2 lg:mt-0">
                <p className="max-w-[460px] text-[16px] sm:text-[20px] lg:text-[22px] font-medium leading-[1.45] text-[#0A0D14] lg:text-white">
                  Ruang Belajar &amp; Simulasi Mandiri{" "}
                  <span className="block text-[#475569] lg:text-blue-50 font-normal">
                    Tes Kemampuan Akademik SMP.
                  </span>
                </p>
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

          {/* BOTTOM ROW: KARTU KIRI RATA KANAN-KIRI + ANAK SMP 3D DI KANAN */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-end px-5 sm:px-12 lg:px-16 gap-8 lg:gap-10 mt-6 sm:mt-8 lg:mt-4">
            <div className="lg:col-span-6 pb-2 lg:pb-20 lg:pr-8 relative z-30">
              <div
                style={{
                  transform:
                    "translate3d(calc(var(--mx) * 8px), calc(var(--sy) * -0.05px), 0)",
                }}
                className="bg-white/80 rounded-[28px] sm:rounded-[32px] p-2.5 sm:p-3 shadow-[0_20px_50px_rgba(15,23,42,0.06)] border border-white max-w-[600px] will-change-transform"
              >
                <div className="bg-white rounded-[20px] p-6 sm:p-10 border border-slate-200/80">
                  <h2 className="text-[24px] sm:text-[26px] font-medium tracking-[-0.025em] leading-[1.3] text-[#0A0D14] mb-4 text-left">
                    Persiapan Terukur dari Diagnostik hingga Ujian CBT
                  </h2>

                  <p className="text-[16px] font-normal leading-[1.65] text-[#334155] text-justify mb-8">
                    Dirancang agar siswa fokus menguasai materi inti Fase D
                    secara bertahap. Evaluasi dimulai dari pemetaan kemampuan
                    awal dengan syarat lulus 90%, dilanjutkan latihan tiga level
                    kognitif pada setiap submateri, hingga simulasi ujian
                    mandiri berdurasi 75 menit.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                    <button
                      type="button"
                      onClick={() => handleNavigate("/register")}
                      disabled={loadingRoute === "/register"}
                      className="min-h-[48px] w-full px-6 py-3 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] active:translate-y-0.5 text-white text-[16px] font-medium transition-all shadow-[0_10px_24px_rgba(27,104,255,0.28)] inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <span>Daftar &amp; Mulai</span>
                      <svg
                        className="w-4 h-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </button>

                    <a
                      href="#simulasi"
                      className="min-h-[48px] w-full px-6 py-3 rounded-[14px] bg-white hover:bg-[#F4F7FC] active:translate-y-0.5 text-[#0A0D14] border-2 border-slate-300 hover:border-[#1B68FF] text-[16px] font-medium transition-all inline-flex items-center justify-center whitespace-nowrap"
                    >
                      <span>Coba Simulasi CBT</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Anak SMP Cutout dengan Efek Kedalaman & Parallax */}
            <div className="lg:col-span-6 relative -mx-5 sm:-mx-12 lg:mx-0 pt-6 sm:pt-10 lg:pt-0 px-4 sm:px-8 lg:px-0 bg-gradient-to-br from-[#2370FF] via-[#1B68FF] to-[#0D4EE0] lg:bg-none rounded-t-[36px] lg:rounded-none flex items-end justify-center lg:justify-start lg:-translate-x-6 xl:-translate-x-12 lg:-mt-64 xl:-mt-80 2xl:-mt-96 z-20 pointer-events-none overflow-hidden lg:overflow-visible">
              <div
                style={{
                  transform:
                    "translate3d(calc(var(--mx) * 20px), calc(var(--sy) * -0.1px + var(--my) * 10px), 0)",
                }}
                className="relative w-full sm:w-[620px] lg:w-[820px] xl:w-[960px] 2xl:w-[1100px] max-w-none h-[300px] sm:h-[460px] lg:h-[700px] xl:h-[820px] 2xl:h-[920px] flex items-end justify-center will-change-transform"
              >
                <SmartStudentCutout />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. SECTION: ALUR KETUNTASAN (#alur)
             - Rata Kanan-Kiri Penuh (w-full px-6 sm:px-12 lg:px-16)
             - Clean, Bold, Tanpa Gambar Jalan & Tanpa Teks Kecil di Ujung-Ujung
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="alur"
        className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-16 bg-[#060E24] text-white overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(56,189,248,0.14) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(56,189,248,0.14) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 w-full">
          <ScrollDepthBox speed={0.05}>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 pb-8 border-b border-white/10">
              <h2 className="text-[36px] sm:text-[50px] lg:text-[62px] font-normal tracking-[-0.04em] leading-[1.05] text-white max-w-3xl">
                Empat Tahap Ketuntasan Belajar
              </h2>
              <p className="text-[16px] sm:text-[17px] font-normal leading-[1.65] text-slate-300 max-w-xl text-justify">
                Seluruh tahapan disusun berurutan. Siswa menuntaskan pemetaan
                awal dan latihan bertingkat sebelum membuka simulasi ujian
                berwaktu.
              </p>
            </div>
          </ScrollDepthBox>

          {/* 3-Column Clean Bold Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Kolom 1 */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ScrollDepthBox speed={0.07} className="flex-1">
                <div className="h-full rounded-[32px] bg-[#E2ECFC] text-[#0A0D14] p-8 sm:p-10 flex flex-col justify-between min-h-[300px]">
                  <span className="text-[52px] sm:text-[64px] font-semibold tracking-[-0.05em] leading-none text-[#1B68FF]">
                    01
                  </span>
                  <div className="mt-8">
                    <h3 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.03em] leading-[1.2] text-[#0A0D14]">
                      Recall Kemampuan
                    </h3>
                    <p className="text-[16px] text-[#334155] leading-[1.6] text-justify mt-3">
                      30 soal diagnostik lintas mata pelajaran untuk memetakan
                      penguasaan materi dasar siswa di awal.
                    </p>
                  </div>
                </div>
              </ScrollDepthBox>

              <ScrollDepthBox speed={0.09}>
                <div className="rounded-[32px] bg-[#38BDF8] text-[#060E24] p-8 sm:p-10 flex items-center justify-between">
                  <span className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.03em] leading-[1.2]">
                    Syarat Lulus
                    <span className="block">Setiap Tahap</span>
                  </span>
                  <span className="text-[64px] sm:text-[76px] font-bold tracking-[-0.05em] leading-none">
                    90%
                  </span>
                </div>
              </ScrollDepthBox>
            </div>

            {/* Kolom 2 */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ScrollDepthBox speed={0.06} tilt className="flex-1">
                <div className="h-full rounded-[32px] bg-gradient-to-b from-[#0E2459] to-[#081538] border border-white/15 p-8 sm:p-10 flex flex-col justify-between min-h-[360px]">
                  <div>
                    <span className="text-[52px] sm:text-[64px] font-semibold tracking-[-0.05em] leading-none text-[#38BDF8]">
                      02
                    </span>
                    <h3 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.03em] leading-[1.2] text-white mt-4">
                      Tiga Level Kognitif
                    </h3>
                  </div>

                  <div className="space-y-3 my-6">
                    <div className="p-4 rounded-[18px] bg-white/10 text-[18px] font-semibold text-white flex items-center justify-between">
                      <span>Level 1 • Pemahaman</span>
                      <span className="text-[#38BDF8]">10 Soal</span>
                    </div>
                    <div className="p-4 rounded-[18px] bg-white/10 text-[18px] font-semibold text-white flex items-center justify-between">
                      <span>Level 2 • Aplikasi</span>
                      <span className="text-[#38BDF8]">10 Soal</span>
                    </div>
                    <div className="p-4 rounded-[18px] bg-[#1B68FF] text-[18px] font-semibold text-white flex items-center justify-between shadow-lg">
                      <span>Level 3 • Penalaran</span>
                      <span>10 Soal</span>
                    </div>
                  </div>
                </div>
              </ScrollDepthBox>

              <ScrollDepthBox speed={0.08}>
                <div className="rounded-[28px] bg-white/5 border border-white/10 py-6 px-8 flex items-center justify-between">
                  <span className="text-[24px] font-semibold tracking-[-0.04em] text-white">
                    AGRA.
                  </span>
                  <span className="text-[16px] font-medium text-slate-300">
                    Fase D SMP/MTs
                  </span>
                </div>
              </ScrollDepthBox>
            </div>

            {/* Kolom 3 */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ScrollDepthBox speed={0.07}>
                <div className="rounded-[32px] bg-[#0B1B42] border border-white/15 p-8 sm:p-10">
                  <span className="text-[52px] sm:text-[64px] font-semibold tracking-[-0.05em] leading-none text-white">
                    03
                  </span>
                  <h3 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.03em] leading-[1.2] text-white mt-4">
                    16 Submateri Inti
                  </h3>
                  <p className="text-[16px] text-slate-300 leading-[1.6] text-justify mt-3">
                    Mencakup 8 submateri Matematika dan 8 submateri Bahasa
                    Indonesia.
                  </p>
                </div>
              </ScrollDepthBox>

              <ScrollDepthBox speed={0.08}>
                <div className="grid grid-cols-3 gap-2.5 p-2 rounded-full bg-white/5 border border-white/10">
                  <div className="h-4 rounded-full bg-[#38BDF8]" />
                  <div className="h-4 rounded-full bg-[#1B68FF]" />
                  <div className="h-4 rounded-full bg-white/20" />
                </div>
              </ScrollDepthBox>

              <ScrollDepthBox speed={0.09} className="flex-1">
                <div className="h-full rounded-[32px] bg-[#1B68FF] text-white p-8 sm:p-10 flex flex-col justify-between min-h-[240px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[52px] sm:text-[64px] font-semibold tracking-[-0.05em] leading-none text-white">
                      04
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-white text-[#1B68FF] text-[15px] font-semibold">
                      75 Menit
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.03em] leading-[1.2] text-white">
                      Simulasi Ujian CBT
                    </h3>
                    <p className="text-[16px] text-blue-50 leading-[1.6] text-justify mt-2">
                      30 soal acak berwaktu dengan pembahasan langkah demi
                      langkah.
                    </p>
                  </div>
                </div>
              </ScrollDepthBox>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. SECTION: SIMULASI INTERAKTIF CBT (#simulasi)
             - Rata Kanan-Kiri Penuh (w-full px-6 sm:px-12 lg:px-16)
             - Font Onest Konsisten & Kartu 3D Interaktif di Kanan
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="simulasi"
        className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-16 bg-[#1B68FF] text-white overflow-hidden"
      >
        {/* Vector Grid Texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.11) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.11) 1px, transparent 1px)
            `,
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative z-10 w-full">
          {/* Header Row — Rata Kanan-Kiri */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
            <span className="px-6 py-2.5 rounded-full bg-white text-[#0A0D14] font-semibold text-[15px] border-2 border-[#0A0D14] shadow-[4px_4px_0px_#0A0D14]">
              Simulasi Interaktif CBT
            </span>
            <span className="text-[16px] font-medium text-blue-50">
              Aritmetika Sosial • Level 3 Penalaran
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* KIRI (6 COL): Rata Kiri Penuh */}
            <ScrollDepthBox speed={0.05} className="lg:col-span-6 space-y-6">
              <h2 className="text-[40px] sm:text-[54px] lg:text-[64px] font-semibold tracking-[-0.04em] leading-[1.03] text-white text-left">
                Uji Coba Soal &amp; Pembahasan
              </h2>

              <p className="text-[16px] sm:text-[17px] text-blue-50 leading-[1.65] text-justify">
                Sebuah toko buku memberikan promo bertingkat bertuliskan Diskon
                50% + 20% untuk paket buku persiapan ujian seharga
                Rp400.000,00. Pilih salah satu opsi jawaban di bawah ini untuk
                melihat evaluasi penyelesaiannya.
              </p>

              <div className="space-y-3.5 pt-2">
                {SAMPLE_OPTIONS.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOption(opt.id)}
                      className={`w-full text-left p-5 rounded-[18px] border-2 transition-all duration-200 flex items-start gap-4 cursor-pointer ${
                        isSelected
                          ? "bg-white text-[#0A0D14] border-[#0A0D14] shadow-[6px_6px_0px_#0A0D14] -translate-y-0.5"
                          : "bg-[#1454D6]/85 hover:bg-[#1454D6] text-white border-white/25"
                      }`}
                    >
                      <span
                        className={`w-9 h-9 rounded-[10px] text-[15px] font-semibold flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-[#1B68FF] text-white"
                            : "bg-white/15 text-white"
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="text-[15px] sm:text-[16px] font-normal leading-[1.6] text-justify flex-1">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollDepthBox>

            {/* KANAN (6 COL): Kartu 3D Miring yang Merapat ke Kanan-Kiri Grid */}
            <ScrollDepthBox
              speed={0.08}
              tilt
              className="lg:col-span-6 w-full"
            >
              <div className="w-full bg-white text-[#0A0D14] rounded-[32px] p-6 sm:p-9 border-2 border-[#0A0D14] shadow-[16px_20px_0px_rgba(6,14,36,0.45)] lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200">
                  <div>
                    <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-[#0A0D14]">
                      Pembahasan Jawaban • Opsi {selectedOption}
                    </h3>
                    <p className="text-[14px] text-slate-500 mt-0.5">
                      Simulasi Evaluasi Langsung
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-[14px] font-semibold ${
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

                {/* Kotak Langkah Perhitungan dengan Font Onest yang Jelas */}
                <div className="rounded-[22px] bg-[#060E24] text-white p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-medium text-[#38BDF8]">
                      Langkah Penyelesaian
                    </span>
                    <span className="text-[14px] font-semibold text-white">
                      Harga Awal Rp400.000
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-white/10 text-[15px] sm:text-[16px]">
                    <div className="p-3.5 rounded-[14px] bg-white/8 text-slate-200">
                      {chosenOptionObj?.step1}
                    </div>
                    <div className="p-3.5 rounded-[14px] bg-white/8 text-slate-200">
                      {chosenOptionObj?.step2}
                    </div>
                    <div
                      className={`p-4 rounded-[14px] font-semibold text-[17px] ${
                        chosenOptionObj?.isCorrect
                          ? "bg-[#1B68FF] text-white"
                          : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                      }`}
                    >
                      {chosenOptionObj?.conclusion}
                    </div>
                  </div>
                </div>

                <p className="text-[15px] sm:text-[16px] text-[#334155] leading-[1.65] text-justify mt-6">
                  {chosenOptionObj?.feedback}
                </p>

                <div className="mt-7 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-[15px] font-semibold text-[#0A0D14]">
                    480+ Soal Latihan &amp; Simulasi
                  </span>
                  <button
                    type="button"
                    onClick={() => handleNavigate("/register")}
                    className="min-h-[46px] px-6 py-2.5 rounded-[12px] bg-[#0A0D14] hover:bg-[#1B68FF] text-white text-[15px] font-semibold transition-colors cursor-pointer"
                  >
                    Buka Simulasi 75 Menit →
                  </button>
                </div>
              </div>
            </ScrollDepthBox>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. SECTION: CAKUPAN MATERI (#submateri)
             - Ringkas, Tidak Overstimulated (4 Kotak Inti), Rata Kanan-Kiri Penuh
         ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="submateri"
        className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-16 bg-[#F4F7FC]"
      >
        <ScrollDepthBox speed={0.05}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div className="max-w-2xl">
              <h2 className="text-[36px] sm:text-[50px] lg:text-[62px] font-normal tracking-[-0.04em] leading-[1.05] text-[#0A0D14] text-left">
                Cakupan Materi Fase D
              </h2>
              <p className="text-[16px] text-[#334155] leading-[1.65] text-justify mt-4">
                Kurikulum terbagi menjadi dua mata pelajaran utama. Pilih mata
                pelajaran untuk melihat kelompok materi inti yang diujikan.
              </p>
            </div>

            {/* Switcher Bersih Tanpa Label Kecil Berlebihan */}
            <div className="inline-flex rounded-[18px] p-1.5 bg-[#EEF2FA] border border-slate-300/80 self-start lg:self-end">
              <button
                type="button"
                onClick={() => setActiveDomain("numerasi")}
                className={`min-h-[48px] px-7 py-2.5 rounded-[14px] text-[16px] font-medium transition-all cursor-pointer ${
                  activeDomain === "numerasi"
                    ? "bg-[#1B68FF] text-white shadow-xs"
                    : "text-[#334155] hover:text-[#0A0D14]"
                }`}
              >
                Matematika
              </button>
              <button
                type="button"
                onClick={() => setActiveDomain("literasi")}
                className={`min-h-[48px] px-7 py-2.5 rounded-[14px] text-[16px] font-medium transition-all cursor-pointer ${
                  activeDomain === "literasi"
                    ? "bg-[#1B68FF] text-white shadow-xs"
                    : "text-[#334155] hover:text-[#0A0D14]"
                }`}
              >
                Bahasa Indonesia
              </button>
            </div>
          </div>
        </ScrollDepthBox>

        {/* Hanya 4 Kotak Inti dalam 1 Baris (Clean & Tidak Overstimulated) */}
        <div
          key={activeDomain}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {activeTopics.map((topic, idx) => (
            <ScrollDepthBox key={topic.num} speed={0.06 + idx * 0.015}>
              <div className="group h-full bg-white hover:bg-[#1B68FF] rounded-[28px] p-8 border border-slate-200/90 hover:border-[#1B68FF] transition-all duration-300 flex flex-col justify-between min-h-[280px] shadow-[0_12px_32px_rgba(15,23,42,0.03)]">
                <span className="text-[44px] font-light tracking-[-0.04em] leading-none text-[#1B68FF] group-hover:text-white transition-colors">
                  {topic.num}
                </span>

                <div className="mt-8">
                  <h3 className="text-[22px] sm:text-[24px] font-semibold tracking-[-0.025em] leading-[1.25] text-[#0A0D14] group-hover:text-white transition-colors text-left">
                    {topic.title}
                  </h3>
                  <p className="text-[15px] sm:text-[16px] font-normal text-[#334155] group-hover:text-blue-50 leading-[1.6] text-justify mt-3 transition-colors">
                    {topic.desc}
                  </p>
                </div>
              </div>
            </ScrollDepthBox>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. CLOSING CTA & FOOTER — Rata Kanan-Kiri Penuh Sejajar Navbar
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full pt-6 pb-16 px-6 sm:px-12 lg:px-16 bg-[#F4F7FC]">
        <ScrollDepthBox speed={0.05}>
          <div className="w-full rounded-[32px] bg-[#060E24] text-white p-8 sm:p-14 lg:p-16 relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <div className="max-w-2xl">
                <h2 className="text-[34px] sm:text-[48px] lg:text-[56px] font-normal tracking-[-0.04em] leading-[1.06] text-white mb-4 text-left">
                  Mulai Persiapan TKA SMP Hari Ini
                </h2>
                <p className="text-[16px] font-normal leading-[1.65] text-slate-300 text-justify">
                  Akses langsung 30 soal diagnostik prasyarat, latihan
                  bertingkat pada 16 submateri Matematika dan Bahasa Indonesia,
                  serta paket simulasi CBT 75 menit.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => handleNavigate("/register")}
                  disabled={loadingRoute === "/register"}
                  className="min-h-[48px] px-8 py-3.5 rounded-[14px] bg-[#1B68FF] hover:bg-[#1454D6] text-white text-[16px] font-semibold transition-all shadow-[0_12px_28px_rgba(27,104,255,0.3)] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loadingRoute === "/register"
                    ? "Memuat..."
                    : "Daftar Akun Siswa →"}
                </button>
                <Link
                  href="/login"
                  className="min-h-[48px] px-7 py-3.5 rounded-[14px] bg-white/10 hover:bg-white/15 border border-white/20 text-white text-[16px] font-medium transition-all inline-flex items-center justify-center"
                >
                  Masuk ke Akun
                </Link>
              </div>
            </div>
          </div>
        </ScrollDepthBox>

        <footer className="mt-14 pt-8 border-t border-slate-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-[15px] font-normal text-[#334155]">
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

          <div className="flex flex-wrap items-center gap-6">
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
