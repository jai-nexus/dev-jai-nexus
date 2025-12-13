#!/usr/bin/env tsx

import "dotenv/config";
import fetch from "node-fetch";
import type {
  CreateWaveSessionResponse,
  WavePlan,
  WaveTask,
  WaveActionResponse,
} from "@/lib/waves/types";

const BASE = process.env.JAI_INTERNAL_API_BASE ?? "http://localhost:3000";
const TOKEN =
  process.env.JAI_INTERNAL_API_TOKEN ??
  (() => {
    console.error("Missing JAI_INTERNAL_API_TOKEN in env");
    process.exit(1);
  })();

function isCreateWaveSessionResponse(
  value: unknown,
): value is CreateWaveSessionResponse {
  if (!value || typeof value !== "object") return false;
  const v = value as { ok?: unknown; sessionId?: unknown };
  return typeof v.sessionId === "number";
}

function isWaveActionResponse(value: unknown): value is WaveActionResponse {
  if (!value || typeof value !== "object") return false;
  const v = value as { ok?: unknown; actionId?: unknown };
  return typeof v.actionId === "number";
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

  // 1) Create Wave session
  const createRes = await fetch(`${BASE}/api/internal/waves`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-jai-internal-token": TOKEN,
    },
    body: JSON.stringify({ projectKey, waveLabel, title }),
  });

  const createJsonRaw = await createRes.json().catch(() => null);
  if (!isCreateWaveSessionResponse(createJsonRaw)) {
    console.error(
      "[jai:wave:plan] Unexpected createRes payload",
      createRes.status,
      createJsonRaw,
    );
    process.exit(1);
  }

  console.log("[jai:wave:plan] createRes", createRes.status, createJsonRaw);

  if (!createRes.ok) {
    console.error(
      "Failed to create wave:",
      createRes.status,
      createJsonRaw,
    );
    process.exit(1);
  }

  const sessionId = createJsonRaw.sessionId;

  // 2) Stub plan (replace with real agent later)
  const tasks: WaveTask[] = [
    {
      id: "T1",
      kind: "audit",
      status: "pending",
      title: "Review auth + route protection",
      description:
        "Audit NextAuth config, middleware/proxy, and protected routes for dev.jai.nexus.",
      repoName: "jai-nexus/dev-jai-nexus",
      nhId: `${projectKey}.${waveLabel}.1`,
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
        "Tighten assertInternalToken + internal routes for repos/waves across local + Vercel.",
      repoName: "jai-nexus/dev-jai-nexus",
      nhId: `${projectKey}.${waveLabel}.2`,
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
        "Add Operator view for PilotSessions + last WavePlan for each projectKey/waveLabel.",
      repoName: "jai-nexus/dev-jai-nexus",
      nhId: `${projectKey}.${waveLabel}.3`,
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
    notes:
      "Stubbed by jai-agent-plan-wave.ts; replace with real agent later.",
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

  const actionJsonRaw = await actionRes.json().catch(() => null);
  if (!isWaveActionResponse(actionJsonRaw)) {
    console.error(
      "[jai:wave:plan] Unexpected actionRes payload",
      actionRes.status,
      actionJsonRaw,
    );
    process.exit(1);
  }

  console.log("[jai:wave:plan] actionRes", actionRes.status, actionJsonRaw);

  if (!actionRes.ok) {
    console.error(
      "Failed to record plan:",
      actionRes.status,
      actionJsonRaw,
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
