// portal/src/app/api/sot-events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../../../generated/prisma/client";
import { parseSotTimestamp } from "@/lib/time";

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

// POST  /api/sot-events
// Ingest a single SoT event into the DB
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SotEventBody;

    // Required fields
    if (!body.ts || !body.source || !body.kind || !body.summary) {
      return NextResponse.json(
        { error: "Missing required fields (ts, source, kind, summary)" },
        { status: 400 },
      );
    }

    // Soft version check for v0.1
    if (body.version && body.version !== "sot-event-0.1") {
      console.warn(
        `sot-events POST: unexpected version "${body.version}", expected "sot-event-0.1"`,
      );
    }

    // Canonical timestamp parsing (UTC-safe)
    const ts = parseSotTimestamp(body.ts);
    if (!ts) {
      return NextResponse.json({ error: "Invalid ts" }, { status: 400 });
    }

    let repoId = body.repoId;
    let domainId = body.domainId;

    // Optional: resolve repo by name
    if (!repoId && body.repoName) {
      const repo = await prisma.repo.findUnique({
        where: { name: body.repoName },
      });
      repoId = repo?.id;
    }

    // Optional: resolve domain by domain name
    if (!domainId && body.domainName) {
      const domain = await prisma.domain.findUnique({
        where: { domain: body.domainName },
      });
      domainId = domain?.id;
    }

    const created = await prisma.sotEvent.create({
      data: {
        ts,
        source: body.source,
        kind: body.kind,
        // IMPORTANT: use empty string when nhId is not provided
        nhId: body.nhId ?? "",
        summary: body.summary,
        payload: body.payload,
        repoId,
        domainId,
      },
    });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (err) {
    console.error("sot-events POST error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET  /api/sot-events
// Read the SoT stream with optional filters for agents/CLI
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const nh = searchParams.get("nh") ?? undefined;
  const source = searchParams.get("source") ?? undefined;
  const kind = searchParams.get("kind") ?? undefined;

  const limitParam = searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam) || 50, 1), 200);

  // Simple, typed where-clause
  const where: {
    nhId?: string;
    source?: string;
    kind?: string;
  } = {};

  if (nh) where.nhId = nh;
  if (source) where.source = source;
  if (kind) where.kind = kind;

  const events = await prisma.sotEvent.findMany({
    where,
    orderBy: { ts: "desc" },
    take: limit,
  });

  const result = events.map((evt) => ({
    id: evt.id,
    ts: evt.ts.toISOString(),
    createdAt: evt.createdAt.toISOString(),
    source: evt.source,
    kind: evt.kind,
    nhId: evt.nhId || null,
    summary: evt.summary,
    payload: evt.payload,
  }));

  return NextResponse.json({
    meta: {
      count: result.length,
      limit,
      filters: { nh, source, kind },
    },
    events: result,
  });
}
