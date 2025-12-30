// portal/src/lib/prisma.ts
import { PrismaClient, Prisma } from "../../prisma/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

export { Prisma };

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  throw new Error("[prisma] DATABASE_URL or DIRECT_URL is not set");
}

// Cache both prisma + pool in dev to avoid connection storms during HMR
type GlobalForPrisma = typeof globalThis & {
  prisma?: PrismaClient;
  prismaPool?: pg.Pool;
};

const g = globalThis as GlobalForPrisma;

const pool = g.prismaPool ?? new Pool({ connectionString });
if (process.env.NODE_ENV !== "production") g.prismaPool = pool;

const adapter = new PrismaPg(pool);

export const prisma =
  g.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  g.prisma = prisma;
}

export default prisma;
