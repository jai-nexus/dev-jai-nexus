// portal/scripts/ingest-sot-event.ts
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '../generated/prisma/client';
import { parseSotTimestamp } from '@/lib/time';

type RawEvent = {
  version?: string;

  ts: string;       // ISO8601 with Z/offset (real event time)
  source: string;   // "chatgpt" | "github" | "notion" | ...
  kind: string;     // "conversation" | "decision" | ...

  nhId?: string;
  summary?: string;
  payload?: Prisma.InputJsonValue;

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

  let event: RawEvent;
  try {
    event = JSON.parse(raw) as RawEvent;
  } catch (err) {
    console.error('Failed to parse JSON from', absPath, err);
    process.exit(1);
  }

  if (!event.ts || !event.source || !event.kind) {
    console.error('Event must include ts, source, kind.');
    process.exit(1);
  }

  if (event.version && event.version !== 'sot-event-0.1') {
    console.warn(
      `Warning: unexpected sot-event version "${event.version}". ` +
        'Expected "sot-event-0.1". Ingesting anyway.',
    );
  }

  // *** Canonical UTC event time ***
  const ts = parseSotTimestamp(event.ts);

  let repoId = event.repoId;
  let domainId = event.domainId;

  if (!repoId && event.repoName) {
    const repo = await prisma.repo.findUnique({
      where: { name: event.repoName },
    });
    if (!repo) {
      console.warn('No Repo found for name:', event.repoName);
    } else {
      repoId = repo.id;
    }
  }

  if (!domainId && event.domainName) {
    const domain = await prisma.domain.findUnique({
      where: { domain: event.domainName },
    });
    if (!domain) {
      console.warn('No Domain found for domain:', event.domainName);
    } else {
      domainId = domain.id;
    }
  }

  const created = await prisma.sotEvent.create({
    data: {
      ts, // <- true event instant in UTC
      source: event.source,
      kind: event.kind,
      nhId: event.nhId ?? '',
      summary: event.summary,
      payload: event.payload,
      repoId,
      domainId,
      // createdAt is set by DB @default(now())
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
