// portal/src/app/api/internal/waves/actions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";

export const runtime = "nodejs";

type ActionBody = {
  sessionId: number;
  actionType: string;
  mode: string;
  reason: string;
  payload?: unknown;
};

export async function POST(req: NextRequest) {
  const check = assertInternalToken(req);
  if (!check.ok) return check.response;

  let body: ActionBody;
  try {
    body = (await req.json()) as ActionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { sessionId, actionType, mode, reason, payload } = body;

  if (!sessionId || typeof sessionId !== "number") {
    return NextResponse.json(
      { error: "Missing or invalid sessionId" },
      { status: 400 },
    );
  }

  if (!actionType || !mode || !reason) {
    return NextResponse.json(
      { error: "Missing actionType, mode, or reason" },
      { status: 400 },
    );
  }

  const session = await prisma.pilotSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return NextResponse.json(
      { error: "PilotSession not found", sessionId },
      { status: 404 },
    );
  }

  const action = await prisma.pilotAction.create({
    data: {
      sessionId,
      mode,
      actionType,
      reason,
      payload:
        typeof payload === "string"
          ? payload
          : payload != null
            ? JSON.stringify(payload, null, 2)
            : null,
    },
  });

  return NextResponse.json({
    ok: true,
    actionId: action.id,
  });
}
