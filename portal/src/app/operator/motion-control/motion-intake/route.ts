import { NextResponse } from "next/server";

import {
  buildMotionFromMotionIntakeRecord,
  buildPersistableMotionIntakeRecord,
  listRecentMotionIntakeRecords,
  persistMotionIntakeRecord,
  type MotionIntakeDraft,
} from "@/lib/controlPlane/motionKernel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MotionIntakeRequestBody {
  draft?: MotionIntakeDraft;
}

export async function GET() {
  const records = await listRecentMotionIntakeRecords(10);
  return NextResponse.json({
    ok: true,
    records,
    motionBases: records.map(buildMotionFromMotionIntakeRecord),
    nonAuthorizations: routeNonAuthorizations(),
  });
}

export async function POST(request: Request) {
  const body = await parseBody(request);
  if (!body.draft) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Missing motion intake draft. No motion was persisted, routed, approved, or executed.",
        nonAuthorizations: routeNonAuthorizations(),
      },
      { status: 400 },
    );
  }

  const record = buildPersistableMotionIntakeRecord(body.draft);
  const persistedRecord = await persistMotionIntakeRecord(record);

  return NextResponse.json({
    ok: true,
    record: persistedRecord,
    motionBasis: buildMotionFromMotionIntakeRecord(persistedRecord),
    nonAuthorizations: routeNonAuthorizations(),
  });
}

async function parseBody(request: Request): Promise<MotionIntakeRequestBody> {
  try {
    const value = (await request.json()) as MotionIntakeRequestBody;
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function routeNonAuthorizations() {
  return [
    "Persisted motion is not approved work.",
    "Persisted motion is not routed work.",
    "Persisted motion is not CONTROL_THREAD acceptance.",
    "Persisted motion is not autonomous execution.",
    "Persisted target thread is not route authority.",
    "Persisted repo target is not repo execution authority.",
    "Persisted evidence pointer is not validation approval.",
    "Selected persisted motion basis is not final authority.",
    "CONTROL_THREAD remains authority.",
    "Linear remains a temporary mirror only.",
    "No autonomous execution.",
    "No GitHub mutation.",
    "No PR creation.",
    "No branch mutation.",
    "No merge action.",
    "No branch deletion.",
    "No production gate opening.",
    "No source-of-truth transfer.",
    "No auto-submit to agents.",
    "No auto-run deliberation.",
    "No auto-route work.",
    "No work-packet execution.",
    "No provider API key persistence.",
    "No provider API key exposure.",
    "No provider secret storage.",
  ];
}
