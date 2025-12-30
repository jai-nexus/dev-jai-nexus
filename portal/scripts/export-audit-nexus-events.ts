// portal/scripts/export-audit-nexus-events.ts
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

type AuditRegistry = {
  version: number;
  source?: string;
  updated?: string;
  quarters: Array<{
    key: string;
    status: string;
    audits?: Array<{
      id: string;
      title: string;
      status: string;
      priority?: string;
      updated?: string;
      nhId?: string;
      repoName?: string;
      domainName?: string;
      links?: Record<string, unknown>;
    }>;
  }>;
};

type BackfillRegistry = {
  version: number;
  source?: string;
  updated?: string;
  quarters: Array<{
    key: string;
    status: string;
    items?: Array<{
      id: string;
      title: string;
      status: string;
      priority?: string;
      updated?: string;
      nhId?: string;
      repoName?: string;
      domainName?: string;
      relatedAudits?: string[];
      links?: Record<string, unknown>;
    }>;
  }>;
};

function nowIsoZ() {
  return new Date().toISOString();
}

function parseArgs(argv: string[]) {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--auditNexusRoot') out.auditNexusRoot = argv[++i];
    else if (a === '--quarter') out.quarter = argv[++i];
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--reportOut') out.reportOut = argv[++i];
    else if (a === '--runId') out.runId = argv[++i];
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

function usage() {
  console.error(
    [
      'Usage:',
      '  pnpm export:audit-nexus -- --quarter 2026-Q1 --out <path.jsonl> [--reportOut <path.md>] [--auditNexusRoot <path>]',
      '',
      'Defaults:',
      '- auditNexusRoot defaults to ../../audit-nexus relative to dev-jai-nexus/portal',
      '- quarter defaults to the first quarter in audit registry with status=active',
      '',
      'Outputs:',
      '- JSONL events to stdout or --out',
      '- optional run report markdown to --reportOut',
    ].join('\n'),
  );
}

function readYamlFile<T>(filePath: string, optional = false): T | undefined {
  if (!fs.existsSync(filePath)) {
    if (optional) return undefined;
    console.error('Missing required file:', filePath);
    process.exit(1);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  return YAML.parse(raw) as T;
}

function pickQuarter(reg: AuditRegistry, quarterArg?: string): string {
  if (quarterArg) return quarterArg;
  const active = reg.quarters.find((q) => q.status === 'active');
  if (active?.key) return active.key;
  console.error('No --quarter provided and no active quarter found in audit registry.');
  process.exit(1);
}

function ensureDirFor(filePath: string) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function toJsonlLine(obj: unknown) {
  return JSON.stringify(obj);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    process.exit(0);
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const defaultAuditNexusRoot = path.resolve(__dirname, '..', '..', '..', 'audit-nexus');
  const auditNexusRoot =
    typeof args.auditNexusRoot === 'string'
      ? path.resolve(args.auditNexusRoot)
      : defaultAuditNexusRoot;

  const auditRegistryPath = path.join(auditNexusRoot, 'registry', 'audit-registry.yml');
  const backfillRegistryPath = path.join(auditNexusRoot, 'backfill', 'registry.yml');

  const auditReg = readYamlFile<AuditRegistry>(auditRegistryPath)!;
  const backfillReg = readYamlFile<BackfillRegistry>(backfillRegistryPath, true);

  const quarter = pickQuarter(auditReg, typeof args.quarter === 'string' ? args.quarter : undefined);
  const runId =
    typeof args.runId === 'string' ? args.runId : `local-${nowIsoZ().replace(/[:.]/g, '-')}`;

  const auditQuarter = auditReg.quarters.find((q) => q.key === quarter);
  if (!auditQuarter) {
    console.error(`Quarter ${quarter} not found in audit registry.`);
    process.exit(1);
  }

  const backfillQuarter = backfillReg?.quarters.find((q) => q.key === quarter);

  const lines: string[] = [];
  const warnings: string[] = [];

  const auditSource = auditReg.source ?? 'audit-nexus';
  const backfillSource = backfillReg?.source ?? 'audit-nexus.backfill';
  const auditUpdated = auditReg.updated ?? nowIsoZ();
  const backfillUpdated = backfillReg?.updated ?? nowIsoZ();

  const audits = auditQuarter.audits ?? [];
  for (const a of audits) {
    const ts = a.updated ?? auditUpdated;
    lines.push(
      toJsonlLine({
        version: 'sot-event-0.1',
        ts,
        source: auditSource,
        kind: 'audit.registry',
        summary: `${a.id} ${a.title} (${a.status})`,
        nhId: a.nhId ?? quarter,
        repoName: a.repoName ?? 'audit-nexus',
        domainName: a.domainName ?? '',
        payload: {
          auditId: a.id,
          quarter,
          title: a.title,
          status: a.status,
          priority: a.priority ?? '',
          links: a.links ?? {},
          registryPath: 'registry/audit-registry.yml',
          runId,
        },
      }),
    );
  }

  const items = backfillQuarter?.items ?? [];
  for (const b of items) {
    const ts = b.updated ?? backfillUpdated;
    lines.push(
      toJsonlLine({
        version: 'sot-event-0.1',
        ts,
        source: backfillSource,
        kind: 'backfill.registry',
        summary: `${b.id} ${b.title} (${b.status})`,
        nhId: b.nhId ?? quarter,
        repoName: b.repoName ?? 'audit-nexus',
        domainName: b.domainName ?? '',
        payload: {
          backfillId: b.id,
          quarter,
          title: b.title,
          status: b.status,
          priority: b.priority ?? '',
          relatedAudits: b.relatedAudits ?? [],
          links: b.links ?? {},
          registryPath: 'backfill/registry.yml',
          runId,
        },
      }),
    );
  }

  if (audits.length === 0) warnings.push(`No audits listed for ${quarter} in audit registry.`);
  if (!backfillReg) warnings.push('No backfill/registry.yml found (optional).');
  if (backfillReg && (backfillQuarter?.items?.length ?? 0) === 0)
    warnings.push(`No backfill items listed for ${quarter} in backfill registry.`);

  // Write JSONL
  const jsonl = lines.join('\n') + (lines.length ? '\n' : '');

  if (typeof args.out === 'string') {
    const outPath = path.resolve(args.out);
    ensureDirFor(outPath);
    fs.writeFileSync(outPath, jsonl, 'utf8');
    console.log('Wrote JSONL:', outPath);
  } else {
    process.stdout.write(jsonl);
  }

  // Optional report
  if (typeof args.reportOut === 'string') {
    const reportPath = path.resolve(args.reportOut);
    ensureDirFor(reportPath);

    const report = [
      `# audit-nexus export report`,
      ``,
      `**RunId:** ${runId}`,
      `**Quarter:** ${quarter}`,
      `**Audit registry:** ${auditRegistryPath}`,
      `**Backfill registry:** ${backfillReg ? backfillRegistryPath : '(missing/optional)'}`,
      ``,
      `## Counts`,
      `- audits: ${audits.length}`,
      `- backfill items: ${items.length}`,
      `- events emitted: ${lines.length}`,
      ``,
      warnings.length ? `## Warnings\n${warnings.map((w) => `- ${w}`).join('\n')}\n` : '',
    ].join('\n');

    fs.writeFileSync(reportPath, report, 'utf8');
    console.log('Wrote report:', reportPath);
  }
}

main();
