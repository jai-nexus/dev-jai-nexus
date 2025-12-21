#!/usr/bin/env tsx

/**
 * Backfill SotEvent.workPacketId for existing WorkPacket SoT events.
 *
 * Safe behavior:
 * - Only updates events where workPacketId IS NULL.
 * - Matches by current WorkPacket.nhId (so it can't recover pre-rename history).
 *
 * Run from portal/:
 *   pnpm tsx scripts/backfill-sotevent-workpacketid.ts
 */

import { prisma } from "../src/lib/prisma";

const KINDS = [
  "WORK_PACKET_CREATED",
  "WORK_PACKET_UPDATED",
  "WORK_PACKET_STATUS_CHANGED",
] as const;

async function main() {
  const packets = await prisma.workPacket.findMany({
    select: { id: true, nhId: true },
  });

  let total = 0;

  for (const p of packets) {
    const res = await prisma.sotEvent.updateMany({
      where: {
        workPacketId: null,
        nhId: p.nhId,
        kind: { in: [...KINDS] },
      },
      data: { workPacketId: p.id },
    });

    total += res.count;
  }

  console.log(`Backfilled workPacketId on ${total} SotEvent rows.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
