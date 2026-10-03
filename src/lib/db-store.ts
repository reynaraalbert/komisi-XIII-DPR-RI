import { prisma } from "@/lib/prisma";
import type { CmsData } from "@/lib/cms-store";

export const isDbConnected = Boolean(process.env.DATABASE_URL);

/**
 * Actively tests whether the database is reachable. Returns true/false instead
 * of only checking that a URL exists (a URL existing does not mean the DB is up).
 * Used by the admin UI to show an accurate "Terhubung / Tidak Terhubung" status
 * instead of silently falling back to static defaults.
 */
export async function pingDb(timeoutMs = 8000): Promise<boolean> {
  if (!isDbConnected) return false;
  try {
    // Run against a timeout so the UI never hangs on a dead connection.
    // Supabase (region ap-south-1) can need several seconds on a cold
    // connection, so an 8s timeout avoids false "offline" readings.
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB ping timeout")), timeoutMs)
      ),
    ]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads a collection from the database. Fast direct read with a 7s timeout
 * so Supabase cold-start connections have enough time to establish on the first hit
 * and return REAL data immediately.
 */
export async function readDbCollectionSafe<K extends keyof CmsData>(
  key: K
): Promise<CmsData[K] | null> {
  try {
    const timeout = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 7000)
    );
    const query = readDbCollection(key);
    return await Promise.race([query, timeout]);
  } catch {
    return null;
  }
}

export async function readDbCollection<K extends keyof CmsData>(key: K): Promise<CmsData[K] | null> {
  if (!isDbConnected) return null;

  try {
    switch (key) {
      case "berita": {
        const rows = await prisma.newsArticle.findMany({ orderBy: { createdAt: "desc" } });
        return rows as unknown as CmsData[K];
      }
      case "agenda": {
        const rows = await prisma.agendaItem.findMany({ orderBy: { createdAt: "desc" } });
        return rows as unknown as CmsData[K];
      }
      case "anggota": {
        const rows = await prisma.member.findMany({ orderBy: { createdAt: "asc" } });
        return rows as unknown as CmsData[K];
      }
      case "pimpinan": {
        const rows = await prisma.member.findMany({ where: { role: { in: ["Ketua Komisi", "Wakil Ketua Komisi"] } } });
        return rows as unknown as CmsData[K];
      }
      case "mitraKerja": {
        const rows = await prisma.mitraKerja.findMany();
        return rows as unknown as CmsData[K];
      }
      case "aspirasi": {
        const rows = await prisma.aspirasi.findMany({ orderBy: { createdAt: "desc" } });
        return rows as unknown as CmsData[K];
      }
      case "pages": {
        const rows = await prisma.pageContent.findMany();
        return rows.map((r: { id: string; slug: string; title: string; sections: any }) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          sections: r.sections,
        })) as unknown as CmsData[K];
      }
      case "stats": {
        const row = await prisma.siteStat.findUnique({ where: { id: "default-stats" } });
        if (!row) return null;
        const { id, updatedAt, ...rest } = row;
        return rest as unknown as CmsData[K];
      }
      case "siteContent": {
        const row = await prisma.pageContent.findUnique({ where: { slug: "siteContent" } });
        if (!row) return null;
        return row.sections as unknown as CmsData[K];
      }
      case "submissions": {
        const rows = await prisma.newsSubmission.findMany({ orderBy: { createdAt: "desc" } });
        return rows as unknown as CmsData[K];
      }
      default:
        return null;
    }
  } catch (err) {
    console.warn(`[Prisma DB Read Warning] Fallback to static data for ${key}:`, (err as Error).message);
    return null;
  }
}

/**
 * SQL fragment that swaps an inline base64 data-URL for a short, cacheable
 * /api/media URL *inside the database query*, so the heavy blob is never
 * transferred out of Supabase. Normal URLs / NULLs pass through untouched.
 * The `v` param (row updatedAt) changes whenever the row is edited.
 */
function mediaCol(kind: string, col: string): string {
  return (
    `CASE WHEN "${col}" LIKE 'data:%' ` +
    `THEN '/api/media/${kind}/' || "id" || '/${col}?v=' || (extract(epoch from "updatedAt")::bigint)::text ` +
    `ELSE "${col}" END AS "${col}"`
  );
}

const MEMBER_COLS = (
  `"id","nomorAnggota","name","role","fraksi","dapil",${mediaCol("member", "photoUrl")},` +
  `"email","bio","billsLed","pendidikan","masaJabatan","komisi","createdAt","updatedAt"`
);

