// scripts/ingest-sample-sot-event.ts

// 1) Load .env so DATABASE_URL is available
import 'dotenv/config';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import crypto from 'node:crypto';
import sampleEvent from './sample-sot-event.json';

// Infer the shape of the JSON to keep TS happy
type SampleEvent = {
  ts: string;
  source: string;
  kind: string;
  nhId?: string;
  summary?: string;
  payload?: unknown;
  repoId?: number;
  domainId?: number;
};

async function main() {
  const e = sampleEvent as SampleEvent;

  const created = await prisma.sotEvent.create({
    data: {
      eventId: crypto.randomUUID(),
      ts: new Date(e.ts),
      source: e.source,
      kind: e.kind,
      nhId: e.nhId ?? '',
      summary: e.summary ?? null,
      payload: (e.payload as any) ?? Prisma.DbNull,
      repoId: e.repoId ?? null,
      domainId: e.domainId ?? null,
    },
  });

  console.log('Created SotEvent with id:', created.id);
}

main()
  .catch((err) => {
    console.error('Ingest failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
