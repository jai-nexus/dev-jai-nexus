import { prisma } from "../src/lib/prisma";

async function main() {
  const domains = await prisma.domain.findMany({
    select: { domain: true, repo: { select: { name: true } } },
    orderBy: { domain: "asc" },
  });

  const broken = domains.filter((d) => !d.repo?.name);

  if (broken.length) {
    console.error("❌ Domains missing repo mapping:");
    for (const d of broken) console.error(`- ${d.domain}`);
    process.exit(1);
  }

  console.log(`✅ Domain repo mappings OK (${domains.length} domains)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
