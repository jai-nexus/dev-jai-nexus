// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // 1) Global ignores (replaces .eslintignore)
  globalIgnores([
    // Node / Next
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",

    // Prisma client + artifacts
    "generated/**",
    "prisma/migrations/**",

    // Vercel / misc
    ".vercel/**",

    // Legacy script we don't care to lint right now
    "scripts/jai-dump-event.ts",

    // Next’s auto-generated types
    "next-env.d.ts",
  ]),

  // 2) Next.js recommended configs
  ...nextVitals,
  ...nextTs,
]);

export default eslintConfig;
