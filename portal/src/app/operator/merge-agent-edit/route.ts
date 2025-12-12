// portal/src/app/api/operator/merge-agent-edit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContextApiAuth } from "@/lib/contextApiAuth";
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "fs";
import path from "path";

/**
 * POST /api/operator/merge-agent-edit
 * Body: { syncRunId: number }
 * - Merges the agent's staged patch into the repo workspace.
 */
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

    if (!repo) {
      return NextResponse.json({ error: "Repo not found for this SyncRun" }, { status: 404 });
    }

    const workspaceRoot = `/workspace/${repo.githubUrl?.split("/").slice(-2).join("/")}`;
    const stagedDir = path.join(workspaceRoot, ".jai-agent-edits");

    const stagedFileName = run.summary?.match(/to (.+)$/)?.[1];
    if (!stagedFileName)
      return NextResponse.json({ error: "Unable to resolve file path from summary" }, { status: 400 });

    const stagedPath = path.join(stagedDir, stagedFileName.replace(/\//g, "__"));
    const targetPath = path.join(workspaceRoot, stagedFileName);

    if (!existsSync(stagedPath)) {
      return NextResponse.json({ error: "Staged file not found" }, { status: 404 });
    }

    const content = readFileSync(stagedPath, "utf-8");
    writeFileSync(targetPath, content, "utf-8");
    unlinkSync(stagedPath);

    await prisma.syncRun.update({
      where: { id: syncRunId },
      data: {
        status: "MERGED",
        finishedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, mergedFile: stagedFileName }, { status: 200 });
  } catch (err) {
    console.error("[POST /api/operator/merge-agent-edit] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
