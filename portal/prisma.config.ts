// portal/prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

// Prefer DIRECT_URL (non-pooled) for CLI/migrate when present.
const url = directUrl ?? databaseUrl;

if (!url) {
    throw new Error("[prisma.config] Set DIRECT_URL or DATABASE_URL");
}

export default defineConfig({
    schema: "prisma/schema.prisma",

    // Prisma 7 config expects you to define the datasource URL here.
    datasource: { url },

    // (Optional but often useful with Prisma 7 changes)
    engine: { type: "classic" },

    migrations: {
        seed: "tsx prisma/seed.ts",
    },
});
