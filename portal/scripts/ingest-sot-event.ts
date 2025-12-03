// portal/scripts/ingest-sot-event.ts
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

type RawEvent = {
  // optional schema version (recommended: "sot-event-0.1")
  version?: string;

  ts: string;         // ISO timestamp
  source: string;     // "chatgpt" | "github" | "notion" | ...
  kind: string;       // "conversation" | "decision" | "task" | ...

  nhId?: string;
  summary: string;    // v0.1: required for dashboards
  payload?: Prisma.InputJsonValue;

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

  let event: RawEvent;
  try {
    event = JSON.parse(raw) as RawEvent;
  } catch (err) {
    console.error('Failed to parse JSON from', absPath, err);
    process.exit(1);
  }

  // Optional: soft version check
  if (event.version && event.version !== 'sot-event-0.1') {
    console.warn(
      `Warning: unexpected sot-event version "${event.version}". ` +
        'Expected "sot-event-0.1". Ingesting anyway.',
    );
  }

  // basic validation
  if (!event.ts || !event.source || !event.kind || !event.summary) {
    console.error('Event must include ts, source, kind, summary.');
    process.exit(1);
  }

  const ts = new Date(event.ts);
  if (Number.isNaN(ts.getTime())) {
    console.error('Invalid ts timestamp:', event.ts);
    process.exit(1);
  }

  let repoId = event.repoId;
  let domainId = event.domainId;

  // Optional: resolve by name when IDs not provided
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
      ts,
      source: event.source,
      kind: event.kind,
      nhId: event.nhId ?? '',
      summary: event.summary,
      payload: event.payload ?? null, // Prisma.InputJsonValue | null
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
