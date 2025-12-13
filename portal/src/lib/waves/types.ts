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
  /** Local task id for this wave, e.g. "T1" */
  id: string;

  kind: WaveTaskKind;
  status: WaveTaskStatus;

  title: string;
  description?: string;

  /**
   * Which repo this task is about — matches Repo.name
   * e.g. "jai-nexus/dev-jai-nexus"
   */
  repoName: string;

  /**
   * Optional NH pointer (your routing glue)
   * e.g. "2.1.2.W1.0.1"
   */
  nhId?: string;

  target?: WaveTaskTarget;
}

export interface WavePlan {
  /** e.g. "2.1.2" */
  projectKey: string;

  /** e.g. "W1.0" */
  waveLabel: string;

  summary: string;
  notes?: string;

  tasks: WaveTask[];
}

/**
 * Shape returned by /api/internal/waves/get-plan
 * (what jai-wave-apply is currently logging)
 */
export interface GetWavePlanResponse {
  ok: true;
  projectKey: string;
  waveLabel: string;
  sessionId: number;
  actionId: number;
  plan: WavePlan;
}

/**
 * Optional simple error shape for internal wave APIs.
 * This matches what you log when something fails.
 */
export interface WaveErrorResponse {
  ok?: false;
  error?: string;
}
