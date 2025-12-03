import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type SotEventBody = {
  version?: string;        // "sot-event-0.1"
  ts: string;
  source: string;
  kind: string;
  nhId?: string;
  summary?: string;
  payload?: unknown;
  repoName?: string;
  domainName?: string;
  repoId?: number;
  domainId?: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SotEventBody;

    if (!body.ts || !body.source || !body.kind) {
      return NextResponse.json(
        { error: 'ts, source, kind are required' },
        { status: 400 },
      );
    }

    const ts = new Date(body.ts);
    if (Number.isNaN(ts.getTime())) {
      return NextResponse.json(
        { error: `Invalid ts: ${body.ts}` },
        { status: 400 },
      );
    }

    let repoId = body.repoId ?? null;
    let domainId = body.domainId ?? null;

    if (!repoId && body.repoName) {
      const repo = await prisma.repo.findUnique({
        where: { name: body.repoName },
      });
      repoId = repo?.id ?? null;
    }

    if (!domainId && body.domainName) {
      const domain = await prisma.domain.findUnique({
        where: { domain: body.domainName },
      });
      domainId = domain?.id ?? null;
    }

    const created = await prisma.sotEvent.create({
      data: {
        ts,
        source: body.source,
        kind: body.kind,
        nhId: body.nhId ?? '',
        summary: body.summary,
        payload: body.payload as any,
        repoId: repoId ?? undefined,
        domainId: domainId ?? undefined,
      },
    });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (err) {
    console.error('sot-events POST error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
