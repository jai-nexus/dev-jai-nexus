// portal/src/app/api/internal/agents/plan-wave/route.ts
import { NextRequest, NextResponse } from "next/server";
import { assertInternalToken } from "@/lib/internalAuth";
import {
  PLANNER_GENERATION,
  PLANNER_LAYER2_AUTHORIZED_API_SPEND_USD,
  PlannerSpendLockError,
  planWaveWithAgent,
  type PlanWaveInput,
} from "@/lib/waves/agentPlanner";

type PlanWaveBody = Omit<PlanWaveInput, "providerMode"> & { providerMode?: unknown };

// Q4M11Y26-P2:A3-C: internal-token callers get the deterministic offline stub
// plan. Live provider planning is refused under the code-locked USD 0.00
// Layer 2 ceiling, before the planner runs.
function spendLocked() {
  return NextResponse.json(
    {
      ok: false,
      error: "provider_spend_not_authorized",
      detail: `Live provider planning is disabled: Layer 2 API spend is code-locked at USD ${PLANNER_LAYER2_AUTHORIZED_API_SPEND_USD}.`,
      layer2ApiSpendUsd: PLANNER_LAYER2_AUTHORIZED_API_SPEND_USD,
    },
    { status: 403 },
  );
}

export async function POST(req: NextRequest) {
  const check = assertInternalToken(req);
  if (!check.ok) return check.response;

  let body: PlanWaveBody;
  try {
    body = (await req.json()) as PlanWaveBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { projectKey, waveLabel, title, repoName } = body;

  if (!projectKey || !waveLabel || !title || !repoName) {
    return NextResponse.json(
      {
        error: "Missing required fields",
        required: ["projectKey", "waveLabel", "title", "repoName"],
      },
      { status: 400 },
    );
  }

  const providerMode = body.providerMode ?? "offline_stub";
  if (providerMode === "live_provider") return spendLocked();
  if (providerMode !== "offline_stub") {
    return NextResponse.json(
      { error: "Invalid providerMode", allowed: ["offline_stub", "live_provider"] },
      { status: 400 },
    );
  }

  try {
    const plan = await planWaveWithAgent({
      projectKey,
      waveLabel,
      title,
      repoName,
      providerMode,
    });

    return NextResponse.json({
      ok: true,
      projectKey,
      waveLabel,
      plan,
      generation: PLANNER_GENERATION,
    });
  } catch (err) {
    if (err instanceof PlannerSpendLockError) return spendLocked();
    console.error("[/api/internal/agents/plan-wave] unexpected error", err);
    return NextResponse.json(
      { error: "Planner internal error" },
      { status: 500 },
    );
  }
}
