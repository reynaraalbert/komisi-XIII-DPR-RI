import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { readCollection, writeCollection } from "@/lib/cms-store";
import type { Aspirasi } from "@/lib/data";

export const dynamic = "force-dynamic";

interface Params {
  params: { id: string };
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const aspirasi = readCollection("aspirasi") as Aspirasi[];
    const idx = aspirasi.findIndex((a) => a.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Aspirasi not found" }, { status: 404 });
    }
    aspirasi[idx] = { ...aspirasi[idx], ...body };
    writeCollection("aspirasi", aspirasi as never);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
