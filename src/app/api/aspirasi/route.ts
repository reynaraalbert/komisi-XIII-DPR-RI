import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { readCollection, writeCollection } from "@/lib/cms-store";
import type { Aspirasi } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const aspirasi = readCollection("aspirasi") as Aspirasi[];
  return NextResponse.json(aspirasi);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<Aspirasi, "id" | "status" | "createdAt">;
    const aspirasi = readCollection("aspirasi") as Aspirasi[];
    const newAspirasi: Aspirasi = {
      ...body,
      id: `asp-${Date.now()}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    aspirasi.unshift(newAspirasi);
    writeCollection("aspirasi", aspirasi as never);
    return NextResponse.json({ ok: true, id: newAspirasi.id });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
