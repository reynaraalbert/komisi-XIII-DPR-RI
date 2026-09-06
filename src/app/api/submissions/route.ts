import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { readCollection, writeCollection } from "@/lib/cms-store";
import type { NewsSubmission } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const submissions = readCollection("submissions") as NewsSubmission[];
  return NextResponse.json(submissions);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<NewsSubmission, "id" | "status" | "createdAt">;
    const submissions = readCollection("submissions") as NewsSubmission[];
    const newSubmission: NewsSubmission = {
      ...body,
      id: `sub-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    submissions.unshift(newSubmission);
    writeCollection("submissions", submissions as never);
    return NextResponse.json({ ok: true, id: newSubmission.id });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
