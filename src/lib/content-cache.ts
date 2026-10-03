/**
 * Shared in-memory cache for the public /api/content payload.
 *
 * Lives in its own module so the admin write route can invalidate it right
 * after a save (a module-level variable inside a route file cannot be reached
 * from another route). This keeps Supabase egress low: the whole dataset is
 * read from the database at most once per TTL window instead of on every hit.
 */

export const CONTENT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cached: { data: unknown; timestamp: number } | null = null;

export function getCachedContent(): unknown | null {
  if (cached && Date.now() - cached.timestamp < CONTENT_CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

export function hasAnyCachedContent(): boolean {
  return cached !== null;
}

export function setCachedContent(data: unknown) {
  cached = { data, timestamp: Date.now() };
}

export function clearContentCache() {
  cached = null;
}
