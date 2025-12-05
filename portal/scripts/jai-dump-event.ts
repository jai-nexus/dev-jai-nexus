// scripts/jai-dump-event.ts (sketch)
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

/**
 * Determine an event timestamp from a raw chat dump.
 *
 * Prefer explicit timestamps provided in the chat (e.g. `ts`, `startedAt`,
 * the first message’s `ts` or `createdAt`). If no valid candidate is found,
 * fall back to the current time (UTC) to preserve ingestion semantics.
 */
function resolveTimestamp(payload: any): string {
  const candidates = [
    payload?.ts,
    payload?.startedAt,
    payload?.messages?.[0]?.ts,
    payload?.messages?.[0]?.createdAt,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const d = new Date(candidate);
      if (!Number.isNaN(d.getTime())) {
        return d.toISOString();
      }
    }
  }
  return new Date().toISOString();
}

async function main(): Promise<void> {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: tsx scripts/jai-dump-event.ts ./data/raw.json');
    process.exit(1);
  }

  const raw = fs.readFileSync(path.resolve(filePath), 'utf8');
  const payload = JSON.parse(raw);

  const ts = resolveTimestamp(payload);

  const envelope = {
    version: 'sot-event-0.1',
    ts,
    source: 'jai-runner',
    kind: 'conversation',
    summary: 'Imported legacy chat log',
    nhId: '2.1.x',
    repoName: 'jai-nexus/dev-jai-nexus',
    domainName: 'dev.jai.nexus',
    payload,
  };

  const endpoint =
    process.env.SOT_EVENTS_ENDPOINT ??
    'https://dev-jai-nexus.vercel.app/api/sot-events';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(envelope),
  });

  console.log('status', res.status, 'body', await res.text());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
