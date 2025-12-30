// portal/src/lib/contracts/sotEventV01.ts
/**
 * IMPORTANT:
 * Vercel build executes server modules during "Collecting page data".
 * Do NOT read external files at module import time (fs.readFileSync at top-level),
 * especially from vendor/ submodules (they may not be present in CI builds).
 *
 * This module intentionally implements a lightweight runtime validator
 * with zero filesystem dependencies.
 */

export type SotEventV01 = {
  version: string | number;
  ts: string; // ISO timestamp string
  source: string;
  kind: string;

  summary?: string | null;
  nhId?: string | null;

  repoName?: string | null;
  domainName?: string | null;

  payload?: unknown;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asString(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return null;
}

function requireString(obj: Record<string, unknown>, key: string): string {
  const s = asString(obj[key]);
  if (!s || !s.trim()) {
    throw new Error(`[sotEventV01] Missing or invalid "${key}"`);
  }
  return s.trim();
}

function optionalString(obj: Record<string, unknown>, key: string): string | null {
  const s = asString(obj[key]);
  return s && s.trim() ? s.trim() : null;
}

/**
 * Throws if the input is not SoT Event v0.1-shaped.
 * (This is intentionally minimal; you can harden later.)
 */
export function assertSotEventV01(input: unknown): asserts input is SotEventV01 {
  if (!isRecord(input)) {
    throw new Error("[sotEventV01] Event must be an object");
  }

  // required
  const versionRaw = input.version;
  const version =
    typeof versionRaw === "string" || typeof versionRaw === "number"
      ? versionRaw
      : null;
  if (version === null) {
    throw new Error(`[sotEventV01] Missing or invalid "version"`);
  }

  const ts = requireString(input, "ts");
  const source = requireString(input, "source");
  const kind = requireString(input, "kind");

  // optional
  const summary = optionalString(input, "summary");
  const nhId = optionalString(input, "nhId");
  const repoName = optionalString(input, "repoName");
  const domainName = optionalString(input, "domainName");

  // mutate to normalized shape (safe; caller already passed object)
  (input as SotEventV01).version = version;
  (input as SotEventV01).ts = ts;
  (input as SotEventV01).source = source;
  (input as SotEventV01).kind = kind;
  (input as SotEventV01).summary = summary;
  (input as SotEventV01).nhId = nhId;
  (input as SotEventV01).repoName = repoName;
  (input as SotEventV01).domainName = domainName;
}
