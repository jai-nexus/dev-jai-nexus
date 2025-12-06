// portal/scripts/emit-autopilot-demo.ts

import "dotenv/config";

const BASE_URL =
  process.env.SOT_EVENTS_BASE_URL ?? "http://localhost:3000/api/sot-events";

async function postEvent(body: unknown) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${BASE_URL} failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  console.log("→ wrote event", json);
}

async function main() {
  const now = new Date();
  const baseTs = now.toISOString();

  const runId = `autopilot-${baseTs.replace(/[:.]/g, "-")}-offbook-ai`;

  // 1) Build started
  await postEvent({
    version: "sot-event-0.1",
    ts: baseTs,
    source: "jai-autopilot-win",
    kind: "AUTOPILOT_BUILD_STARTED",
    summary: "Autopilot started build for offbook-ai.",
    nhId: "1.3",
    repoName: "JerryIngram/offbook-ai",
    payload: {
      projectId: "jai-autopilot.v0",
      targetRepo: "JerryIngram/offbook-ai",
      targetBranch: "main",
      targetNhId: "2.1",
      command: "npm run build",
      runId,
    },
  });

  // 2) Build failed
  await postEvent({
    version: "sot-event-0.1",
    ts: new Date(now.getTime() + 90_000).toISOString(),
    source: "jai-autopilot-win",
    kind: "AUTOPILOT_BUILD_FAILED",
    summary: "OffBook build failed – Next.js module resolution error.",
    nhId: "1.3",
    repoName: "JerryIngram/offbook-ai",
    payload: {
      projectId: "jai-autopilot.v0",
      targetRepo: "JerryIngram/offbook-ai",
      targetBranch: "main",
      targetNhId: "2.1",
      command: "npm run build",
      runId,
      exitCode: 1,
      errorType: "NEXT_BUILD_ERROR",
      errorSummary:
        "Module not found: Can't resolve '@radix-ui/react-accordion'",
      logTail: [
        "Module not found: Can't resolve '@radix-ui/react-accordion'",
        "Import trace for requested module:",
        "./components/ui/accordion.tsx",
      ],
    },
  });

  // 3) Build succeeded after fix
  await postEvent({
    version: "sot-event-0.1",
    ts: new Date(now.getTime() + 4 * 60_000).toISOString(),
    source: "jai-autopilot-win",
    kind: "AUTOPILOT_BUILD_SUCCEEDED",
    summary: "OffBook build succeeded after dependency fix.",
    nhId: "1.3",
    repoName: "JerryIngram/offbook-ai",
    payload: {
      projectId: "jai-autopilot.v0",
      targetRepo: "JerryIngram/offbook-ai",
      targetBranch: "main",
      targetNhId: "2.1",
      command: "npm run build",
      runId,
      durationSeconds: 240,
    },
  });

  console.log("Autopilot demo events emitted.");
}

main().catch((err) => {
  console.error("Error emitting Autopilot demo events:", err);
  process.exit(1);
});
