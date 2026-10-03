/**
 * Normalizes image paths/URLs from database or API responses into valid Next.js asset paths.
 * 
 * Handles:
 * - External URLs (http://, https://, data:image/...) -> unchanged
 * - Paths like 'image_soal/...' or '/image_soal/...' -> '/assets/image_soal/...'
 * - Paths like 'public/assets/...' or '/public/assets/...' -> '/assets/...'
 * - Relative paths like '../../public/assets/...' -> '/assets/...'
 * - Any path without leading slash -> prefixed with '/'
 */
export function normalizeImageUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // External URLs or Base64 data URIs
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Remove relative leading indicators like ../ or ./
  let clean = trimmed.replace(/^(\.\.\/|\.\/)+/, '');

  // Strip leading 'public/' or '/public/'
  clean = clean.replace(/^\/?public\//, '');

  // If path directly references image_soal, redirect to assets/image_soal
  if (clean.startsWith('image_soal/') || clean.startsWith('/image_soal/')) {
    clean = clean.replace(/^\/?image_soal\//, 'assets/image_soal/');
  }

  // Ensure single leading slash
  if (!clean.startsWith('/')) {
    clean = `/${clean}`;
  }

  return clean;
}
