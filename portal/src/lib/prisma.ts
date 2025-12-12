// portal/src/lib/prisma.ts
import "dotenv/config";

import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "[prisma] DATABASE_URL is not set – check your .env for DATABASE_URL",
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
