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

  const [stats, anggota, pimpinan, mitraKerja, berita, agenda, aspirasi, pages, siteContent, submissions] = await Promise.all([
    readDbCollection("stats"),
    readDbCollection("anggota"),
    readDbCollection("pimpinan"),
    readDbCollection("mitraKerja"),
    readDbCollection("berita"),
    readDbCollection("agenda"),
    readDbCollection("aspirasi"),
    readDbCollection("pages"),
    readDbCollection("siteContent"),
    readDbCollection("submissions"),
  ]);

  return NextResponse.json(
    {
      stats: stats ?? readCollection("stats"),
      anggota: anggota ?? readCollection("anggota"),
      pimpinan: pimpinan ?? readCollection("pimpinan"),
      mitraKerja: mitraKerja ?? readCollection("mitraKerja"),
      berita: berita ?? readCollection("berita"),
      agenda: agenda ?? readCollection("agenda"),
      siteContent: siteContent ?? fallback.siteContent,
      submissions: submissions ?? fallback.submissions,
      aspirasi: aspirasi ?? readCollection("aspirasi"),
      pages: pages ?? readCollection("pages"),
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
