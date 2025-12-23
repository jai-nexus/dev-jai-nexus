import { prisma } from "../src/lib/prisma";

async function main() {
  const rows = await prisma.domain.findMany({
    select: { id: true, domain: true },
    orderBy: { domain: "asc" },
    take: 200,
  });

  console.log(`Domains in this DB: ${rows.length}`);
  for (const r of rows) console.log(`- ${r.domain} (id=${r.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
