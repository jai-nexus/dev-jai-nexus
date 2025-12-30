// portal/scripts/ingest-sot-event.ts
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '../generated/prisma/client';
import { parseSotTimestamp } from '@/lib/time';

type RawEvent = {
  version?: string;

  ts: string; // ISO8601 with Z/offset (real event time)
  source: string; // "chatgpt" | "github" | "notion" | ...
  kind: string; // "conversation" | "decision" | ...

  nhId?: string;
  summary?: string;
  payload?: Prisma.InputJsonValue;

  repoId?: number;
  domainId?: number;
  repoName?: string;
  domainName?: string;
};

function usage() {
  console.error(
    [
      'Usage:',
      '  pnpm ingest:event -- <file.json | file.jsonl>',
      '  pnpm ingest:event -- --file <file.json | file.jsonl>',
      '  pnpm ingest:event -- --stdin',
      '',
      'Notes:',
      '- JSONL = one JSON object per line (blank lines ignored).',
      '- You may pass "-" as a filename to read from stdin.',
    ].join('\n'),
  );
}

function parseArgs(argv: string[]) {
  let filePath: string | undefined;
  let useStdin = false;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    if (a === '--file') {
      filePath = argv[i + 1];
      i++;
      continue;
    }

    if (a === '--stdin') {
      useStdin = true;
      continue;
    }

    if (a === '-' && !filePath) {
      useStdin = true;
      continue;
    }

    // first non-flag positional
    if (!a.startsWith('-') && !filePath) {
      filePath = a;
      continue;
    }
  }

  if (filePath === '-') useStdin = true;
  return { filePath, useStdin };
}

function parseEventsFromText(text: string, label: string): RawEvent[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  // JSON array
  if (trimmed.startsWith('[')) {
    try {
      const arr = JSON.parse(trimmed);
      if (!Array.isArray(arr)) throw new Error('Expected JSON array');
      return arr as RawEvent[];
    } catch (err) {
      console.error('Failed to parse JSON array from', label, err);
      process.exit(1);
    }
  }

  // JSONL or single object
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    const out: RawEvent[] = [];
    for (let i = 0; i < lines.length; i++) {
      try {
        out.push(JSON.parse(lines[i]) as RawEvent);
      } catch (err) {
        console.error(`Failed to parse JSONL line ${i + 1} from ${label}`, err);
        process.exit(1);
      }
    }
    return out;
  }

  // single JSON object
  try {
    return [JSON.parse(trimmed) as RawEvent];
  } catch (err) {
    console.error('Failed to parse JSON from', label, err);
    process.exit(1);
  }
}

async function resolveRepoDomainIds(event: RawEvent) {
  let repoId = event.repoId;
  let domainId = event.domainId;

  if (!repoId && event.repoName) {
    const repo = await prisma.repo.findUnique({ where: { name: event.repoName } });
    if (!repo) console.warn('No Repo found for name:', event.repoName);
    else repoId = repo.id;
  }

  if (!domainId && event.domainName) {
    const domain = await prisma.domain.findUnique({
      where: { domain: event.domainName },
    });
    if (!domain) console.warn('No Domain found for domain:', event.domainName);
    else domainId = domain.id;
  }

  return { repoId, domainId };
}

async function main() {
  const { filePath, useStdin } = parseArgs(process.argv.slice(2));
  if (!filePath && !useStdin) {
    usage();
    process.exit(1);
  }

  let raw: string;
  let label = '<stdin>';

  if (useStdin) {
    raw = fs.readFileSync(0, 'utf8'); // stdin
  } else {
    const absPath = path.isAbsolute(filePath!)
      ? filePath!
      : path.resolve(process.cwd(), filePath!);
    label = absPath;

    if (!fs.existsSync(absPath)) {
      console.error('File not found:', absPath);
      console.error(
        'Tip: running from dev-jai-nexus/portal, audit-nexus is usually at ..\\..\\audit-nexus\\...',
      );
      process.exit(1);
    }

    raw = fs.readFileSync(absPath, 'utf8');
  }

  const events = parseEventsFromText(raw, label);
  if (events.length === 0) {
    console.warn('No events found in', label);
    return;
  }

  const acceptedVersions = new Set(['sot-event-0.1', '0.1']);

  let createdCount = 0;

  for (const event of events) {
    if (!event.ts || !event.source || !event.kind) {
      console.error('Event must include ts, source, kind. Offending event:', event);
      process.exit(1);
    }

    if (event.version && !acceptedVersions.has(event.version)) {
      console.warn(
        `Warning: unexpected sot-event version "${event.version}". ` +
          'Expected "sot-event-0.1" (or "0.1"). Ingesting anyway.',
      );
    }

    const ts = parseSotTimestamp(event.ts);
    const { repoId, domainId } = await resolveRepoDomainIds(event);

    const created = await prisma.sotEvent.create({
      data: {
        ts,
        source: event.source,
        kind: event.kind,
        nhId: event.nhId ?? '',
        summary: event.summary,
        payload: event.payload,
        repoId,
        domainId,
      },
    });

    createdCount++;
    console.log('Created SotEvent id =', created.id);
  }

  console.log(`Done. Created ${createdCount} SotEvent(s).`);
}

main()
  .catch((err) => {
    console.error('Ingest failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
