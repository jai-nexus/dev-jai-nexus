// portal/src/lib/registryEnums.ts
import { RepoStatus, DomainStatus, DomainEnv } from "@/lib/dbEnums";
import type {
  RepoStatusValue,
  DomainStatusValue,
  DomainEnvValue,
} from "@/lib/dbEnums";

// Canonical values (useful for UI selects / validation)
export const REPO_STATUS_VALUES = Object.freeze<RepoStatusValue[]>([
  RepoStatus.ACTIVE,
  RepoStatus.FROZEN,
  RepoStatus.PLANNED,
  RepoStatus.PARKED,
]);

export const DOMAIN_STATUS_VALUES = Object.freeze<DomainStatusValue[]>([
  DomainStatus.live,
  DomainStatus.planned,
  DomainStatus.parked,
]);

export const DOMAIN_ENV_VALUES = Object.freeze<DomainEnvValue[]>([
  DomainEnv.prod,
  DomainEnv.stage,
  DomainEnv.dev,
]);

// ✅ Back-compat exports (older pages import these)
export const REPO_STATUSES = REPO_STATUS_VALUES;
export const DOMAIN_STATUSES = DOMAIN_STATUS_VALUES;
export const DOMAIN_ENVS = DOMAIN_ENV_VALUES;

// ---- RepoStatus ----
// Accept lowercase inputs (YAML/config/query params) but return Prisma enum values.
const REPO_STATUS_ALIASES: Record<string, RepoStatusValue> = {
  active: RepoStatus.ACTIVE,
  live: RepoStatus.ACTIVE,
  enabled: RepoStatus.ACTIVE,

  frozen: RepoStatus.FROZEN,
  freeze: RepoStatus.FROZEN,
  locked: RepoStatus.FROZEN,

  parked: RepoStatus.PARKED,
  paused: RepoStatus.PARKED,
  hold: RepoStatus.PARKED,

  planned: RepoStatus.PLANNED,
  plan: RepoStatus.PLANNED,
  todo: RepoStatus.PLANNED,
  backlog: RepoStatus.PLANNED,
};

export function normalizeRepoStatus(v: unknown): RepoStatusValue {
  const s = String(v ?? "").trim().toLowerCase();
  return REPO_STATUS_ALIASES[s] ?? RepoStatus.PLANNED;
}

// ---- DomainStatus ----
const DOMAIN_STATUS_ALIASES: Record<string, DomainStatusValue> = {
  live: DomainStatus.live,
  active: DomainStatus.live,

  planned: DomainStatus.planned,
  plan: DomainStatus.planned,
  todo: DomainStatus.planned,

  parked: DomainStatus.parked,
  paused: DomainStatus.parked,
  hold: DomainStatus.parked,
};

export function normalizeDomainStatus(v: unknown): DomainStatusValue {
  const s = String(v ?? "").trim().toLowerCase();
  return DOMAIN_STATUS_ALIASES[s] ?? DomainStatus.planned;
}

// ---- DomainEnv ----
const DOMAIN_ENV_ALIASES: Record<string, DomainEnvValue> = {
  prod: DomainEnv.prod,
  production: DomainEnv.prod,

  stage: DomainEnv.stage,
  staging: DomainEnv.stage,

  dev: DomainEnv.dev,
  development: DomainEnv.dev,
  local: DomainEnv.dev,
};

export function normalizeDomainEnv(v: unknown): DomainEnvValue {
  const s = String(v ?? "").trim().toLowerCase();
  return DOMAIN_ENV_ALIASES[s] ?? DomainEnv.dev;
}
