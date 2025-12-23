// portal/prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prefer DIRECT_URL when available (non-pooled). Fall back to DATABASE_URL.
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!url) {
  throw new Error("[prisma.config] Set DIRECT_URL or DATABASE_URL");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url,
    // shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL, // optional
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
