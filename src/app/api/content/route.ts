import { NextResponse } from "next/server";
import { readDbCollectionSafe } from "@/lib/db-store";
import { defaultCollection } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

let cachedContent: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 5000; // 5 seconds in-memory cache

/**
 * Public bulk endpoint — returns the full content dataset straight from the
 * database. Uses in-memory caching and SWR CDN headers for instant response times (<1s).
 */
export async function GET() {
  const now = Date.now();

  // Serve from in-memory cache if fresh
  if (cachedContent && now - cachedContent.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cachedContent.data, {
      headers: {
        "Cache-Control": "public, s-maxage=2, stale-while-revalidate=15",
      },
    });
  }

  const [stats, anggota, pimpinan, mitraKerja, berita, agenda, pages, siteContent] = await Promise.all([
    readDbCollectionSafe("stats"),
    readDbCollectionSafe("anggota"),
    readDbCollectionSafe("pimpinan"),
    readDbCollectionSafe("mitraKerja"),
    readDbCollectionSafe("berita"),
    readDbCollectionSafe("agenda"),
    readDbCollectionSafe("pages"),
    readDbCollectionSafe("siteContent"),
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

  cachedContent = { data: payload, timestamp: now };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=2, stale-while-revalidate=15",
    },
  });
}