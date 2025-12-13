#!/usr/bin/env tsx

import "dotenv/config";
import fetch from "node-fetch";

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

function isCreateWaveResponse(body: unknown): body is CreateWaveResponse {
  if (typeof body !== "object" || body === null) return false;

  const candidate = body as { sessionId?: unknown };
  return typeof candidate.sessionId === "number";
}

async function main() {
  console.log("[jai:wave:plan] BASE =", BASE);
  console.log("[jai:wave:plan] TOKEN prefix =", TOKEN.slice(0, 8) + "...");

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

  const rawCreateJson: unknown = await createRes.json().catch(() => ({}));

  console.log("[jai:wave:plan] createRes", createRes.status, rawCreateJson);

  if (!createRes.ok || !isCreateWaveResponse(rawCreateJson)) {
    console.error("Failed to create wave:", createRes.status, rawCreateJson);
    process.exit(1);
  }

  const sessionId = rawCreateJson.sessionId;

  // 2) Stub plan (swap to real OpenAI later)
  const plan = {
    summary: `Plan for ${projectKey} ${waveLabel}: ${title}`,
    steps: [
      "Audit current auth + route protection",
      "Harden internal API guards",
      "Add basic agent planning endpoints",
    ],
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

  const actionJson: unknown = await actionRes.json().catch(() => ({}));

  console.log("[jai:wave:plan] actionRes", actionRes.status, actionJson);

  if (!actionRes.ok) {
    console.error("Failed to record plan:", actionRes.status, actionJson);
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
