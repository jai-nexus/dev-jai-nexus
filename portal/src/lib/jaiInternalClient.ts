// portal/src/lib/jaiInternalClient.ts
import fetch from "node-fetch";

const BASE = process.env.JAI_INTERNAL_API_BASE ?? "http://localhost:3000";
const TOKEN = process.env.JAI_INTERNAL_API_TOKEN ?? "";

if (!TOKEN) {
  console.warn("[jai-internal-client] Missing JAI_INTERNAL_API_TOKEN");
}

function headers() {
  return {
    "content-type": "application/json",
    "x-jai-internal-token": TOKEN,
  };
}

export async function listRepos() {
  const res = await fetch(`${BASE}/api/internal/repos`, {
    headers: { "x-jai-internal-token": TOKEN },
  });
  if (!res.ok) throw new Error(`listRepos failed: ${res.status}`);
  return (await res.json()) as {
    ok: boolean;
    count: number;
    repos: Array<{
      nhId: string;
      name: string;
      domainPod: string | null;
      engineGroup: string | null;
      status: string | null;
    }>;
  };
}

export async function createWave(input: {
  projectKey: string;
  waveLabel: string;
  title: string;
  description?: string;
  mode?: string;
}) {
  const res = await fetch(`${BASE}/api/internal/waves`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`createWave failed: ${res.status}`);
  return (await res.json()) as { ok: true; sessionId: number };
}

export async function logWaveAction(
  sessionId: number,
  input: {
    actionType: string;
    reason: string;
    mode?: string;
    targetNodeId?: string;
    payload?: string;
  },
) {
  const res = await fetch(`${BASE}/api/internal/waves/${sessionId}/actions`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`logWaveAction failed: ${res.status}`);
  return (await res.json()) as { ok: true; actionId: number };
}
