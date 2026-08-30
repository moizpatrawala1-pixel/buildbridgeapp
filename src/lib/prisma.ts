// src/lib/prisma.ts
//
// A single shared Prisma client instance, using the pg driver adapter —
// required as of Prisma 7, which no longer connects to Postgres
// automatically from just a connection string on the client constructor.
//
// Why the global-caching pattern: in Next.js dev mode, every file save
// triggers a hot reload, which re-runs this module. Without caching the
// client on globalThis, that means a brand new PrismaClient (and a brand
// new connection pool) on every save, with old ones never cleaned up —
// leave that running for an afternoon and you can exhaust your database's
// connection limit, especially on Neon's free tier where that limit is low.

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}