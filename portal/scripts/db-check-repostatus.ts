// portal/scripts/db-check-repostatus.ts
import dotenv from "dotenv";

// Allow selecting a specific env file (defaults to .env.local)
const envFile = process.env.ENV_FILE || ".env.local";

// Force override so the selected env file wins (important for prod checks)
dotenv.config({ path: envFile, override: true });
dotenv.config({ path: ".env", override: true });

const { prisma } = await import("../src/lib/prisma");

async function main() {
  console.log("ENV_FILE     =", envFile);
  console.log("DATABASE_URL =", process.env.DATABASE_URL ? "[set]" : "[unset]");
  console.log("DIRECT_URL   =", process.env.DIRECT_URL ? "[set]" : "[unset]");

  const enumLabels = await prisma.$queryRaw<{ enumlabel: string }[]>`
    SELECT e.enumlabel::text AS enumlabel
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'RepoStatus'
    ORDER BY e.enumsortorder;
  `;
  console.log("RepoStatus enum labels:", enumLabels.map((r) => r.enumlabel));

  const counts = await prisma.$queryRaw<{ status: string; count: bigint }[]>`
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
