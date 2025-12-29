// portal/src/app/api/internal/repos/[nhId]/status/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";
import { RepoStatus } from "@/lib/dbEnums";

// ✅ Needed for DbNull / Json typing
import { Prisma } from "../../../../../../../prisma/generated/prisma";

type StatusPayload = {
  status: string;
  notes?: string | null;
};

const ALLOWED_STATUSES = Object.values(RepoStatus) as RepoStatus[];

/**
 * Back-compat mapping for older internal callers.
 * These are NOT stored in DB; they map to real RepoStatus enum values.
 */
const LEGACY_STATUS_ALIASES: Record<string, RepoStatus> = {
  ACTIVE: RepoStatus.active,
  LIVE: RepoStatus.active,
  ENABLED: RepoStatus.active,

  IN_SETUP: RepoStatus.planned,
  SETUP: RepoStatus.planned,

  BLOCKED: RepoStatus.frozen,
  FROZEN: RepoStatus.frozen,
  LOCKED: RepoStatus.frozen,

  ARCHIVED: RepoStatus.parked,
  PARKED: RepoStatus.parked,
  PAUSED: RepoStatus.parked,
  HOLD: RepoStatus.parked,
};

function normalizeIncomingStatus(input: unknown): RepoStatus | null {
  const raw = String(input ?? "").trim();
  if (!raw) return null;

  // direct enum value match (case-insensitive)
  const wantLower = raw.toLowerCase();
  const direct = (ALLOWED_STATUSES as string[]).find(
    (v) => v.toLowerCase() === wantLower,
  );
  if (direct) return direct as RepoStatus;

  // legacy tokens: "IN SETUP" / "in-setup" / "IN_SETUP" -> "IN_SETUP"
  const key = raw.toUpperCase().replace(/[\s-]+/g, "_");
  return LEGACY_STATUS_ALIASES[key] ?? null;
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

  const status = normalizeIncomingStatus(body?.status);
  if (!status) {
    return NextResponse.json(
      {
        error: "Invalid status",
        allowed: ALLOWED_STATUSES,
        legacyAccepted: Object.keys(LEGACY_STATUS_ALIASES),
      },
      { status: 400 },
    );
  }

  const repo = await prisma.repo.findFirst({ where: { nhId } });
  if (!repo) {
    return NextResponse.json({ error: "Repo not found", nhId }, { status: 404 });
  }

  // ✅ Type this to Prisma’s expected update input for the model
  const data: Prisma.RepoUpdateInput = { status };

  // notes handling for Json field:
  // - if notes omitted: do nothing
  // - if notes null or "" -> clear (DB null)
  // - if notes non-empty -> set trimmed string (valid JSON scalar)
  if ("notes" in body) {
    if (body.notes === null) {
      data.notes = Prisma.DbNull;
    } else if (typeof body.notes === "string") {
      const trimmed = body.notes.trim();
      data.notes = trimmed.length ? trimmed : Prisma.DbNull;
    }
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
