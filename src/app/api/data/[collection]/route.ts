import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { CmsData, readCollection, writeCollection } from "@/lib/cms-store";

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

export async function GET(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = params.collection as keyof CmsData;
  if (!COLLECTIONS.includes(key)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 400 });
  }
  return NextResponse.json(readCollection(key));
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = params.collection as keyof CmsData;
  if (!COLLECTIONS.includes(key)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 400 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  writeCollection(key, body as never);
  return NextResponse.json({ ok: true });
}
