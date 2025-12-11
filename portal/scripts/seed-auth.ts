// portal/scripts/seed-auth.ts
import "dotenv/config";
import { prisma } from "@/server/db";
import bcrypt from "bcryptjs";

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const agentPassword = process.env.SEED_AGENT_PASSWORD;

  if (!adminPassword || !agentPassword) {
    throw new Error("Set SEED_ADMIN_PASSWORD and SEED_AGENT_PASSWORD");
  }

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const agentHash = await bcrypt.hash(agentPassword, 10);

  // ADMIN
  await prisma.user.upsert({
    where: { email: "admin@jai.nexus" },
    update: {
      passwordHash: adminHash,
      role: "ADMIN",
    },
    create: {
      email: "admin@jai.nexus",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  // AGENT
  await prisma.user.upsert({
    where: { email: "agent@jai.nexus" },
    update: {
      passwordHash: agentHash,
      role: "AGENT",
    },
    create: {
      email: "agent@jai.nexus",
      passwordHash: agentHash,
      role: "AGENT",
    },
  });

  console.log("Seeded / updated admin@jai.nexus and agent@jai.nexus");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
