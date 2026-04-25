import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/auth";
import {
  MOTION_PROMOTION_ADMIN_EMAIL,
  readMotionPromotionAvailability,
  promoteMotionDraft,
  type MotionPromotionRequestBody,
} from "@/lib/motion/motionPromotion";

export const runtime = "nodejs";

function isMotionPromotionRequestBody(value: unknown): value is MotionPromotionRequestBody {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;

  return (
    typeof record.generated_at === "string" &&
    typeof record.provisional_motion_id === "string" &&
    typeof record.provisional_branch_name === "string" &&
    typeof record.confirmation_text === "string" &&
    !!record.contender &&
    typeof record.contender === "object" &&
    !Array.isArray(record.contender)
  );
}

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json(
      {
        ok: false,
        error: "unauthorized",
        message: "Authentication is required for draft motion promotion.",
      },
      { status: 401 },
    );
  }

  if (session.user.email !== MOTION_PROMOTION_ADMIN_EMAIL) {
    return NextResponse.json(
      {
        ok: false,
        error: "forbidden",
        message:
          "Draft motion promotion requires the current v0 admin guard: session.user.email === \"admin@jai.nexus\".",
      },
      { status: 403 },
    );
  }

  const availability = readMotionPromotionAvailability(session.user.email);
  if (!availability.enabled) {
    return NextResponse.json(
      {
        ok: false,
        error: "promotion_disabled",
        message: "Motion promotion is disabled in this environment.",
        blocking_reasons: availability.blocking_reasons,
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_json",
        message: "Invalid JSON body.",
      },
      { status: 400 },
    );
  }

  if (!isMotionPromotionRequestBody(body)) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_request",
        message:
          "Expected contender input, provisional motion metadata, and confirmation text.",
      },
      { status: 400 },
    );
  }

  try {
    const promoted = await promoteMotionDraft(body);
    return NextResponse.json(promoted, { status: 200 });
  } catch (error) {
    const status =
      typeof (error as { status?: unknown })?.status === "number"
        ? ((error as { status: number }).status)
        : 500;
    const payload =
      (error as { payload?: unknown })?.payload &&
      typeof (error as { payload?: unknown }).payload === "object"
        ? ((error as { payload: Record<string, unknown> }).payload)
        : null;

    if (payload) {
      return NextResponse.json(payload, { status });
    }

    return NextResponse.json(
      {
        ok: false,
        error: "promotion_failed",
        message: error instanceof Error ? error.message : "Motion promotion failed.",
      },
      { status },
    );
  }
}
