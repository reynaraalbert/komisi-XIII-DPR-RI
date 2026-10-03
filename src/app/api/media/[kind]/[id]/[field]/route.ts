import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Serves a single base64 image/document stored in the database as a real file.
 *
 * The public /api/content payload no longer embeds base64 blobs (they made
 * every read ~1 MB and burned Supabase egress). Instead it points to
 * /api/media/<kind>/<id>/<field>?v=<updatedAt>. Each file is fetched from the
 * database once and then cached by the CDN/browser "forever" — the `v`
 * query param changes whenever the row changes, so edits still show up.
 */

type Delegate = { findUnique: (args: any) => Promise<Record<string, any> | null> };

const SOURCES: Record<string, { delegate: () => Delegate; fields: string[] }> = {
  berita: { delegate: () => prisma.newsArticle as unknown as Delegate, fields: ["imageUrl", "documentUrl"] },
  member: { delegate: () => prisma.member as unknown as Delegate, fields: ["photoUrl"] },
  mitra: { delegate: () => prisma.mitraKerja as unknown as Delegate, fields: ["logoUrl"] },
  agenda: { delegate: () => prisma.agendaItem as unknown as Delegate, fields: ["pdfDownloadUrl"] },
};

const DATA_URL = /^data:([\w.+-]+\/[\w.+-]+);base64,([\s\S]+)$/;

export async function GET(
  _req: NextRequest,
  { params }: { params: { kind: string; id: string; field: string } }
) {
  const source = SOURCES[params.kind];
  if (!source || !source.fields.includes(params.field)) {
    return new NextResponse("Not found", { status: 404 });
  }

  let value: unknown;
  try {
    const row = await source.delegate().findUnique({
      where: { id: params.id },
      select: { [params.field]: true },
    });
    value = row?.[params.field];
  } catch {
    return new NextResponse("Unavailable", { status: 503 });
  }

  if (typeof value !== "string") {
    return new NextResponse("Not found", { status: 404 });
  }

  // If the stored value is a normal URL, just redirect to it.
  if (!value.startsWith("data:")) {
    return NextResponse.redirect(value, 302);
  }

  const match = DATA_URL.exec(value);
  if (!match) return new NextResponse("Invalid data", { status: 422 });

  const body = Buffer.from(match[2], "base64");
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": match[1],
      "Content-Length": String(body.length),
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
