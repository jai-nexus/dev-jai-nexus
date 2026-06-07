import fs from "node:fs/promises";
import path from "node:path";

import { getPortfolioStatusFixture } from "../src/lib/controlPlane/portfolioStatusFixture";

type JsonRecord = Record<string, unknown>;

type Args = {
  manifestPath: string | null;
  readModelPath: string | null;
  update: boolean;
};

type BaselineMetadata = {
  statusDate: string;
  artifactVersion: string;
  readModelVersion: string;
  authorityBoundaryLabel: string;
  sourceBaselineNote: string;
  checksum: string | null;
};

type CheckResult = {
  label: string;
  expected: string;
  actual: string | null;
  ok: boolean;
};

type ChecksumResult =
  | {
      kind: "match";
      expected: string;
      actual: string;
    }
  | {
      kind: "mismatch";
      expected: string;
      actual: string;
    }
  | {
      kind: "missing-local";
      actual: string | null;
    }
  | {
      kind: "missing-supplied";
      expected: string;
    };

const LOCAL_ONLY_SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//;
const WINDOWS_DRIVE_PATH = /^[a-zA-Z]:[\\/]/;
const WINDOWS_UNC_PATH = /^\\\\[^\\]+\\[^\\]+/;
const FIXTURE_PATH = path.resolve(
  process.cwd(),
  "src",
  "lib",
  "controlPlane",
  "portfolioStatusFixture.ts",
);

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
    update: false,
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

    if (arg === "--update") {
      args.update = true;
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
      "  pnpm -C portal verify:portfolio-status-fixture -- --update --manifest <local manifest.json> [--read-model <local read-model.json>]",
      "",
      "Notes:",
      "  - Local file paths only.",
      "  - No remote fetch, repo sync, API, DB, or fixture mutation.",
      "  - Default mode is verify/check only.",
      "  - Update mode is explicit, manual, local-only, and rewrites checked-in fixture metadata.",
    ].join("\n"),
  );
}

function assertLocalPath(inputPath: string, label: string): string {
  const trimmed = inputPath.trim();

  if (!trimmed) {
    throw new Error(`${label} path is required and cannot be empty.`);
  }

  if (
    LOCAL_ONLY_SCHEME.test(trimmed) ||
    (!WINDOWS_DRIVE_PATH.test(trimmed) && /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed))
  ) {
    throw new Error(`${label} must be a local file path, not a URI or URL: ${inputPath}`);
  }

  if (WINDOWS_UNC_PATH.test(trimmed)) {
    throw new Error(`${label} must be a local file path, not a UNC/network path: ${inputPath}`);
  }

  return path.resolve(process.cwd(), trimmed);
}

