import { NextResponse } from "next/server";
import { readAllCms, readCollection } from "@/lib/cms-store";
import { readDbCollection } from "@/lib/db-store";

export const dynamic = "force-dynamic";

/**
 * Public bulk endpoint — returns the full content dataset without requiring
 * authentication. Used by public pages (server components) to render edits in
 * real time.
 */
export async function GET() {
  const fallback = readAllCms();

  const [stats, dbAnggota, dbPimpinan, mitraKerja, berita, agenda, aspirasi, pages, siteContent, submissions] = await Promise.all([
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

  // Derive final anggota & pimpinan cleanly so DB updates NEVER fall back to default
  const finalAnggota = dbAnggota ?? readCollection("anggota");
  const finalPimpinan =
    dbPimpinan ??
    (dbAnggota
      ? (dbAnggota as any[]).filter((m: any) => m.role !== "Anggota Komisi")
      : readCollection("pimpinan"));

  return NextResponse.json(
    {
      stats: stats ?? readCollection("stats"),
      anggota: finalAnggota,
      pimpinan: finalPimpinan,
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
