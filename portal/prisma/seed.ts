// portal/prisma/seed.ts
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Using DATABASE_URL:", process.env.DATABASE_URL);

  const repos = [
    {
      name: "jai-nexus/dev-jai-nexus",
      nhId: "2.1.2",
      domainPod: "jai.nexus",
      engineGroup: "frontend",
      status: "ACTIVE",
      githubUrl: "https://github.com/jai-nexus/dev-jai-nexus",
      defaultBranch: "main",
    },
    // add more as you like
  ];

  for (const repo of repos) {
    await prisma.repo.upsert({
      where: { name: repo.name },
      update: repo,
      create: repo,
    });
  }

  console.log("✅ Seed complete — repos inserted/updated.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
