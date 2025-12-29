// portal/src/lib/registryEnums.ts
import { RepoStatus, DomainStatus, DomainEnv } from "@/lib/dbEnums";
import type {
  RepoStatusValue,
  DomainStatusValue,
  DomainEnvValue,
} from "@/lib/dbEnums";

// Canonical values (UI selects / validation)
export const REPO_STATUS_VALUES = Object.freeze<RepoStatusValue[]>([
  RepoStatus.active,
  RepoStatus.frozen,
  RepoStatus.planned,
  RepoStatus.parked,
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

// Back-compat exports
export const REPO_STATUSES = REPO_STATUS_VALUES;
export const DOMAIN_STATUSES = DOMAIN_STATUS_VALUES;
export const DOMAIN_ENVS = DOMAIN_ENV_VALUES;

// ---- RepoStatus ----
const REPO_STATUS_ALIASES: Record<string, RepoStatusValue> = {
  active: RepoStatus.active,
  live: RepoStatus.active,
  enabled: RepoStatus.active,

  frozen: RepoStatus.frozen,
  freeze: RepoStatus.frozen,
  locked: RepoStatus.frozen,

  parked: RepoStatus.parked,
  paused: RepoStatus.parked,
  hold: RepoStatus.parked,

  planned: RepoStatus.planned,
  plan: RepoStatus.planned,
  todo: RepoStatus.planned,
  backlog: RepoStatus.planned,
};

export function normalizeRepoStatus(v: unknown): RepoStatusValue {
  const s = String(v ?? "").trim().toLowerCase();
  return REPO_STATUS_ALIASES[s] ?? RepoStatus.planned;
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
