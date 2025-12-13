#!/usr/bin/env tsx

import "dotenv/config";
import fetch from "node-fetch";
import type {
  GetWavePlanResponse,
  WaveErrorResponse,
  WaveTask,
} from "@/lib/waves/types";

const BASE = process.env.JAI_INTERNAL_API_BASE ?? "http://localhost:3000";
const TOKEN =
  process.env.JAI_INTERNAL_API_TOKEN ??
  (() => {
    console.error("Missing JAI_INTERNAL_API_TOKEN in env");
    process.exit(1);
  })();

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

  let json: GetWavePlanResponse | WaveErrorResponse;

  try {
    json = (await res.json()) as GetWavePlanResponse | WaveErrorResponse;
  } catch {
    console.error("[jai:wave:apply] Failed to parse JSON from response");
    console.error("HTTP status:", res.status);
    process.exit(1);
  }

  console.log("[jai:wave:apply] status", res.status, json);

  if (!("ok" in json) || !json.ok) {
    console.error("Failed to load wave plan");
    if ("error" in json && json.error) {
      console.error("Reason:", json.error);
    }
    process.exit(1);
  }

  const { plan, sessionId, actionId } = json;

  console.log();
  console.log(`Wave plan for ${plan.projectKey} ${plan.waveLabel}`);
  console.log(`  Session: ${sessionId}, action: ${actionId}`);
  console.log();
  console.log(plan.summary);
  console.log();

  if (plan.notes) {
    console.log(`Notes: ${plan.notes}`);
    console.log();
  }

  if (!plan.tasks || plan.tasks.length === 0) {
    console.log("(plan has no tasks)");
    return;
  }

  console.log("Tasks:");
  plan.tasks.forEach((task: WaveTask, idx: number) => {
    const label = task.nhId ?? task.id;
    console.log(
      `  ${idx + 1}. [${label}] (${task.kind}/${task.status}) ${task.title}`,
    );

    if (task.target) {
      const prefix =
        task.target.kind === "route"
          ? "route"
          : task.target.kind === "api"
            ? "api"
            : task.target.kind === "script"
              ? "script"
              : task.target.kind === "db"
                ? "db"
                : "config";

      console.log(`       -> target ${prefix}: ${task.target.path}`);
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
