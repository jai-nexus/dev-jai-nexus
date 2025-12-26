// portal/src/lib/registryEnums.ts
import type { RepoStatus, DomainStatus, DomainEnv } from "@/lib/dbEnums";

// Canonical values (useful for UI selects / validation)
// NOTE: frozen to avoid accidental mutation in UI code.
export const REPO_STATUS_VALUES = Object.freeze<RepoStatus[]>([
  "ACTIVE",
  "FROZEN",
  "PLANNED",
  "PARKED",
]);

export const DOMAIN_STATUS_VALUES = Object.freeze<DomainStatus[]>([
  "live",
  "planned",
  "parked",
]);

export const DOMAIN_ENV_VALUES = Object.freeze<DomainEnv[]>([
  "prod",
  "stage",
  "dev",
]);

// ✅ Back-compat exports (older pages import these)
export const REPO_STATUSES = REPO_STATUS_VALUES;
export const DOMAIN_STATUSES = DOMAIN_STATUS_VALUES;
export const DOMAIN_ENVS = DOMAIN_ENV_VALUES;

// ---- RepoStatus ----
// Accept lowercase inputs (YAML/config/query params) but return Prisma enum values (UPPERCASE).
const REPO_STATUS_ALIASES: Record<string, RepoStatus> = {
  active: "ACTIVE",
  live: "ACTIVE",
  enabled: "ACTIVE",

  frozen: "FROZEN",
  freeze: "FROZEN",
  locked: "FROZEN",

  parked: "PARKED",
  paused: "PARKED",
  hold: "PARKED",

  planned: "PLANNED",
  plan: "PLANNED",
  todo: "PLANNED",
  backlog: "PLANNED",
};

export function normalizeRepoStatus(v: unknown): RepoStatus {
  const s = String(v ?? "").trim().toLowerCase();
  return REPO_STATUS_ALIASES[s] ?? "PLANNED";
}

// ---- DomainStatus ----
const DOMAIN_STATUS_ALIASES: Record<string, DomainStatus> = {
  live: "live",
  active: "live",

  planned: "planned",
  plan: "planned",
  todo: "planned",

  parked: "parked",
  paused: "parked",
  hold: "parked",
};

export function normalizeDomainStatus(v: unknown): DomainStatus {
  const s = String(v ?? "").trim().toLowerCase();
  return DOMAIN_STATUS_ALIASES[s] ?? "planned";
}

// ---- DomainEnv ----
const DOMAIN_ENV_ALIASES: Record<string, DomainEnv> = {
  prod: "prod",
  production: "prod",

  stage: "stage",
  staging: "stage",

  dev: "dev",
  development: "dev",
  local: "dev",
};

export function normalizeDomainEnv(v: unknown): DomainEnv {
  const s = String(v ?? "").trim().toLowerCase();
  return DOMAIN_ENV_ALIASES[s] ?? "dev";
}
