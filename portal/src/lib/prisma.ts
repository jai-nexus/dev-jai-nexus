// portal/src/lib/prisma.ts
console.log("[lib/prisma] Initializing module...");

import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

// Use DIRECT_URL for pool to bypass any transaction pooler issues with prepared statements
// But fall back to DATABASE_URL if missing.
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("[lib/prisma] DIRECT_URL or DATABASE_URL must be set");
}

console.log("[lib/prisma] Using DB Host:", connectionString.split('@')[1]?.split('/')[0] || "unknown");

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { Prisma };
export default prisma;
