// portal/src/lib/registryEnums.ts
import type {
  RepoStatus,
  DomainStatus,
  DomainEnv,
} from "../../prisma/generated/prisma";

// RepoStatus: active | frozen | planned | parked
export function normalizeRepoStatus(v: unknown): RepoStatus {
  const s = String(v ?? "").trim().toLowerCase();

  if (s === "active" || s === "live" || s === "enabled") return "active";
  if (s === "frozen" || s === "freeze" || s === "locked") return "frozen";
  if (s === "parked" || s === "paused" || s === "hold") return "parked";
  if (s === "planned" || s === "plan" || s === "todo" || s === "backlog")
    return "planned";

  // safe default
  return "planned";
}

// DomainStatus: live | planned | parked
export function normalizeDomainStatus(v: unknown): DomainStatus {
  const s = String(v ?? "").trim().toLowerCase();

  if (s === "live" || s === "active") return "live";
  if (s === "planned" || s === "plan" || s === "todo") return "planned";
  if (s === "parked" || s === "paused" || s === "hold") return "parked";

  return "planned";
}

// DomainEnv: prod | stage | dev
export function normalizeDomainEnv(v: unknown): DomainEnv {
  const s = String(v ?? "").trim().toLowerCase();

  if (s === "prod" || s === "production") return "prod";
  if (s === "stage" || s === "staging") return "stage";
  if (s === "dev" || s === "development" || s === "local") return "dev";

  // safe default
  return "dev";
}
