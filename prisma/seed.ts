import { PrismaClient } from "@prisma/client";
import { INITIAL_BERITA, INITIAL_AGENDA, INITIAL_MEMBERS, INITIAL_MITRA, INITIAL_ASPIRASI, STATS } from "../src/lib/data";
import { PAGES } from "../src/lib/pages";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Supabase Database Seeding...");

  // 1. Seed Berita
  console.log("Seeding Berita...");
  for (const item of INITIAL_BERITA) {
    await prisma.newsArticle.upsert({
      where: { slug: item.slug },
      update: {},
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

  // 2. Seed Agenda
  console.log("Seeding Agenda...");
  for (const item of INITIAL_AGENDA) {
    await prisma.agendaItem.upsert({
      where: { id: item.id },
      update: {},
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

  // 3. Seed Anggota
  console.log("Seeding Anggota...");
  for (const item of INITIAL_MEMBERS) {
    await prisma.member.upsert({
      where: { id: item.id },
      update: {},
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

  // 4. Seed Mitra Kerja
  console.log("Seeding Mitra Kerja...");
  for (const item of INITIAL_MITRA) {
    await prisma.mitraKerja.upsert({
      where: { id: item.id },
      update: {},
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

  // 5. Seed Aspirasi
  console.log("Seeding Aspirasi...");
  for (const item of INITIAL_ASPIRASI) {
    await prisma.aspirasi.upsert({
      where: { id: item.id },
      update: {},
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

  // 6. Seed Pages
  console.log("Seeding Pages CMS...");
  for (const page of PAGES) {
    await prisma.pageContent.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        sections: page.sections as any,
      },
    });
  }

  // 7. Seed Stats
  console.log("Seeding Site Stats...");
  await prisma.siteStat.upsert({
    where: { id: "default-stats" },
    update: STATS,
    create: {
      id: "default-stats",
      ...STATS,
    },
  });

  console.log("✅ Supabase Database Seeding Completed Successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
