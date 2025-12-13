// portal/src/app/api/internal/waves/get-plan/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";

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

export async function POST(req: NextRequest) {
  const check = assertInternalToken(req);
  if (!check.ok) return check.response;

  let body: GetPlanBody;
  try {
    body = (await req.json()) as GetPlanBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
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
      return NextResponse.json(
        {
          error: "No session found for projectKey / waveLabel",
          projectKey: body.projectKey,
          waveLabel: body.waveLabel,
        },
        { status: 404 },
      );
    }

    sessionId = session.id;
  } else {
    return NextResponse.json(
      {
        error: "Must provide either sessionId or (projectKey, waveLabel)",
      },
      { status: 400 },
    );
  }

  const session = await prisma.pilotSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return NextResponse.json(
      { error: "Session not found", sessionId },
      { status: 404 },
    );
  }

  const planAction = await prisma.pilotAction.findFirst({
    where: {
      sessionId: session.id,
      actionType: "plan",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!planAction) {
    return NextResponse.json(
      { error: "No plan action found for session", sessionId },
      { status: 404 },
    );
  }

  let plan: unknown = null;
  if (planAction.payload) {
    try {
      plan = JSON.parse(planAction.payload);
    } catch {
      // If it isn't valid JSON, just return the raw string
      plan = planAction.payload;
    }
  }

  return NextResponse.json({
    ok: true,
    projectKey: session.projectKey,
    waveLabel: session.waveLabel,
    sessionId: session.id,
    actionId: planAction.id,
    plan,
  });
}
