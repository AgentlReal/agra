'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
}

interface SpotlightTourProps {
  isOpen: boolean;
  steps: TourStep[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

/**
 * Komponen Spotlight Tour Walkthrough Interaktif:
 * Menyorot elemen target dengan cutout gelap di sekelilingnya dan menampilkan
 * popover panduan langkah demi langkah dengan panah penunjuk dinamis.
 */
export function SpotlightTour({
  isOpen,
  steps,
  currentStep,
  onNext,
  onPrev,
  onSkip,
}: SpotlightTourProps) {
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [viewport, setViewport] = useState({ vw: 1280, vh: 800 });

  const activeStep = steps[currentStep];

  const updatePosition = useCallback(() => {
    if (!isOpen || !activeStep) return;
    const el = document.querySelector(
      `[data-tour-id="${activeStep.targetId}"]`
    ) as HTMLElement | null;
    if (!el) return;

    const r = el.getBoundingClientRect();
    setRect({
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
    });
    setViewport({
      vw: window.innerWidth,
      vh: window.innerHeight,
    });
  }, [isOpen, activeStep]);

  // Auto-scroll ke elemen yang disorot saat berpindah langkah
  useEffect(() => {
    if (!isOpen || !activeStep) return;
    const el = document.querySelector(
      `[data-tour-id="${activeStep.targetId}"]`
    ) as HTMLElement | null;

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const timer1 = setTimeout(updatePosition, 120);
    const timer2 = setTimeout(updatePosition, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, currentStep, activeStep, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    let rafId = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft' && currentStep > 0) onPrev();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(rafId);
    };
  }, [isOpen, currentStep, onNext, onPrev, onSkip, updatePosition]);

  if (!isOpen || !activeStep || !rect) return null;

  const pad = 10;
  const spotTop = rect.top - pad;
  const spotLeft = rect.left - pad;
  const spotWidth = rect.width + pad * 2;
  const spotHeight = rect.height + pad * 2;

  const popoverWidth = Math.min(360, viewport.vw - 32);
  const spaceBelow = viewport.vh - (spotTop + spotHeight);
  const placeAbove = spaceBelow < 220 && spotTop > 220;

  const popoverTop = placeAbove
    ? Math.max(16, spotTop - 200)
    : Math.min(viewport.vh - 200, spotTop + spotHeight + 18);

  const targetCenterX = spotLeft + spotWidth / 2;
  const popoverLeft = Math.max(
    16,
    Math.min(viewport.vw - popoverWidth - 16, targetCenterX - popoverWidth / 2)
  );
  const arrowLeft = Math.max(
    28,
    Math.min(popoverWidth - 28, targetCenterX - popoverLeft)
  );

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <div
      style={{ fontFamily: "'Onest', sans-serif" }}
      className="fixed inset-0 z-[100] pointer-events-auto"
    >
      {/* Area klik gelap di luar untuk menutup/melewati */}
      <div
        onClick={onSkip}
        className="fixed inset-0 bg-transparent cursor-pointer"
        aria-label="Tutup panduan"
      />

      {/* Lubang Sorotan (Spotlight Cutout) */}
      <div
        style={{
          top: `${spotTop}px`,
          left: `${spotLeft}px`,
          width: `${spotWidth}px`,
          height: `${spotHeight}px`,
          boxShadow: '0 0 0 9999px rgba(6, 14, 36, 0.72)',
          transition: 'all 380ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="fixed rounded-[32px] pointer-events-none ring-4 ring-white shadow-[0_0_50px_rgba(27,104,255,0.45)]"
      />

      {/* Kotak Popover Panduan */}
      <div
        style={{
          top: `${popoverTop}px`,
          left: `${popoverLeft}px`,
          width: `${popoverWidth}px`,
          transition: 'all 380ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="fixed z-[101] rounded-[24px] bg-white p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] border border-slate-100 text-[#0A0D14]"
      >
        {/* Segitiga Penunjuk (Arrow) */}
        <div
          style={{ left: `${arrowLeft}px` }}
          className={`absolute -translate-x-1/2 w-4 h-4 bg-white rotate-45 ${
            placeAbove
              ? '-bottom-2 border-r border-b border-slate-100'
              : '-top-2 border-l border-t border-slate-100'
          }`}
        />

        {/* Isi Penjelasan */}
        <p className="text-[15px] sm:text-[16px] leading-[1.55] text-[#1E293B]">
          Ini adalah <strong className="font-semibold text-[#0A0D14]">{activeStep.title}</strong>.{' '}
          {activeStep.description}
        </p>

        {/* Baris Tombol Navigasi Bawah */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#334155] hover:text-[#0A0D14] text-[13px] font-medium transition-colors cursor-pointer"
          >
            Lewati
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onPrev}
              disabled={isFirst}
              aria-label="Langkah sebelumnya"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-[#334155] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-[13px] font-medium text-[#334155] tabular-nums min-w-[34px] text-center">
              {currentStep + 1} / {steps.length}
            </span>

            <button
              type="button"
              onClick={onNext}
              aria-label={isLast ? 'Selesai panduan' : 'Langkah selanjutnya'}
              className="h-8 px-3 min-w-[32px] rounded-full bg-[#1B68FF] hover:bg-[#1454D6] text-white text-[13px] font-semibold flex items-center justify-center transition-colors shadow-[0_6px_16px_rgba(27,104,255,0.35)] cursor-pointer"
            >
              {isLast ? (
                <span className="px-1">Selesai</span>
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

