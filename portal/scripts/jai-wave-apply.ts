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

async function main() {
  // For symmetry with jai:wave:plan, use:
  //   npm run jai:wave:apply -- <projectKey> <waveLabel>
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

  const json = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    sessionId?: number;
    actionId?: number;
    plan?: unknown;
  };

  console.log("[jai:wave:apply] status", res.status, json);

  if (!res.ok || !json.ok) {
    console.error("Failed to load wave plan");
    process.exit(1);
  }

  console.log(
    `\n=== Wave plan for ${projectKey} ${waveLabel} (session ${
      json.sessionId
    }, action ${json.actionId}) ===\n`,
  );
  console.log(JSON.stringify(json.plan, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
