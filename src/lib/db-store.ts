import { prisma } from "@/lib/prisma";
import type { CmsData } from "@/lib/cms-store";

export const isDbConnected = Boolean(process.env.DATABASE_URL);

export async function readDbCollection<K extends keyof CmsData>(key: K): Promise<CmsData[K] | null> {
  if (!isDbConnected) return null;

  try {
    switch (key) {
      case "berita": {
        const rows = await prisma.newsArticle.findMany({ orderBy: { createdAt: "desc" } });
        if (rows.length === 0) return null;
        return rows as unknown as CmsData[K];
      }
      case "agenda": {
        const rows = await prisma.agendaItem.findMany({ orderBy: { createdAt: "desc" } });
        if (rows.length === 0) return null;
        return rows as unknown as CmsData[K];
      }
      case "anggota": {
        const rows = await prisma.member.findMany({ where: { role: "Anggota Komisi" } });
        if (rows.length === 0) return null;
        return rows as unknown as CmsData[K];
      }
      case "pimpinan": {
        const rows = await prisma.member.findMany({ where: { role: { in: ["Ketua Komisi", "Wakil Ketua Komisi"] } } });
        if (rows.length === 0) return null;
        return rows as unknown as CmsData[K];
      }
      case "mitraKerja": {
        const rows = await prisma.mitraKerja.findMany();
        if (rows.length === 0) return null;
        return rows as unknown as CmsData[K];
      }
      case "aspirasi": {
        const rows = await prisma.aspirasi.findMany({ orderBy: { createdAt: "desc" } });
        if (rows.length === 0) return null;
        return rows as unknown as CmsData[K];
      }
      case "pages": {
        const rows = await prisma.pageContent.findMany();
        if (rows.length === 0) return null;
        return rows.map((r) => ({
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
      default:
        return null;
    }
  } catch (err) {
    console.warn(`[Prisma DB Read Warning] Fallback to JSON for ${key}:`, (err as Error).message);
    return null;
  }
}

export async function writeDbCollection<K extends keyof CmsData>(key: K, value: CmsData[K]): Promise<boolean> {
  if (!isDbConnected) return false;

  try {
    switch (key) {
      case "berita": {
        const items = value as CmsData["berita"];
        for (const item of items) {
          await prisma.newsArticle.upsert({
            where: { id: item.id },
            update: {
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
            },
            create: {
              id: item.id,
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
            },
          });
        }
        return true;
      }
      case "agenda": {
        const items = value as CmsData["agenda"];
        for (const item of items) {
          await prisma.agendaItem.upsert({
            where: { id: item.id },
            update: {
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
            },
            create: {
              id: item.id,
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
            },
          });
        }
        return true;
      }
      case "anggota":
      case "pimpinan": {
        const items = value as CmsData["anggota"];
        for (const item of items) {
          await prisma.member.upsert({
            where: { id: item.id },
            update: {
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
            },
            create: {
              id: item.id,
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
            },
          });
        }
        return true;
      }
      case "mitraKerja": {
        const items = value as CmsData["mitraKerja"];
        for (const item of items) {
          await prisma.mitraKerja.upsert({
            where: { id: item.id },
            update: {
              name: item.name,
              acronym: item.acronym,
              ministerOrHead: item.ministerOrHead,
              focusArea: item.focusArea,
              logoUrl: item.logoUrl,
              description: item.description,
            },
            create: {
              id: item.id,
              name: item.name,
              acronym: item.acronym,
              ministerOrHead: item.ministerOrHead,
              focusArea: item.focusArea,
              logoUrl: item.logoUrl,
              description: item.description,
            },
          });
        }
        return true;
      }
      case "aspirasi": {
        const items = value as CmsData["aspirasi"];
        for (const item of items) {
          await prisma.aspirasi.upsert({
            where: { id: item.id },
            update: {
              mode: item.mode,
              name: item.name || null,
              email: item.email || null,
              whatsapp: item.whatsapp || null,
              subject: item.subject,
              message: item.message,
              category: item.category,
              status: item.status,
              createdAt: item.createdAt,
            },
            create: {
              id: item.id,
              mode: item.mode,
              name: item.name || null,
              email: item.email || null,
              whatsapp: item.whatsapp || null,
              subject: item.subject,
              message: item.message,
              category: item.category,
              status: item.status,
              createdAt: item.createdAt,
            },
          });
        }
        return true;
      }
      case "pages": {
        const pages = value as CmsData["pages"];
        for (const page of pages) {
          await prisma.pageContent.upsert({
            where: { slug: page.slug },
            update: {
              title: page.title,
              sections: page.sections as any,
            },
            create: {
              id: page.id,
              slug: page.slug,
              title: page.title,
              sections: page.sections as any,
            },
          });
        }
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
      default:
        return false;
    }
  } catch (err) {
    console.error(`[Prisma DB Write Error] Failed for ${key}:`, (err as Error).message);
    return false;
  }
}
