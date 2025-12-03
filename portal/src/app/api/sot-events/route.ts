// portal/src/app/api/sot-events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

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

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SotEventBody;

    if (!body.ts || !body.source || !body.kind || !body.summary) {
      return NextResponse.json(
        { error: 'Missing required fields (ts, source, kind, summary)' },
        { status: 400 },
      );
    }

    if (body.version && body.version !== 'sot-event-0.1') {
      console.warn(
        `sot-events POST: unexpected version "${body.version}", expected "sot-event-0.1"`,
      );
    }

    const ts = new Date(body.ts);
    if (Number.isNaN(ts.getTime())) {
      return NextResponse.json({ error: 'Invalid ts' }, { status: 400 });
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
        ts,
        source: body.source,
        kind: body.kind,
        nhId: body.nhId ?? '',
        summary: body.summary,
        payload: body.payload ?? null,
        repoId,
        domainId,
      },
    });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (err) {
    console.error('sot-events POST error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
