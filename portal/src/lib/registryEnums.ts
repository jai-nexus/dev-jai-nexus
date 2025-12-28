// portal/src/lib/registryEnums.ts
import { RepoStatus } from "./dbEnums";

export const REPO_STATUS_ORDER: RepoStatus[] = [
  RepoStatus.ACTIVE,
  RepoStatus.FROZEN,
  RepoStatus.PLANNED,
  RepoStatus.PARKED,
];

// What we accept in YAML / UI filters:
export const REPO_STATUS_INPUTS = ["active", "frozen", "planned", "parked"] as const;
export type RepoStatusInput = (typeof REPO_STATUS_INPUTS)[number];

export function normalizeRepoStatus(input?: string | null): RepoStatus {
  const raw = String(input ?? "").trim();
  const v = raw.toLowerCase();

  // Accept either YAML style (active) or Prisma enum style (ACTIVE)
  switch (v) {
    case "active":
    case "enabled":
    case "on":
      return RepoStatus.ACTIVE;

    case "frozen":
    case "paused":
    case "hold":
      return RepoStatus.FROZEN;

    case "planned":
    case "plan":
    case "todo":
      return RepoStatus.PLANNED;

    case "parked":
    case "park":
    case "backlog":
      return RepoStatus.PARKED;

    default:
      // Safe default: keep it out of sync runs until explicitly activated.
      return RepoStatus.PLANNED;
  }
}

export function repoStatusDbLabel(status: RepoStatus): RepoStatusInput {
  // Your Prisma schema uses @map("active") etc, so DB labels are lowercase.
  // This helper is only for display/debug, not required for Prisma writes.
  switch (status) {
    case RepoStatus.ACTIVE:
      return "active";
    case RepoStatus.FROZEN:
      return "frozen";
    case RepoStatus.PLANNED:
      return "planned";
    case RepoStatus.PARKED:
      return "parked";
    default:
      return "planned";
  }
}
