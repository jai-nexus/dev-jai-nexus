// portal/prisma/seed.ts
import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function seedRepos() {
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

  console.log("✅ Repo registry seeded");
}

async function seedUsers() {
  // ADMIN
  const adminPasswordHash = await bcrypt.hash("admin1234", 12);
  await prisma.user.upsert({
    where: { email: "admin@jai.nexus" },
    update: {
      name: "JAI Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
    create: {
      email: "admin@jai.nexus",
      name: "JAI Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
  });

  // AGENT (optional helper login)
  const agentPasswordHash = await bcrypt.hash("agent1234", 12);
  await prisma.user.upsert({
    where: { email: "agent@jai.nexus" },
    update: {
      name: "JAI Agent",
      role: "AGENT",
      passwordHash: agentPasswordHash,
    },
    create: {
      email: "agent@jai.nexus",
      name: "JAI Agent",
      role: "AGENT",
      passwordHash: agentPasswordHash,
    },
  });

  console.log("✅ Users seeded: admin@jai.nexus, agent@jai.nexus");
}

async function main() {
  console.log("🌱 Using DATABASE_URL:", process.env.DATABASE_URL);
  await seedRepos();
  await seedUsers();
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
