import { prisma } from "../src/lib/prisma";

async function main() {
  const [workPackets, items] = await Promise.all([
    prisma.workPacket.findMany({ select: { id: true }, orderBy: { id: "asc" } }),
    prisma.agentInboxItem.findMany({
      select: { id: true, workPacketId: true, createdAt: true },
      orderBy: [{ workPacketId: "asc" }, { id: "asc" }],
    }),
  ]);

  const wpSet = new Set(workPackets.map((w) => w.id));

  // orphans (will fail FK constraint if migration adds it)
  const orphans = items.filter((it) => !wpSet.has(it.workPacketId));

  // duplicates (will fail UNIQUE(workPacketId))
  const groups = new Map<number, number[]>();
  for (const it of items) {
    const arr = groups.get(it.workPacketId) ?? [];
    arr.push(it.id);
    groups.set(it.workPacketId, arr);
  }
  const dups = [...groups.entries()].filter(([, ids]) => ids.length > 1);

  console.log("WorkPackets:", workPackets.length);
  console.log("AgentInboxItems:", items.length);

  console.log("Orphan AgentInboxItems:", orphans.length);
  for (const it of orphans.slice(0, 50)) {
    console.log("  orphan item id", it.id, "workPacketId", it.workPacketId);
  }
  if (orphans.length > 50) console.log("  (more orphans omitted)");

  console.log("Duplicate workPacketId groups:", dups.length);
  for (const [wpId, ids] of dups.slice(0, 50)) {
    console.log("  workPacketId", wpId, "ids", ids);
  }
  if (dups.length > 50) console.log("  (more dup groups omitted)");
}

main()
  .catch((e) => {
    console.error("❌ check failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
