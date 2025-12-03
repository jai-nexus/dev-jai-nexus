// portal/src/app/api/sync-report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { recordSotEvent } from '@/lib/sotEvents';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ... existing repo / syncRun logic ...
    // assume you compute: repo, startedAt, finishedAt, status, summary, type, trigger

    const repo = await prisma.repo.upsert({
      where: { name: body.repoFullName },
      create: {
        name: body.repoFullName,
        nhId: body.nhId ?? '',
        description: body.repoDescription ?? null,
      },
      update: {
        nhId: body.nhId ?? '',
        description: body.repoDescription ?? null,
      },
    });

    const run = await prisma.syncRun.create({
      data: {
        type: body.type,
        status: body.status,
        trigger: body.trigger ?? null,
        startedAt: new Date(body.startedAt),
        finishedAt: new Date(body.finishedAt),
        workflowRunUrl: body.workflowRunUrl ?? null,
        summary: body.summary ?? null,
        payload: body.payload,
        repoId: repo.id,
      },
    });

    // NEW: mirror it into SotEvent as a "sync"
    await recordSotEvent({
      version: 'sot-event-0.1',
      ts: body.finishedAt ?? body.startedAt,
      source: 'github',                    // or "sync-service", etc.
      kind: 'sync',
      summary: body.summary ?? `Sync run ${run.id} (${body.status})`,
      nhId: body.nhId,
      payload: {
        syncRunId: run.id,
        repoName: repo.name,
        type: body.type,
        status: body.status,
        trigger: body.trigger,
        workflowRunUrl: body.workflowRunUrl,
      },
      repoId: repo.id,
      domainName: 'dev.jai.nexus',         // or resolve dynamically later
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('sync-report POST error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
