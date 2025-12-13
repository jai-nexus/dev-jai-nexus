// portal/src/app/api/internal/waves/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";

type CreateWaveBody = {
  projectKey: string;
  waveLabel: string;
  title: string;
};

export async function POST(req: NextRequest) {
  const check = assertInternalToken(req);
  if (!check.ok) return check.response;

  let body: CreateWaveBody;
  try {
    body = (await req.json()) as CreateWaveBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { projectKey, waveLabel, title } = body;

  if (!projectKey || !waveLabel || !title) {
    return NextResponse.json(
      { error: "Missing projectKey, waveLabel, or title" },
      { status: 400 },
    );
  }

  const session = await prisma.pilotSession.create({
    data: {
      projectKey,
      waveLabel,
      mode: "wave",
      surface: "operator",
      createdBy: "agent:planner",
      // you can add a future "summary" field to PilotSession and set title here
    },
  });

  return NextResponse.json({
    ok: true,
    sessionId: session.id,
  });
}
