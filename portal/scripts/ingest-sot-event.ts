// portal/scripts/ingest-sot-event.ts
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import { recordSotEvent, type SotEventEnvelopeV01 } from '@/lib/sotEvents';

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: npm run ingest:event -- ./data/my-event.json');
    process.exit(1);
  }

  const absPath = path.resolve(filePath);
  const raw = fs.readFileSync(absPath, 'utf8');

  let event: SotEventEnvelopeV01;
  try {
    event = JSON.parse(raw) as SotEventEnvelopeV01;
  } catch (err) {
    console.error('Failed to parse JSON from', absPath, err);
    process.exit(1);
  }

  // Soft version check happens inside recordSotEvent as well,
  // but we can keep this for quick feedback.
  if (event.version && event.version !== 'sot-event-0.1') {
    console.warn(
      `Warning: unexpected sot-event version "${event.version}". ` +
        'Expected "sot-event-0.1". Ingesting anyway.',
    );
  }

  try {
    const created = await recordSotEvent(event);
    console.log('Created SotEvent id =', created.id);
  } catch (err) {
    console.error('Ingest failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
