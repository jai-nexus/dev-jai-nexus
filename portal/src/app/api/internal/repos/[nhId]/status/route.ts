// portal/src/app/api/internal/repos/[nhId]/status/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma, Prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";
import { RepoStatus } from "@/lib/dbEnums";

type StatusPayload = {
  status: string;
  notes?: string | null;
};

// Accept legacy status labels, but WRITE ONLY RepoStatus values.
const LEGACY_TO_REPO_STATUS: Record<string, RepoStatus> = {
  ACTIVE: RepoStatus.active,
  LIVE: RepoStatus.active,
  ENABLED: RepoStatus.active,

  IN_SETUP: RepoStatus.planned,
  PLANNED: RepoStatus.planned,
  TODO: RepoStatus.planned,
  BACKLOG: RepoStatus.planned,

  FROZEN: RepoStatus.frozen,
  LOCKED: RepoStatus.frozen,
  BLOCKED: RepoStatus.frozen,

  PARKED: RepoStatus.parked,
  PAUSED: RepoStatus.parked,
  HOLD: RepoStatus.parked,
  ARCHIVED: RepoStatus.parked,
};

function normalizeRepoStatus(input: string): RepoStatus | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;

  // allow direct match by value (case-insensitive)
  const want = raw.toLowerCase();
  const direct = (Object.values(RepoStatus) as string[]).find(
    (v) => v.toLowerCase() === want,
  );
  if (direct) return direct as RepoStatus;

  // allow legacy keys (ACTIVE/IN_SETUP/etc.)
  const upper = raw.toUpperCase();
  return LEGACY_TO_REPO_STATUS[upper] ?? null;
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ nhId: string }> },
) {
  const check = assertInternalToken(req);
  if (!check.ok) return check.response;

  const { nhId: rawNhId } = await context.params;
  const nhId = decodeURIComponent(rawNhId ?? "").trim();

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

  const status = normalizeRepoStatus(body.status);
  if (!status) {
    return NextResponse.json(
      {
        error: "Invalid status",
        allowedRepoStatus: Object.values(RepoStatus),
        acceptedLegacyKeys: Object.keys(LEGACY_TO_REPO_STATUS),
      },
      { status: 400 },
    );
  }

  const repo = await prisma.repo.findFirst({ where: { nhId } });
  if (!repo) {
    return NextResponse.json({ error: "Repo not found", nhId }, { status: 404 });
  }

  const data: Prisma.RepoUpdateInput = { status };

  // notes is Json? in schema
  // - omit => no change
  // - empty/null => clear
  // - non-empty string => set as JSON string
  if (body.notes !== undefined) {
    const trimmed = typeof body.notes === "string" ? body.notes.trim() : "";
    data.notes = trimmed.length ? (trimmed as Prisma.InputJsonValue) : Prisma.DbNull;
  }

  const updated = await prisma.repo.update({
    where: { id: repo.id },
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
