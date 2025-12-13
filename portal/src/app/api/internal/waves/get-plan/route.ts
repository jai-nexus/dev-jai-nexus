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

  let sessionId: number | null = null;

  // Case 1: direct sessionId
  if ("sessionId" in body && typeof body.sessionId === "number") {
    sessionId = body.sessionId;
  }
  // Case 2: projectKey + waveLabel (NH-style addressing)
  else if (
    "projectKey" in body &&
    typeof body.projectKey === "string" &&
    "waveLabel" in body &&
    typeof body.waveLabel === "string"
  ) {
    const session = await prisma.pilotSession.findFirst({
      where: {
        projectKey: body.projectKey,
        waveLabel: body.waveLabel,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found for project/wave" },
        { status: 404 },
      );
    }

    sessionId = session.id;
  }

  if (!sessionId || !Number.isFinite(sessionId)) {
    return NextResponse.json(
      {
        error:
          "Provide either { sessionId } or { projectKey, waveLabel } in body",
      },
      { status: 400 },
    );
  }

  const session = await prisma.pilotSession.findUnique({
    where: { id: sessionId },
    include: {
      actions: {
        where: { actionType: "plan" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!session) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 },
    );
  }

  const latestPlanAction = session.actions[0];

  if (!latestPlanAction) {
    return NextResponse.json(
      { error: "No plan action found for session" },
      { status: 404 },
    );
  }

  let plan: unknown = null;

  if (typeof latestPlanAction.payload === "string") {
    try {
      plan = JSON.parse(latestPlanAction.payload);
    } catch {
      // If it’s not valid JSON, just return the raw string
      plan = { raw: latestPlanAction.payload };
    }
  } else {
    plan = latestPlanAction.payload ?? null;
  }

  return NextResponse.json({
    ok: true,
    sessionId: session.id,
    projectKey: session.projectKey,
    waveLabel: session.waveLabel,
    actionId: latestPlanAction.id,
    plan,
  });
}
