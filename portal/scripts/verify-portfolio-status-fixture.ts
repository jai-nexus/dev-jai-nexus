import fs from "node:fs/promises";
import path from "node:path";

import { getPortfolioStatusFixture } from "../src/lib/controlPlane/portfolioStatusFixture";

type JsonRecord = Record<string, unknown>;

type Args = {
  manifestPath: string | null;
  readModelPath: string | null;
};

type CheckResult = {
  label: string;
  expected: string;
  actual: string | null;
  ok: boolean;
};

const LOCAL_ONLY_SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//;

const FIELD_CANDIDATES = {
  statusDate: ["status_date", "statusDate", "baseline_date", "baselineDate", "generated_date"],
  artifactVersion: [
    "artifact_version",
    "artifactVersion",
    "bundle_version",
    "bundleVersion",
    "handoff_version",
    "handoffVersion",
    "version",
  ],
  readModelVersion: [
    "read_model_version",
    "readModelVersion",
    "ui_read_model_version",
    "uiReadModelVersion",
    "model_version",
    "modelVersion",
  ],
  authorityBoundaryLabel: [
    "authority_boundary_label",
    "authorityBoundaryLabel",
    "authority_boundary",
    "authorityBoundary",
  ],
  sourceBaselineNote: [
    "source_baseline_note",
    "sourceBaselineNote",
    "baseline_note",
    "baselineNote",
    "source_note",
    "sourceNote",
  ],
  checksum: ["checksum", "sha256", "sha_256", "integrity", "integrity_checksum"],
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    manifestPath: null,
    readModelPath: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--manifest") {
      args.manifestPath = next ?? null;
      index += 1;
      continue;
    }

    if (arg === "--read-model") {
      args.readModelPath = next ?? null;
      index += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function printUsage() {
  console.log(
    [
      "Usage:",
      "  pnpm -C portal verify:portfolio-status-fixture -- --manifest <local manifest.json> [--read-model <local read-model.json>]",
      "",
      "Notes:",
      "  - Local file paths only.",
      "  - No remote fetch, repo sync, API, DB, or fixture mutation.",
      "  - Default mode is verify/check only.",
    ].join("\n"),
  );
}

function assertLocalPath(inputPath: string, label: string): string {
  if (LOCAL_ONLY_SCHEME.test(inputPath)) {
    throw new Error(`${label} must be a local file path, not a URL: ${inputPath}`);
  }

  return path.resolve(process.cwd(), inputPath);
}

async function readJsonFile(inputPath: string, label: string): Promise<unknown> {
  const resolvedPath = assertLocalPath(inputPath, label);
  const text = (await fs.readFile(resolvedPath, "utf8")).replace(/^\uFEFF/, "");
  return JSON.parse(text) as unknown;
}

function isRecord(value: unknown): value is JsonRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function normalizeKey(key: string): string {
  return key.replace(/[-_\s]/g, "").toLowerCase();
}

function findStringByKeys(value: unknown, keys: string[]): string | null {
  const wanted = new Set(keys.map(normalizeKey));
  const queue: unknown[] = [value];

  while (queue.length > 0) {
    const current = queue.shift();
    if (Array.isArray(current)) {
      queue.push(...current);
      continue;
    }

    if (!isRecord(current)) continue;

    for (const [key, nestedValue] of Object.entries(current)) {
      if (wanted.has(normalizeKey(key)) && typeof nestedValue === "string") {
        const trimmed = nestedValue.trim();
        if (trimmed.length > 0) return trimmed;
      }
      queue.push(nestedValue);
    }
  }

  return null;
}

function includesExpected(actual: string | null, expected: string): boolean {
  if (!actual) return false;
  return actual === expected || actual.includes(expected);
}

function compareField(label: string, expected: string, actual: string | null): CheckResult {
  return {
    label,
    expected,
    actual,
    ok: includesExpected(actual, expected),
  };
}

function formatResult(result: CheckResult): string {
  const status = result.ok ? "PASS" : "FAIL";
  return `${status} ${result.label}\n  expected: ${result.expected}\n  actual:   ${result.actual ?? "(not found)"}`;
}

function firstFound(values: Array<string | null>): string | null {
  return values.find((value): value is string => typeof value === "string" && value.length > 0) ?? null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.manifestPath) {
    printUsage();
    throw new Error("Missing required --manifest <local manifest.json>");
  }

  const fixture = getPortfolioStatusFixture();
  const metadata = fixture.static_baseline_metadata;
  const manifest = await readJsonFile(args.manifestPath, "manifest");
  const readModel = args.readModelPath
    ? await readJsonFile(args.readModelPath, "read model")
    : null;

  const results: CheckResult[] = [
    compareField(
      "status date",
      metadata.status_date,
      firstFound([
        findStringByKeys(manifest, FIELD_CANDIDATES.statusDate),
        findStringByKeys(readModel, FIELD_CANDIDATES.statusDate),
      ]),
    ),
    compareField(
      "artifact version",
      metadata.artifact_version,
      findStringByKeys(manifest, FIELD_CANDIDATES.artifactVersion),
    ),
    compareField(
      "read model version",
      metadata.read_model_version,
      firstFound([
        findStringByKeys(manifest, FIELD_CANDIDATES.readModelVersion),
        findStringByKeys(readModel, FIELD_CANDIDATES.readModelVersion),
      ]),
    ),
    compareField(
      "authority boundary label",
      fixture.authority_boundary_label,
      firstFound([
        findStringByKeys(manifest, FIELD_CANDIDATES.authorityBoundaryLabel),
        findStringByKeys(readModel, FIELD_CANDIDATES.authorityBoundaryLabel),
      ]),
    ),
    compareField(
      "source/baseline note",
      metadata.source_baseline_note,
      firstFound([
        findStringByKeys(manifest, FIELD_CANDIDATES.sourceBaselineNote),
        findStringByKeys(readModel, FIELD_CANDIDATES.sourceBaselineNote),
      ]),
    ),
  ];

  const manifestChecksum = firstFound([
    findStringByKeys(manifest, FIELD_CANDIDATES.checksum),
    findStringByKeys(readModel, FIELD_CANDIDATES.checksum),
  ]);

  console.log("Operator portfolio status fixture verify");
  console.log("Mode: local check only; no remote fetch; no mutation.\n");

  for (const result of results) {
    console.log(formatResult(result));
  }

  if (manifestChecksum) {
    console.log(
      [
        "INFO checksum / integrity",
        `  handoff checksum: ${manifestChecksum}`,
        `  local fixture:    ${metadata.checksum_integrity_note ?? "No local checksum stored."}`,
        "  result:           manual-review only; checksum is not compared because no checksum is stored locally.",
      ].join("\n"),
    );
  } else {
    console.log(
      [
        "INFO checksum / integrity",
        `  local fixture: ${metadata.checksum_integrity_note ?? "No local checksum stored."}`,
        "  result:        manual-review only; no handoff checksum found in supplied local files.",
      ].join("\n"),
    );
  }

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    console.error(`\nFixture metadata verification failed: ${failed.length} mismatch(es).`);
    process.exit(1);
  }

  console.log("\nFixture metadata verification passed.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
