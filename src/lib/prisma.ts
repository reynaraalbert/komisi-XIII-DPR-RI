import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use Supabase's transaction pooler (DATABASE_URL, port 6543 + pgbouncer=true).
// This pooler is designed for apps that issue many short queries in parallel
// (like this CMS endpoint that reads several collections at once) and reuses a
// shared pool, so it never hits the "session mode: max clients" limit that the
// direct connection (DIRECT_URL, port 5432) hits under load.
//
// The connection_limit (set on the URL in .env) caps how many connections
// Prisma opens at once against that pooler. Raises it from the old 1 so that
// parallel reads/writes no longer get serialized (which made the CMS slow).
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
