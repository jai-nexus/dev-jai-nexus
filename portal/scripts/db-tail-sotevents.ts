// portal/scripts/db-tail-sotevents.ts
import dotenv from "dotenv";

const envFile = process.env.ENV_FILE || ".env.local";
dotenv.config({ path: envFile, override: true });
dotenv.config({ path: ".env", override: false });

const { prisma } = await import("../src/lib/prisma");

async function main() {
  const e = await prisma.sotEvent.findMany({
    take: 10,
    orderBy: { ts: "desc" },
    select: { id: true, ts: true, kind: true, source: true, nhId: true, repoId: true, domainId: true },
  });

  console.log(
    e.map((x) => ({
      id: x.id,
      ts: x.ts.toISOString(),
      kind: x.kind,
      source: x.source,
      nhId: x.nhId,
      repoId: x.repoId,
      domainId: x.domainId,
    })),
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
