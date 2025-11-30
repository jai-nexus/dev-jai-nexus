// portal/src/app/api/sync-report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';  // 👈 add this
import { prisma } from '@/lib/prisma';

type SyncReportBody = {
  repoFullName: string; // "jai-nexus/jai-nexus"
  type: string;         // "notion_sync", "docs_harvest", ...
  status: string;       // "success" | "failed" | "partial"
  trigger?: string;     // "push" | "schedule" | "manual"
  startedAt: string;    // ISO string
  finishedAt: string;   // ISO string
  workflowRunUrl?: string;
  summary?: string;
  payload?: Prisma.InputJsonValue | null;  // 👈 typed properly
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SyncReportBody;

    const { repoFullName, type, status, startedAt, finishedAt } = body;

    if (!repoFullName || !type || !status || !startedAt || !finishedAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const [owner] = repoFullName.split('/');
    const githubUrl = `https://github.com/${repoFullName}`;

    const repo = await prisma.repo.upsert({
      where: { name: repoFullName },
      update: {
        owner,
        githubUrl,
      },
      create: {
        name: repoFullName,
        owner,
        githubUrl,
        nhId: '',
        status: 'unknown',
      },
    });

    const run = await prisma.syncRun.create({
      data: {
        type: body.type,
        status: body.status,
        trigger: body.trigger,
        startedAt: new Date(body.startedAt),
        finishedAt: new Date(body.finishedAt),
        workflowRunUrl: body.workflowRunUrl,
        summary: body.summary,
        // 👇 null → undefined, matches Prisma's expected union type
        payload: body.payload ?? undefined,
        repoId: repo.id,
      },
    });

    return NextResponse.json({ ok: true, id: run.id }, { status: 201 });
  } catch (error) {
    console.error('sync-report error', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 },
    );
  }
}
