import { NextRequest, NextResponse } from "next/server";
import { requireContextApiAuth } from "@/lib/contextApiAuth";
import { prisma } from "@/lib/prisma";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import crypto from "crypto";

/**
 * POST /api/agents/commit
 * Body: {
 *   repoId: number,
 *   path: string,
 *   content: string,
 *   message?: string,
 *   agent?: string
 * }
 */
export async function POST(req: NextRequest) {
  const auth = requireContextApiAuth(req);
  if (!auth.ok) return auth.errorResponse!;

  try {
    const body = await req.json();
    const { repoId, path: relPath, content, message, agent } = body;

    if (!repoId || !relPath || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing required fields: repoId, path, content" },
        { status: 400 }
      );
    }

    // Resolve workspace path (e.g., /workspace/<repo-name>)
    const repo = await prisma.repo.findUnique({ where: { id: repoId } });
    if (!repo) {
      return NextResponse.json({ error: "Repo not found" }, { status: 404 });
    }

    const workspaceRoot = `/workspace/${repo.githubUrl?.split("/").slice(-2).join("/")}`;
    const filePath = path.join(workspaceRoot, relPath);

    // Ensure dir exists
    mkdirSync(path.dirname(filePath), { recursive: true });

    // Write file content (non-destructive branch pattern)
    const branchDir = path.join(workspaceRoot, ".jai-agent-edits");
    mkdirSync(branchDir, { recursive: true });
    const branchFile = path.join(branchDir, relPath.replace(/\//g, "__"));
    writeFileSync(branchFile, content, "utf-8");

    // Record SyncRun
    const syncRun = await prisma.syncRun.create({
      data: {
        type: "agent-commit",
        status: "PENDING_REVIEW",
        trigger: agent ?? "unknown",
        summary: message ?? `Agent edit to ${relPath}`,
        startedAt: new Date(),
        finishedAt: new Date(),
      },
    });

    const checksum = crypto.createHash("sha256").update(content).digest("hex");

    return NextResponse.json(
      {
        ok: true,
        repoId,
        relPath,
        checksum,
        syncRunId: syncRun.id,
        message: message ?? null,
        reviewUrl: `/operator/sync-runs/${syncRun.id}`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[POST /api/agents/commit] error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
