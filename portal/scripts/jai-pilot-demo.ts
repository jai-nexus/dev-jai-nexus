#!/usr/bin/env tsx

import { prisma } from "../src/lib/prisma";

async function main() {
  const session = await prisma.pilotSession.create({
    data: {
      projectKey: "Dev<INFRA>Ops",
      waveLabel: "Wave 7",
      mode: "observer",
      surface: "web",
      createdBy: "admin@jai.nexus",
    },
  });

  await prisma.pilotAction.create({
    data: {
      sessionId: session.id,
      mode: "observer",
      actionType: "note",
      reason: "Initial demo action in observer mode.",
    },
  });

  console.log("Created demo PilotSession + PilotAction:", session.id);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