const PUBLIC_QUERIES: Partial<Record<keyof CmsData, string>> = {
  berita:
    `SELECT "id","title","slug","category","date","readTime","author","summary","content",` +
    `${mediaCol("berita", "imageUrl")},${mediaCol("berita", "documentUrl")},` +
    `"isFeatured","createdAt","updatedAt" FROM "NewsArticle" ORDER BY "createdAt" DESC`,
  anggota: `SELECT ${MEMBER_COLS} FROM "Member" ORDER BY "createdAt" ASC`,
  pimpinan: `SELECT ${MEMBER_COLS} FROM "Member" WHERE "role" IN ('Ketua Komisi','Wakil Ketua Komisi')`,
  mitraKerja:
    `SELECT "id","name","acronym","ministerOrHead","focusArea",${mediaCol("mitra", "logoUrl")},` +
    `"description","createdAt","updatedAt" FROM "MitraKerja"`,
  agenda:
    `SELECT "id","title","type","partner","date","time","location","status","summary","streamUrl",` +
    `${mediaCol("agenda", "pdfDownloadUrl")},"createdAt","updatedAt" FROM "AgendaItem" ORDER BY "createdAt" DESC`,
};

/**
 * Public (visitor-facing) read. Same shape as readDbCollectionSafe, but media
 * columns are returned as lightweight URLs instead of base64. NEVER use this
 * for the admin editor: writing these URLs back would replace the stored
 * images. Collections without heavy media fall back to the normal reader.
 */
export async function readPublicCollectionSafe<K extends keyof CmsData>(
  key: K
): Promise<CmsData[K] | null> {
  const sql = PUBLIC_QUERIES[key];
  if (!sql) return readDbCollectionSafe(key);
  if (!isDbConnected) return null;

  try {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 7000));
    const query = prisma.$queryRawUnsafe(sql).then((rows) => rows as unknown as CmsData[K]);
    return await Promise.race([query, timeout]);
  } catch (err) {
    console.warn(`[Prisma DB Public Read Warning] ${key}:`, (err as Error).message);
    return null;
  }
}


/**
 * Writes only rows that are new or actually changed.
 *
 * The old implementation upserted EVERY row on every admin save. Many rows
 * carry large base64 images/documents, and every UPDATE in PostgreSQL leaves a
 * dead copy of the row (and of its TOASTed blobs) until vacuumed — which
 * inflated the database far beyond the real amount of data. Skipping unchanged
 * rows avoids that churn entirely.
 *
 * `toData` returns the writable columns for an item. Comparison is
 * conservative: if anything looks different (e.g. JSON key order), the row is
 * simply updated, never skipped.
 */
async function syncRows(
  delegate: any,
  items: any[],
  toData: (item: any) => Record<string, any>,
  options: { whereKey?: "id" | "slug" } = {}
): Promise<void> {
  const whereKey = options.whereKey ?? "id";
  const existing: any[] = await delegate.findMany();
  const byKey = new Map<string, any>(existing.map((row) => [row[whereKey], row]));

  for (const item of items) {
    const data = toData(item);
    const prev = byKey.get(item[whereKey]);
    if (prev) {
      const unchanged = Object.keys(data).every(
        (k) => JSON.stringify(prev[k] ?? null) === JSON.stringify(data[k] ?? null)
      );
      if (unchanged) continue;
      await delegate.update({ where: { [whereKey]: item[whereKey] }, data });
    } else {
      await delegate.create({ data: { id: item.id, ...(whereKey === "slug" ? { slug: item.slug } : {}), ...data } });
    }
  }
}

const memberData = (item: any) => ({
  nomorAnggota: item.nomorAnggota,
  name: item.name,
  role: item.role,
  fraksi: item.fraksi,
  dapil: item.dapil,
  photoUrl: item.photoUrl,
  email: item.email,
  bio: item.bio,
  billsLed: item.billsLed,
  pendidikan: item.pendidikan || null,
  masaJabatan: item.masaJabatan || null,
  komisi: item.komisi || null,
});