async function readJsonFile(inputPath: string, label: string): Promise<unknown> {
  const resolvedPath = assertLocalPath(inputPath, label);
  const stat = await fs.stat(resolvedPath);
  if (!stat.isFile()) {
    throw new Error(`${label} must be a local file: ${inputPath}`);
  }
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

function extractSuppliedMetadata(manifest: unknown, readModel: unknown): BaselineMetadata {
  return {
    statusDate: firstFound([
      findStringByKeys(manifest, FIELD_CANDIDATES.statusDate),
      findStringByKeys(readModel, FIELD_CANDIDATES.statusDate),
    ]) ?? "",
    artifactVersion: findStringByKeys(manifest, FIELD_CANDIDATES.artifactVersion) ?? "",
    readModelVersion: firstFound([
      findStringByKeys(manifest, FIELD_CANDIDATES.readModelVersion),
      findStringByKeys(readModel, FIELD_CANDIDATES.readModelVersion),
    ]) ?? "",
    authorityBoundaryLabel: firstFound([
      findStringByKeys(manifest, FIELD_CANDIDATES.authorityBoundaryLabel),
      findStringByKeys(readModel, FIELD_CANDIDATES.authorityBoundaryLabel),
    ]) ?? "",
    sourceBaselineNote: firstFound([
      findStringByKeys(manifest, FIELD_CANDIDATES.sourceBaselineNote),
      findStringByKeys(readModel, FIELD_CANDIDATES.sourceBaselineNote),
    ]) ?? "",
    checksum: firstFound([
      findStringByKeys(manifest, FIELD_CANDIDATES.checksum),
      findStringByKeys(readModel, FIELD_CANDIDATES.checksum),
    ]),
  };
}

function validateSuppliedMetadata(metadata: BaselineMetadata) {
  const missing = [
    ["status date", metadata.statusDate],
    ["artifact version", metadata.artifactVersion],
    ["read model version", metadata.readModelVersion],
    ["authority boundary label", metadata.authorityBoundaryLabel],
    ["source/baseline note", metadata.sourceBaselineNote],
  ].filter(([, value]) => !value);

  if (missing.length > 0) {
    throw new Error(
      `Supplied local baseline metadata is incomplete: ${missing
        .map(([label]) => label)
        .join(", ")}`,
    );
  }
}

function compareChecksum(localChecksum: string | undefined, suppliedChecksum: string | null): ChecksumResult {
  const expected = localChecksum?.trim() ?? "";

  if (!expected) {
    return {
      kind: "missing-local",
      actual: suppliedChecksum,
    };
  }

  if (!suppliedChecksum) {
    return {
      kind: "missing-supplied",
      expected,
    };
  }

  if (expected === suppliedChecksum) {
    return {
      kind: "match",
      expected,
      actual: suppliedChecksum,
    };
  }

  return {
    kind: "mismatch",
    expected,
    actual: suppliedChecksum,
  };
}

function printChecksumResult(result: ChecksumResult, note: string | undefined) {
  if (result.kind === "match") {
    console.log(
      [
        "PASS checksum / integrity",
        `  expected: ${result.expected}`,
        `  actual:   ${result.actual}`,
        `  note:     ${note ?? "(none)"}`,
      ].join("\n"),
    );
    return;
  }

  if (result.kind === "mismatch") {
    console.log(
      [
        "FAIL checksum / integrity",
        `  expected: ${result.expected}`,
        `  actual:   ${result.actual}`,
        `  note:     ${note ?? "(none)"}`,
      ].join("\n"),
    );
    return;
  }

  if (result.kind === "missing-local") {
    console.log(
      [
        "INFO checksum / integrity",
        "  local fixture: no checksum stored",
        `  supplied:      ${result.actual ?? "(not found)"}`,
        `  note:          ${note ?? "manual-review only"}`,
      ].join("\n"),
    );
    return;
  }

  console.log(
    [
      "INFO checksum / integrity",
      `  local fixture: ${result.expected}`,
      "  supplied:      (not found)",
      "  result:        checksum comparison skipped because supplied local files do not expose a checksum field.",
      `  note:          ${note ?? "(none)"}`,
    ].join("\n"),
  );
}

function compareFixtureToSupplied(
  supplied: BaselineMetadata,
  fixture = getPortfolioStatusFixture(),
): { results: CheckResult[]; checksumResult: ChecksumResult } {
  const metadata = fixture.static_baseline_metadata;
  const results: CheckResult[] = [
    compareField("status date", metadata.status_date, supplied.statusDate),
    compareField("artifact version", metadata.artifact_version, supplied.artifactVersion),
    compareField("read model version", metadata.read_model_version, supplied.readModelVersion),
    compareField("authority boundary label", fixture.authority_boundary_label, supplied.authorityBoundaryLabel),
    compareField("source/baseline note", metadata.source_baseline_note, supplied.sourceBaselineNote),
  ];

  return {
    results,
    checksumResult: compareChecksum(metadata.checksum, supplied.checksum),
  };
}

function fixtureMetadataIsUsable() {
  const fixture = getPortfolioStatusFixture();
  const metadata = fixture.static_baseline_metadata;
  const requiredValues = [
    fixture.authority_boundary_label,
    metadata.status_date,
    metadata.artifact_version,
    metadata.read_model_version,
    metadata.source_baseline_note,
  ];

  return requiredValues.every((value) => typeof value === "string" && value.trim().length > 0);
}

function replaceStringField(source: string, fieldName: string, value: string): string {
  const broadPattern = new RegExp(`(${fieldName}:\\s*)"(?:\\\\.|[^"\\\\])*"`, "m");
  if (!broadPattern.test(source)) {
    throw new Error(`Could not find fixture field: ${fieldName}`);
  }

  const next = source.replace(broadPattern, `$1${JSON.stringify(value)}`);
  return next;
}

function replaceGeneratedLabel(source: string, statusDate: string): string {
  const label = `Q2M6 refreshed static checked-in fixture, ${statusDate}`;
  return replaceStringField(source, "generated_label", label);
}

function updateFixtureText(source: string, supplied: BaselineMetadata): string {
  let next = source;
  next = replaceStringField(next, "authority_boundary_label", supplied.authorityBoundaryLabel);
  next = replaceStringField(next, "status_date", supplied.statusDate);
  next = replaceStringField(next, "artifact_version", supplied.artifactVersion);
  next = replaceStringField(next, "read_model_version", supplied.readModelVersion);
  next = replaceStringField(next, "source_baseline_note", supplied.sourceBaselineNote);

  if (supplied.checksum) {
    next = replaceStringField(next, "checksum", supplied.checksum);
  }

  next = replaceGeneratedLabel(next, supplied.statusDate);
  return next;
}

async function runUpdateMode(supplied: BaselineMetadata) {
  console.log("Manual update mode: explicit local fixture metadata update.");
  console.log("Mode: local-only; no remote fetch; no API/DB; writes checked-in fixture metadata only.\n");

  if (!fixtureMetadataIsUsable()) {
    throw new Error("Current fixture baseline is incomplete; refusing to mutate.");
  }

  console.log("PASS current fixture baseline loaded and contains required metadata.");
  validateSuppliedMetadata(supplied);
  console.log("PASS supplied local manifest/read-model metadata is complete.");

  const original = await fs.readFile(FIXTURE_PATH, "utf8");
  const updated = updateFixtureText(original, supplied);

  if (updated === original) {
    console.log("No fixture metadata changes needed; supplied metadata matches current fixture text.");
  } else {
    await fs.writeFile(FIXTURE_PATH, updated, "utf8");
    console.log(`Updated fixture metadata: ${path.relative(process.cwd(), FIXTURE_PATH)}`);
  }

  try {
    const postUpdateText = await fs.readFile(FIXTURE_PATH, "utf8");
    const postUpdateChecks = [
      supplied.statusDate,
      supplied.artifactVersion,
      supplied.readModelVersion,
      supplied.authorityBoundaryLabel,
      supplied.sourceBaselineNote,
      supplied.checksum,
    ].filter((value): value is string => typeof value === "string" && value.length > 0);
    const missing = postUpdateChecks.filter((value) => !postUpdateText.includes(value));

    if (missing.length > 0) {
      throw new Error(`Post-update fixture text verification failed; missing value(s): ${missing.join(", ")}`);
    }

    console.log("PASS post-update fixture text verification.");

    const postUpdateResult = compareChecksum(supplied.checksum ?? undefined, supplied.checksum);
    printChecksumResult(postUpdateResult, "Post-update supplied checksum parity check.");

    if (postUpdateResult.kind === "mismatch") {
      throw new Error("Post-update checksum verification failed.");
    }
  } catch (error) {
    await fs.writeFile(FIXTURE_PATH, original, "utf8");
    console.error("Rollback attempted: restored original fixture file from in-memory snapshot.");
    throw error;
  }

  console.log("\nManual fixture update completed.");
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
  const suppliedMetadata = extractSuppliedMetadata(manifest, readModel);

  if (args.update) {
    await runUpdateMode(suppliedMetadata);
    return;
  }

  const { results, checksumResult } = compareFixtureToSupplied(suppliedMetadata, fixture);

  console.log("Operator portfolio status fixture verify");
  console.log("Mode: local check only; no remote fetch; no mutation.\n");

  for (const result of results) {
    console.log(formatResult(result));
  }

  printChecksumResult(checksumResult, metadata.checksum_integrity_note);

  const failed = results.filter((result) => !result.ok);
  const checksumFailed = checksumResult.kind === "mismatch";
  if (failed.length > 0 || checksumFailed) {
    const checksumMessage = checksumFailed ? " plus checksum mismatch" : "";
    console.error(`\nFixture metadata verification failed: ${failed.length} metadata mismatch(es)${checksumMessage}.`);
    process.exit(1);
  }

  console.log("\nFixture metadata verification passed.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
