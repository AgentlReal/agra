'use client';

import React, { useState } from 'react';
import { ZoomIn, X, Image as ImageIcon } from 'lucide-react';
import FormattedContent from './FormattedContent';

interface OptionRendererProps {
  text: string;
  className?: string;
  onZoom?: (url: string) => void;
}

/**
 * Checks if a string is a standalone image URL or path
 */
export function isImageUrl(str?: string | null): boolean {
  if (!str) return false;
  const trimmed = str.trim();
  const urlPattern = /^(https?:\/\/|\/|\.\/|data:image\/).*\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i;
  const dataUriPattern = /^data:image\/[a-z]+;base64,/i;
  return urlPattern.test(trimmed) || dataUriPattern.test(trimmed);
}

/**
 * Checks if string contains markdown image syntax: ![alt](url)
 */
export function extractMarkdownImage(str?: string | null): {
  prefixText: string;
  alt: string;
  url: string;
  suffixText: string;
} | null {
  if (!str) return null;
  const mdImgMatch = str.match(/([\s\S]*?)!\[(.*?)\]\((.*?)\)([\s\S]*)/);
  if (!mdImgMatch) return null;
  return {
    prefixText: mdImgMatch[1].trim(),
    alt: mdImgMatch[2] || 'Pilihan Gambar',
    url: mdImgMatch[3].trim(),
    suffixText: mdImgMatch[4].trim(),
  };
}

export default function OptionRenderer({
  text,
  className = '',
  onZoom,
}: OptionRendererProps) {
  const [internalZoom, setInternalZoom] = useState<string | null>(null);

  if (!text) return null;

  const handleZoom = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onZoom) {
      onZoom(url);
    } else {
      setInternalZoom(url);
    }
  };

  // 1. Check Markdown image syntax: ![alt](url)
  const mdImg = extractMarkdownImage(text);
  if (mdImg) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {mdImg.prefixText && (
          <FormattedContent content={mdImg.prefixText} inline className="text-inherit" />
        )}
        <div className="relative group inline-block max-w-xs overflow-hidden rounded-lg border border-slate-800 bg-slate-950/60 p-1.5">
          <img
            src={mdImg.url}
            alt={mdImg.alt}
            className="max-h-36 sm:max-h-44 w-auto object-contain rounded cursor-zoom-in hover:opacity-95 transition-opacity"
            onClick={(e) => handleZoom(mdImg.url, e)}
          />
          <button
            type="button"
            onClick={(e) => handleZoom(mdImg.url, e)}
            className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold text-slate-300 backdrop-blur-sm border border-slate-700 hover:text-white transition-colors"
          >
            <ZoomIn className="h-3 w-3" />
            <span>Perbesar</span>
          </button>
        </div>
        {mdImg.suffixText && (
          <FormattedContent content={mdImg.suffixText} inline className="text-inherit" />
        )}

        {/* Fallback Internal Modal if parent onZoom not passed */}
        {internalZoom && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setInternalZoom(null);
            }}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setInternalZoom(null)}
                className="absolute top-3 right-3 z-10 rounded-full bg-slate-800/80 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={internalZoom}
                alt="Pratinjau Penuh"
                className="max-h-[80vh] w-auto mx-auto object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Check standalone Image URL
  if (isImageUrl(text)) {
    return (
      <div className={`relative group inline-block max-w-xs overflow-hidden rounded-lg border border-slate-800 bg-slate-950/60 p-1.5 ${className}`}>
        <img
          src={text.trim()}
          alt="Pilihan Gambar"
          className="max-h-36 sm:max-h-44 w-auto object-contain rounded cursor-zoom-in hover:opacity-95 transition-opacity"
          onClick={(e) => handleZoom(text.trim(), e)}
        />
        <button
          type="button"
          onClick={(e) => handleZoom(text.trim(), e)}
          className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold text-slate-300 backdrop-blur-sm border border-slate-700 hover:text-white transition-colors"
        >
          <ZoomIn className="h-3 w-3" />
          <span>Perbesar</span>
        </button>

        {/* Fallback Internal Modal if parent onZoom not passed */}
        {internalZoom && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setInternalZoom(null);
            }}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setInternalZoom(null)}
                className="absolute top-3 right-3 z-10 rounded-full bg-slate-800/80 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={internalZoom}
                alt="Pratinjau Penuh"
                className="max-h-[80vh] w-auto mx-auto object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Standard Text / LaTeX Option
  return <FormattedContent content={text} inline className={`text-inherit ${className}`} />;
}
