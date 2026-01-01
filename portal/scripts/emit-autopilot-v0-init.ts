// portal/scripts/emit-autopilot-v0-init.ts

import 'dotenv/config';
import crypto from 'node:crypto';
import { prisma } from '../src/lib/prisma';

async function main() {
  const now = new Date();

  await prisma.sotEvent.create({
    data: {
      eventId: crypto.randomUUID(),
      ts: now,
      source: 'bootstrap-script',
      kind: 'AUTOPILOT_PROJECT_REGISTERED',
      summary:
        'Registered JAI Autopilot Agent v0 as internal Tier-0 project.',
      nhId: '1.3',
      payload: {
        projectId: 'jai-autopilot.v0',
        name: 'JAI Autopilot Agent v0',
        rootNhId: '1.3',
        tier: 0,
        status: 'planned',
        repo: 'JerryIngram/jai-autopilot-win',
        ownerAgentNhId: '1.1',
        notes:
          'Local Windows agent that watches builds, calls LLMs for fixes, and emits AUTOPILOT_* SoT events.',
      },
    },
  });

  console.log(
    'Autopilot v0 project registration event written to SotEvent table.',
  );
}

main()
  .catch((err) => {
    console.error('Error writing Autopilot v0 event:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
