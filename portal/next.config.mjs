// portal/next.config.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dev-jai-nexus/ (parent of /portal)
const repoRoot = path.resolve(__dirname, "..");

/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    // Must be an absolute path
    root: repoRoot,
  },
};

export default nextConfig;
