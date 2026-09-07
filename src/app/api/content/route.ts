import { NextResponse } from "next/server";
import { readDbCollectionSafe } from "@/lib/db-store";
import { defaultCollection } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

/**
 * Public bulk endpoint — returns the full content dataset straight from the
 * database (primary source). If the database is unreachable, falls back to
 * static defaults so public pages still render.
 */
export async function GET() {
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

  return NextResponse.json(
    {
      stats: stats ?? defaultCollection("stats"),
      anggota: anggota ?? defaultCollection("anggota"),
      pimpinan: pimpinan ?? defaultCollection("pimpinan"),
      mitraKerja: mitraKerja ?? defaultCollection("mitraKerja"),
      berita: berita ?? defaultCollection("berita"),
      agenda: agenda ?? defaultCollection("agenda"),
      siteContent: siteContent ?? defaultCollection("siteContent"),
      pages: pages ?? defaultCollection("pages"),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}