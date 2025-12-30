// portal/scripts/fix-repostatus-legacy.ts
import dotenv from "dotenv";

// Load ENV_FILE first (e.g. .env.vercel.production), and make it win
const envFile = (process.env.ENV_FILE?.trim() || ".env.local").trim();
dotenv.config({ path: envFile, override: true });

// .env is fallback only (never override ENV_FILE)
dotenv.config({ path: ".env", override: false });

const { prisma } = await import("../src/lib/prisma");

async function main() {
  console.log("ENV_FILE =", envFile);
  console.log("DATABASE_URL =", process.env.DATABASE_URL ? "[set]" : "[unset]");
  console.log("DIRECT_URL   =", process.env.DIRECT_URL ? "[set]" : "[unset]");

  // 1) Detect column type
  const col = await prisma.$queryRaw<Array<{ data_type: string; udt_name: string }>>`
    SELECT data_type, udt_name
    FROM information_schema.columns
    WHERE table_schema='public' AND table_name='Repo' AND column_name='status'
    LIMIT 1;
  `;

  const udt = col[0]?.udt_name ?? "(unknown)";
  console.log("Repo.status udt_name =", udt);

  // 2) Rename enum labels if prod still uses uppercase labels
  await prisma.$executeRawUnsafe(`
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'RepoStatus' AND e.enumlabel = 'ACTIVE'
  ) THEN
    EXECUTE 'ALTER TYPE "RepoStatus" RENAME VALUE ''ACTIVE'' TO ''active''';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'RepoStatus' AND e.enumlabel = 'FROZEN'
  ) THEN
    EXECUTE 'ALTER TYPE "RepoStatus" RENAME VALUE ''FROZEN'' TO ''frozen''';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'RepoStatus' AND e.enumlabel = 'PLANNED'
  ) THEN
    EXECUTE 'ALTER TYPE "RepoStatus" RENAME VALUE ''PLANNED'' TO ''planned''';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'RepoStatus' AND e.enumlabel = 'PARKED'
  ) THEN
    EXECUTE 'ALTER TYPE "RepoStatus" RENAME VALUE ''PARKED'' TO ''parked''';
  END IF;
END $$;
  `);

  // 3) Normalize any legacy row values
  if (udt === "RepoStatus") {
    await prisma.$executeRawUnsafe(`
      UPDATE "Repo"
      SET status = (
        CASE UPPER(status::text)
          WHEN 'ACTIVE'   THEN 'active'
          WHEN 'FROZEN'   THEN 'frozen'
          WHEN 'PLANNED'  THEN 'planned'
          WHEN 'PARKED'   THEN 'parked'
          WHEN 'IN_SETUP' THEN 'planned'
          WHEN 'ARCHIVED' THEN 'parked'
          WHEN 'BLOCKED'  THEN 'frozen'
          ELSE status::text
        END
      )::"RepoStatus"
      WHERE status IS NOT NULL
        AND UPPER(status::text) IN ('ACTIVE','FROZEN','PLANNED','PARKED','IN_SETUP','ARCHIVED','BLOCKED');
    `);
  } else {
    await prisma.$executeRawUnsafe(`
      UPDATE "Repo"
      SET status = (
        CASE UPPER(status::text)
          WHEN 'ACTIVE'   THEN 'active'
          WHEN 'FROZEN'   THEN 'frozen'
          WHEN 'PLANNED'  THEN 'planned'
          WHEN 'PARKED'   THEN 'parked'
          WHEN 'IN_SETUP' THEN 'planned'
          WHEN 'ARCHIVED' THEN 'parked'
          WHEN 'BLOCKED'  THEN 'frozen'
          ELSE status::text
        END
      )
      WHERE status IS NOT NULL
        AND UPPER(status::text) IN ('ACTIVE','FROZEN','PLANNED','PARKED','IN_SETUP','ARCHIVED','BLOCKED');
    `);
  }

  // 4) Report final state
  const labels = await prisma.$queryRaw<Array<{ enumlabel: string }>>`
    SELECT e.enumlabel
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'RepoStatus'
    ORDER BY e.enumsortorder;
  `;
  console.log("RepoStatus enum labels:", labels.map((r) => r.enumlabel));

  const counts = await prisma.$queryRaw<Array<{ status: string; count: bigint }>>`
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
