// portal/prisma/seed.ts
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Using DATABASE_URL:", process.env.DATABASE_URL);

  // --- 1) Seed core repos -----------------------------------
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
    // add more as needed
  ];

  for (const repo of repos) {
    await prisma.repo.upsert({
      where: { name: repo.name },
      update: repo,
      create: repo,
    });
  }

  console.log("✅ Repos seeded");

  // --- 2) Seed operator users --------------------------------

  const adminHash = await bcrypt.hash("admin1234", 12);
  const agentHash = await bcrypt.hash("agent1234", 12);

  const users = [
    {
      email: "admin@jai.nexus",
      name: "JAI Admin",
      role: "ADMIN" as const,
      passwordHash: adminHash,
    },
    {
      email: "agent@jai.nexus",
      name: "JAI Agent",
      role: "AGENT" as const,
      passwordHash: agentHash,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash: user.passwordHash,
      },
      create: user,
    });
  }

  console.log("✅ Users seeded (admin@jai.nexus / agent@jai.nexus)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
