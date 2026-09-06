import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { readCollection, writeCollection } from "@/lib/cms-store";
import type { NewsSubmission, NewsArticle } from "@/lib/data";

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
    const submissions = readCollection("submissions") as NewsSubmission[];
    const idx = submissions.findIndex((s) => s.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (body.action === "approve") {
      const sub = submissions[idx];
      const proofread = body.proofread || {};
      const berita = readCollection("berita") as NewsArticle[];
      const newArticle: NewsArticle = {
        id: `news-${Date.now()}`,
        title: proofread.title || sub.artikel.judul,
        slug: (proofread.title || sub.artikel.judul)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        category: (proofread.category || sub.artikel.kategori) as NewsArticle["category"],
        date: sub.artikel.tanggal || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        readTime: "4 Menit Baca",
        author: sub.biodata.nama,
        summary: proofread.summary || sub.artikel.ringkasan,
        content: proofread.content || sub.artikel.isiBerita,
        imageUrl: proofread.imageUrl || sub.attachments.imageUrl || "",
        documentUrl: proofread.documentUrl || sub.attachments.documentUrl || "",
        isFeatured: false,
      };
      berita.unshift(newArticle);
      writeCollection("berita", berita as never);
      submissions[idx] = { ...sub, status: "approved" as const, proofreadNotes: body.proofreadNotes || "" };
    } else if (body.action === "decline") {
      submissions[idx] = {
        ...submissions[idx],
        status: "declined" as const,
        proofreadNotes: body.proofreadNotes || "",
      };
    } else {
      submissions[idx] = { ...submissions[idx], ...body };
    }

    writeCollection("submissions", submissions as never);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
