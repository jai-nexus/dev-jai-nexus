// scripts/jai-dump-event.ts (sketch)
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: tsx scripts/jai-dump-event.ts ./data/raw.json');
    process.exit(1);
  }

  const raw = fs.readFileSync(path.resolve(filePath), 'utf8');
  const payload = JSON.parse(raw);

  const envelope = {
    version: 'sot-event-0.1',
    ts: new Date().toISOString(),
    source: 'jai-runner',
    kind: 'conversation',
    summary: 'Imported legacy chat log',
    nhId: '2.1.x',
    repoName: 'jai-nexus/dev-jai-nexus',
    domainName: 'dev.jai.nexus',
    payload
  };

  const res = await fetch('https://dev-jai-nexus.vercel.app/api/sot-events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(envelope),
  });

  console.log('status', res.status, 'body', await res.text());
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
