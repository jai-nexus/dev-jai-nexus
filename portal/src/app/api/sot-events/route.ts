// portal/src/app/api/sot-events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { parseSotTimestamp } from "@/lib/time";
import { getToken } from "next-auth/jwt";
import { assertInternalToken } from "@/lib/internalAuth";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SotEventBody = {
  version?: string;

  ts: string;
  source: string;
  kind: string;
  summary: string;

  nhId?: string;
  payload?: Prisma.InputJsonValue;

  repoId?: number;
  domainId?: number;
  repoName?: string;
  domainName?: string;
};

function timingSafeEqualString(a: string, b: string) {
  const aa = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

// Boolean-only check (so GET can fall back to session without returning 500)
function hasInternalToken(req: NextRequest) {
  const expected = process.env.JAI_INTERNAL_API_TOKEN ?? "";
  if (!expected) return false;

  const auth = req.headers.get("authorization") ?? "";
  const bearer = auth.replace(/^Bearer\s+/i, "").trim();
  const legacy = (req.headers.get("x-jai-internal-token") ?? "").trim();
  const presented = bearer || legacy;

  if (!presented) return false;
  return timingSafeEqualString(presented, expected);
}

async function hasSession(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return false;
  const token = await getToken({ req, secret });
  return !!token;
}

// POST /api/sot-events (internal token only)
export async function POST(req: NextRequest) {
  // Strict: missing token env var is a 500 (misconfig), not a silent 401
  const internal = assertInternalToken(req);
  if (!internal.ok) return internal.response;

  try {
    const body = (await req.json()) as SotEventBody;

    if (!body.ts || !body.source || !body.kind || !body.summary) {
      return NextResponse.json(
        { error: "Missing required fields (ts, source, kind, summary)" },
        { status: 400 },
      );
    }

    if (body.version && body.version !== "sot-event-0.1") {
      console.warn(
        `sot-events POST: unexpected version "${body.version}", expected "sot-event-0.1"`,
      );
    }

    const ts = parseSotTimestamp(body.ts);
    if (!ts) {
      return NextResponse.json({ error: "Invalid ts" }, { status: 400 });
    }

    let repoId = body.repoId;
    let domainId = body.domainId;

    if (!repoId && body.repoName) {
      const repo = await prisma.repo.findUnique({
        where: { name: body.repoName },
      });
      repoId = repo?.id;
    }

    if (!domainId && body.domainName) {
      const domain = await prisma.domain.findUnique({
        where: { domain: body.domainName },
      });
      domainId = domain?.id;
    }

    const created = await prisma.sotEvent.create({
      data: {
        eventId: crypto.randomUUID(), // API ingest usually gets a fresh ID if not from a specific pipeline mutation
        ts,
        source: body.source,
        kind: body.kind,
        nhId: body.nhId ?? "",
        summary: body.summary,
        payload: body.payload ?? Prisma.DbNull,
        repoId: repoId ?? null,
        domainId: domainId ?? null,
      },
    });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (err) {
    console.error("sot-events POST error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET /api/sot-events (session OR internal token)
export async function GET(req: NextRequest) {
  const ok = hasInternalToken(req) || (await hasSession(req));
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);

  const nh = searchParams.get("nh") ?? undefined;
  const source = searchParams.get("source") ?? undefined;
  const kind = searchParams.get("kind") ?? undefined;

  const limitParam = searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam) || 50, 1), 200);

  const where: { nhId?: string; source?: string; kind?: string } = {};
  if (nh) where.nhId = nh;
  if (source) where.source = source;
  if (kind) where.kind = kind;

  const events = await prisma.sotEvent.findMany({
    where,
    orderBy: { ts: "desc" },
    take: limit,
  });

  return NextResponse.json({
    meta: { count: events.length, limit, filters: { nh, source, kind } },
    events: events.map((evt) => ({
      id: evt.id,
      ts: evt.ts.toISOString(),
      createdAt: evt.createdAt.toISOString(),
      source: evt.source,
      kind: evt.kind,
      nhId: evt.nhId || null,
      summary: evt.summary,
      payload: evt.payload,
    })),
  });
}
