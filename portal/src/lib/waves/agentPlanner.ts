// Q4M11Y26-P2:A3-C. Program 2 Layer 2 API spend is code-locked at USD 0.00.
// The wave planner returns only a deterministic offline stub plan. It imports
// no provider SDK and builds no client, whatever OPENAI_API_KEY,
// JAI_PLANNER_MODEL or JAI_LAYER2_AUTHORIZED_API_SPEND_USD contain. A caller
// that demands live provider planning fails closed. Lifting the lock requires
// a code change under its own CONTROL_THREAD route.
import type { WavePlan, WaveTask } from "./types";

export const PLANNER_LAYER2_AUTHORIZED_API_SPEND_USD = "0.00";

export type PlannerProviderMode = "offline_stub" | "live_provider";

export const PLANNER_GENERATION = Object.freeze({
  source: "offline_stub",
  providerGenerated: false,
  layer2ApiSpendUsd: PLANNER_LAYER2_AUTHORIZED_API_SPEND_USD,
});

export type PlanWaveInput = {
  projectKey: string;
  waveLabel: string;
  title: string;
  repoName: string;
  providerMode?: PlannerProviderMode;
};

export class PlannerSpendLockError extends Error {
  readonly code = "PROVIDER_SPEND_NOT_AUTHORIZED";

  constructor(requestedMode: unknown) {
    super(
      `Wave planner provider mode ${JSON.stringify(requestedMode)} is not authorized: ` +
        `Layer 2 API spend is code-locked at USD ${PLANNER_LAYER2_AUTHORIZED_API_SPEND_USD}.`,
    );
    this.name = "PlannerSpendLockError";
  }
}

// Throws for anything other than the offline stub, including unknown values.
export function assertPlannerSpendLock(mode: unknown = "offline_stub"): void {
  if (mode !== "offline_stub") throw new PlannerSpendLockError(mode);
}

function makeTaskId(projectKey: string, waveLabel: string, index: number): string {
  // 2.1.2 + W1.0 + 1 => 2.1.2.W1.0.1
  return `${projectKey}.${waveLabel}.${index + 1}`;
}

function buildStubPlan(input: PlanWaveInput): WavePlan {
  const { projectKey, waveLabel, title, repoName } = input;

  const tasks: WaveTask[] = [
    {
      id: makeTaskId(projectKey, waveLabel, 0),
      kind: "audit",
      status: "pending",
      title: "Review auth + route protection",
      description:
        "Check /login, /operator, and all app routes to ensure they are protected behind NextAuth sessions.",
      repoName,
      nhId: makeTaskId(projectKey, waveLabel, 0),
      target: {
        kind: "route",
        path: "src/app/(protected)/operator/page.tsx",
      },
    },
    {
      id: makeTaskId(projectKey, waveLabel, 1),
      kind: "infra",
      status: "pending",
      title: "Harden internal API guards",
      description:
        "Ensure all /api/internal/* routes enforce x-jai-internal-token and reject unauthenticated requests.",
      repoName,
      nhId: makeTaskId(projectKey, waveLabel, 1),
      target: {
        kind: "api",
        path: "src/app/api/internal/**/*",
      },
    },
    {
      id: makeTaskId(projectKey, waveLabel, 2),
      kind: "feature",
      status: "pending",
      title: "Expose basic wave planning in Operator UI",
      description:
        "Add an Operator view for a single wave, including plan summary and tasks.",
      repoName,
      nhId: makeTaskId(projectKey, waveLabel, 2),
      target: {
        kind: "route",
        path: "src/app/operator/waves/[sessionId]/page.tsx",
      },
    },
  ];

  return {
    projectKey,
    waveLabel,
    summary: `Plan for ${projectKey} ${waveLabel}: ${title}`,
    notes:
      "Offline stub plan from agentPlanner.buildStubPlan; not provider-generated. " +
      `No model was called: Layer 2 API spend is code-locked at USD ${PLANNER_LAYER2_AUTHORIZED_API_SPEND_USD}.`,
    tasks,
  };
}

export async function planWaveWithAgent(input: PlanWaveInput): Promise<WavePlan> {
  assertPlannerSpendLock(input.providerMode ?? "offline_stub");
  return buildStubPlan(input);
}
