// portal/scripts/db-check-tables.ts
import dotenv from "dotenv";

const envFile = process.env.ENV_FILE || ".env.local";
dotenv.config({ path: envFile, override: true });
dotenv.config({ path: ".env", override: false });

const { prisma } = await import("../src/lib/prisma");

function safeParseDb(urlStr: string | undefined) {
  if (!urlStr) return null;
  try {
    const u = new URL(urlStr);
    return { host: u.host, db: u.pathname, ssl: u.searchParams.get("sslmode") ?? null };
  } catch {
    return { host: "(unparseable)", db: "(unparseable)", ssl: null };
  }
}

async function main() {
  console.log("ENV_FILE     =", envFile);
  console.log("DATABASE_URL =", process.env.DATABASE_URL ? "[set]" : "[unset]");
  console.log("DIRECT_URL   =", process.env.DIRECT_URL ? "[set]" : "[unset]");
  console.log("DB           =", safeParseDb(process.env.DATABASE_URL || process.env.DIRECT_URL || undefined));

  // Use queryRawUnsafe to avoid PowerShell/backtick/template literal problems.
  const rows = await prisma.$queryRawUnsafe<{ t: string | null }[]>(
    `SELECT to_regclass('public."AgentInboxItem"') AS t`,
  );
  const rows2 = await prisma.$queryRawUnsafe<{ t: string | null }[]>(
    `SELECT to_regclass('public."WorkPacket"') AS t`,
  );
  const rows3 = await prisma.$queryRawUnsafe<{ t: string | null }[]>(
    `SELECT to_regclass('public."SotEvent"') AS t`,
  );

  console.log('AgentInboxItem =', rows?.[0]?.t ?? null);
  console.log('WorkPacket     =', rows2?.[0]?.t ?? null);
  console.log('SotEvent       =', rows3?.[0]?.t ?? null);

  // Quick counts (helps sanity check which DB you’re on)
  const counts = await prisma.$queryRawUnsafe<{ table: string; count: bigint }[]>(
    `
    SELECT 'AgentInboxItem' as table, COUNT(*)::bigint as count FROM "AgentInboxItem"
    UNION ALL
    SELECT 'WorkPacket' as table, COUNT(*)::bigint as count FROM "WorkPacket"
    UNION ALL
    SELECT 'SotEvent' as table, COUNT(*)::bigint as count FROM "SotEvent"
    `,
  );

  console.log(
    "Counts:",
    counts.map((r) => ({ table: r.table, count: r.count.toString() })),
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
