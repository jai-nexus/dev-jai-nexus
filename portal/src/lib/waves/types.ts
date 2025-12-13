// portal/src/lib/waves/types.ts

export type WaveTaskStatus = "pending" | "in_progress" | "done";

export type WaveTaskKind =
  | "audit"
  | "refactor"
  | "feature"
  | "bugfix"
  | "infra";

export type WaveTaskTargetKind =
  | "route"
  | "api"
  | "script"
  | "db"
  | "config";

export interface WaveTaskTarget {
  kind: WaveTaskTargetKind;
  // e.g. "src/app/operator/page.tsx", "src/app/api/internal/waves/route.ts"
  path: string;
}

export interface WaveTask {
  id: string; // e.g. "T1", "T2"
  kind: WaveTaskKind;
  status: WaveTaskStatus;

  title: string;
  description?: string;

  // Which repo this task is about — matches Repo.name
  // e.g. "jai-nexus/dev-jai-nexus"
  repoName: string;

  // Optional NH pointer (your routing glue)
  nhId?: string;

  target?: WaveTaskTarget;
}

export interface WavePlan {
  projectKey: string; // e.g. "2.1.2"
  waveLabel: string;  // e.g. "W1.0"

  summary: string;
  notes?: string;

  tasks: WaveTask[];
}

/**
 * Internal API response types
 */

export interface CreateWaveSessionResponse {
  ok: boolean;
  sessionId: number;
}

export interface WaveActionResponse {
  ok: boolean;
  actionId: number;
}

export interface GetWavePlanResponse {
  ok: boolean;
  projectKey: string;
  waveLabel: string;
  sessionId: number;
  actionId: number;
  plan: WavePlan;
}
