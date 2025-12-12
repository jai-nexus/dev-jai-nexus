import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";

type StatusPayload = {
  nhId?: string;
  status?: string;
  notes?: string | null;
};

export async function PATCH(
  req: NextRequest,
  context: { params?: { nhId?: string } },
) {
  const check = assertInternalToken(req);
  if (!check.ok) return check.response;

  let body: StatusPayload = {};
  try {
    const json = (await req.json()) as StatusPayload;
    if (json && typeof json === "object") {
      body = json;
    }
  } catch {
    // allow empty/invalid JSON; we'll validate below
  }

  const url = new URL(req.url);

  const nhIdFromParams =
    typeof context.params?.nhId === "string" &&
    context.params.nhId !== "undefined" &&
    context.params.nhId.trim().length > 0
      ? context.params.nhId.trim()
      : undefined;

  const nhIdFromBody =
    typeof body.nhId === "string" && body.nhId.trim().length > 0
      ? body.nhId.trim()
      : undefined;

  const nhIdFromQuery =
    url.searchParams.get("nhId")?.trim() || undefined;

  const nhId = nhIdFromParams ?? nhIdFromBody ?? nhIdFromQuery;

  if (!nhId) {
    return NextResponse.json(
      { error: "Missing nhId in path, body, or query" },
      { status: 400 },
    );
  }

  if (!body.status || typeof body.status !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'status' field" },
      { status: 400 },
    );
  }

  const normalizedStatus = body.status.trim().toLowerCase();
  const allowed = ["active", "in_setup", "archived", "blocked"];

  if (!allowed.includes(normalizedStatus)) {
    return NextResponse.json(
      { error: "Invalid status", allowed },
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

  const data: any = {
    status: normalizedStatus.toUpperCase(), // e.g. ACTIVE
  };

  if (typeof body.notes === "string") {
    const trimmed = body.notes.trim();
    if (trimmed.length > 0) {
      data.notes = trimmed;
    }
  }

  await prisma.repo.updateMany({
    where: { nhId },
    data,
  });

  const updated = await prisma.repo.findFirst({
    where: { nhId },
  });

  if (!updated) {
    return NextResponse.json(
      { error: "Repo disappeared during update", nhId },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    repo: {
      nhId: updated.nhId,
      name: updated.name,   // <-- correct field
      status: updated.status,
      notes: updated.notes,
    },
  });
}
