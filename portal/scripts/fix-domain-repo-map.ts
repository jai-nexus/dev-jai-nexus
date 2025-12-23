import { prisma } from "../src/lib/prisma";

async function connectDomainToRepo(domainHost: string, repoName: string) {
  const domain = await prisma.domain.findFirst({
    where: { domain: domainHost },
    select: { id: true, domain: true },
  });

  if (!domain) {
    throw new Error(`Domain not found in this DB: ${domainHost}`);
  }

  const repo = await prisma.repo.findFirst({
    where: { name: repoName }, // adjust if your Repo unique field isn't "name"
    select: { id: true, name: true },
  });

  if (!repo) {
    throw new Error(`Repo not found in this DB: ${repoName}`);
  }

  await prisma.domain.update({
    where: { id: domain.id },
    data: { repo: { connect: { id: repo.id } } },
  });

  console.log(`✅ ${domain.domain} -> ${repo.name}`);
}

async function main() {
  await connectDomainToRepo("dev.jai.nexus", "jai-nexus/dev-jai-nexus");
  await connectDomainToRepo("infra.nexus", "jai-nexus/docs-nexus"); // set this to truth
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
