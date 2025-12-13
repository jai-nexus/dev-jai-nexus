// portal/src/app/api/internal/waves/get-plan/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";
import type { WavePlan } from "@/lib/waves/types";

type GetPlanBody =
  | {
      sessionId: number;
      projectKey?: never;
      waveLabel?: never;
    }
  | {
      sessionId?: never;
      projectKey: string;
      waveLabel: string;
    };

type GetPlanSuccess = {
  ok: true;
  projectKey: string;
  waveLabel: string;
  sessionId: number;
  actionId: number;
  plan: WavePlan | string | null;
};

type GetPlanError = {
  ok?: false;
  error: string;
  projectKey?: string;
  waveLabel?: string;
  sessionId?: number | null;
};

export async function POST(req: NextRequest) {
  const check = assertInternalToken(req);
  if (!check.ok) return check.response;

  let body: GetPlanBody;
  try {
    body = (await req.json()) as GetPlanBody;
  } catch {
    const err: GetPlanError = { error: "Invalid JSON body" };
    return NextResponse.json(err, { status: 400 });
  }

  // Resolve session either by explicit id or by (projectKey, waveLabel)
  let sessionId: number | null = null;

  if ("sessionId" in body && typeof body.sessionId === "number") {
    sessionId = body.sessionId;
  } else if ("projectKey" in body && "waveLabel" in body) {
    const session = await prisma.pilotSession.findFirst({
      where: {
        projectKey: body.projectKey,
        waveLabel: body.waveLabel,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!session) {
      const err: GetPlanError = {
        error: "No session found for projectKey / waveLabel",
        projectKey: body.projectKey,
        waveLabel: body.waveLabel,
      };
      return NextResponse.json(err, { status: 404 });
    }

    sessionId = session.id;
  } else {
    const err: GetPlanError = {
      error: "Must provide either sessionId or (projectKey, waveLabel)",
    };
    return NextResponse.json(err, { status: 400 });
  }

  const session = await prisma.pilotSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    const err: GetPlanError = {
      error: "Session not found",
      sessionId,
    };
    return NextResponse.json(err, { status: 404 });
  }

  const planAction = await prisma.pilotAction.findFirst({
    where: {
      sessionId: session.id,
      actionType: "plan",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!planAction) {
    const err: GetPlanError = {
      error: "No plan action found for session",
      sessionId,
    };
    return NextResponse.json(err, { status: 404 });
  }

  // ⚠️ Prisma model has these as `String?`, so we must guard & narrow.
  const { projectKey, waveLabel } = session;

  if (!projectKey || !waveLabel) {
    const err: GetPlanError = {
      error: "Session missing projectKey or waveLabel",
      sessionId,
    };
    return NextResponse.json(err, { status: 500 });
  }

  let plan: WavePlan | string | null = null;
  if (planAction.payload) {
    try {
      plan = JSON.parse(planAction.payload as string) as WavePlan;
    } catch {
      // If it isn't valid JSON, just return the raw string
      plan = planAction.payload as string;
    }
  }

  const response: GetPlanSuccess = {
    ok: true,
    projectKey,
    waveLabel,
    sessionId: session.id,
    actionId: planAction.id,
    plan,
  };

  return NextResponse.json(response);
}
