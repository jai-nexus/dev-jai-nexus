#!/usr/bin/env tsx

import "dotenv/config";
import fetch, { type Response } from "node-fetch";

const BASE = process.env.JAI_INTERNAL_API_BASE ?? "http://localhost:3000";
const TOKEN =
  process.env.JAI_INTERNAL_API_TOKEN ??
  (() => {
    console.error("Missing JAI_INTERNAL_API_TOKEN in env");
    process.exit(1);
  })();

type CreateWaveResponse = {
  ok?: boolean;
  sessionId?: number;
};

type WaveTaskTargetDto = {
  kind: string;
  path: string;
};

type WaveTaskDto = {
  id: string;
  kind: string;
  status: string;
  title: string;
  description?: string;
  repoName: string;
  nhId?: string;
  target?: WaveTaskTargetDto;
};

type WavePlanDto = {
  projectKey: string;
  waveLabel: string;
  summary: string;
  notes?: string;
  tasks: WaveTaskDto[];
};

type PlanWaveResponse = {
  ok?: boolean;
  projectKey?: string;
  waveLabel?: string;
  plan?: WavePlanDto;
};

async function safeJson<T>(
  res: Response,
): Promise<T | Record<string, never>> {
  try {
    return (await res.json()) as T;
  } catch {
    return {};
  }
}

async function main(): Promise<void> {
  console.log("[jai:wave:plan] BASE =", BASE);
  console.log(
    "[jai:wave:plan] TOKEN prefix =",
    TOKEN.slice(0, 8) + "...",
  );

  const [projectKey, waveLabel, ...rest] = process.argv.slice(2);

  if (!projectKey || !waveLabel) {
    console.error(
      "Usage: npm run jai:wave:plan -- <projectKey> <waveLabel> <title...>",
    );
    process.exit(1);
  }

  const title = rest.join(" ") || `Wave ${waveLabel} for ${projectKey}`;
  const repoName = "jai-nexus/dev-jai-nexus";

  // 1) Create Wave session (PilotSession)
  const createRes = await fetch(`${BASE}/api/internal/waves`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-jai-internal-token": TOKEN,
    },
    body: JSON.stringify({ projectKey, waveLabel, title }),
  });

  const createJson = await safeJson<CreateWaveResponse>(createRes);

  console.log("[jai:wave:plan] createRes", createRes.status, createJson);

  const sessionId = createJson.sessionId;
  if (!createRes.ok || typeof sessionId !== "number") {
    console.error(
      "Failed to create wave:",
      createRes.status,
      createJson,
    );
    process.exit(1);
  }

  // 2) Ask internal agent to plan this wave
  const plannerRes = await fetch(
    `${BASE}/api/internal/agents/plan-wave`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-jai-internal-token": TOKEN,
      },
      body: JSON.stringify({ projectKey, waveLabel, title, repoName }),
    },
  );

  const plannerJson = await safeJson<PlanWaveResponse>(plannerRes);

  console.log("[jai:wave:plan] plannerRes", plannerRes.status, plannerJson);

  if (!plannerRes.ok || !plannerJson.ok || !plannerJson.plan) {
    console.error(
      "Planner error:",
      plannerRes.status,
      plannerJson,
    );
    throw new Error(
      `Planner error: status=${plannerRes.status} body=${JSON.stringify(
        plannerJson,
      )}`,
    );
  }

  const plan = plannerJson.plan;

  // 3) Record the plan as a PilotAction (what W1.0 did manually)
  const actionRes = await fetch(
    `${BASE}/api/internal/waves/${sessionId}/actions`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-jai-internal-token": TOKEN,
      },
      body: JSON.stringify({
        sessionId,
        actionType: "plan",
        mode: "agent:planner",
        reason: plan.summary,
        payload: JSON.stringify(plan, null, 2),
      }),
    },
  );

  const actionJson = await safeJson<{ ok?: boolean; actionId?: number }>(
    actionRes,
  );

  console.log("[jai:wave:plan] actionRes", actionRes.status, actionJson);

  if (!actionRes.ok || !actionJson.ok) {
    console.error(
      "Failed to record plan:",
      actionRes.status,
      actionJson,
    );
    process.exit(1);
  }

  console.log("");
  console.log(
    `✅ Recorded Wave ${waveLabel} plan for ${projectKey} as session ${sessionId}`,
  );
  console.log("");
  console.log(plan.summary);
  console.log("");

  if (plan.notes) {
    console.log("Notes:", plan.notes);
    console.log("");
  }

  if (plan.tasks.length > 0) {
    console.log("Tasks:");
    for (const task of plan.tasks) {
      const targetStr = task.target
        ? ` -> ${task.target.kind}: ${task.target.path}`
        : "";
      console.log(
        `  - [${task.id}] (${task.kind}/${task.status}) ${task.title}${targetStr}`,
      );
    }
  } else {
    console.log("(no tasks returned)");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
