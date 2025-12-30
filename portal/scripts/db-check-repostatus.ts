// portal/scripts/db-check-repostatus.ts
import dotenv from "dotenv";

const envFile = (process.env.ENV_FILE || ".env.local").trim();

// ✅ ENV_FILE should win
dotenv.config({ path: envFile, override: true });
// ✅ .env is fallback only (do NOT override ENV_FILE)
dotenv.config({ path: ".env", override: false });

// Import Prisma AFTER env is loaded
const { prisma } = await import("../src/lib/prisma");

function safeDbInfo() {
  const raw = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!raw) return { ok: false as const, msg: "DATABASE_URL/DIRECT_URL unset" };

  try {
    const u = new URL(raw);
    return {
      ok: true as const,
      host: u.host,
      db: u.pathname,
      hasSsl: u.searchParams.has("sslmode") || u.searchParams.has("ssl"),
    };
  } catch {
    return { ok: false as const, msg: "Connection string not parseable as URL" };
  }
}

async function main() {
  console.log("ENV_FILE     =", envFile);
  console.log("DATABASE_URL =", process.env.DATABASE_URL ? "[set]" : "[unset]");
  console.log("DIRECT_URL   =", process.env.DIRECT_URL ? "[set]" : "[unset]");

  const info = safeDbInfo();
  if (info.ok) console.log("DB =", { host: info.host, db: info.db, ssl: info.hasSsl });
  else console.log("DB =", info.msg);

  const enumLabels = await prisma.$queryRaw<{ enumlabel: string }[]>`
    SELECT e.enumlabel::text AS enumlabel
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE lower(t.typname) = lower('RepoStatus')
    ORDER BY e.enumsortorder;
  `;
  console.log("RepoStatus enum labels:", enumLabels.map((r) => r.enumlabel));

  const counts = await prisma.$queryRaw<{ status: string | null; count: bigint }[]>`
    SELECT status::text AS status, COUNT(*)::bigint AS count
    FROM "Repo"
    GROUP BY status
    ORDER BY COUNT(*) DESC;
  `;
  console.log(
    "Repo.status counts:",
    counts.map((r) => ({ status: r.status, count: r.count.toString() })),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
