#!/usr/bin/env tsx

import "dotenv/config";
import fetch from "node-fetch";
import type { GetWavePlanResponse, WaveTask } from "@/lib/waves/types";

const BASE = process.env.JAI_INTERNAL_API_BASE ?? "http://localhost:3000";
const TOKEN =
  process.env.JAI_INTERNAL_API_TOKEN ??
  (() => {
    console.error("Missing JAI_INTERNAL_API_TOKEN in env");
    process.exit(1);
  })();

function isWaveTaskArray(value: unknown): value is WaveTask[] {
  return (
    Array.isArray(value) &&
    value.every(
      (t) =>
        t &&
        typeof t === "object" &&
        typeof (t as WaveTask).id === "string" &&
        typeof (t as WaveTask).kind === "string" &&
        typeof (t as WaveTask).status === "string" &&
        typeof (t as WaveTask).title === "string" &&
        typeof (t as WaveTask).repoName === "string",
    )
  );
}

function isGetWavePlanResponse(
  value: unknown,
): value is GetWavePlanResponse {
  if (!value || typeof value !== "object") return false;

  const v = value as {
    ok?: unknown;
    projectKey?: unknown;
    waveLabel?: unknown;
    sessionId?: unknown;
    actionId?: unknown;
    plan?: unknown;
  };

  if (v.ok !== true) return false;
  if (typeof v.projectKey !== "string") return false;
  if (typeof v.waveLabel !== "string") return false;
  if (typeof v.sessionId !== "number") return false;
  if (typeof v.actionId !== "number") return false;

  const plan = v.plan as { summary?: unknown; tasks?: unknown } | undefined;
  if (!plan || typeof plan.summary !== "string") return false;
  if (!isWaveTaskArray(plan.tasks)) return false;

  return true;
}

async function main() {
  const [projectKey, waveLabel] = process.argv.slice(2);

  if (!projectKey || !waveLabel) {
    console.error(
      "Usage: npm run jai:wave:apply -- <projectKey> <waveLabel>",
    );
    process.exit(1);
  }

  console.log("[jai:wave:apply] BASE =", BASE);
  console.log(
    "[jai:wave:apply] TOKEN prefix =",
    TOKEN.slice(0, 8) + "...",
  );
  console.log(
    `[jai:wave:apply] Loading plan for projectKey=${projectKey}, waveLabel=${waveLabel}`,
  );

  const res = await fetch(`${BASE}/api/internal/waves/get-plan`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-jai-internal-token": TOKEN,
    },
    body: JSON.stringify({ projectKey, waveLabel }),
  });

  const jsonRaw = await res.json().catch(() => null);
  console.log("[jai:wave:apply] status", res.status, jsonRaw);

  if (!res.ok || !isGetWavePlanResponse(jsonRaw)) {
    console.error(
      "Failed to load plan or unexpected payload:",
      res.status,
      jsonRaw,
    );
    process.exit(1);
  }

  const { sessionId, actionId, plan } = jsonRaw;

  console.log();
  console.log(`Wave plan for ${plan.projectKey} ${plan.waveLabel}`);
  console.log(`  Session: ${sessionId}, action: ${actionId}`);
  console.log();
  console.log(plan.summary);

  if (plan.notes) {
    console.log();
    console.log("Notes:", plan.notes);
  }

  if (!plan.tasks.length) {
    console.log();
    console.log("(plan has no tasks)");
    process.exit(0);
  }

  console.log();
  console.log("Tasks:");
  plan.tasks.forEach((task, idx) => {
    const seq = idx + 1;
    const nhLabel =
      task.nhId ?? `${plan.projectKey}.${plan.waveLabel}.${seq}`;
    console.log(
      `  ${seq}. [${nhLabel}] (${task.kind}/${task.status}) ${task.title}`,
    );

    if (task.target) {
      console.log(
        `       -> target ${task.target.kind}: ${task.target.path}`,
      );
    }
  });

  // v0: just print; future: actually apply diffs / open PRs.
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
