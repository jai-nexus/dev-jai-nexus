// portal/prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    // This is the command Prisma runs for `prisma db seed`
    seed: "tsx prisma/seed.ts",
  },
});
