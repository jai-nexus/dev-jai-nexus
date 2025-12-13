// portal/src/app/api/internal/agents/plan-wave/route.ts
import { NextRequest, NextResponse } from "next/server";
import { assertInternalToken } from "@/lib/internalAuth";
import {
  planWaveWithAgent,
  type PlanWaveInput,
} from "@/lib/waves/agentPlanner";

type PlanWaveBody = PlanWaveInput;

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

  try {
    const plan = await planWaveWithAgent({
      projectKey,
      waveLabel,
      title,
      repoName,
    });

    return NextResponse.json({
      ok: true,
      projectKey,
      waveLabel,
      plan,
    });
  } catch (err) {
    console.error("[/api/internal/agents/plan-wave] unexpected error", err);
    return NextResponse.json(
      { error: "Planner internal error" },
      { status: 500 },
    );
  }
}
