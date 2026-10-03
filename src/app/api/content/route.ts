import { NextResponse } from "next/server";
import { readPublicCollectionSafe } from "@/lib/db-store";
import { defaultCollection } from "@/lib/cms-store";
import {
  getCachedContent,
  hasAnyCachedContent,
  setCachedContent,
} from "@/lib/content-cache";

export const dynamic = "force-dynamic";

// CDN/browser cache: keep Supabase egress low. The in-memory cache is cleared
// immediately when an admin saves, so edits show up quickly on this instance.
const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
};

/**
 * Public bulk endpoint — returns the full content dataset straight from the
 * database. Uses in-memory caching and Edge CDN headers so the database is
 * read at most once per cache window rather than on every visit.
 */
export async function GET() {
  // Serve from in-memory cache if fresh
  const fresh = getCachedContent();
  if (fresh) {
    return NextResponse.json(fresh, { headers: CACHE_HEADERS });
  }

  const [stats, anggota, pimpinan, mitraKerja, berita, agenda, pages, siteContent] = await Promise.all([
    readPublicCollectionSafe("stats"),
    readPublicCollectionSafe("anggota"),
    readPublicCollectionSafe("pimpinan"),
    readPublicCollectionSafe("mitraKerja"),
    readPublicCollectionSafe("berita"),
    readPublicCollectionSafe("agenda"),
    readPublicCollectionSafe("pages"),
    readPublicCollectionSafe("siteContent"),
  ]);

  const payload = {
    stats: stats ?? defaultCollection("stats"),
    anggota: anggota ?? defaultCollection("anggota"),
    pimpinan: pimpinan ?? defaultCollection("pimpinan"),
    mitraKerja: mitraKerja ?? defaultCollection("mitraKerja"),
    berita: berita ?? defaultCollection("berita"),
    agenda: agenda ?? defaultCollection("agenda"),
    siteContent: siteContent ?? defaultCollection("siteContent"),
    pages: pages ?? defaultCollection("pages"),
  };

  // Only update in-memory cache if at least some DB collections were retrieved
  const hasRealData = Boolean(berita || anggota || mitraKerja || stats);
  if (hasRealData || !hasAnyCachedContent()) {
    setCachedContent(payload);
  }

  return NextResponse.json(payload, { headers: CACHE_HEADERS });
}