export async function writeDbCollection<K extends keyof CmsData>(key: K, value: CmsData[K]): Promise<boolean> {
  if (!isDbConnected) return false;

  try {
    switch (key) {
      case "berita": {
        const items = value as CmsData["berita"];
        const ids = items.map((item) => item.id);
        await syncRows(prisma.newsArticle, items, (item) => ({
          title: item.title,
          slug: item.slug,
          category: item.category,
          date: item.date,
          readTime: item.readTime,
          author: item.author,
          summary: item.summary,
          content: item.content,
          imageUrl: item.imageUrl,
          documentUrl: item.documentUrl || null,
          isFeatured: item.isFeatured || false,
        }));
        // Safety: only prune rows NOT in the incoming list when the list is
        // non-empty. An empty list usually means the CMS loaded static defaults
        // (DB read failed) — pruning then would wipe every real row.
        if (ids.length > 0) {
          await prisma.newsArticle.deleteMany({ where: { id: { notIn: ids } } });
        }
        return true;
      }
      case "agenda": {
        const items = value as CmsData["agenda"];
        const ids = items.map((item) => item.id);
        await syncRows(prisma.agendaItem, items, (item) => ({
          title: item.title,
          type: item.type,
          partner: item.partner,
          date: item.date,
          time: item.time,
          location: item.location,
          status: item.status,
          summary: item.summary,
          streamUrl: item.streamUrl || null,
          pdfDownloadUrl: item.pdfDownloadUrl || null,
        }));
        if (ids.length > 0) {
          await prisma.agendaItem.deleteMany({ where: { id: { notIn: ids } } });
        }
        return true;
      }
      case "anggota": {
        const items = value as CmsData["anggota"];
        const ids = items.map((item) => item.id);
        await syncRows(prisma.member, items, memberData);
        if (ids.length > 0) {
          await prisma.member.deleteMany({ where: { id: { notIn: ids } } });
        }
        return true;
      }
      case "pimpinan": {
        const items = value as CmsData["pimpinan"];
        const ids = items.map((item) => item.id);
        await syncRows(prisma.member, items, memberData);
        if (ids.length > 0) {
          await prisma.member.deleteMany({
            where: { role: { in: ["Ketua Komisi", "Wakil Ketua Komisi"] }, id: { notIn: ids } },
          });
        }
        return true;
      }
      case "mitraKerja": {
        const items = value as CmsData["mitraKerja"];
        const ids = items.map((item) => item.id);
        await syncRows(prisma.mitraKerja, items, (item) => ({
          name: item.name,
          acronym: item.acronym,
          ministerOrHead: item.ministerOrHead,
          focusArea: item.focusArea,
          logoUrl: item.logoUrl,
          description: item.description,
        }));
        if (ids.length > 0) {
          await prisma.mitraKerja.deleteMany({ where: { id: { notIn: ids } } });
        }
        return true;
      }
      case "aspirasi": {
        const items = value as CmsData["aspirasi"];
        const ids = items.map((item) => item.id);
        await syncRows(prisma.aspirasi, items, (item) => ({
          mode: item.mode,
          name: item.name || null,
          email: item.email || null,
          whatsapp: item.whatsapp || null,
          subject: item.subject,
          message: item.message,
          category: item.category,
          status: item.status,
          createdAt: item.createdAt,
        }));
        if (ids.length > 0) {
          await prisma.aspirasi.deleteMany({ where: { id: { notIn: ids } } });
        }
        return true;
      }
      case "pages": {
        const pages = value as CmsData["pages"];
        await syncRows(
          prisma.pageContent,
          pages,
          (page) => ({ title: page.title, sections: page.sections as any }),
          { whereKey: "slug" }
        );
        return true;
      }
      case "stats": {
        const stats = value as CmsData["stats"];
        await prisma.siteStat.upsert({
          where: { id: "default-stats" },
          update: stats,
          create: {
            id: "default-stats",
            ...stats,
          },
        });
        return true;
      }
      case "siteContent": {
        const data = value as CmsData["siteContent"];
        const prev = await prisma.pageContent.findUnique({ where: { slug: "siteContent" } });
        // Skip the write entirely when nothing changed.
        if (prev && JSON.stringify(prev.sections) === JSON.stringify(data)) {
          return true;
        }
        await prisma.pageContent.upsert({
          where: { slug: "siteContent" },
          update: {
            title: "siteContent",
            sections: data as any,
          },
          create: {
            id: "siteContent",
            slug: "siteContent",
            title: "siteContent",
            sections: data as any,
          },
        });
        return true;
      }
      case "submissions": {
        const items = value as CmsData["submissions"];
        const ids = items.map((item) => item.id);
        await syncRows(prisma.newsSubmission, items, (item) => ({
          biodata: item.biodata as any,
          artikel: item.artikel as any,
          attachments: item.attachments as any,
          status: item.status,
          proofreadNotes: item.proofreadNotes || null,
          createdAt: item.createdAt,
        }));
        if (ids.length > 0) {
          await prisma.newsSubmission.deleteMany({ where: { id: { notIn: ids } } });
        }
        return true;
      }
      default:
        return false;
    }
  } catch (err) {
    console.error(`[Prisma DB Write Error] Failed for ${key}:`, (err as Error).message);
    return false;
  }
}
