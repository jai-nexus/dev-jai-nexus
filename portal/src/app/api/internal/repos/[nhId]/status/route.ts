// portal/src/app/api/internal/repos/[nhId]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";

type StatusPayload = {
  status: string;
  notes?: string | null;
};

const ALLOWED_STATUSES = [
  "ACTIVE",
  "IN_SETUP",
  "ARCHIVED",
  "BLOCKED",
] as const;

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ nhId: string }> },
) {
  const check = assertInternalToken(req);
  if (!check.ok) return check.response;

  // Next 16: params is a Promise
  const { nhId: rawNhId } = await context.params;
  const nhId = decodeURIComponent(rawNhId ?? "");

  if (!nhId) {
    return NextResponse.json(
      { error: "Missing nhId in route params" },
      { status: 400 },
    );
  }

  let body: StatusPayload;
  try {
    body = (await req.json()) as StatusPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.status || typeof body.status !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'status' field" },
      { status: 400 },
    );
  }

  const normalizedStatus = body.status.toUpperCase();

  if (
    !ALLOWED_STATUSES.includes(
      normalizedStatus as (typeof ALLOWED_STATUSES)[number],
    )
  ) {
    return NextResponse.json(
      { error: "Invalid status", allowed: ALLOWED_STATUSES },
      { status: 400 },
    );
  }

  const repo = await prisma.repo.findFirst({
    where: { nhId },
  });

  if (!repo) {
    return NextResponse.json(
      { error: "Repo not found", nhId },
      { status: 404 },
    );
  }

  // We only care about status + optional notes, and we let Prisma
  // worry about the exact JSON type for notes.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
    status: normalizedStatus,
  };

  if (typeof body.notes === "string") {
    const trimmed = body.notes.trim();
    if (trimmed.length > 0) {
      data.notes = trimmed;
    }
  }

  const updated = await prisma.repo.update({
    where: {
      // Repo has a composite unique key (id + name)
      id: repo.id,
      name: repo.name,
    },
    data,
  });

  return NextResponse.json({
    ok: true,
    repo: {
      nhId: updated.nhId,
      name: updated.name,
      status: updated.status,
      notes: updated.notes,
    },
  });
}
