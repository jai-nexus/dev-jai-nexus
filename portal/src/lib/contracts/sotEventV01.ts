// portal/src/lib/contracts/sotEventV01.ts

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

export function validateSotEventV01(v: unknown): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isRecord(v)) {
    return { ok: false, errors: ["Expected object"] };
  }

  for (const k of REQUIRED) {
    if (!(k in v)) errors.push(`Missing required field: ${k}`);
  }

  if ("version" in v && v.version !== "0.1") {
    errors.push(`version must be "0.1"`);
  }

  if ("ts" in v && (typeof v.ts !== "string" || v.ts.trim().length === 0)) {
    errors.push("ts must be a non-empty string");
  }

  if ("source" in v && (typeof v.source !== "string" || v.source.trim().length === 0)) {
    errors.push("source must be a non-empty string");
  }

  if ("kind" in v && (typeof v.kind !== "string" || v.kind.trim().length === 0)) {
    errors.push("kind must be a non-empty string");
  }

  const optStringOrNull = (key: keyof SotEventV01) => {
    if (!(key in v)) return;
    const val = v[key as string];
    if (val === null) return;
    if (typeof val !== "string") errors.push(`${String(key)} must be string | null`);
  };

  optStringOrNull("summary");
  optStringOrNull("nhId");
  optStringOrNull("repoName");
  optStringOrNull("domainName");

  // Strict: no extra keys
  for (const k of Object.keys(v)) {
    if (!ALLOWED.has(k)) errors.push(`Unexpected field: ${k}`);
  }

  return { ok: errors.length === 0, errors };
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
