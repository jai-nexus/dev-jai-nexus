// portal/src/lib/contracts/sotEventV01.ts
//
// IMPORTANT:
// This contract validator MUST NOT read JSON schema files from disk.
// Vercel builds can fail during "collect page data" if a module tries to open
// e.g. /vercel/path0/vendor/datacontracts/... (submodules often aren't present).
//
// So: runtime-only, pure TS validation. No fs/path imports. No schema loading.

export type SotEventV01 = {
  version: "0.1";
  ts: string;
  source: string;
  kind: string;

  summary?: string | null;
  nhId?: string | null;
  repoName?: string | null;
  domainName?: string | null;

  payload?: unknown;
};

const REQUIRED = ["version", "ts", "source", "kind"] as const;

const ALLOWED = new Set<string>([
  "version",
  "ts",
  "source",
  "kind",
  "summary",
  "nhId",
  "repoName",
  "domainName",
  "payload",
]);

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function optStringOrNull(
  v: Record<string, unknown>,
  key: keyof SotEventV01,
  errors: string[],
) {
  if (!(key in v)) return;
  const val = v[key as string];
  if (val === null || val === undefined) return;
  if (typeof val !== "string") errors.push(`${String(key)} must be string | null`);
}

/**
 * Strict validator:
 * - requires: version, ts, source, kind
 * - optional strings may be string | null
 * - rejects unknown keys
 */
export function validateSotEventV01(v: unknown): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isRecord(v)) {
    return { ok: false, errors: ["Expected object"] };
  }

  // Required presence
  for (const k of REQUIRED) {
    if (!(k in v)) errors.push(`Missing required field: ${k}`);
  }

  // Required types/values
  if ("version" in v && v.version !== "0.1") {
    errors.push(`version must be "0.1"`);
  }

  if ("ts" in v && !isNonEmptyString(v.ts)) {
    errors.push("ts must be a non-empty string");
  }

  if ("source" in v && !isNonEmptyString(v.source)) {
    errors.push("source must be a non-empty string");
  }

  if ("kind" in v && !isNonEmptyString(v.kind)) {
    errors.push("kind must be a non-empty string");
  }

  // Optional fields
  optStringOrNull(v, "summary", errors);
  optStringOrNull(v, "nhId", errors);
  optStringOrNull(v, "repoName", errors);
  optStringOrNull(v, "domainName", errors);

  // Strict: no extra keys
  for (const k of Object.keys(v)) {
    if (!ALLOWED.has(k)) errors.push(`Unexpected field: ${k}`);
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Convenient safe parser (never throws).
 */
export function parseSotEventV01(v: unknown): SotEventV01 | null {
  const res = validateSotEventV01(v);
  return res.ok ? (v as SotEventV01) : null;
}

/**
 * Dev-hard assertion:
 * - In dev: throw hard (so contract drift is obvious)
 * - In prod: do NOT throw (don’t take down operator UI); log and continue
 */
export function assertSotEventV01(v: unknown): asserts v is SotEventV01 {
  const res = validateSotEventV01(v);
  if (res.ok) return;

  const msg = `[sotEventV01] invalid SotEvent v0.1: ${res.errors.join("; ")}`;

  if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line no-console
    console.warn(msg);
    return;
  }

  throw new Error(msg);
}
