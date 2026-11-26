import { supabaseAdmin } from '@/lib/supabase';

export interface ResolvedReportItem {
  id: string;
  name: string;
  url: string;
}

/**
 * Checks whether a stored report reference is a direct HTTPS URL (e.g. Cloudinary secure_url).
 */
export function isDirectReportUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

/**
 * Extracts a clean display filename from either a Cloudinary HTTPS URL or a Supabase Storage path.
 */
export function extractReportFilename(pathOrUrl: string, fallbackIndex = 0): string {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') {
    return `Report-${fallbackIndex + 1}`;
  }

  try {
    const rawPath = isDirectReportUrl(pathOrUrl)
      ? new URL(pathOrUrl).pathname
      : pathOrUrl;
    const parts = rawPath.split('/').filter(Boolean);
    const lastSegment = parts[parts.length - 1] || '';
    const decoded = decodeURIComponent(lastSegment);
    // Strip leading timestamp prefixes like "1795680000000_" and random Cloudinary suffixes if neat
    const cleaned = decoded.replace(/^\d+_/, '');
    return cleaned || `Report-${fallbackIndex + 1}`;
  } catch {
    return `Report-${fallbackIndex + 1}`;
  }
}

/**
 * Resolves a batch of booking report arrays into accessible URLs.
 * Direct Cloudinary HTTPS URLs are returned as-is; legacy Supabase storage paths are signed.
 */
export async function resolveBookingReportsBatch(
  reportArrays: Array<string[] | null | undefined>
): Promise<Map<string, string>> {
  const urlMap = new Map<string, string>();
  const legacySupabasePaths: string[] = [];

  for (const list of reportArrays) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (!item || typeof item !== 'string') continue;
      if (isDirectReportUrl(item)) {
        urlMap.set(item, item);
      } else if (!legacySupabasePaths.includes(item)) {
        legacySupabasePaths.push(item);
      }
    }
  }

  if (legacySupabasePaths.length > 0) {
    try {
      const { data: urls } = await supabaseAdmin.storage
        .from('medical-reports')
        .createSignedUrls(legacySupabasePaths, 3600);

      (urls || []).forEach((u) => {
        if (u.signedUrl && u.path) {
          urlMap.set(u.path, u.signedUrl);
        }
      });
    } catch (err) {
      console.warn('Legacy Supabase storage signed URLs warning:', err);
    }
  }

  return urlMap;
}
