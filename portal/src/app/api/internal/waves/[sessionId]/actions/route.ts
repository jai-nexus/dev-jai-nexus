// portal/src/app/api/internal/waves/[sessionId]/actions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";

type AllowedActionType = "plan" | "note" | "patch";

type ActionBody = {
  sessionId?: number;
  actionType: AllowedActionType;
  mode?: string;
  reason: string;
  payload?: string | null;
};

export async function POST(req: NextRequest, context: unknown) {
  const check = assertInternalToken(req);
  if (!check.ok) return check.response;

  // Next 16’s typed routes play games with `context.params`,
  // so we treat it defensively and keep our own validation.
  const routeContext = (context as { params?: { sessionId?: string } }) ?? {};
  const sessionIdStr = routeContext.params?.sessionId;

  const sessionIdFromRoute =
    typeof sessionIdStr === "string" ? Number.parseInt(sessionIdStr, 10) : NaN;

  let body: ActionBody;
  try {
    body = (await req.json()) as ActionBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (!body.actionType || !body.reason) {
    return NextResponse.json(
      { error: "Missing required fields: actionType, reason" },
      { status: 400 },
    );
  }

  const allowed: AllowedActionType[] = ["plan", "note", "patch"];
  if (!allowed.includes(body.actionType)) {
    return NextResponse.json(
      {
        error: "Invalid actionType",
        allowed,
      },
      { status: 400 },
    );
  }

  const finalSessionId =
    Number.isFinite(sessionIdFromRoute) && sessionIdFromRoute > 0
      ? sessionIdFromRoute
      : body.sessionId ?? NaN;

  if (!Number.isFinite(finalSessionId) || finalSessionId <= 0) {
    return NextResponse.json(
      { error: "Invalid or missing sessionId route/body" },
      { status: 400 },
    );
  }

  const session = await prisma.pilotSession.findUnique({
    where: { id: finalSessionId },
  });

  if (!session) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 },
    );
  }

  const action = await prisma.pilotAction.create({
    data: {
      sessionId: finalSessionId,
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
