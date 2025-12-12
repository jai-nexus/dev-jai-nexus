// portal/src/app/api/operator/reject-agent-edit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContextApiAuth } from "@/lib/contextApiAuth";
import { unlinkSync, existsSync } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const auth = requireContextApiAuth(req);
  if (!auth.ok) return auth.errorResponse!;

  try {
    const { syncRunId } = await req.json();
    if (!syncRunId) {
      return NextResponse.json({ error: "Missing syncRunId" }, { status: 400 });
    }

    const run = await prisma.syncRun.findUnique({ where: { id: syncRunId } });
    if (!run) return NextResponse.json({ error: "SyncRun not found" }, { status: 404 });

    const repo = await prisma.repo.findFirst({
      where: { name: { contains: run.summary?.split(" ")[2] ?? "" } },
    });

    const workspaceRoot = `/workspace/${repo?.githubUrl?.split("/").slice(-2).join("/")}`;
    const stagedDir = path.join(workspaceRoot, ".jai-agent-edits");

    const stagedFileName = run.summary?.match(/to (.+)$/)?.[1];
    if (stagedFileName) {
      const stagedPath = path.join(stagedDir, stagedFileName.replace(/\//g, "__"));
      if (existsSync(stagedPath)) unlinkSync(stagedPath);
    }

    await prisma.syncRun.update({
      where: { id: syncRunId },
      data: {
        status: "REJECTED",
        finishedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[POST /api/operator/reject-agent-edit] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
