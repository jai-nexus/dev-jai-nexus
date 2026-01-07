import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const QUIET = process.env.JAI_QUIET === "1";
const DEBUG = process.env.JAI_DEBUG_PRISMA === "1";
const isProd = process.env.NODE_ENV === "production";

function log(...args: unknown[]) {
  if (QUIET) return;
  if (DEBUG || !isProd) console.log(...args);
}

// Use DIRECT_URL for pool to bypass transaction pooler issues with prepared statements
// Fall back to DATABASE_URL if missing.
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("[lib/prisma] DIRECT_URL or DATABASE_URL must be set");
}

if (!QUIET && DEBUG) {
  try {
    const host = connectionString.split("@")[1]?.split("/")[0] || "unknown";
    console.log("[lib/prisma] DB Host:", host);
  } catch {
    console.log("[lib/prisma] DB Host: unknown");
  }
}

log("[lib/prisma] Initializing module...");

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isProd ? ["error"] : ["error", "warn"],
  });

if (!isProd) globalForPrisma.prisma = prisma;

export { Prisma };
export default prisma;
