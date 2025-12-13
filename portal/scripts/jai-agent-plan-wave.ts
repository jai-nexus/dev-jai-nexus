#!/usr/bin/env tsx

import "dotenv/config";
import fetch from "node-fetch";
import type { WavePlan, WaveTask } from "@/lib/waves/types";

const BASE = process.env.JAI_INTERNAL_API_BASE ?? "http://localhost:3000";
const TOKEN =
  process.env.JAI_INTERNAL_API_TOKEN ??
  (() => {
    console.error("Missing JAI_INTERNAL_API_TOKEN in env");
    process.exit(1);
  })();

interface CreateWaveResponse {
  ok?: boolean;
  sessionId?: number;
  error?: string;
}

interface RecordActionResponse {
  ok?: boolean;
  actionId?: number;
  error?: string;
}

async function main() {
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
  const nhBase = `${projectKey}.${waveLabel}`;

  // 1) Create Wave session
  const createRes = await fetch(`${BASE}/api/internal/waves`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-jai-internal-token": TOKEN,
    },
    body: JSON.stringify({ projectKey, waveLabel, title }),
  });

  const createJson = (await createRes
    .json()
    .catch(() => ({ ok: false as const }))) as CreateWaveResponse;

  console.log("[jai:wave:plan] createRes", createRes.status, createJson);

  if (!createRes.ok || typeof createJson.sessionId !== "number") {
    console.error(
      "Failed to create wave:",
      createRes.status,
      createJson,
    );
    process.exit(1);
  }

  const sessionId = createJson.sessionId;

  // 2) Stub plan (swap to real OpenAI later)
  const tasks: WaveTask[] = [
    {
      id: "T1",
      kind: "audit",
      status: "pending",
      title: "Review auth + route protection",
      description:
        "Confirm all operator routes and protected segments enforce NextAuth sessions.",
      repoName: "jai-nexus/dev-jai-nexus",
      nhId: `${nhBase}.1`,
      target: {
        kind: "route",
        path: "src/app/(protected)/operator/page.tsx",
      },
    },
    {
      id: "T2",
      kind: "infra",
      status: "pending",
      title: "Harden internal API guards",
      description:
        "Ensure /api/internal/** routes require x-jai-internal-token and safe logging.",
      repoName: "jai-nexus/dev-jai-nexus",
      nhId: `${nhBase}.2`,
      target: {
        kind: "api",
        path: "src/app/api/internal/**/*",
      },
    },
    {
      id: "T3",
      kind: "feature",
      status: "pending",
      title: "Expose basic wave planning in Operator UI",
      description:
        "Add a simple /operator/waves view to list waves and tasks for project 2.1.2.",
      repoName: "jai-nexus/dev-jai-nexus",
      nhId: `${nhBase}.3`,
      target: {
        kind: "route",
        path: "src/app/operator/page.tsx",
      },
    },
  ];

  const plan: WavePlan = {
    projectKey,
    waveLabel,
    summary: `Plan for ${projectKey} ${waveLabel}: ${title}`,
    notes: "Stubbed by jai-agent-plan-wave.ts; replace with real agent later.",
    tasks,
  };

  // 3) Log the plan as a PilotAction
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

  const actionJson = (await actionRes
    .json()
    .catch(() => ({ ok: false as const }))) as RecordActionResponse;

  console.log("[jai:wave:plan] actionRes", actionRes.status, actionJson);

  if (!actionRes.ok || !actionJson.ok || typeof actionJson.actionId !== "number") {
    console.error(
      "Failed to record plan:",
      actionRes.status,
      actionJson,
    );
    process.exit(1);
  }

  console.log(
    `✅ Recorded Wave ${waveLabel} plan for ${projectKey} as session ${sessionId}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
