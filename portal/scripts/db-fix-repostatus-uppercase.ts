// portal/scripts/db-fix-repostatus-uppercase.ts
import dotenv from "dotenv";

function loadEnv() {
  const envFile = process.env.ENV_FILE;
  if (envFile) dotenv.config({ path: envFile, override: true });
  dotenv.config({ path: ".env.local" });
  dotenv.config({ path: ".env" });
}

async function main() {
  loadEnv();

  const { prisma } = await import("../src/lib/prisma");

  // Map legacy/uppercase -> valid RepoStatus labels (lowercase)
  const sql = `
    UPDATE "Repo"
    SET status = CASE UPPER(status::text)
      WHEN 'ACTIVE'   THEN 'active'
      WHEN 'LIVE'     THEN 'active'
      WHEN 'ENABLED'  THEN 'active'

      WHEN 'IN_SETUP' THEN 'planned'
      WHEN 'PLANNED'  THEN 'planned'
      WHEN 'TODO'     THEN 'planned'
      WHEN 'BACKLOG'  THEN 'planned'

      WHEN 'FROZEN'   THEN 'frozen'
      WHEN 'LOCKED'   THEN 'frozen'
      WHEN 'BLOCKED'  THEN 'frozen'

      WHEN 'PARKED'   THEN 'parked'
      WHEN 'PAUSED'   THEN 'parked'
      WHEN 'HOLD'     THEN 'parked'
      WHEN 'ARCHIVED' THEN 'parked'
      ELSE status::text
    END::"RepoStatus"
    WHERE UPPER(status::text) IN (
      'ACTIVE','LIVE','ENABLED',
      'IN_SETUP','PLANNED','TODO','BACKLOG',
      'FROZEN','LOCKED','BLOCKED',
      'PARKED','PAUSED','HOLD','ARCHIVED'
    );
  `;

  const updated = await prisma.$executeRawUnsafe(sql);
  console.log("Rows updated:", updated);

  const bad = await prisma.$queryRawUnsafe<
    { status: string; count: string }[]
  >(`
    SELECT status::text AS status, COUNT(*)::bigint::text AS count
    FROM "Repo"
    WHERE status::text NOT IN ('active','frozen','planned','parked')
    GROUP BY status
    ORDER BY COUNT(*) DESC;
  `);

  console.log("Non-canonical statuses remaining:", bad);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
