import { NextResponse } from "next/server";
import { readAllCms, readCollection } from "@/lib/cms-store";
import { readDbCollection } from "@/lib/db-store";

export const dynamic = "force-dynamic";

/**
 * Public bulk endpoint — returns the full content dataset without requiring
 * authentication. Used by public pages (server components) to render edits in
 * real time. Content is non-sensitive editorial data.
 */
export async function GET() {
  const fallback = readAllCms();

  const [stats, anggota, pimpinan, mitraKerja, berita, agenda, aspirasi, pages] = await Promise.all([
    readDbCollection("stats"),
    readDbCollection("anggota"),
    readDbCollection("pimpinan"),
    readDbCollection("mitraKerja"),
    readDbCollection("berita"),
    readDbCollection("agenda"),
    readDbCollection("aspirasi"),
    readDbCollection("pages"),
  ]);

  return NextResponse.json({
    stats: stats ?? readCollection("stats"),
    anggota: anggota ?? readCollection("anggota"),
    pimpinan: pimpinan ?? readCollection("pimpinan"),
    mitraKerja: mitraKerja ?? readCollection("mitraKerja"),
    berita: berita ?? readCollection("berita"),
    agenda: agenda ?? readCollection("agenda"),
    siteContent: fallback.siteContent,
    submissions: fallback.submissions,
    aspirasi: aspirasi ?? readCollection("aspirasi"),
    pages: pages ?? readCollection("pages"),
  });
}
