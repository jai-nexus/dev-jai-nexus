// portal/src/lib/registryEnums.ts

export const REPO_STATUSES = ["active", "frozen", "planned", "parked"] as const;
export type RepoStatusValue = (typeof REPO_STATUSES)[number];

export const DOMAIN_STATUSES = ["live", "planned", "parked"] as const;
export type DomainStatusValue = (typeof DOMAIN_STATUSES)[number];

export const DOMAIN_ENVS = ["prod", "stage", "dev"] as const;
export type DomainEnvValue = (typeof DOMAIN_ENVS)[number];

function clean(v: unknown): string {
  return String(v ?? "").trim().toLowerCase();
}

function isOneOf<T extends readonly string[]>(
  value: string,
  allowed: T
): value is T[number] {
  return (allowed as readonly string[]).includes(value);
}

export function normalizeRepoStatus(v: unknown): RepoStatusValue {
  const s = clean(v);
  if (isOneOf(s, REPO_STATUSES)) return s;
  return "planned";
}

export function normalizeDomainStatus(v: unknown): DomainStatusValue {
  const s = clean(v);
  if (isOneOf(s, DOMAIN_STATUSES)) return s;
  return "planned";
}

export function normalizeDomainEnv(v: unknown): DomainEnvValue | null {
  const s = clean(v);
  if (!s) return null;

  // light aliases (optional)
  if (s === "production") return "prod";
  if (s === "staging") return "stage";

  if (isOneOf(s, DOMAIN_ENVS)) return s;
  return null;
}
