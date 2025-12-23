import { prisma } from "../src/lib/prisma";

async function main() {
  const rows = await prisma.repo.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
    take: 500,
  });

  console.log(`Repos in this DB: ${rows.length}`);
  for (const r of rows) console.log(`- ${r.name} (id=${r.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
