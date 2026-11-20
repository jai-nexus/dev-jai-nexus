import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const wrapperPath = fileURLToPath(import.meta.url);
const offlineUrl = "postgresql://offline:offline@127.0.0.1:5432/offline_verify?schema=public";

export function resolvePrismaPaths(scriptPath, paths = path) {
  const portalDir = paths.dirname(paths.dirname(scriptPath));
  return { portalDir, prismaCliPath: paths.join(portalDir, "node_modules", "prisma", "build", "index.js") };
}

export function buildPrismaEnv(parent) {
  return {
    ...parent,
    // Prisma 7.1.0 validates and generates with WASM. This non-executable
    // file satisfies its startup presence check without fetching an engine.
    PRISMA_SCHEMA_ENGINE_BINARY: wrapperPath,
    CHECKPOINT_DISABLE: "1",
    DATABASE_URL: parent.DATABASE_URL || offlineUrl,
    DIRECT_URL: parent.DIRECT_URL || offlineUrl,
  };
}

function run(args) {
  const [command] = args;
  if (args.length !== 1 || (command !== "validate" && command !== "generate")) {
    console.error("Usage: node prisma-offline.mjs <validate|generate> (exactly one argument)");
    return 1;
  }

  const { portalDir, prismaCliPath } = resolvePrismaPaths(wrapperPath);
  if (!statSync(prismaCliPath, { throwIfNoEntry: false })?.isFile()) {
    console.error(`Local Prisma CLI missing: ${prismaCliPath}`);
    return 1;
  }
  const result = spawnSync(process.execPath, [prismaCliPath, command], {
    cwd: portalDir,
    env: buildPrismaEnv(process.env),
    stdio: "inherit",
  });
  if (result.error) console.error(result.error.message);
  if (result.signal) console.error(`Prisma terminated by ${result.signal}`);
  return result.status ?? 1;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  process.exitCode = run(process.argv.slice(2));
}
