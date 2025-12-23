// portal/next.config.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// IMPORTANT: allow Turbopack to resolve workspace deps (pnpm store)
// by setting root to the repo root (parent of /portal)
const turbopackRoot = path.resolve(__dirname, "..");

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: turbopackRoot,
  },
};

export default nextConfig;
