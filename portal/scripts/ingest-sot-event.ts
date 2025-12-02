// portal/scripts/ingest-sot-event.ts
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';

type RawEvent = {
  ts: string;
  source: string;
  kind: string;
  nhId?: string;
  summary?: string;
  payload?: unknown;

  // optional linkage
  repoId?: number;
  domainId?: number;
  repoName?: string;
  domainName?: string;
};

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: npm run ingest:event -- ./data/my-event.json');
    process.exit(1);
  }

  const absPath = path.resolve(filePath);
  const raw = fs.readFileSync(absPath, 'utf8');
  const event = JSON.parse(raw) as RawEvent;

  // basic validation
  if (!event.ts || !event.source || !event.kind) {
    console.error('Event must include ts, source, kind.');
    process.exit(1);
  }

  let repoId = event.repoId;
  let domainId = event.domainId;

  // Optional: resolve by name when IDs not provided
  if (!repoId && event.repoName) {
    const repo = await prisma.repo.findUnique({
      where: { name: event.repoName },
    });
    repoId = repo?.id;
  }

  if (!domainId && event.domainName) {
    const domain = await prisma.domain.findUnique({
      where: { domain: event.domainName },
    });
    domainId = domain?.id;
  }

  const created = await prisma.sotEvent.create({
    data: {
      ts: new Date(event.ts),
      source: event.source,
      kind: event.kind,
      nhId: event.nhId ?? '',
      summary: event.summary,
      payload: event.payload as any,
      repoId,
      domainId,
    },
  });

  console.log('Created SotEvent id =', created.id);
}

main()
  .catch((err) => {
    console.error('Ingest failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
