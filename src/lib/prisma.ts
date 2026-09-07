import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function buildClient(): PrismaClient {
  // Connect directly through Supabase's reliable direct port (DIRECT_URL).
  // The pooler URL (DATABASE_URL) is a single-connection PgBouncer that makes
  // every parallel query/request slow and occasionally times out, which causes
  // the CMS to fall back to static defaults and feel unresponsive. Using the
  // direct connection keeps reads & writes fast and reliable.
  const directUrl = process.env.DIRECT_URL;
  return new PrismaClient({
    datasources: directUrl ? { db: { url: directUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma || buildClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
