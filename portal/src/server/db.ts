// portal/src/server/db.ts
import { PrismaPg } from "@prisma/adapter-pg";
// IMPORTANT: import from generated client, not "@prisma/client"
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("[prisma] DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Singleton Prisma Client (Prisma 7 + driver adapter)
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
