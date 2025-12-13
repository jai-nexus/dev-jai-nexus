import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";

type ActionBody = {
  sessionId?: number | string;
  actionType: string;
  mode?: string;
  reason: string;
  payload?: string | null;
};

export async function POST(
  req: NextRequest,
  context: { params: { sessionId?: string } },
) {
  const check = assertInternalToken(req);
  if (!check.ok) return check.response;

  let body: ActionBody;
  try {
    body = (await req.json()) as ActionBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const rawFromParams = context?.params?.sessionId;
  const rawFromBody =
    body.sessionId !== undefined ? body.sessionId.toString() : undefined;

  const rawSessionId = rawFromParams ?? rawFromBody;
  const sessionId = rawSessionId ? Number(rawSessionId) : NaN;

  if (!rawSessionId || Number.isNaN(sessionId)) {
    return NextResponse.json(
      {
        error: "Invalid or missing sessionId route param",
        rawFromParams,
        rawFromBody,
      },
      { status: 400 },
    );
  }

  if (!body.actionType || !body.reason) {
    return NextResponse.json(
      { error: "Missing actionType or reason" },
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

  const action = await prisma.pilotAction.create({
    data: {
      sessionId,
      mode: body.mode ?? "agent",
      actionType: body.actionType,
      reason: body.reason,
      payload: body.payload ?? null,
    },
  });

  return NextResponse.json({
    ok: true,
    actionId: action.id,
  });
}
