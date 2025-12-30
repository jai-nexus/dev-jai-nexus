// portal/scripts/fix-repostatus-legacy.ts
import dotenv from "dotenv";

const envFile = (process.env.ENV_FILE?.trim() || ".env.local").trim();

// ✅ ENV_FILE should win
dotenv.config({ path: envFile, override: true });
// ✅ .env is fallback only
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

  // 1) Rename enum labels if prod still uses uppercase labels
  await prisma.$executeRawUnsafe(`
DO $$
DECLARE type_name text;
BEGIN
  SELECT t.typname INTO type_name
  FROM pg_type t
  WHERE lower(t.typname) = lower('RepoStatus')
  LIMIT 1;

  IF type_name IS NULL THEN
    RAISE NOTICE 'RepoStatus enum type not found; skipping enum label rename.';
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE lower(t.typname) = lower('RepoStatus') AND e.enumlabel = 'ACTIVE'
  ) THEN
    EXECUTE format('ALTER TYPE %I RENAME VALUE ''ACTIVE'' TO ''active''', type_name);
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE lower(t.typname) = lower('RepoStatus') AND e.enumlabel = 'FROZEN'
  ) THEN
    EXECUTE format('ALTER TYPE %I RENAME VALUE ''FROZEN'' TO ''frozen''', type_name);
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE lower(t.typname) = lower('RepoStatus') AND e.enumlabel = 'PLANNED'
  ) THEN
    EXECUTE format('ALTER TYPE %I RENAME VALUE ''PLANNED'' TO ''planned''', type_name);
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE lower(t.typname) = lower('RepoStatus') AND e.enumlabel = 'PARKED'
  ) THEN
    EXECUTE format('ALTER TYPE %I RENAME VALUE ''PARKED'' TO ''parked''', type_name);
  END IF;
END $$;
  `);

  // 2) Normalize legacy row values.
  // IMPORTANT: do not use CASE-to-text then cast (that breaks on enum name drift).
  // Do simple targeted updates instead — works for enum OR text columns.
  await prisma.$executeRawUnsafe(`
    UPDATE "Repo" SET status = 'active'
    WHERE status IS NOT NULL AND UPPER(status::text) IN ('ACTIVE','LIVE','ENABLED');
  `);

  await prisma.$executeRawUnsafe(`
    UPDATE "Repo" SET status = 'planned'
    WHERE status IS NOT NULL AND UPPER(status::text) IN ('IN_SETUP','PLANNED','TODO','BACKLOG');
  `);

  await prisma.$executeRawUnsafe(`
    UPDATE "Repo" SET status = 'frozen'
    WHERE status IS NOT NULL AND UPPER(status::text) IN ('FROZEN','LOCKED','BLOCKED');
  `);

  await prisma.$executeRawUnsafe(`
    UPDATE "Repo" SET status = 'parked'
    WHERE status IS NOT NULL AND UPPER(status::text) IN ('PARKED','PAUSED','HOLD','ARCHIVED');
  `);

  // 3) Report final state
  const labels = await prisma.$queryRaw<Array<{ enumlabel: string }>>`
    SELECT e.enumlabel::text AS enumlabel
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE lower(t.typname) = lower('RepoStatus')
    ORDER BY e.enumsortorder;
  `;
  console.log("RepoStatus enum labels:", labels.map((r) => r.enumlabel));

  const counts = await prisma.$queryRaw<Array<{ status: string | null; count: bigint }>>`
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
