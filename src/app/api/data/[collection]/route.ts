import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/api-auth";
import { CmsData, readCollection, writeCollection } from "@/lib/cms-store";
import { readDbCollection, writeDbCollection } from "@/lib/db-store";

export const dynamic = "force-dynamic";

const COLLECTIONS: (keyof CmsData)[] = [
  "stats",
  "anggota",
  "pimpinan",
  "mitraKerja",
  "berita",
  "agenda",
  "siteContent",
  "submissions",
  "aspirasi",
  "pages",
];

interface Params {
  params: { collection: string };
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }
  const key = params.collection as keyof CmsData;
  if (!COLLECTIONS.includes(key)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 400, headers: NO_CACHE_HEADERS });
  }

  const dbData = await readDbCollection(key);
  if (dbData !== null) {
    return NextResponse.json(dbData, { headers: NO_CACHE_HEADERS });
  }

  return NextResponse.json(readCollection(key), { headers: NO_CACHE_HEADERS });
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }
  const key = params.collection as keyof CmsData;
  if (!COLLECTIONS.includes(key)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 400, headers: NO_CACHE_HEADERS });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: NO_CACHE_HEADERS });
  }

  await writeDbCollection(key, body as never);
  writeCollection(key, body as never);

  try {
    // Purge Vercel cache for all pages immediately
    revalidatePath("/", "layout");
  } catch {
    // ignore
  }

  return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS });
}
